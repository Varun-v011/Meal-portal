import React, { useEffect, useState } from "react";
import { Clock, Check, X, Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, Table, Button, ImagePreviewModal } from "../components/ui";
import inputBase from "../components/ui/inputBase";
import EmptyState from "../components/ui/EmptyState";

const MEAL_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function RejectDialog({ order, onCancel, onConfirm, submitting }) {
  const [remarks, setRemarks] = useState("");

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15, 20, 35, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--navy-900)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 420, padding: 22, boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}
      >
        <h3 className="brand-font" style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
          Reject order
        </h3>
        <p className="body-font" style={{ color: "rgba(255,255,255,.6)", fontSize: 13, margin: "0 0 18px" }}>
          {order.employee} · {MEAL_LABELS[order.meal_type] || order.meal_type} · Qty {order.quantity}
        </p>

        <div className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "rgba(255,255,255,.6)", marginBottom: 8, textTransform: "uppercase" }}>
          Reason
        </div>
        <textarea
          autoFocus
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Reason for rejecting this order..."
          rows={4}
          style={{ ...inputBase, background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.15)", color: "#fff", resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Button variant="secondary" full onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" full onClick={() => onConfirm(remarks)} disabled={submitting || !remarks.trim()}>
            {submitting ? "Rejecting..." : "Reject order"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage({ adminId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null); // id currently confirming
  const [rejectTarget, setRejectTarget] = useState(null); // order object being rejected
  const [previewSrc, setPreviewSrc] = useState(null);

  const fetchPending = async () => {
    setError("");
    try {
      const res = await fetch("/api/orders/pending", {
        headers: { "X-User-Id": String(adminId) },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load pending orders. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const review = async (orderId, action, remarks) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-User-Id": String(adminId) },
        body: JSON.stringify({ action, remarks }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      setError("That action failed. Please try again.");
    }
  };

  const handleConfirm = async (order) => {
    setActioningId(order.id);
    await review(order.id, "confirm");
    setActioningId(null);
  };

  const handleRejectSubmit = async (remarks) => {
    setActioningId(rejectTarget.id);
    await review(rejectTarget.id, "reject", remarks);
    setActioningId(null);
    setRejectTarget(null);
  };

  const rows = orders.map((o) => ({
    ...o,
    employee: `${o.employee}${o.worker_id ? ` (${o.worker_id})` : ""}`,
  }));

  return (
    <Card>
      <CardHeader title="Pending Meal Orders" icon={Clock} />

      {error && (
        <div className="body-font" style={{ padding: "12px 22px", fontSize: 13, color: "var(--bad-600)", borderBottom: "1px solid var(--line)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <EmptyState icon={Clock} title="Loading pending orders..." />
      ) : (
        <Table
          columns={[
            { key: "employee", label: "Employee" },
            { key: "meal", label: "Meal type", render: (r) => MEAL_LABELS[r.meal_type] || r.meal_type },
            { key: "quantity", label: "Qty" },
            { key: "amount", label: "Amount", render: (r) => `₹${r.amount}` },
            { key: "order_date", label: "Order date", render: (r) => formatDate(r.order_date) },
            { key: "ordered_for", label: "Ordered for", render: (r) => formatDate(r.ordered_for) },
            {
              key: "payment_screenshot",
              label: "Payment screenshot",
              render: (r) => (
                <button
                  type="button"
                  onClick={() => setPreviewSrc(`/api/uploads/${r.payment_screenshot}`)}
                  className="focus-ring body-font"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--navy-900)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13.5 }}
                >
                  <ImageIcon size={14} /> View
                </button>
              ),
            },
            {
              key: "action",
              label: "Action",
              width: 190,
              render: (r) => (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button size="sm" variant="primary" icon={Check} onClick={() => handleConfirm(r)} disabled={actioningId === r.id}>
                    Confirm
                  </Button>
                  <Button size="sm" variant="danger" icon={X} onClick={() => setRejectTarget(r)} disabled={actioningId === r.id}>
                    Reject
                  </Button>
                </div>
              ),
            },
          ]}
          rows={rows}
          emptyTitle="No pending lunch orders."
        />
      )}

      {rejectTarget && (
        <RejectDialog
          order={rejectTarget}
          submitting={actioningId === rejectTarget.id}
          onCancel={() => setRejectTarget(null)}
          onConfirm={handleRejectSubmit}
        />
      )}

      {previewSrc && <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />}
    </Card>
  );
}