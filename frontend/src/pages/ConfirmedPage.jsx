import React, { useEffect, useMemo, useState } from "react";
import { Clock, Coffee, Sun, Moon, Eye, X, Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, Table, Button, EmptyState, ToggleTabs, ImagePreviewModal } from "../components/ui";

const MEAL_META = {
  breakfast: { label: "Breakfast", icon: Coffee },
  lunch: { label: "Lunch", icon: Sun },
  dinner: { label: "Dinner", icon: Moon },
};
const MEAL_ORDER = ["breakfast", "lunch", "dinner"];

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function groupByMeal(orders) {
  const byMeal = {};
  orders.forEach((o) => {
    if (!byMeal[o.meal_type]) byMeal[o.meal_type] = [];
    byMeal[o.meal_type].push(o);
  });
  return MEAL_ORDER.filter((m) => byMeal[m] && byMeal[m].length > 0).map((mealType) => {
    const mealOrders = byMeal[mealType];
    const qty = mealOrders.reduce((sum, o) => sum + Number(o.quantity), 0);
    const total = mealOrders.reduce((sum, o) => sum + Number(o.amount), 0);
    return { mealType, orders: mealOrders, qty, total };
  });
}

function MealOrdersModal({ mealType, orders, onClose }) {
  const meta = MEAL_META[mealType];
  const [previewSrc, setPreviewSrc] = useState(null);
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15, 20, 35, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 860, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}
      >
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {meta && (
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "var(--brass-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brass-600)" }}>
                <meta.icon size={16} />
              </span>
            )}
            <h2 className="brand-font" style={{ fontSize: 16, fontWeight: 600, color: "var(--navy-900)", margin: 0 }}>
              {meta ? meta.label : mealType} — confirmed orders
            </h2>
          </div>
          <button className="focus-ring" onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-600)", padding: 6 }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ overflowY: "auto" }}>
          <Table
            columns={[
              { key: "employee", label: "Employee" },
              { key: "quantity", label: "Qty" },
              { key: "amount", label: "Amount", render: (r) => `₹${r.amount}` },
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
            ]}
            rows={orders.map((o) => ({ ...o, employee: `${o.employee}${o.worker_id ? ` (${o.worker_id})` : ""}` }))}
            emptyTitle="No confirmed orders."
          />
        </div>
      </div>
      {previewSrc && <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />}
    </div>
  );
}

export default function ConfirmedPage({ adminId }) {
  const [day, setDay] = useState("today"); // "today" | "tomorrow"
  const [ordersToday, setOrdersToday] = useState([]);
  const [ordersTomorrow, setOrdersTomorrow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMeal, setViewMeal] = useState(null);

  useEffect(() => {
    if (!adminId) return;
    (async () => {
      setError("");
      try {
        const headers = { "X-User-Id": String(adminId) };
        const [resToday, resTomorrow] = await Promise.all([
          fetch("/api/orders/confirmed-today", { headers }),
          fetch(`/api/orders/confirmed-today?date=${tomorrowIso()}`, { headers }),
        ]);
        if (!resToday.ok || !resTomorrow.ok) throw new Error();
        const [dataToday, dataTomorrow] = await Promise.all([resToday.json(), resTomorrow.json()]);
        setOrdersToday(Array.isArray(dataToday) ? dataToday : []);
        setOrdersTomorrow(Array.isArray(dataTomorrow) ? dataTomorrow : []);
      } catch {
        setError("Could not load confirmed orders. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, [adminId]);

  const groupsToday = useMemo(() => groupByMeal(ordersToday), [ordersToday]);
  const groupsTomorrow = useMemo(() => groupByMeal(ordersTomorrow), [ordersTomorrow]);
  const groups = day === "today" ? groupsToday : groupsTomorrow;
  const cardTitle = day === "today" ? "Today's confirmed meal orders" : "Tomorrow's confirmed meal orders";
  const emptyTitle = day === "today" ? "No confirmed meal orders for today yet." : "No confirmed meal orders for tomorrow yet.";

  if (loading) {
    return (
      <Card>
        <CardHeader title="Confirmed meal orders" icon={Clock} />
        <EmptyState icon={Clock} title="Loading confirmed orders..." />
      </Card>
    );
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ maxWidth: 280 }}>
        <ToggleTabs
          value={day}
          onChange={setDay}
          options={[
            { value: "today", label: `Today${ordersToday.length ? ` (${ordersToday.length})` : ""}` },
            { value: "tomorrow", label: `Tomorrow${ordersTomorrow.length ? ` (${ordersTomorrow.length})` : ""}` },
          ]}
        />
      </div>

      {error && (
        <div className="body-font" style={{ fontSize: 13, color: "var(--bad-600)" }}>
          {error}
        </div>
      )}

      {groups.length === 0 ? (
        <Card>
          <CardHeader title={cardTitle} icon={Clock} />
          <EmptyState title={emptyTitle} />
        </Card>
      ) : (
        groups.map(({ mealType, orders: mealOrders, qty, total }) => {
          const meta = MEAL_META[mealType];
          return (
            <Card key={mealType}>
              <CardHeader title={meta ? meta.label : mealType} icon={meta ? meta.icon : Clock} />
              <div className="card-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                <div style={{ display: "flex", flex: 1, minWidth: 240 }}>
                  <div style={{ flex: 1 }}>
                    <div className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-600)", textTransform: "uppercase" }}>
                      Orders
                    </div>
                    <div className="brand-font" style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-900)" }}>{mealOrders.length}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-600)", textTransform: "uppercase" }}>
                      Quantity
                    </div>
                    <div className="brand-font" style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-900)" }}>{qty}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-600)", textTransform: "uppercase" }}>
                      Total
                    </div>
                    <div className="brand-font" style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-900)" }}>₹{total}</div>
                  </div>
                </div>
                <Button variant="secondary" icon={Eye} onClick={() => setViewMeal(mealType)}>
                  View all orders for this meal
                </Button>
              </div>
            </Card>
          );
        })
      )}

      {viewMeal && (
        <MealOrdersModal
          mealType={viewMeal}
          orders={groups.find((g) => g.mealType === viewMeal)?.orders || []}
          onClose={() => setViewMeal(null)}
        />
      )}
    </div>
  );
}