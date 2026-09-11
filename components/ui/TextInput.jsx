import React from "react";
import inputBase from "./inputBase";

export default function TextInput({ value, onChange, placeholder, type = "text", icon: Icon, rightIcon, onRightIconClick }) {
  return (
    <div style={{ position: "relative" }}>
      {Icon && <Icon size={16} style={{ position: "absolute", left: 13, top: 13, color: "var(--ink-400)" }} />}
      <input
        className="focus-ring body-font"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        style={{ ...inputBase, paddingLeft: Icon ? 38 : 13, paddingRight: rightIcon ? 38 : 13 }}
      />
      {rightIcon && (
        <button type="button" onClick={onRightIconClick} style={{ position: "absolute", right: 10, top: 9, background: "none", border: "none", cursor: "pointer", color: "var(--ink-400)", padding: 4 }}>
          {rightIcon}
        </button>
      )}
    </div>
  );
}
