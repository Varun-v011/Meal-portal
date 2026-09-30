// import React from "react";

// export default function ToggleTabs({ options, value, onChange }) {
//   return (
//     <div style={{ display: "flex", gap: 8 }}>
//       {options.map((o) => {
//         const active = o.value === value;
//         return (
//           <button
//             key={o.value}
//             type="button"
//             onClick={() => onChange(o.value)}
//             className="body-font focus-ring"
//             style={{
//               flex: 1,
//               padding: "13px 0",
//               borderRadius: "var(--radius-sm)",
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: "pointer",
//               border: active ? "1px solid var(--navy-900)" : "1px solid var(--line)",
//               background: active ? "var(--navy-900)" : "#fff",
//               color: active ? "#fff" : "var(--ink-600)",
//             }}
//           >
//             {o.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }


import React from "react";

export default function ToggleTabs({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((o) => {
        const active = o.value === value;
        const disabled = !!o.disabled;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => !disabled && onChange(o.value)}
            disabled={disabled}
            className="body-font focus-ring"
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              fontSize: 14,
              cursor: disabled ? "not-allowed" : "pointer",
              border: active ? "1px solid var(--navy-900)" : "1px solid var(--line)",
              background: disabled ? "var(--canvas)" : active ? "var(--navy-900)" : "#fff",
              color: disabled ? "var(--ink-400)" : active ? "#fff" : "var(--ink-600)",
              opacity: disabled ? 0.7 : 1,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}