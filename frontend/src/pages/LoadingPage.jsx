import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, Eyebrow } from "../components/ui";
import { SkeletonTableRows, SkeletonFormCard, SkeletonFeedItem } from "../components/skeletons";

export default function LoadingPage() {
  return (
    <div className="grid-loading">
      <div>
        <Eyebrow>TABLE — LOADING</Eyebrow>
        <div style={{ height: 8 }} />
        <Card>
          <CardHeader title="Meal order history" icon={Clock} />
          <SkeletonTableRows rows={5} cols={6} />
        </Card>
        <div style={{ height: 20 }} />
        <Eyebrow>FORM — LOADING</Eyebrow>
        <div style={{ height: 8 }} />
        <SkeletonFormCard />
      </div>
      <div>
        <Eyebrow>FEED / CARD LIST — LOADING</Eyebrow>
        <div style={{ height: 8 }} />
        <SkeletonFeedItem />
        <SkeletonFeedItem />
      </div>
    </div>
  );
}
