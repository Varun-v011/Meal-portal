import React, { useRef } from "react";
import { Upload } from "lucide-react";
import Button from "../ui/Button";

export default function FileUploadCard({ file, onFile, qrLabel = "IT MESS PORTAL", total = 0 }) {
  const inputRef = useRef(null);
  return (
    <div style={{ display: "flex", gap: 18, padding: 18, background: "var(--canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--line)", flexWrap: "wrap" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 132, height: 132, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <rect width="96" height="96" fill="#fff" />
            {Array.from({ length: 12 }).map((_, i) =>
              Array.from({ length: 12 }).map((_, j) => ((i * 7 + j * 3) % 5 === 0) && (
                <rect key={`${i}-${j}`} x={i * 8} y={j * 8} width="8" height="8" fill="var(--navy-900)" />
              ))
            )}
          </svg>
        </div>
        <div className="brand-font" style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "var(--navy-900)", letterSpacing: ".03em" }}>{qrLabel}</div>
      </div>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div className="body-font" style={{ fontSize: 13.5, color: "var(--ink-900)", marginBottom: 10 }}>Scan, pay via UPI, and upload the payment screenshot.</div>
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => onFile(e.target.files?.[0]?.name || null)} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button variant="secondary" size="sm" icon={Upload} onClick={() => inputRef.current?.click()}>Choose file</Button>
          <span className="body-font" style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{file || "No file chosen"}</span>
        </div>
        <div className="body-font" style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 10 }}>Accepted formats: JPG, JPEG, PNG</div>
        <div className="brand-font" style={{ fontSize: 15, fontWeight: 700, color: "var(--brass-600)", marginTop: 10 }}>Total: ₹{total}</div>
      </div>
    </div>
  );
}
