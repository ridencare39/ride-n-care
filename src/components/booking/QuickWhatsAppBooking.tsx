import { useState } from "react";
import { isValidIndianMobile, normalizeIndianMobile, sendBookingToWhatsApp } from "@/lib/booking";

/** Mobile-number popup: number in, booking straight to WhatsApp. */
export function QuickWhatsAppBooking({ onFullBooking }: { onFullBooking: () => void }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianMobile(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setError(null);
    sendBookingToWhatsApp({
      mobile: `+91 ${normalizeIndianMobile(mobile)}`,
      whatsapp: `+91 ${normalizeIndianMobile(mobile)}`,
      issue: "Please call me back to confirm my doorstep service booking.",
    });
  };

  return (
    <form onSubmit={submit} className="min-w-0">
      <p className="text-sm text-muted-foreground">
        Doorstep bike &amp; car service in Bangalore. Share your number and we'll confirm on WhatsApp in minutes.
      </p>
      <label className="mt-4 block">
        <span className="text-sm font-semibold">Mobile number</span>
        <div className="mt-1 flex items-stretch overflow-hidden rounded-xl border border-border bg-background">
          <span className="grid shrink-0 place-items-center border-r border-border px-3 text-sm font-semibold">+91</span>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            type="tel"
            inputMode="numeric"
            maxLength={13}
            placeholder="98765 43210"
            className="min-h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            aria-label="Mobile number"
          />
        </div>
      </label>
      {error && <p className="mt-2 text-sm font-semibold text-destructive">{error}</p>}
      <button className="mt-4 w-full min-h-12 rounded-full bg-[#25D366] px-6 py-3.5 font-bold text-white shadow-lg">
        BOOK ON WHATSAPP
      </button>
      <button type="button" onClick={onFullBooking} className="mt-3 w-full text-sm font-semibold text-primary">
        Or pick your vehicle &amp; package →
      </button>
    </form>
  );
}
