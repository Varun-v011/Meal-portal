// Update these with your real details.
export const UPI_ID = "vyapar.178284819699@hdfcbank"; // <-- replace with your actual UPI ID
export const PAYEE_NAME = "NLCIL Meal Portal";

/**
 * Builds a standard UPI deep link. Any UPI app (GPay, PhonePe, Paytm, BHIM, etc.)
 * registers itself to handle "upi://pay" links, so tapping this on a phone opens
 * the OS "choose an app" sheet (or the sole installed app directly) with the
 * amount and payee prefilled.
 */
export function buildUpiLink({ amount, note = "Meal order payment" }) {
  const params = new URLSearchParams({
    pa: UPI_ID, // payee address
    pn: PAYEE_NAME, // payee name
    am: String(amount), // amount
    cu: "INR",
    tn: note, // transaction note
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Builds an image URL for a QR code that encodes the given UPI link, so
 * desktop users can scan it with their phone's UPI app.
 */
export function buildUpiQrImageUrl(upiLink, size = 132) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiLink)}`;
}
