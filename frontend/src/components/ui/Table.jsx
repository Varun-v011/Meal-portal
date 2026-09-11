import React from "react";
import EmptyState from "./EmptyState";

export default function Table({ columns, rows, emptyTitle = "Nothing here yet", emptySubtitle }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="body-font" style={{ textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--ink-600)", padding: "13px 22px", background: "var(--canvas)", borderBottom: "1px solid var(--line)", whiteSpace: "nowrap" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                {columns.map((c) => (
                  <td key={c.key} className="body-font" style={{ padding: "14px 22px", fontSize: 13.5, color: "var(--ink-900)" }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
