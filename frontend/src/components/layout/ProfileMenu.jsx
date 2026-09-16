import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

/**
 * Avatar + name button. Shows the user's mobile number under their name
 * (variant="row" only — used at the top of Sidebar on desktop).
 *
 * variant="avatar": just the circular initials, no name/mobile text —
 * used in BottomNav (mobile).
 *
 * The dropdown (name/mobile card + Logout) is intentionally left
 * commented out for now — not needed yet.
 */
export default function ProfileMenu({ name = "User", mobile, onLogout, align = "left", variant = "row" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const isAvatar = variant === "avatar";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring body-font"
        style={
          isAvatar
            ? {
                width: 40, height: 40, borderRadius: "50%",
                background: open ? "var(--brass-100)" : "var(--canvas)",
                border: "1px solid var(--line)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 0,
              }
            : {
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line)", background: open ? "var(--canvas)" : "#fff",
                cursor: "pointer", textAlign: "left",
              }
        }
      >
        <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brass-100)", color: "var(--brass-600)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12.5, flexShrink: 0 }}>
          {initials(name)}
        </span>
        {!isAvatar && (
          <span style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
            {mobile && <div style={{ fontSize: 11, color: "var(--ink-400)" }}>{mobile}</div>}
          </span>
        )}
      </button>

      {/* {open && (
        <div
          className="body-font"
          style={{
            position: "absolute",
            ...(isAvatar ? { bottom: "calc(100% + 8px)" } : { top: "calc(100% + 6px)" }),
            [align]: 0, minWidth: 200, background: "#fff",
            border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-card)", zIndex: 40, overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--navy-900)" }}>{name}</div>
            {mobile && <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 2 }}>{mobile}</div>}
          </div>
          <button
            onClick={() => { setOpen(false); onLogout?.(); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 9,
              padding: "11px 14px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13.5, fontWeight: 600, color: "var(--bad-600)",
            }}
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      )} */}
    </div>
  );
}