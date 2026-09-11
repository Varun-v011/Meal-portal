import React from "react";
import { Minus, Plus } from "lucide-react";

export default function Stepper({ value, onChange, max = 10 }) {
  const btnStyle = { width: 36, height: 40, border: "1px solid var(--line)", background: "#fff", color: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
  return (
    <div style={{ display: "flex", alignItems: "center", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--line)", width: "fit-content" }}>
      <button type="button" style={{ ...btnStyle, border: "none", borderRight: "1px solid var(--line)" }} onClick={() => onChange(Math.max(1, value - 1))}><Minus size={14} /></button>
      <div className="body-font" style={{ width: 44, textAlign: "center", fontWeight: 700, fontSize: 14, color: "var(--navy-900)" }}>{value}</div>
      <button type="button" style={{ ...btnStyle, border: "none", borderLeft: "1px solid var(--line)" }} onClick={() => onChange(Math.min(max, value + 1))}><Plus size={14} /></button>
    </div>
  );
}
