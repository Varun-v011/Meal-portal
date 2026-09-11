import React from "react";
import Logo from "./Logo";
import NAV_ITEMS from "./navItems";

export default function TopNav({ page, setPage }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <Logo />
        <div className="nav-tabs">
          {NAV_ITEMS.map((it) => (
            <button
              key={it.key}
              onClick={() => setPage(it.key)}
              className="body-font focus-ring"
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: page === it.key ? "var(--navy-900)" : "transparent",
                color: page === it.key ? "#fff" : "var(--ink-600)",
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--brass-100)", color: "var(--brass-600)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>RS</div>
      </div>
    </div>
  );
}
