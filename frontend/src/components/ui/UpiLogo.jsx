import React from "react";

/** Renders the official UPI logo at icon scale. Matches the (size) prop
 * shape lucide icons use, so it can be dropped into Button's `icon` prop
 * the same way <IndianRupee size={16} /> was. */
export default function UpiLogo({ size = 16 }) {
  const width = size * (213 / 77); // preserves the logo's actual aspect ratio
  return (
    <img
      src="/upi-logo.png"
      alt="UPI"
      width={Math.round(width)}
      height={size}
      style={{ display: "block" }}
    />
  );
}