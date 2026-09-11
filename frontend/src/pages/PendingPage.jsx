import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, Table } from "../components/ui";

export default function PendingPage() {
  return (
    <Card>
      <CardHeader title="Pending meal orders" icon={Clock} />
      <Table
        columns={[
          { key: "employee", label: "Employee" }, { key: "meal", label: "Meal type" }, { key: "qty", label: "Qty" },
          { key: "amount", label: "Amount" }, { key: "date", label: "Order date" }, { key: "for", label: "Ordered for" },
          { key: "screenshot", label: "Payment screenshot" }, { key: "status", label: "Status" }, { key: "action", label: "Action" },
        ]}
        rows={[]}
        emptyTitle="No pending lunch orders."
      />
    </Card>
  );
}
