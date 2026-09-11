import React from "react";

export function SkelLine({ w = "100%", h = 12, r = 6 }) {
  return <div className="shimmer" style={{ width: w, height: h, borderRadius: r }} />;
}

export function SkelCircle({ size = 40 }) {
  return <div className="shimmer" style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0 }} />;
}
