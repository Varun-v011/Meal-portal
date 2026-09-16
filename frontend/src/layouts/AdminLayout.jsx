import React from "react";
import { Sidebar, BottomNav, ADMIN_NAV_ITEMS } from "../components/layout";

export default function AdminLayout({ page, setPage, onLogout, children, title, subtitle, userName = "Admin User", userRole = "Administrator", userMobile }) {
  return (
    <div className="sidebar-shell app-shell" style={{ background: "var(--canvas)" }}>
      <Sidebar
        page={page}
        setPage={setPage}
        items={ADMIN_NAV_ITEMS}
        onLogout={onLogout}
        userName={userName}
        userRole={userRole}
        userMobile={userMobile}
        sectionLabel="Admin dashboard"
      />
      <div className="sidebar-content">
        <div className="page-wrap">
          <div className="header-row">
            <div>
              <h1 className="brand-font" style={{ fontSize: 20, fontWeight: 700, color: "var(--navy-900)", margin: 0 }}>{title}</h1>
              {subtitle && <p className="body-font" style={{ fontSize: 13, color: "var(--ink-600)", margin: "4px 0 0" }}>{subtitle}</p>}
            </div>
          </div>
          {children}
        </div>
      </div>
      <BottomNav page={page} setPage={setPage} items={ADMIN_NAV_ITEMS} />
    </div>
  );
}