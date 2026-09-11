import React from "react";

const STATUS_MAP = {
  confirmed: { bg: "var(--ok-100)", fg: "var(--ok-600)", label: "Confirmed" },
  pending: { bg: "var(--warn-100)", fg: "var(--warn-600)", label: "Pending" },
  rejected: { bg: "var(--bad-100)", fg: "var(--bad-600)", label: "Rejected" },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className="body-font" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, color: s.fg, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 999 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.fg }} />
      {s.label}
    </span>
  );
}
