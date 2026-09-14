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
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const DEFAULT_FROM = todayIso();

/**
 * Reused for both "My History" (user layout, own orders only) and
 * "All History" (admin layout, every user's orders) — pass
 * `showEmployeeColumn` to toggle the Employee column and `title`
 * to relabel the card for context. Pass `userId` to scope to one
 * worker's own orders; omit it (admin) to see everyone's.
 */
export default function HistoryPage({ title = "Meal order history", showEmployeeColumn = true, currentUserId, showSearch = true, showFilters = true }) {
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(todayIso());
  const [appliedFrom, setAppliedFrom] = useState(DEFAULT_FROM);
  const [appliedTo, setAppliedTo] = useState(todayIso());
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
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) => {
      const haystack = [
        o.employee,
        o.worker_id,
        MEAL_LABELS[o.meal_type] || o.meal_type,
        o.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [orders, search]);

  // Rejected orders never collected payment, so they shouldn't count toward
  // the qty/total summary — only pending + confirmed orders count.
  const totalQty = filteredRows.reduce((sum, o) => (o.status === "rejected" ? sum : sum + Number(o.quantity || 0)), 0);
  const totalAmount = filteredRows.reduce((sum, o) => (o.status === "rejected" ? sum : sum + Number(o.amount || 0)), 0);

  const columns = [
    ...(showEmployeeColumn ? [{ key: "employee", label: "Employee", render: (r) => `${r.employee}${r.worker_id ? ` (${r.worker_id})` : ""}` }] : []),
    { key: "meal", label: "Meal type", render: (r) => MEAL_LABELS[r.meal_type] || r.meal_type },
    { key: "qty", label: "Qty", render: (r) => r.quantity },
    { key: "amount", label: "Amount", render: (r) => `₹${r.amount}` },
    {
      key: "screenshot",
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
    { key: "ordered", label: "Ordered date", render: (r) => formatDate(r.order_date) },
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
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="body-font focus-ring" style={{ ...inputBase, width: 150 }} />
              <span style={{ color: "var(--ink-400)" }}>→</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="body-font focus-ring" style={{ ...inputBase, width: 150 }} />
            </div>
            {showSearch && (
              <div style={{ width: 220 }}>
                <TextInput icon={Search} placeholder="Search name, ID, meal..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            )}
            <Button size="sm" icon={Search} onClick={handleSearch} disabled={loading}>Search</Button>
            <button onClick={handleClear} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--bad-100)", background: "var(--bad-100)", color: "var(--bad-600)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
          </div>
        </div>
      </Card>
      )}

      {showFilters && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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
        <Table
          columns={columns}
          rows={loading ? [] : filteredRows}
          emptyTitle={loading ? "Loading order history..." : "No meal orders found for this range."}
        />
      </Card>

      {previewSrc && <ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />}
    </div>
  );
}