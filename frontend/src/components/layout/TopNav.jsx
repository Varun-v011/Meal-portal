import React from "react";
import Logo from "./Logo";

/**
 * Desktop top bar. Pass `items` for the role-specific nav
 * (USER_NAV_ITEMS / ADMIN_NAV_ITEMS). Omit items for a bare
 * header (e.g. admin layout, where the Sidebar owns navigation).
 */
export default function TopNav({ page, setPage, items = [], userLabel = "RS", onLogout }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <Logo />
        {items.length > 0 && (
          <div className="nav-tabs">
            {items.map((it) => (
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
        )}
        <button
          onClick={onLogout}
          className="focus-ring"
          title="Log out"
          style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--brass-100)", color: "var(--brass-600)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0, border: "none", cursor: onLogout ? "pointer" : "default" }}
        >
          {userLabel}
        </button>
      </div>
    </div>
  );
}
