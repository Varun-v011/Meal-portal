import React from "react";
import { Utensils } from "lucide-react";
import { Sidebar, BottomNav, USER_NAV_ITEMS } from "../components/layout";

export default function UserLayout({ page, setPage, onLogout, children, title, subtitle, userName = "Rahul Sharma", userRole = "Staff", contentMaxWidth }) {
  return (
    <div className="sidebar-shell app-shell" style={{ background: "var(--canvas)" }}>
      <Sidebar
        page={page}
        setPage={setPage}
        items={USER_NAV_ITEMS}
        onLogout={onLogout}
        userName={userName}
        userRole={userRole}
        sectionLabel="Menu"
      />

      {/* Mobile-only navy brand header — visibility controlled entirely by the
          .mobile-header CSS class (tokens.css), never inline, so the media
          query can actually take effect. */}
      <div className="mobile-header" style={{ background: "var(--navy-900)", color: "#fff", padding: "14px 18px", alignItems: "center", gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brass-400)" }}>
          <Utensils size={16} />
        </span>
        <span className="brand-font" style={{ fontSize: 16, fontWeight: 700 }}>NLCIL Meal Portal</span>
      </div>

      <div className="sidebar-content">
        <div className="page-wrap">
          <div style={contentMaxWidth ? { maxWidth: contentMaxWidth, marginLeft: "auto", marginRight: "auto" } : undefined}>
            <div className="header-row">
              <div>
                <h1 className="brand-font" style={{ fontSize: 20, fontWeight: 700, color: "var(--navy-900)", margin: 0 }}>{title}</h1>
                {subtitle && <p className="body-font" style={{ fontSize: 13, color: "var(--ink-600)", margin: "4px 0 0" }}>{subtitle}</p>}
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
      <BottomNav page={page} setPage={setPage} items={USER_NAV_ITEMS} />
    </div>
  );
}