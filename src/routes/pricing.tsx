import { createFileRoute, Link } from "@tanstack/react-router";
import { BIKE_PACKAGES, CAR_PACKAGES, formatPrice } from "@/lib/pricing";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";
import { BookingButton } from "@/components/booking/BookingButton";


export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Bike & Car Service Price List in Bangalore | Ride N Care" },
      { name: "description", content: "Honest, upfront pricing for bike & car servicing. No hidden charges. Pay only after the job is done." },
      { property: "og:title", content: "Transparent Pricing — Ride N Care" },
      { property: "og:description", content: "Honest, upfront pricing for bike & car servicing." },
      { property: "og:url", content: `${SITE_URL}/pricing` },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/pricing` }],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <h1 className="text-5xl font-bold">Bike &amp; Car Service Price List in Bangalore</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">Flat rates. No hidden charges. Parts billed at MRP with bill copy.</p>
      <p className="mt-4 text-muted-foreground max-w-3xl">
        Every Ride N Care package below is a doorstep service in Bangalore — a certified mechanic reaches your home or office
        with genuine OEM parts, shows you the worn parts before replacing them, and you pay only once the job is done.
        Bike servicing starts at ₹499 and is priced by engine capacity; car servicing starts at ₹1,499. Consumables and
        spares, if needed, are billed separately at MRP with a printed bill, and every job carries our 7-day workmanship
        guarantee. Most bike services finish in 60–90 minutes at your address, with no garage queue and no travel charge
        inside our {""}
        <Link to="/areas" className="text-primary underline">service areas</Link>.
      </p>


      <h2 className="mt-12 text-2xl font-bold">Bike Service</h2>
      <div className="mt-4 grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {BIKE_PACKAGES.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-primary text-sm font-semibold">{t.tier}</div>
            <div className="text-xs text-muted-foreground">{t.cc}</div>
            <div className="mt-3 text-2xl font-bold">{formatPrice(t.price)}</div>
            <BookingButton vehicle="bike" packageId={t.id} className="mt-4 h-11 w-full rounded-full bg-grad-primary font-semibold text-primary-foreground">Book</BookingButton>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">Car Service</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {CAR_PACKAGES.slice(0, 3).map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-primary text-sm font-semibold">{t.name}</div>
            <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
            <div className="mt-4 text-3xl font-bold">{formatPrice(t.price)}</div>
            <BookingButton vehicle="car" packageId={t.id} className="mt-5 h-11 rounded-full bg-grad-primary px-5 font-semibold text-primary-foreground">Book</BookingButton>
          </div>
        ))}
      </div>
    </div>
  );
}