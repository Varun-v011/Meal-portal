import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

/** Full-screen lightbox for previewing a payment screenshot without leaving the page. */
export default function ImagePreviewModal({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15, 20, 35, 0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", maxWidth: "min(560px, 92vw)", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}
      >
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 className="brand-font" style={{ fontSize: 14, fontWeight: 700, color: "var(--navy-900)", margin: 0 }}>Payment Screenshot</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="focus-ring"
              title="Open in new tab"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, color: "var(--ink-600)" }}
            >
              <ExternalLink size={15} />
            </a>
            <button
              className="focus-ring"
              onClick={onClose}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-600)", width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div style={{ overflow: "auto", background: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <img src={src} alt="Payment Screenshot" style={{ maxWidth: "100%", maxHeight: "72vh", display: "block", borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}