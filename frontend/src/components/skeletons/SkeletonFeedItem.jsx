import React from "react";
import { Card } from "../ui/Card";
import { SkelLine, SkelCircle } from "./Skeleton";

export default function SkeletonFeedItem() {
  // avatar + name line, media block, action row, caption lines
  return (
    <Card accent={false} style={{ marginBottom: 16 }}>
      <div style={{ padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <SkelCircle size={38} />
        <div style={{ flex: 1 }}>
          <SkelLine w="34%" h={11} />
          <div style={{ height: 6 }} />
          <SkelLine w="20%" h={9} />
        </div>
      </div>
      <div className="shimmer" style={{ width: "100%", height: 220 }} />
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
          <SkelCircle size={22} />
          <SkelCircle size={22} />
          <SkelCircle size={22} />
        </div>
        <SkelLine w="60%" h={10} />
        <div style={{ height: 8 }} />
        <SkelLine w="85%" h={10} />
      </div>
    </Card>
  );
}
