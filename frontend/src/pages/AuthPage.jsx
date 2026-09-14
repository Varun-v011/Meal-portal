import React, { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus, Utensils } from "lucide-react";
import { Field, TextInput, Button } from "../components/ui";

const EMPTY_FORM = {
  name: "",
  worker_id: "",
  mobile_number: "",
  department: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors([]);
    setForm(EMPTY_FORM);
    setShowPw(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (mode === "register") {
      if (form.password !== form.confirm_password) {
        setErrors(["Password and confirm password do not match."]);
        return;
      }
    }

    setSubmitting(true);
    try {
      const url = mode === "login" ? "/api/login" : "/api/register";
      const body =
        mode === "login"
          ? { worker_id: form.worker_id, password: form.password }
          : {
              name: form.name,
              worker_id: form.worker_id,
              mobile_number: form.mobile_number,
              department: form.department || null,
              email: form.email || null,
              password: form.password,
              confirm_password: form.confirm_password,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors(data.errors || ["Something went wrong. Please try again."]);
        return;
      }

      if (mode === "login") {
        // Role comes entirely from the backend (based on worker_id + password) —
        // the frontend never lets the user choose it. App.jsx routes to the
        // admin or staff layout based on data.user.role.
        onLogin?.(data.user);
      } else {
        // Registration successful — drop them into the login form.
        switchMode("login");
        setForm((f) => ({ ...EMPTY_FORM, worker_id: body.worker_id }));
        setErrors([]);
      }
    } catch (err) {
      setErrors(["Could not reach the server. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell auth-screen">
      <div className="auth-brand" style={{ background: "var(--navy-950)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(circle at 20% 20%, rgba(201,152,46,.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(41,56,115,.5), transparent 45%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Utensils size={16} color="var(--brass-400)" />
            </div>
            <span className="brand-font" style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>IT Mess Portal</span>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <h1 className="brand-font" style={{ color: "#fff", fontSize: 34, lineHeight: 1.2, fontWeight: 700, maxWidth: 380, margin: 0 }}>
            One place to order, track, and settle every staff meal.
          </h1>
          <p className="body-font" style={{ color: "rgba(255,255,255,.6)", fontSize: 14.5, marginTop: 14, maxWidth: 340 }}>
            Scan, pay, and your kitchen team sees the order the moment it's confirmed.
          </p>
        </div>
        <div className="body-font" style={{ position: "relative", color: "rgba(255,255,255,.35)", fontSize: 12.5 }}>© 2026 IT Mess Portal</div>
      </div>

      <div className="auth-form-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380 }}>
          <h2 className="brand-font" style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-900)", margin: "0 0 6px" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="body-font" style={{ fontSize: 13.5, color: "var(--ink-600)", margin: "0 0 22px" }}>
            {mode === "login" ? "Sign in to order and track your meals." : "Register with your staff ID to get started."}
          </p>

          {errors.length > 0 && (
            <div
              className="body-font"
              style={{
                background: "#fdecea",
                border: "1px solid #f0c9c4",
                color: "var(--bad-600, #b3261e)",
                borderRadius: "var(--radius-sm)",
                padding: "10px 12px",
                fontSize: 13,
                marginBottom: 16,
                display: "grid",
                gap: 4,
              }}
            >
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          <div style={{ display: "grid", gap: 16 }}>
            {mode === "register" && (
              <Field label="Full name">
                <TextInput placeholder="e.g. Rahul Sharma" value={form.name} onChange={update("name")} />
              </Field>
            )}
            <Field label="Employee / Contract Worker ID">
              <TextInput placeholder="e.g. ITM-1042" value={form.worker_id} onChange={update("worker_id")} />
            </Field>
            {mode === "register" && (
              <Field label="Mobile number">
                <TextInput placeholder="10-digit mobile number" value={form.mobile_number} onChange={update("mobile_number")} />
              </Field>
            )}
            {mode === "register" && (
              <Field label="Department (optional)">
                <TextInput placeholder="e.g. Engineering" value={form.department} onChange={update("department")} />
              </Field>
            )}
            {mode === "register" && (
              <Field label="Email (optional)">
                <TextInput type="email" placeholder="you@company.com" value={form.email} onChange={update("email")} />
              </Field>
            )}
            <Field label="Password">
              <TextInput
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={update("password")}
                rightIcon={showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                onRightIconClick={() => setShowPw((s) => !s)}
              />
            </Field>
            {mode === "register" && (
              <Field label="Confirm password">
                <TextInput
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm_password}
                  onChange={update("confirm_password")}
                />
              </Field>
            )}

            {mode === "login" && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
                <button type="button" className="body-font" style={{ background: "none", border: "none", color: "var(--brass-600)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Forgot password?</button>
              </div>
            )}

            <Button type="submit" full icon={mode === "login" ? LogIn : UserPlus} disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </Button>

            <div className="body-font" style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)" }}>
              {mode === "login" ? "New here?" : "Already registered?"}{" "}
              <button type="button" onClick={() => switchMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "var(--navy-900)", fontWeight: 700, cursor: "pointer" }}>
                {mode === "login" ? "Create an account" : "Sign in instead"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
