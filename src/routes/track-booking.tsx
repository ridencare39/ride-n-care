import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackBooking } from "@/lib/bookings.functions";
import { formatPrice } from "@/lib/pricing";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/track-booking")({
  head: () => ({ meta: [{ title: "Track Your Booking | Ride N Care" }, { name: "description", content: "Check your Ride N Care service booking status using your Booking ID and mobile number." }, { property: "og:title", content: "Track Your Booking | Ride N Care" }, { property: "og:description", content: "Check your Ride N Care service booking status." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }], links: [{ rel: "canonical", href: `${SITE_URL}/track-booking` }] }),
  component: TrackBookingPage,
});

const stages = ["confirmed", "assigned", "technician_on_the_way", "service_started", "service_completed"];
function label(value: string) { return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }

function TrackBookingPage() {
  const lookup = useServerFn(trackBooking); const [booking, setBooking] = useState<any>(null); const [searched, setSearched] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  return <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><div className="text-center"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Booking updates</span><h1 className="mt-2 text-4xl font-bold">Track Your Booking</h1><p className="mt-3 text-muted-foreground">Enter the Booking ID from your confirmation and the same mobile number used to book.</p></div>
    <form className="mx-auto mt-8 grid max-w-xl gap-3 rounded-md border border-border bg-card p-5" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setError(""); try { const result = await lookup({ data: { bookingId: String(form.get("bookingId") ?? ""), mobile: String(form.get("mobile") ?? "") } }); setBooking(result.booking); setSearched(true); } catch (e) { setError(e instanceof Error ? e.message : "Could not check this booking."); } finally { setBusy(false); } }}>
      <label><span className="text-sm font-semibold">Booking ID</span><input name="bookingId" required placeholder="RNC-20260912-0001" className="mt-1 h-12 w-full rounded-md border border-border bg-background px-3 uppercase"/></label><label><span className="text-sm font-semibold">Mobile Number</span><input name="mobile" required inputMode="numeric" placeholder="10-digit mobile" className="mt-1 h-12 w-full rounded-md border border-border bg-background px-3"/></label>{error && <p className="text-sm font-semibold text-destructive">{error}</p>}<Button className="h-12 rounded-full" disabled={busy}><Search />{busy ? "Checking…" : "Track Booking"}</Button>
    </form>
    {searched && !booking && <p className="mt-8 text-center font-semibold">No matching booking was found. Check both details and try again.</p>}
    {booking && <section className="mt-8"><div className="rounded-md border border-border bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono font-bold text-primary">{booking.bookingId}</p><h2 className="mt-1 text-xl font-bold">{booking.brand} {booking.model}</h2></div><span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{label(booking.status)}</span></div><div className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><p><span className="text-muted-foreground">Service:</span> {booking.packageName}</p><p><span className="text-muted-foreground">Price:</span> {formatPrice(booking.price)}</p><p><span className="text-muted-foreground">Date:</span> {booking.date}</p><p><span className="text-muted-foreground">Time:</span> {booking.time}</p><p><span className="text-muted-foreground">Payment:</span> {label(booking.paymentStatus)}</p><p><span className="text-muted-foreground">Location:</span> {booking.address}</p></div></div>
      <h2 className="mt-8 text-2xl font-bold">Service progress</h2><ol className="mt-4 grid gap-3 sm:grid-cols-5">{stages.map((stage, index) => { const activeIndex = stages.indexOf(booking.status); const complete = index <= activeIndex; return <li key={stage} className={`rounded-md border p-3 text-sm ${complete ? "border-primary bg-primary/5" : "border-border"}`}><span className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full ${complete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{complete ? <Check className="h-4 w-4"/> : index + 1}</span><span className="font-semibold">{label(stage)}</span></li>; })}</ol>
    </section>}
  </main>;
}
