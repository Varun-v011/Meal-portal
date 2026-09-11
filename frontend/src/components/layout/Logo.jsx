import React from "react";
import { Utensils } from "lucide-react";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Utensils size={16} color="var(--brass-400)" />
      </div>
      <div className="brand-font" style={{ fontWeight: 700, fontSize: 15, color: "var(--navy-900)", lineHeight: 1.1 }}>
        IT Mess Portal
        <div className="body-font" style={{ fontWeight: 500, fontSize: 10.5, color: "var(--ink-400)", letterSpacing: ".04em" }}>STAFF MEALS</div>
      </div>
    </div>
  );
}
