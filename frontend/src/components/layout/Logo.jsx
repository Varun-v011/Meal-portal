import React from "react";
import { Utensils } from "lucide-react";

export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Utensils size={16} color="var(--brass-400)" />
      </div>
      <div className="brand-font" style={{ fontWeight: 700, fontSize: 15, color: "var(--navy-900)", lineHeight: 1.1 }}>
        SapaaduBooking 
      </div>
    </div>
  );
}
