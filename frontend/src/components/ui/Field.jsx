import React from "react";

export function Eyebrow({ children }) {
  return (
    <div className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: "var(--brass-600)" }}>
      {children}
    </div>
  );
}

export default function Field({ label, hint, children }) {
  return (
    <div>
      <div className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-600)", marginBottom: 8, textTransform: "uppercase" }}>
        {label}
      </div>
      {children}
      {hint && <div className="body-font" style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 6 }}>{hint}</div>}
    </div>
  );
}
