import React, { useEffect, useMemo, useState } from "react";
import { Users, Search, Trash2, Phone } from "lucide-react";
import { Card, CardHeader, Table, Button, TextInput } from "../components/ui";

/** Confirm dialog — same navy style as the Reject Order dialog. */
function DeleteDialog({ user, onCancel, onConfirm, submitting }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15, 20, 35, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
      onClick={submitting ? undefined : onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--navy-900)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 420, padding: 22, boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}
      >
        <h3 className="brand-font" style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
          Delete User
        </h3>
        <p className="body-font" style={{ color: "rgba(255,255,255,.6)", fontSize: 13, margin: "0 0 16px" }}>
          {user.name} · {user.department} · {user.mobile_number}
        </p>
        <p className="body-font" style={{ color: "rgba(255,255,255,.85)", fontSize: 13.5, lineHeight: 1.5, margin: 0 }}>
          This permanently removes the account
          {user.order_count > 0
            ? ` and their ${user.order_count} order${user.order_count === 1 ? "" : "s"}, including payment screenshots`
            : ""}
          . This can't be undone.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Button variant="secondary" full onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" full icon={Trash2} onClick={onConfirm} disabled={submitting}>
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Mobile card for one user — mirrors the Table columns, laid out for a narrow screen. */
function UserCard({ user, onDelete }) {
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderTop: "3px solid var(--brass-500)", borderRadius: "var(--radius-lg)", padding: 14 }}>
      <p className="brand-font" style={{ fontWeight: 700, fontSize: 14.5, margin: 0, color: "var(--navy-900)" }}>{user.name}</p>
      <p className="body-font" style={{ fontSize: 12, color: "var(--ink-600)", margin: "2px 0 10px" }}>{user.department || "—"}</p>

      <div className="body-font" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "var(--ink-600)", borderTop: "1px solid var(--line)", paddingTop: 8, marginBottom: 10 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--navy-900)" }}>
          <Phone size={13} /> {user.mobile_number}
        </span>
        <span>Created {user.created_at || "—"}</span>
      </div>

      <Button size="sm" variant="danger" icon={Trash2} full onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}

export default function UsersPage({ adminId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setError("");
    try {
      const res = await fetch("/api/users", { headers: { "X-User-Id": String(adminId) } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load users. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { "X-User-Id": String(adminId) },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0] || "Could not delete user.");
      }
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      setError(e.message || "Could not delete user.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) =>
      [u.name, u.department, u.mobile_number].filter(Boolean).join(" ").toLowerCase().includes(term)
    );
  }, [users, search]);

  const columns = [
    { key: "name", label: "Name", render: (r) => r.name },
    { key: "department", label: "Department", render: (r) => r.department || "—" },
    { key: "mobile_number", label: "Mobile Number", render: (r) => r.mobile_number },
    { key: "created_at", label: "Created at", render: (r) => r.created_at || "—" },
    {
      key: "action",
      label: "Action",
      render: (r) => (
        <Button size="sm" variant="danger" icon={Trash2} onClick={() => setDeleteTarget(r)}>
          Delete
        </Button>
      ),
    },
  ];

  const emptyText = loading
    ? "Loading users..."
    : search.trim()
    ? "No users match your search."
    : "No registered users yet.";

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card>
        <CardHeader title={`Registered Users${!loading ? ` (${filteredRows.length})` : ""}`} icon={Users} />

        <div className="card-pad" style={{ borderBottom: "1px solid var(--line)" }}>
          <div style={{ maxWidth: 320 }}>
            <TextInput icon={Search} placeholder="Search name, department, mobile..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {error && (
          <div className="body-font" style={{ padding: "12px 22px", fontSize: 13, color: "var(--bad-600)", borderBottom: "1px solid var(--line)" }}>
            {error}
          </div>
        )}

        <div className="table-desktop">
          <Table columns={columns} rows={loading ? [] : filteredRows} emptyTitle={emptyText} />
        </div>

        <div className="order-cards-mobile" style={{ padding: !loading && filteredRows.length ? 14 : 0 }}>
          {filteredRows.length === 0 ? (
            <div className="card-pad body-font" style={{ fontSize: 13, color: "var(--ink-600)" }}>{emptyText}</div>
          ) : (
            filteredRows.map((u) => <UserCard key={u.id} user={u} onDelete={() => setDeleteTarget(u)} />)
          )}
        </div>
      </Card>

      {deleteTarget && (
        <DeleteDialog user={deleteTarget} submitting={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
      )}
    </div>
  );
}