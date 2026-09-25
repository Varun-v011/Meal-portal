import React, { useEffect, useState } from "react";
import { Coffee, Sun, Moon, Save } from "lucide-react";
import { Card, CardHeader, Field, TextInput, Button, Switch } from "../components/ui";

const MEAL_META = {
  breakfast: { label: "Breakfast", icon: Coffee },
  lunch: { label: "Lunch", icon: Sun },
  dinner: { label: "Dinner", icon: Moon },
};

const EMPTY_ROW = { is_available: true, price: "", closing_time: "" };

export default function MealSettingsPage({ adminId }) {
  const [settings, setSettings] = useState({
    breakfast: { ...EMPTY_ROW },
    lunch: { ...EMPTY_ROW },
    dinner: { ...EMPTY_ROW },
  });
  const [loading, setLoading] = useState(true);
  const [savingMeal, setSavingMeal] = useState(null);
  const [savedMeal, setSavedMeal] = useState(null);
  const [errors, setErrors] = useState({});
  const [screenshotRequired, setScreenshotRequired] = useState(true);
  const [savingScreenshot, setSavingScreenshot] = useState(false);
  const [savedScreenshot, setSavedScreenshot] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/meal-settings");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSettings((prev) => {
            const next = { ...prev };
            data.forEach((row) => {
              next[row.meal_type] = {
                is_available: row.is_available,
                price: row.price,
                closing_time: row.closing_time || "",
              };
            });
            return next;
          });
        }
      } finally {
        setLoading(false);
      }

      try {
        const res2 = await fetch("/api/app-settings");
        const data2 = await res2.json();
        if (typeof data2.screenshot_required === "boolean") {
          setScreenshotRequired(data2.screenshot_required);
        }
      } catch {}
    })();
  }, []);

  const update = (mealType, key, value) => {
    setSettings((prev) => ({ ...prev, [mealType]: { ...prev[mealType], [key]: value } }));
  };

  const handleSave = async (mealType) => {
    setSavingMeal(mealType);
    setSavedMeal(null);
    setErrors((e) => ({ ...e, [mealType]: null }));

    const row = settings[mealType];
    const price = parseFloat(row.price);
    if (Number.isNaN(price) || price < 0) {
      setErrors((e) => ({ ...e, [mealType]: ["Price must be a non-negative number."] }));
      setSavingMeal(null);
      return;
    }

    try {
      const res = await fetch(`/api/meal-settings/${mealType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-User-Id": String(adminId) },
        body: JSON.stringify({
          is_available: row.is_available,
          price,
          closing_time: row.closing_time || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors((e) => ({ ...e, [mealType]: data.errors || ["Something went wrong."] }));
        return;
      }
      setSavedMeal(mealType);
      setTimeout(() => setSavedMeal((m) => (m === mealType ? null : m)), 2000);
    } finally {
      setSavingMeal(null);
    }
  };

  const handleToggleScreenshot = async (value) => {
    setScreenshotRequired(value);
    setSavingScreenshot(true);
    setSavedScreenshot(false);
    try {
      const res = await fetch("/api/app-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-User-Id": String(adminId) },
        body: JSON.stringify({ screenshot_required: value }),
      });
      if (res.ok) {
        setSavedScreenshot(true);
        setTimeout(() => setSavedScreenshot(false), 2000);
      }
    } finally {
      setSavingScreenshot(false);
    }
  };

  if (loading) return null;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card>
        <CardHeader title="Payment Screenshot" icon={Save} />
        <div className="card-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="body-font" style={{ fontSize: 13, color: "var(--ink-600)" }}>
            Require a payment screenshot before users can place an order.
          </div>
<Switch
  checked={screenshotRequired}
  onChange={handleToggleScreenshot}
  label
  onLabels={["Mandatory", "Optional"]}
/>
        </div>
        {savingScreenshot && (
          <div className="card-pad" style={{ paddingTop: 0, fontSize: 12.5, color: "var(--ink-600)" }}>Saving...</div>
        )}
        {savedScreenshot && (
          <div className="card-pad" style={{ paddingTop: 0, fontSize: 12.5, color: "var(--ok-600)", fontWeight: 700 }}>Saved</div>
        )}
      </Card>

      {Object.entries(MEAL_META).map(([mealType, meta]) => {
        const row = settings[mealType];
        const rowErrors = errors[mealType];
        return (
          <Card key={mealType}>
            <CardHeader title={meta.label} icon={meta.icon} />
            <div className="card-pad" style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="body-font" style={{ fontSize: 13, color: "var(--ink-600)" }}>
                  Turn this off to stop new orders immediately, regardless of closing time.
                </div>
                <Switch
                  checked={row.is_available}
                  onChange={(v) => update(mealType, "is_available", v)}
                  label
                />
              </div>

              <div className="qty-for-grid">
                <Field label="Price per plate">
                  <TextInput
                    type="number"
                    value={row.price}
                    onChange={(e) => update(mealType, "price", e.target.value)}
                    placeholder="e.g. 90"
                  />
                </Field>
                <Field label="Closing time" hint="Leave blank for no cutoff">
                  <TextInput
                    type="time"
                    value={row.closing_time}
                    onChange={(e) => update(mealType, "closing_time", e.target.value)}
                  />
                </Field>
              </div>

              {rowErrors && rowErrors.length > 0 && (
                <div className="body-font" style={{ fontSize: 12.5, color: "var(--bad-600)" }}>
                  {rowErrors.join(" ")}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                {savedMeal === mealType && (
                  <span className="body-font" style={{ fontSize: 12.5, color: "var(--ok-600)", fontWeight: 700 }}>
                    Saved
                  </span>
                )}
                <Button
                  variant="primary"
                  icon={Save}
                  disabled={savingMeal === mealType}
                  onClick={() => handleSave(mealType)}
                >
                  {savingMeal === mealType ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}