import React, { useEffect, useState } from "react";
import { X, Copy, Check } from "lucide-react";

/**
 * Modal that shows an order's transaction ID and/or payment screenshot.
 * Render it when you have a selected order:
 *   {proofOrder && <PaymentProofModal order={proofOrder} onClose={() => setProofOrder(null)} />}
 */
export default function PaymentProofModal({ order, onClose }) {
  const [copied, setCopied] = useState(false);

  const hasScreenshot = !!order.payment_screenshot;
  const hasTxn = !!order.transaction_id;
  const screenshotUrl = hasScreenshot ? `/api/uploads/${order.payment_screenshot}` : null;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyTxn = async () => {
    try {
      await navigator.clipboard.writeText(order.transaction_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const labelStyle = {
    fontSize: 11.5,
    fontWeight: 700,
    color: "var(--ink-600)",
    letterSpacing: ".04em",
    textTransform: "uppercase",
    marginBottom: 6,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,20,35,.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        className="body-font"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "var(--radius-md, 14px)",
          padding: 20,
          width: "100%",
          maxWidth: 420,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 50px rgba(0,0,0,.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 className="brand-font" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--navy-900)" }}>
            Payment details
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <X size={18} />
          </button>
        </div>

        {!hasTxn && !hasScreenshot && (
          <div style={{ fontSize: 13, color: "var(--ink-600)" }}>No payment details were submitted with this order.</div>
        )}

        {hasTxn && (
          <div style={{ marginBottom: hasScreenshot ? 16 : 0 }}>
            <div style={labelStyle}>Transaction ID</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <code
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  background: "var(--canvas)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  fontSize: 13.5,
                  wordBreak: "break-all",
                  userSelect: "all",
                }}
              >
                {order.transaction_id}
              </code>
              <button
                type="button"
                onClick={copyTxn}
                aria-label="Copy transaction ID"
                style={{ padding: 8, background: "#fff", border: "1px solid var(--line)", borderRadius: 8, cursor: "pointer", display: "flex" }}
              >
                {copied ? <Check size={16} color="var(--ok-600, #1f9d55)" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}

        {hasScreenshot && (
          <div>
            <div style={labelStyle}>Payment screenshot</div>
            <a href={screenshotUrl} target="_blank" rel="noreferrer">
              <img
                src={screenshotUrl}
                alt="Payment screenshot"
                style={{ width: "100%", borderRadius: 8, border: "1px solid var(--line)", display: "block" }}
              />
            </a>
            <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 6 }}>Click the image to open it full size.</div>
          </div>
        )}
      </div>
    </div>
  );
}