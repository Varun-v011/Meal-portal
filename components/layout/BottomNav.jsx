import React from "react";
import NAV_ITEMS from "./navItems";

export default function BottomNav({ page, setPage }) {
  return (
    <div
      className="nav-tabs-mobile"
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 30,
        background: "#fff", borderTop: "1px solid var(--line)",
        justifyContent: "space-around", alignItems: "center",
        padding: "8px 6px calc(8px + env(safe-area-inset-bottom))",
        boxShadow: "0 -6px 18px -12px rgba(15,23,48,.25)",
      }}
    >
      {NAV_ITEMS.map((it) => {
        const Icon = it.icon;
        const active = page === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setPage(it.key)}
            className="focus-ring"
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 8px", color: active ? "var(--navy-900)" : "var(--ink-400)", flex: 1 }}
          >
            <Icon size={19} strokeWidth={active ? 2.4 : 2} />
            <span className="body-font" style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
