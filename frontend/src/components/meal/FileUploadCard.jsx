import React, { useRef } from "react";
import { Upload } from "lucide-react";
import Button from "../ui/Button";
import UpiLogo from "../ui/UpiLogo";
import useIsMobile from "../../hooks/useIsMobile";
import { buildUpiLink, buildUpiQrImageUrl } from "../../config/payment";

export default function FileUploadCard({ file, onFile, qrLabel = "Thangam Residency", total = 0, note }) {
  const inputRef = useRef(null);
  const isMobile = useIsMobile();

  const upiLink = buildUpiLink({ amount: total, note: note || "Meal order payment" });
  const qrImageUrl = buildUpiQrImageUrl(upiLink);

  return (
    <div className="upload-card">
      {isMobile ? (
        <Button
          variant="secondary"
          icon={UpiLogo}
          onClick={() => { window.location.href = upiLink; }}
          disabled={total <= 0}
          full
        >
          Pay ₹{total} via UPI
        </Button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 132, height: 132, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src={qrImageUrl} alt="Scan to pay via UPI" width={120} height={120} />
          </div>
          <div className="brand-font" style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "var(--navy-900)", letterSpacing: ".03em" }}>{qrLabel}</div>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div className="body-font" style={{ fontSize: 13.5, color: "var(--ink-900)", marginBottom: 10 }}>
          {isMobile ? "Pay via UPI and upload the payment screenshot." : "Scan, pay via UPI, and upload the payment screenshot."}
        </div>
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => onFile(e.target.files?.[0] || null)} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button variant="secondary" size="sm" icon={Upload} onClick={() => inputRef.current?.click()}>Choose file</Button>
          <span className="body-font" style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{file?.name || "No file chosen"}</span>
        </div>
        <div className="body-font" style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 10 }}>Accepted formats: JPG, JPEG, PNG</div>
        <div className="brand-font" style={{ fontSize: 15, fontWeight: 700, color: "var(--brass-600)", marginTop: 10 }}>Total: ₹{total}</div>
      </div>
    </div>
  );
}