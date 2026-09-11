import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title, subtitle }) {
  return (
    <div style={{ padding: "56px 20px", textAlign: "center" }}>
      <div style={{ width: 44, height: 44, margin: "0 auto 14px", borderRadius: 12, background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-400)" }}>
        <Icon size={20} />
      </div>
      <div className="body-font" style={{ fontWeight: 600, color: "var(--ink-600)", fontSize: 14 }}>{title}</div>
      {subtitle && <div className="body-font" style={{ fontSize: 13, color: "var(--ink-400)", marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}
