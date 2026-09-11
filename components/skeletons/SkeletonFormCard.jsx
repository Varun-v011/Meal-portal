import React from "react";
import { Card, CardHeader } from "../ui/Card";
import { SkelLine, SkelCircle } from "./Skeleton";

export default function SkeletonFormCard() {
  return (
    <Card>
      <CardHeader title=" " />
      <div style={{ padding: 22, display: "grid", gap: 18 }}>
        <SkelLine w="30%" h={11} />
        <div style={{ display: "flex", gap: 10 }}>
          <SkelLine w="50%" h={40} r={9} />
          <SkelLine w="50%" h={40} r={9} />
        </div>
        <SkelLine w="35%" h={11} />
        <SkelLine w="100%" h={42} r={9} />
        <div style={{ display: "flex", gap: 14 }}>
          <SkelCircle size={132} />
          <div style={{ flex: 1, display: "grid", gap: 10 }}>
            <SkelLine w="90%" h={11} />
            <SkelLine w="45%" h={30} r={9} />
            <SkelLine w="60%" h={11} />
          </div>
        </div>
      </div>
    </Card>
  );
}
