import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Search, X, Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, Table, Button, TextInput, StatusBadge, ImagePreviewModal, inputBase } from "../components/ui";

const MEAL_LABELS = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

const DEFAULT_FROM = todayIso();

/** Mobile card for a single history row — mirrors the Table columns/labels
 * exactly, just laid out for a narrow screen instead of a wide row. */
function HistoryOrderCard({ order, showEmployeeColumn, onView }) {
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderTop: "3px solid var(--brass-500)", borderRadius: "var(--radius-lg)", padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          {showEmployeeColumn && (
            <>
              <p className="brand-font" style={{ fontWeight: 700, fontSize: 14.5, margin: 0, color: "var(--navy-900)" }}>{order.employee}</p>
              <p className="body-font" style={{ fontSize: 12, color: "var(--ink-600)", margin: "2px 0 0" }}>
                {order.department || "—"} · {MEAL_LABELS[order.meal_type] || order.meal_type}
              </p>
            </>
          )}
          {!showEmployeeColumn && (
            <p className="brand-font" style={{ fontWeight: 700, fontSize: 14.5, margin: 0, color: "var(--navy-900)" }}>
              {MEAL_LABELS[order.meal_type] || order.meal_type}
            </p>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="body-font" style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-600)", borderTop: "1px solid var(--line)", paddingTop: 8, marginBottom: 4 }}>
        <span>Qty {order.quantity}</span>
        <span style={{ fontWeight: 700, color: "var(--navy-900)" }}>₹{order.amount}</span>
      </div>
      <div className="body-font" style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-600)", marginBottom: 10 }}>
        <span>Ordered at {order.created_at || "—"}</span>
        <span>Ordered for {formatDate(order.ordered_for)}</span>
      </div>

      <button
        type="button"
        onClick={onView}
        className="focus-ring body-font"
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: 8, fontSize: 12.5, fontWeight: 600, color: "var(--navy-900)", cursor: "pointer" }}
      >
        <ImageIcon size={14} /> Payment Screenshot
      </button>

      {order.remarks && (
        <p className="body-font" style={{ fontSize: 12, color: "var(--ink-600)", margin: "10px 0 0" }}>
          Remarks: {order.remarks}
        </p>
      )}
    </div>
  );
}

/**
 * Reused for both "My History" (user layout, own orders only) and
 * "All History" (admin layout, every user's orders) — pass
 * `showEmployeeColumn` to toggle the Employee column and `title`
 * to relabel the card for context. Pass `userId` to scope to one
 * staff's own orders; omit it (admin) to see everyone's.
 *
 * `hidePending`: pending orders already have their own dedicated page
 * (admin's Pending Orders) — pass this on the admin History view so
 * they aren't duplicated here. Left false for "My History" so staff
 * can still see their own pending orders in their personal history.
 */
export default function HistoryPage({ title = "Meal order history", showEmployeeColumn = true, currentUserId, showSearch = true, showFilters = true, hidePending = false }) {
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(todayIso());
  const [appliedFrom, setAppliedFrom] = useState(showFilters ? DEFAULT_FROM : null);
  const [appliedTo, setAppliedTo] = useState(showFilters ? todayIso() : null);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState(null);

  const fetchHistory = async (fromDate, toDate) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);
      const res = await fetch(`/api/orders/history?${params.toString()}`, {
        headers: { "X-User-Id": String(currentUserId) },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load order history. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchHistory(appliedFrom, appliedTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const handleSearch = () => {
    setAppliedFrom(from);
    setAppliedTo(to);
    fetchHistory(from, to);
  };

  const handleClear = () => {
    setFrom(DEFAULT_FROM);
    setTo(todayIso());
    setSearch("");
    setAppliedFrom(DEFAULT_FROM);
    setAppliedTo(todayIso());
    fetchHistory(DEFAULT_FROM, todayIso());
  };

  const filteredRows = useMemo(() => {
    const base = hidePending ? orders.filter((o) => o.status !== "pending") : orders;
    const term = search.trim().toLowerCase();
    if (!term) return base;
    return base.filter((o) => {
      const haystack = [
        o.employee,
        o.department,
        MEAL_LABELS[o.meal_type] || o.meal_type,
        o.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [orders, search, hidePending]);

  // Rejected orders never collected payment, so they shouldn't count toward
  // the qty/total summary — only pending + confirmed orders count.
  const totalQty = filteredRows.reduce((sum, o) => (o.status === "rejected" ? sum : sum + Number(o.quantity || 0)), 0);
  const totalAmount = filteredRows.reduce((sum, o) => (o.status === "rejected" ? sum : sum + Number(o.amount || 0)), 0);

  const columns = [
    ...(showEmployeeColumn ? [{ key: "employee", label: "Name", render: (r) => r.employee }] : []),
    ...(showEmployeeColumn ? [{ key: "department", label: "Department", render: (r) => r.department || "—" }] : []),
    { key: "meal", label: "Meal type", render: (r) => MEAL_LABELS[r.meal_type] || r.meal_type },
    { key: "qty", label: "Qty", render: (r) => r.quantity },
    { key: "amount", label: "Amount", render: (r) => `₹${r.amount}` },
    {
      key: "screenshot",
      label: "Payment Screenshot",
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
    { key: "created_at", label: "Ordered at", render: (r) => r.created_at || "—" },
    { key: "for", label: "Ordered for", render: (r) => formatDate(r.ordered_for) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "remarks", label: "Remarks", render: (r) => r.remarks || "—" },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {showFilters && (
      <Card accent={false}>
        <div className="filter-row card-pad">
          <div className="filter-left">
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--navy-900)", fontWeight: 700 }}>
              <Calendar size={16} color="var(--brass-600)" />
              <span className="body-font" style={{ fontSize: 13.5 }}>Filter by ordered for</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="body-font focus-ring date-filter-input" style={inputBase} />
                <span style={{ color: "var(--ink-400)" }}>→</span>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="body-font focus-ring date-filter-input" style={inputBase} />
            </div>
            {showSearch && (
              <div style={{ width: 220 }}>
                <TextInput icon={Search} placeholder="Search name, department, meal..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            )}
            <Button size="sm" onClick={handleSearch} disabled={loading}>Apply Filter</Button>
            <button onClick={handleClear} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--bad-100)", background: "var(--bad-100)", color: "var(--bad-600)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
          </div>
        </div>
      </Card>
      )}

      {showFilters && (
        <div className="summary-cards" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Card style={{ flex: 1, minWidth: 200 }}>
            <div className="card-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-600)", textTransform: "uppercase" }}>
                Total quantity
              </span>
              <span className="brand-font" style={{ fontSize: 24, fontWeight: 700, color: "var(--navy-900)" }}>{totalQty}</span>
            </div>
          </Card>
          <Card style={{ flex: 1, minWidth: 200 }}>
            <div className="card-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="body-font" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--ink-600)", textTransform: "uppercase" }}>
                Total amount
              </span>
              <span className="brand-font" style={{ fontSize: 24, fontWeight: 700, color: "var(--navy-900)" }}>₹{totalAmount}</span>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader title={title} icon={Clock} />
        {error && (
          <div className="body-font" style={{ padding: "12px 22px", fontSize: 13, color: "var(--bad-600)", borderBottom: "1px solid var(--line)" }}>
            {error}
          </div>
        )}

        <div className="table-desktop">
          <Table
            columns={columns}
            rows={loading ? [] : filteredRows}
            emptyTitle={loading ? "Loading order history..." : "No meal orders found for this range."}
          />
        </div>

        <div className="order-cards-mobile" style={{ padding: !loading && filteredRows.length ? 14 : 0 }}>
          {loading ? (
            <div className="card-pad body-font" style={{ fontSize: 13, color: "var(--ink-600)" }}>Loading order history...</div>
          ) : filteredRows.length === 0 ? (
            <div className="card-pad body-font" style={{ fontSize: 13, color: "var(--ink-600)" }}>No meal orders found for this range.</div>
          ) : (
            filteredRows.map((r) => (
              <HistoryOrderCard
                key={r.id}
                order={r}
                showEmployeeColumn={showEmployeeColumn}
                onView={() => setPreviewSrc(`/api/uploads/${r.payment_screenshot}`)}
              />
            ))
          )}
        </div>
      </Card>

      {previewSrc && <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />}
    </div>
  );
}