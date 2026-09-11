import React from "react";

export function Card({ children, accent = true, style = {}, className = "" }) {
  return (
    <div
      className={className}
      style={{
        background: "var(--paper)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--line)",
        borderTop: accent ? "3px solid var(--brass-500)" : "1px solid var(--line)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, icon: Icon }) {
  return (
    <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
      {Icon && (
        <span style={{ width: 30, height: 30, borderRadius: 9, background: "var(--brass-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brass-600)" }}>
          <Icon size={16} />
        </span>
      )}
      <h2 className="brand-font" style={{ fontSize: 16, fontWeight: 600, color: "var(--navy-900)", margin: 0 }}>{title}</h2>
    </div>
  );
}

export default Card;
