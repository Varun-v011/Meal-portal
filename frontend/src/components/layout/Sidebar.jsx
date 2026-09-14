import React from "react";
import { LogOut } from "lucide-react";
import Logo from "./Logo";
import ProfileMenu from "./ProfileMenu";

export default function Sidebar({ page, setPage, items, onLogout, userName = "User", userRole, sectionLabel = "Menu" }) {
  return (
    <aside className="sidebar-desktop" style={{ background: "#fff", borderRight: "1px solid var(--line)", flexDirection: "column", padding: "22px 16px", position: "sticky", top: 0, height: "100vh" }}>
      <div style={{ padding: "0 8px", marginBottom: 18 }}>
        <Logo />
      </div>

      <div style={{ marginBottom: 22 }}>
        <ProfileMenu name={userName} role={userRole} onLogout={onLogout} />
      </div>

      <div className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-400)", textTransform: "uppercase", padding: "0 12px", marginBottom: 10 }}>
        {sectionLabel}
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {items.map((it) => {
          const Icon = it.icon;
          const active = page === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setPage(it.key)}
              className="body-font focus-ring"
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "11px 13px", borderRadius: "var(--radius-sm)",
                border: "none", cursor: "pointer", textAlign: "left",
                fontSize: 14, fontWeight: 600,
                background: active ? "var(--navy-900)" : "transparent",
                color: active ? "#fff" : "var(--ink-600)",
              }}
            >
              <Icon size={17} />
              {it.label}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="body-font focus-ring"
        style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", background: "#fff", color: "var(--bad-600)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
      >
        <LogOut size={16} />
        Log out
      </button>
    </aside>
  );
}
