import React, { useState } from "react";
import { Calendar, Clock, Search, X } from "lucide-react";
import { Card, CardHeader, Table, Button, inputBase } from "../components/ui";

/**
 * Reused for both "My History" (user layout, own orders only) and
 * "All History" (admin layout, every user's orders) — pass
 * `showEmployeeColumn` to toggle the Employee column and `title`
 * to relabel the card for context.
 */
export default function HistoryPage({ title = "Meal order history", showEmployeeColumn = true }) {
  const [from, setFrom] = useState("2026-09-11");
  const [to, setTo] = useState("2026-09-11");

  const columns = [
    ...(showEmployeeColumn ? [{ key: "employee", label: "Employee" }] : []),
    { key: "meal", label: "Meal type" }, { key: "qty", label: "Qty" },
    { key: "amount", label: "Amount" }, { key: "screenshot", label: "Payment screenshot" }, { key: "ordered", label: "Ordered date" },
    { key: "for", label: "Ordered for" }, { key: "status", label: "Status" }, { key: "remarks", label: "Remarks" },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card accent={false}>
        <div className="filter-row card-pad">
          <div className="filter-left">
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--navy-900)", fontWeight: 700 }}>
              <Calendar size={16} color="var(--brass-600)" />
              <span className="body-font" style={{ fontSize: 13.5 }}>Filter by ordered for</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="body-font focus-ring" style={{ ...inputBase, width: 150 }} />
              <span style={{ color: "var(--ink-400)" }}>→</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="body-font focus-ring" style={{ ...inputBase, width: 150 }} />
            </div>
            <Button size="sm" icon={Search}>Search</Button>
            <button style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--bad-100)", background: "var(--bad-100)", color: "var(--bad-600)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span className="body-font" style={{ background: "var(--navy-900)", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>QTY: 0</span>
            <span className="body-font" style={{ background: "var(--brass-500)", color: "#fff", padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>TOTAL AMOUNT: ₹0</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title={title} icon={Clock} />
        <Table
          columns={columns}
          rows={[]}
          emptyTitle="No meal orders found for this range."
        />
      </Card>
    </div>
  );
}
