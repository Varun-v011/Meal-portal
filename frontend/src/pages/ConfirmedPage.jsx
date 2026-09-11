import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, EmptyState } from "../components/ui";

export default function ConfirmedPage() {
  return (
    <Card>
      <CardHeader title="Today's confirmed meal orders" icon={Clock} />
      <EmptyState title="No confirmed meal orders for today yet." />
    </Card>
  );
}
