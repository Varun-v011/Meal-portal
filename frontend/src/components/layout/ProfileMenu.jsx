import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

/**
 * Avatar + name button that opens a small card with the user's
 * name/role and a Logout action. Used at the top of Sidebar (desktop)
 * and can be dropped into any header.
 */
export default function ProfileMenu({ name = "User", role, onLogout, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring body-font"
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "9px 10px", borderRadius: "var(--radius-sm)",
          border: "1px solid var(--line)", background: open ? "var(--canvas)" : "#fff",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brass-100)", color: "var(--brass-600)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12.5, flexShrink: 0 }}>
          {initials(name)}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
          {role && <div style={{ fontSize: 11, color: "var(--ink-400)" }}>{role}</div>}
        </span>
        {/* <ChevronDown size={15} color="var(--ink-400)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s ease", flexShrink: 0 }} /> */}
      </button>

      {/* {open && (  
        // <div
        //   className="body-font"
        //   style={{
        //     position: "absolute", top: "calc(100% + 6px)",
        //     [align]: 0, minWidth: 200, background: "#fff",
        //     border: "1px solid var(--line)", borderRadius: "var(--radius-md)",
        //     boxShadow: "var(--shadow-card)", zIndex: 40, overflow: "hidden",
        //   }}
        // >
        //   <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
        //     <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--navy-900)" }}>{name}</div>
        //     {role && <div style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 2 }}>{role}</div>}
        //   </div>
        //   <button
        //     onClick={() => { setOpen(false); onLogout?.(); }}
        //     style={{
        //       width: "100%", display: "flex", alignItems: "center", gap: 9,
        //       padding: "11px 14px", background: "none", border: "none", cursor: "pointer",
        //       fontSize: 13.5, fontWeight: 600, color: "var(--bad-600)",
        //     }}
        //   >
        //     <LogOut size={15} />
        //     Log out
        //   </button>
        // </div>
      )} */}
    </div>
  );
}
