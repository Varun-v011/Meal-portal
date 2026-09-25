import React, { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus, Utensils, KeyRound } from "lucide-react";
import { Field, TextInput, Button } from "../components/ui";
import useIsMobile from "../hooks/useIsMobile";

const EMPTY_FORM = {
  name: "",
  mobile_number: "",
  department: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function AuthPage({ onLogin }) {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [mobileShake, setMobileShake] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleMobileChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length > 10) {
      setMobileShake(true);
      setTimeout(() => setMobileShake(false), 400);
      return; // don't update past 10 digits
    }
    setForm((f) => ({ ...f, mobile_number: digitsOnly }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors([]);
    setForm(EMPTY_FORM);
    setShowPw(false);
    setResetDone(false);
    setVerified(false);
  };

  const handleVerify = async () => {
    setErrors([]);
    setVerifying(true);
    try {
      const res = await fetch("/api/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, mobile_number: form.mobile_number }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors || ["Something went wrong. Please try again."]);
        return;
      }
      setVerified(true);
    } catch {
      setErrors(["Could not reach the server. Please try again."]);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (mode === "forgot" && !verified) return; // shouldn't happen — Verify gates this

    if (mode === "register" || mode === "forgot") {
      if (form.password !== form.confirm_password) {
        setErrors(["Password and confirm password do not match."]);
        return;
      }
    }

    setSubmitting(true);
    try {
      const url =
        mode === "login" ? "/api/login" : mode === "register" ? "/api/register" : "/api/forgot-password";

      const body =
        mode === "login"
          ? { mobile_number: form.mobile_number, password: form.password }
          : mode === "register"
          ? {
              name: form.name,
              mobile_number: form.mobile_number,
              department: form.department,
              email: form.email || null,
              password: form.password,
              confirm_password: form.confirm_password,
            }
          : {
              name: form.name,
              mobile_number: form.mobile_number,
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
        onLogin?.(data.user);
      } else if (mode === "register") {
        switchMode("login");
        setForm((f) => ({ ...EMPTY_FORM, name: body.name }));
        setErrors([]);
      } else {
        setResetDone(true);
      }
    } catch (err) {
      setErrors(["Could not reach the server. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  const heading = mode === "login" ? "Welcome" : mode === "register" ? "Create Your Account" : "Reset your password";
  const subheading =
    mode === "login"
      ? "Sign in"
      : mode === "register"
      ? ""
      : "Verify your name and mobile number to set a new password.";

  return (
    <div className="auth-shell auth-screen" style={{ overflowY: "auto", minHeight: "100vh" }}>
      <div
        className="auth-brand"
        style={{
          background: "var(--navy-950)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : "stretch",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(201,152,46,.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(41,56,115,.5), transparent 45%)",
          }}
        />

        {!isMobile && (
          // Logo sits out of flow so it doesn't push the hero block down and
          // throw off its vertical centering relative to the login card.
<div style={{ position: "absolute", top: 36, left: 44, zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 9,
      background: "rgba(255,255,255,.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Utensils size={16} color="var(--brass-400)" />
  </div>
  <span className="brand-font" style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
    SapaaduBooking
  </span>
</div>
        )}

        {isMobile && (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "20px 16px 10px",
              gap: 6,
            }}
          >

            <h1 className="brand-font" style={{ color: "#fff", fontSize: 22, lineHeight: 1.2, fontWeight: 700, margin: 0 }}>
              Meal Portal
            </h1>
            <p className="body-font" style={{ color: "rgba(255,255,255,.6)", fontSize: 12, margin: 0 }}>
              Order, Pay, and Track your meals in one place.
            </p>
              <img
              src="./Neyon-meal.png"
              alt="NLCIL mascot"
              style={{
                width: "auto",
                height: "13vh",
                maxHeight: 130,
                objectFit: "contain",
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,.4))",
              }}
            />
          </div>
        )}

        {!isMobile && (
          <div className="auth-hero-desktop" style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 2 }}>
              <div>
                <h1 className="brand-font" style={{ color: "#fff", fontSize: 34, lineHeight: 1.2, fontWeight: 700, margin: 0 }}>
                  Meal Portal
                </h1>
                <p className="body-font" style={{ color: "rgba(255,255,255,.6)", fontSize: 14.5, marginTop: 8 }}>
                  Order, pay, and track your meals in one place.
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <img
                  src="./Neyon-meal.png"
                  alt="NLCIL mascot"
                  style={{
                    width: "auto",
                    maxWidth: "85%",
                    height: "32vh",
                    maxHeight: 620,
                    objectFit: "contain",
                    display: "block",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,.4))",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="body-font" style={{ position: "relative", color: "rgba(255,255,255,.35)", fontSize: 12.5 }}></div>
        )}
      </div>

      <div className="auth-form-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {isMobile && (
          <img
            className="auth-mobile-watermark"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "68%",
              maxWidth: 300,
              opacity: 0.16,
              filter: "grayscale(0.4) brightness(1.15)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380, position: "relative" }}>
          <h2 className="brand-font" style={{ fontSize: 22, fontWeight: 700, color: "var(--navy-900)", margin: "0 0 6px" }}>
            {heading}
          </h2>
          <p className="body-font" style={{ fontSize: 13.5, color: "var(--ink-600)", margin: "0 0 22px" }}>
            {subheading}
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

          {mode === "forgot" && resetDone ? (
            <div style={{ display: "grid", gap: 16 }}>
              <div
                className="body-font"
                style={{ background: "var(--ok-100)", border: "1px solid #b9e3c9", color: "var(--ok-600)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: 13 }}
              >
                Password reset successful. You can now sign in with your new password.
              </div>
              <Button type="button" full icon={LogIn} onClick={() => switchMode("login")}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {(mode === "register" || mode === "forgot") && (
                <Field label="Name">
                  <TextInput placeholder="e.g. Rahul Sharma" value={form.name} onChange={update("name")} disabled={mode === "forgot" && verified} />
                </Field>
              )}
              {mode === "register" && (
                <span className="body-font" style={{ color: "var(--bad-600)", fontSize: 10.5, marginTop: -10, marginBottom: -10 }}>
                  Note: This Name is required for password reset and is Case-sensitive.
                </span>
              )}

              <Field label={mode === "login" ? "Registered mobile number" : "Mobile number"}>
                <TextInput
                  placeholder="10-digit Mobile Number"
                  value={form.mobile_number}
                  onChange={handleMobileChange}
                  disabled={mode === "forgot" && verified}
                  inputMode="numeric"
                  className={mobileShake ? "shake" : ""}
                />
              </Field>

              {mode === "forgot" && verified && (
                <div
                  className="body-font"
                  style={{ background: "var(--ok-100)", border: "1px solid #b9e3c9", color: "var(--ok-600)", borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: 13, fontWeight: 600 }}
                >
                  Verified — you can now set a new password.
                </div>
              )}

              {mode === "forgot" && !verified && (
                <Button type="button" full icon={KeyRound} disabled={verifying || !form.name || !form.mobile_number} onClick={handleVerify}>
                  {verifying ? "Verifying…" : "Verify"}
                </Button>
              )}

              {mode === "register" && (
                <Field label="Department">
                  <TextInput placeholder="e.g. IT,HR,House Keeping" value={form.department} onChange={update("department")} />
                </Field>
              )}
              {(mode === "login" || mode === "register" || (mode === "forgot" && verified)) && (
                <Field label={mode === "forgot" ? "New password" : "Password"}>
                  <TextInput
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update("password")}
                    rightIcon={showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    onRightIconClick={() => setShowPw((s) => !s)}
                  />
                </Field>
              )}
              {((mode === "register") || (mode === "forgot" && verified)) && (
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
                  <button type="button" onClick={() => switchMode("forgot")} className="body-font" style={{ background: "none", border: "none", color: "var(--brass-600)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Forgot password?</button>
                </div>
              )}

              {(mode === "login" || mode === "register" || (mode === "forgot" && verified)) && (
                <Button
                  type="submit"
                  full
                  icon={mode === "login" ? LogIn : mode === "register" ? UserPlus : KeyRound}
                  disabled={submitting}
                >
                  {submitting
                    ? "Please wait…"
                    : mode === "login"
                    ? "Sign in"
                    : mode === "register"
                    ? "Create Account"
                    : "Reset password"}
                </Button>
              )}

              <div className="body-font" style={{ textAlign: "center", fontSize: 13, color: "var(--ink-600)" }}>
                {mode === "login" && (
                  <>
                    New here?{" "}
                    <button type="button" onClick={() => switchMode("register")} style={{ background: "none", border: "none", color: "var(--navy-900)", fontWeight: 700, cursor: "pointer" }}>
                      Create an account
                    </button>
                  </>
                )}
                {mode === "register" && (
                  <>
                    Already registered?{" "}
                    <button type="button" onClick={() => switchMode("login")} style={{ background: "none", border: "none", color: "var(--navy-900)", fontWeight: 700, cursor: "pointer" }}>
                      Sign in instead
                    </button>
                  </>
                )}
                {mode === "forgot" && (
                  <button type="button" onClick={() => switchMode("login")} style={{ background: "none", border: "none", color: "var(--navy-900)", fontWeight: 700, cursor: "pointer" }}>
                    Back to sign in
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}