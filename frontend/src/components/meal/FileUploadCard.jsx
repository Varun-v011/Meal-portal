import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import Button from "../ui/Button";
import UpiLogo from "../ui/UpiLogo";
import useIsMobile from "../../hooks/useIsMobile";
import { buildUpiLink, buildUpiQrImageUrl } from "../../config/payment";

export default function FileUploadCard({ file, onFile, qrLabel = "Thangam Residency", total = 0, note }) {
  const inputRef = useRef(null);
  const isMobile = useIsMobile();
  const [zoomed, setZoomed] = useState(false);

  const upiLink = buildUpiLink({ amount: total, note: note || "Meal order payment" });
  const qrImageUrl = buildUpiQrImageUrl(upiLink);

  const handleSaveQr = async () => {
    try {
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "upi-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qrImageUrl, "_blank");
    }
  };

  return (
    <div className="upload-card">
      <div style={{ textAlign: "center" }}>
        {/* {isMobile && (
          <Button
            variant="secondary"
            icon={UpiLogo}
            onClick={() => { window.location.href = upiLink; }}
            disabled={total <= 0}
            full
          >
            Pay ₹{total} via UPI
          </Button>
        )} */}
        <div
          onClick={() => setZoomed(true)}
          style={{ width: 132, height: 132, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", margin: isMobile ? "12px auto 0" : "0 auto", cursor: "pointer" }}
        >
          <img src={qrImageUrl} alt="Scan to pay via UPI" width={120} height={120} />
        </div>
        <div className="brand-font" style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "var(--navy-900)", letterSpacing: ".03em" }}>{qrLabel}</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
          <Button variant="secondary" size="sm" onClick={() => setZoomed(true)}>Tap to zoom</Button>
          <Button variant="secondary" size="sm" onClick={handleSaveQr}>Save QR</Button>
        </div>
      </div>
      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer" }}
        >
          <div style={{ background: "#fff", borderRadius: 12, padding: 20 }}>
            <img src={qrImageUrl} alt="Scan to pay via UPI" width={280} height={280} />
          </div>
          <div className="body-font" style={{ color: "#fff", marginTop: 14, fontSize: 13 }}>Tap anywhere to close</div>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 220 }}>
        <div className="body-font" style={{ fontSize: 13.5, color: "var(--ink-900)", marginBottom: 10 }}>
          {isMobile ? "Pay via UPI button or QR, then upload the payment screenshot." : "Scan, pay via UPI, and upload the payment screenshot."}
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