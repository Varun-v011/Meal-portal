import React from "react";
import { ChevronDown } from "lucide-react";
import inputBase from "./inputBase";

export default function Select({ value, onChange, options, placeholder = "Select" }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        className="focus-ring body-font"
        value={value}
        onChange={onChange}
        style={{ ...inputBase, appearance: "none", paddingRight: 34, color: value ? "var(--ink-900)" : "var(--ink-400)" }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={16} style={{ position: "absolute", right: 12, top: 13, color: "var(--ink-400)", pointerEvents: "none" }} />
    </div>
  );
}
