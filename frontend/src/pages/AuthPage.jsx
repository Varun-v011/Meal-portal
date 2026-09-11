import React, { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus, Utensils } from "lucide-react";
import { Field, TextInput, Button, ToggleTabs } from "../components/ui";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.(role);
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
            <span className="brand-font" style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>IT Meal Portal</span>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <h1 className="brand-font" style={{ color: "#fff", fontSize: 34, lineHeight: 1.2, fontWeight: 700, maxWidth: 380, margin: 0 }}>
            Placeholder
          </h1>
          <p className="body-font" style={{ color: "rgba(255,255,255,.6)", fontSize: 14.5, marginTop: 14, maxWidth: 340 }}>
            Placeholder - need to update later
          </p>
        </div>
        <div className="body-font" style={{ position: "relative", color: "rgba(255,255,255,.35)", fontSize: 12.5 }}>© 2026 IT Meal Portal</div>
      </div>

      <div className="auth-form-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380 }}>
          <h2 className="brand-font" style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-900)", margin: "0 0 6px" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="body-font" style={{ fontSize: 13.5, color: "var(--ink-600)", margin: "0 0 22px" }}>
            {mode === "login" ? "Sign in to order and track your meals." : "Register with your staff ID to get started."}
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            <Field label="Sign in as">
              <ToggleTabs
                value={role}
                onChange={setRole}
                options={[{ value: "user", label: "Staff" }, { value: "admin", label: "Admin" }]}
              />
            </Field>

            {mode === "register" && (
              <Field label="Full name">
                <TextInput placeholder="e.g. Rahul Sharma" />
              </Field>
            )}
            {mode === "register" && (
              <Field label="Staff ID">
                <TextInput placeholder="e.g. ITM-1042" />
              </Field>
            )}
            <Field label="Mobile No.">
              <TextInput type="mobile" placeholder="+91" />
            </Field>
            <Field label="Password">
              <TextInput
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                rightIcon={showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                onRightIconClick={() => setShowPw((s) => !s)}
              />
            </Field>

            {mode === "login" && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
                <button type="button" className="body-font" style={{ background: "none", border: "none", color: "var(--brass-600)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Forgot password?</button>
              </div>
            )}

            <Button type="submit" full icon={mode === "login" ? LogIn : UserPlus}>
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>

            <div className="body-font" style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)" }}>
              {mode === "login" ? "New here?" : "Already registered?"}{" "}
              <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "var(--navy-900)", fontWeight: 700, cursor: "pointer" }}>
                {mode === "login" ? "Create an account" : "Sign in instead"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
