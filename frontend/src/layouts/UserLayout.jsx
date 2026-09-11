import React from "react";
import { TopNav, BottomNav, USER_NAV_ITEMS } from "../components/layout";

export default function UserLayout({ page, setPage, onLogout, children, title, subtitle }) {
  return (
    <div className="body-font app-shell" style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      <TopNav page={page} setPage={setPage} items={USER_NAV_ITEMS} onLogout={onLogout} />
      <div className="page-wrap">
        <div className="header-row">
          <div>
            <h1 className="brand-font" style={{ fontSize: 20, fontWeight: 700, color: "var(--navy-900)", margin: 0 }}>{title}</h1>
            {subtitle && <p className="body-font" style={{ fontSize: 13, color: "var(--ink-600)", margin: "4px 0 0" }}>{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
      <BottomNav page={page} setPage={setPage} items={USER_NAV_ITEMS} />
    </div>
  );
}
