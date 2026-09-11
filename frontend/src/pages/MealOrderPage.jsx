import React, { useState } from "react";
import { Calendar, Utensils } from "lucide-react";
import { Card, CardHeader, Field, Select, Stepper, ToggleTabs, Button } from "../components/ui";
import FileUploadCard from "../components/meal/FileUploadCard";

const PRICE_MAP = { breakfast: 60, lunch: 90, dinner: 110 };

export default function MealOrderPage() {
  const [day, setDay] = useState("today");
  const [category, setCategory] = useState("");
  const [qty, setQty] = useState(1);
  const [file, setFile] = useState(null);

  const price = PRICE_MAP[category] || 0;
  const total = price * qty;

  return (
    <div style={{ maxWidth: 640 }}>
      <Card>
        <CardHeader title="New meal order" icon={Utensils} />
        <div className="card-pad" style={{ display: "grid", gap: 20 }}>
          <Field label="Order day">
            <ToggleTabs value={day} onChange={setDay} options={[{ value: "today", label: "Today" }, { value: "tomorrow", label: "Tomorrow" }]} />
          </Field>
          <div className="body-font" style={{ fontSize: 12.5, color: "var(--brass-600)", fontStyle: "italic", marginTop: -10 }}>
            {day === "today" ? "Lunch ordering closed now." : "Ordering opens at 8:00 AM."}
          </div>

          <Field label="Meal category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: "breakfast", label: "Breakfast" }, { value: "lunch", label: "Lunch" }, { value: "dinner", label: "Dinner" }]} placeholder="Choose a meal" />
          </Field>
          <div className="body-font" style={{ fontSize: 13, color: "var(--ink-600)", marginTop: -12 }}>Price: <b style={{ color: "var(--navy-900)" }}>₹{price}</b> per plate</div>

          <div className="qty-for-grid">
            <Field label="Quantity" hint="Maximum 10 per order">
              <Stepper value={qty} onChange={setQty} />
            </Field>
            <Field label="Ordering for">
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: "10px 13px", display: "flex", gap: 10, alignItems: "center", background: "var(--canvas)" }}>
                <Calendar size={16} color="var(--brass-600)" />
                <div>
                  <div className="body-font" style={{ fontWeight: 700, fontSize: 13.5, color: "var(--navy-900)" }}>11 Sep 2026</div>
                  <div className="body-font" style={{ fontSize: 11.5, color: "var(--ink-400)" }}>{day === "today" ? "Today · Friday" : "Tomorrow · Saturday"}</div>
                </div>
              </div>
            </Field>
          </div>

          <FileUploadCard file={file} onFile={setFile} total={total} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 12, borderTop: "1px solid var(--line)", marginTop: 4 }}>
            <div className="body-font" style={{ fontSize: 12, color: "var(--bad-600)" }}><b>Note:</b> payment screenshot is required to proceed.</div>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <Button variant="secondary" full>Cancel</Button>
              <Button variant="primary" disabled={!category || !file} full>Proceed</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
