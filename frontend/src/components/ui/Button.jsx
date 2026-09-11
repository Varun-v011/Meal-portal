import React from "react";

const sizes = {
  sm: { padding: "8px 14px", fontSize: 13 },
  md: { padding: "11px 18px", fontSize: 14 },
};

const variants = {
  primary: (disabled) => ({ background: disabled ? "#a7ade0" : "var(--navy-900)", color: "#fff", border: "1px solid transparent" }),
  secondary: () => ({ background: "#fff", color: "var(--navy-900)", border: "1px solid var(--line)" }),
  ghost: () => ({ background: "transparent", color: "var(--ink-600)", border: "1px solid transparent" }),
  danger: () => ({ background: "#fff", color: "var(--bad-600)", border: "1px solid #f0c9c4" }),
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled,
  onClick,
  type = "button",
  full,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="focus-ring body-font"
      style={{
        ...sizes[size],
        ...variants[variant](disabled),
        borderRadius: "var(--radius-sm)",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        transition: "transform .12s ease, box-shadow .12s ease",
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(.98)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
