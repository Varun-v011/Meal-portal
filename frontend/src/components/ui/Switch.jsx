import React from "react";

export default function Switch({ checked, onChange, label }) {
  return (
    <label
      className="focus-ring"
      style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}
    >
      <span
        onClick={() => onChange(!checked)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? "var(--ok-600)" : "var(--line)",
          position: "relative",
          transition: "background .15s ease",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,.25)",
            transition: "left .15s ease",
          }}
        />
      </span>
      {label && (
        <span className="body-font" style={{ fontSize: 13.5, fontWeight: 700, color: checked ? "var(--ok-600)" : "var(--ink-400)" }}>
          {checked ? "Available" : "Closed"}
        </span>
      )}
    </label>
  );
}   