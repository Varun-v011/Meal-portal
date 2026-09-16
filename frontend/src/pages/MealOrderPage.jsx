import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Utensils } from "lucide-react";
import { Card, CardHeader, Field, Select, Stepper, ToggleTabs, Button } from "../components/ui";
import FileUploadCard from "../components/meal/FileUploadCard";

const MEAL_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

/** "14:30" -> "2:30 PM", for showing a closing time in the closed-notice line. */
function formatTime(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dateForDay(day) {
  const d = new Date();
  if (day === "tomorrow") d.setDate(d.getDate() + 1);
  return d;
}

/** Date -> "YYYY-MM-DD" for the API. */
function toIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Date -> "11 Sep 2026" for display. */
function formatDisplayDate(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function MealOrderPage({ userId }) {
  const [day, setDay] = useState("today");
  const [category, setCategory] = useState("");
  const [qty, setQty] = useState(1);
  const [file, setFile] = useState(null);
  const [settings, setSettings] = useState(null); // { breakfast: {...}, lunch: {...}, dinner: {...} }
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/meal-settings");
        const data = await res.json();
        if (Array.isArray(data)) {
          const byType = {};
          data.forEach((row) => { byType[row.meal_type] = row; });
          setSettings(byType);
        }
      } finally {
        setLoadingSettings(false);
      }
    })();
  }, []);

  // Closing time only applies to "today" — tomorrow's window hasn't started yet
  // so there's nothing to have closed.
  const isClosedNow = (row) => {
    if (!row) return true;
    if (!row.is_available) return true;
    if (day !== "today" || !row.closing_time) return false;
    const now = new Date();
    const [h, m] = row.closing_time.split(":").map(Number);
    const closing = new Date();
    closing.setHours(h, m, 0, 0);
    return now > closing;
  };

  // Specifically "past its closing time today" (as opposed to admin-disabled),
  // so the hint below can say exactly why it's missing from the dropdown.
  const isPastClosingTime = (row) => {
    if (!row || !row.is_available || day !== "today" || !row.closing_time) return false;
    const now = new Date();
    const [h, m] = row.closing_time.split(":").map(Number);
    const closing = new Date();
    closing.setHours(h, m, 0, 0);
    return now > closing;
  };

  const options = useMemo(() => {
    return Object.keys(MEAL_LABELS)
      .filter((mealType) => !isClosedNow(settings?.[mealType]))
      .map((mealType) => {
        const row = settings?.[mealType];
        const price = row ? Number(row.price) : null;
        const label = `${MEAL_LABELS[mealType]}${price != null ? ` — ₹${price}` : ""}`;
        return { value: mealType, label };
      });
  }, [settings, day]);

  // Meals that dropped off the list specifically because their closing time
  // passed today — surfaced as a red hint so it's clear why they're missing.
  const closedForToday = useMemo(() => {
    if (!settings) return [];
    return Object.keys(MEAL_LABELS).filter((mealType) => isPastClosingTime(settings[mealType]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, day]);

  // If the selected meal becomes closed (e.g. user switches day, or settings
  // load in after a stale selection), clear it so they can't submit against it.
  useEffect(() => {
    if (category && isClosedNow(settings?.[category])) {
      setCategory("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, settings]);

  const selectedRow = category ? settings?.[category] : null;
  const price = selectedRow ? Number(selectedRow.price) : 0;
  const total = price * qty;
  const closedNotice = category && isClosedNow(selectedRow);
  const orderDate = dateForDay(day);

  const resetForm = () => {
    setCategory("");
    setQty(1);
    setFile(null);
  };

  const handleSubmit = async () => {
    setSubmitErrors([]);
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("user_id", userId);
      form.append("meal_type", category);
      form.append("quantity", qty);
      form.append("ordered_for", toIsoDate(orderDate));
      form.append("payment_screenshot", file);

      const res = await fetch("/api/orders", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitErrors(data.errors || ["Something went wrong. Please try again."]);
        return;
      }

      setSubmitted(true);
      resetForm();
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setSubmitErrors(["Could not reach the server. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader title="New Meal Order" icon={Utensils} />
        <div className="card-pad order-form-gap">
          <Field label="Order day">
            <ToggleTabs value={day} onChange={setDay} options={[{ value: "today", label: "Today" }, { value: "tomorrow", label: "Tomorrow" }]} />
          </Field>

          <Field label="Meal Category">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={options}
              placeholder={loadingSettings ? "Loading meals..." : "Choose a meal"}
            />
          </Field>
          {closedForToday.length > 0 && (
            <div className="body-font field-note" style={{ fontSize: 12.5, color: "var(--bad-600)", fontWeight: 600 }}>
              {closedForToday
                .map((mt) => `${MEAL_LABELS[mt]} closed today at ${formatTime(settings[mt].closing_time)}`)
                .join(" · ")}
            </div>
          )}
          {category && !closedNotice && (
            <div className="body-font field-note" style={{ fontSize: 13, color: "var(--ink-600)" }}>
              Price: <b style={{ color: "var(--navy-900)" }}>₹{price}</b> per plate
              {selectedRow?.closing_time && day === "today" && (
                <span> · Closes at {formatTime(selectedRow.closing_time)}</span>
              )}
            </div>
          )}
          {closedNotice && (
            <div className="body-font field-note" style={{ fontSize: 12.5, color: "var(--bad-600)" }}>
              {MEAL_LABELS[category]} is no longer available for {day === "today" ? "today" : "tomorrow"}.
            </div>
          )}

          <div className="qty-for-grid">
            <Field label="Quantity" hint="Maximum 10 per order">
              <Stepper value={qty} onChange={setQty} />
            </Field>
            <Field label="Ordering for">
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: "10px 13px", display: "flex", gap: 10, alignItems: "center", background: "var(--canvas)" }}>
                <Calendar size={16} color="var(--brass-600)" />
                <div>
                  <div className="body-font" style={{ fontWeight: 700, fontSize: 13.5, color: "var(--navy-900)" }}>{formatDisplayDate(orderDate)}</div>
                  <div className="body-font" style={{ fontSize: 11.5, color: "var(--ink-400)" }}>{day === "today" ? "Today" : "Tomorrow"} · {WEEKDAYS[orderDate.getDay()]}</div>
                </div>
              </div>
            </Field>
          </div>

          <FileUploadCard file={file} onFile={setFile} total={total} />

          {submitErrors.length > 0 && (
            <div className="body-font" style={{ fontSize: 12.5, color: "var(--bad-600)" }}>
              {submitErrors.join(" ")}
            </div>
          )}
          {submitted && (
            <div className="body-font" style={{ fontSize: 13, color: "var(--ok-600)", fontWeight: 700 }}>
              Order placed — pending confirmation.
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 12, borderTop: "1px solid var(--line)", marginTop: 4 }}>
            <div className="body-font" style={{ fontSize: 12, color: "var(--bad-600)" }}><b>Note:</b> payment screenshot is required to proceed.</div>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <Button variant="secondary" full onClick={resetForm} disabled={submitting}>Cancel</Button>
              <Button variant="primary" full disabled={!category || !file || closedNotice || submitting} onClick={handleSubmit}>
                {submitting ? "Placing order..." : "Proceed"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}