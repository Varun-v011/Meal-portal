import React from "react";
import { SkelLine } from "./Skeleton";

export default function SkeletonTableRows({ rows = 4, cols = 6 }) {
  return (
    <div>
      <div style={{ display: "flex", padding: "13px 22px", background: "var(--canvas)", borderBottom: "1px solid var(--line)" }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} style={{ flex: 1, paddingRight: 20 }}><SkelLine w="70%" h={9} /></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", padding: "16px 22px", borderBottom: "1px solid var(--line)" }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} style={{ flex: 1, paddingRight: 20 }}>
              <SkelLine w={c === 0 ? "80%" : "50%"} h={11} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
