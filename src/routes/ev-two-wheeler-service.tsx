import { createFileRoute, Link } from "@tanstack/react-router";
import { ELECTRIC_BIKE_PACKAGES, formatPrice } from "@/lib/pricing";
import { pageHead, pageScripts, formatDate } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";

/**
 * /ev-two-wheeler-service — Week 9 of the content calendar.
 *
 * Scope discipline (owner-confirmed capabilities only, mirroring the EV
 * wording on /scooter-service): brakes, tyres, suspension and running gear
 * are doorstep work; battery packs, BMS and motor faults stay with the
 * manufacturer's service network. No battery repair, BMS diagnostics,
 * high-voltage work or EV brand-coverage claims (Q4 gating) anywhere on
 * this page. Prices come from ELECTRIC_BIKE_PACKAGES in src/lib/pricing.ts.
 */

const EV_FAQS: [string, string][] = [
  ["Do you repair EV batteries or motors?", "No. Battery packs, battery-management systems and motor faults stay with the manufacturer's service network. We handle the mechanical side — brakes, tyres, suspension and running gear — and say so upfront rather than pretend."],
  ["What does EV General Service include?", "A ₹999 package: battery health check, charging port inspection, brake inspection and adjustment, tyre and wheel check, electrical check-up, controls and lights check, dry wash and a diagnostic review."],
  ["Can you jump start an electric scooter?", "Yes — EV Jump Start is ₹399: a safe boost plus a battery condition check and a basic charging-system check at your parking spot."],
  ["Which electric scooters do you service?", "We service the mechanical side of common electric scooters — brakes, tyres, suspension and running gear. Battery and motor faults stay with each manufacturer's network regardless of brand."],
  ["Is EV service different from petrol scooter service?", "Yes — there is no engine oil or fuel system, so the checklist focuses on brakes, tyres, electricals and running gear. Our EV packages are priced separately from the petrol packages."],
];

export const Route = createFileRoute("/ev-two-wheeler-service")({
  head: () => ({
    ...pageHead({
      title: "EV Two-Wheeler Service at Home in Bangalore | Ride N Care",
      description:
        "Doorstep electric scooter service in Bangalore: brakes, tyres, running gear and jump start at home. Battery and motor faults stay with the manufacturer.",
      path: "/ev-two-wheeler-service",
      extraMeta: [
        { property: "og:title", content: "EV Two-Wheeler Service at Home in Bangalore | Ride N Care" },
        {
          property: "og:description",
          content:
            "Doorstep electric scooter service in Bangalore: brakes, tyres, running gear and jump start at home. Battery and motor faults stay with the manufacturer.",
        },
      ],
    }),
    scripts: pageScripts(
      graphForPage([
        serviceNode({
          slug: "ev-two-wheeler-service",
          name: "EV Two-Wheeler Service",
          serviceType: "Electric two-wheeler service",
          description:
            "Doorstep service for electric two-wheelers in Bangalore — brakes, tyres, running gear and EV jump start. Battery and motor faults stay with the manufacturer's network.",
        }),
        breadcrumbNode([
          ["Home", "/"],
          ["Bike service", "/bikes"],
          ["EV Two-Wheeler Service", "/ev-two-wheeler-service"],
        ]),
        faqNode(EV_FAQS),
      ]),
    ),
  }),
  component: EvServicePage,
});

function EvServicePage() {
  const general = ELECTRIC_BIKE_PACKAGES.find((p) => p.id === "electric-general-service");
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span> <Link to="/bikes" className="hover:text-primary">Bike service</Link> <span className="mx-1">/</span> <span>EV Two-Wheeler Service</span>
      </nav>

      {/* H1 + subheading */}
      <h1 className="mt-6 text-4xl md:text-5xl font-bold">EV &amp; Electric Scooter Service at Home in Bangalore</h1>
      <p className="mt-3 text-lg text-foreground/80 leading-relaxed">
        Brakes, tyres, suspension and running gear serviced at your parking spot — with the honest boundary stated first: battery packs, BMS and motor faults stay with the manufacturer's network.
      </p>

      {/* Quick answer (40–60 words) — AEO answer-first box */}
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Quick answer</p>
        <p className="mt-2 text-foreground leading-relaxed">
          Ride N Care services the mechanical side of electric two-wheelers at your doorstep in Bangalore — brakes, tyres, suspension, running gear and a ₹999 EV General Service check-up. Battery packs, BMS and motor faults stay with the manufacturer's service network, and we tell you so before you book.
        </p>
      </div>

      {/* Above-the-fold CTAs with GA4 conversion events */}
      <div className="mt-6 flex flex-wrap gap-3">
        <BookingButton vehicle="bike" className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
        <a
          href="tel:+918069409289"
          {...ctcProps("call_click", { vehicle_type: "bike", service: "ev-two-wheeler-service" })}
          className="rounded-full border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
        >
          Call 080 6940 9289
        </a>
        <a
          href="https://wa.me/918296950339"
          target="_blank" rel="noopener"
          {...ctcProps("whatsapp_click", { vehicle_type: "bike", service: "ev-two-wheeler-service" })}
          className="rounded-full border border-emerald-600/50 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          WhatsApp 82969 50339
        </a>
      </div>

      {/* Body copy */}
      <div className="mt-10 space-y-4 text-muted-foreground leading-relaxed">
        <p className="text-foreground">
          Electric scooters remove the engine from the service checklist and sharpen the rest of it. Our EV work at your doorstep covers the mechanical and inspection side: brake inspection and adjustment, tyre and wheel checks, suspension and running gear, charging-port inspection, electrical and controls checks, and a dry wash — the EV General Service package.
        </p>
        <p>
          The high-voltage side stays where the expertise lives. Battery packs, battery-management systems and motor faults are manufacturer-network work — we do not open them, and we say so at booking rather than pretend. What we can do is spot the early signs: the battery health check and diagnostic review in the general service flag what needs the maker's attention.
        </p>
        <p>
          If your scooter is inside its warranty period, the free-service visits belong at the company workshop — we will tell you that before taking the booking. Everything else, from a running repair to a jump start, is quoted in writing before any work starts.
        </p>
      </div>

      {/* What is included — from the confirmed EV package in src/lib/pricing.ts */}
      <h2 className="mt-12 text-2xl font-bold">What is included in EV General Service</h2>
      {general && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-semibold">{general.name}</span>
            <span className="rounded-full border border-border bg-card px-4 py-2 text-sm">{formatPrice(general.price)}</span>
            {general.duration && <span className="text-sm text-muted-foreground">{general.duration}</span>}
          </div>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2">
            {general.includes.map((i) => <li key={i} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {i}</li>)}
          </ul>
        </>
      )}

      {/* Pricing — the three confirmed EV packages */}
      <h2 className="mt-12 text-2xl font-bold">EV pricing</h2>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {ELECTRIC_BIKE_PACKAGES.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="mt-1 text-lg font-bold text-primary">{formatPrice(p.price)}</div>
            {p.duration && <div className="mt-1 text-xs text-muted-foreground">{p.duration}</div>}
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">The price is confirmed in writing before work starts.</p>

      {/* Honest limits — the scope boundary IS the page's promise */}
      <h2 className="mt-12 text-2xl font-bold">What stays with the manufacturer's network</h2>
      <ul className="mt-4 space-y-2">
        {[
          "Battery pack faults, battery replacement and BMS diagnostics.",
          "Motor and controller faults, including high-voltage diagnostics.",
          "Warranty-period free services — use the company workshop for those visits.",
        ].map((l) => (
          <li key={l} className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">✕ {l}</li>
        ))}
      </ul>

      {/* FAQs — same array drives the FAQPage JSON-LD above */}
      <h2 className="mt-12 text-2xl font-bold">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {EV_FAQS.map(([q, a]) => (
          <div key={q} className="p-4">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>

      {/* Cross-links */}
      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold">Related services</h2>
          <ul className="mt-3 space-y-1.5">
            <li><Link to="/$service" params={{ service: "scooter-service" }} className="text-primary hover:underline">Scooter Service in Bangalore</Link></li>
            <li><Link to="/$service" params={{ service: "bike-service" }} className="text-primary hover:underline">Bike Service in Bangalore</Link></li>
            <li><Link to="/bikes" className="text-primary hover:underline">All bike services</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold">Related answers</h2>
          <ul className="mt-3 space-y-1.5">
            <li><Link to="/answers/$slug" params={{ slug: "ev-what-can-be-serviced" }} className="text-primary hover:underline">What can be serviced on an EV at home?</Link></li>
            <li><Link to="/answers/$slug" params={{ slug: "ev-service-cost" }} className="text-primary hover:underline">How much does electric two-wheeler service cost?</Link></li>
            <li><Link to="/answers/$slug" params={{ slug: "ev-service-different" }} className="text-primary hover:underline">Is servicing an electric scooter different from petrol?</Link></li>
            <li><Link to="/answers" className="text-primary hover:underline">All answers →</Link></li>
          </ul>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book EV service today</h2>
        <p className="mt-2 text-primary-foreground/90">The price is confirmed in writing before any work starts.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a
            href="https://wa.me/918296950339"
            target="_blank" rel="noopener"
            {...ctcProps("whatsapp_click", { vehicle_type: "bike", service: "ev-two-wheeler-service" })}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            WhatsApp 82969 50339
          </a>
          <BookingButton vehicle="bike" className="btn-book rounded-full px-6 py-3 font-semibold">Book Now</BookingButton>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">Last reviewed: {formatDate("2026-09-27")}</p>
    </div>
  );
}
