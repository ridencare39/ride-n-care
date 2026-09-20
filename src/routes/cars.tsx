import { createFileRoute, Link } from "@tanstack/react-router";
import car from "@/assets/services/car-engine-maintenance.webp";
import { pageHead } from "@/lib/head";
import { graphForPage, serviceNode, breadcrumbNode, faqNode, pageScripts } from "@/lib/schema";
import { CAR_SERVICES, CAR_BRAND_LIST, CAR_HUB } from "@/lib/car-services";
import { AREAS, PRIORITY_AREAS } from "@/lib/areas";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";
import type { ServiceDef } from "@/lib/services";

const HUB_FAQS: [string, string][] = [
  ["What is included in a doorstep car service in Bangalore?", "Engine oil and filter change, air filter cleaning, brake check, coolant and fluid top-ups, battery test, AC check, lights and wipers, and a multi-point inspection — completed at your home or office."],
  ["How long will the mechanic be at my place?", "The arrival window is confirmed when you book, and the visit runs until the checklist is complete and you have inspected the work — we do not quote job durations we cannot guarantee."],
  ["How much does car service at home cost in Bangalore?", "Pricing depends on your car's make, model and engine — oil grade and capacity, filter type and parts condition change the quote. Share your model and we confirm the exact amount in writing before work starts."],
  ["Do you offer pickup and drop for car service?", "Doorstep work happens in your parking bay, so most jobs need no pickup at all. When a workshop job is genuinely required, pickup and drop are arranged and the estimate is shared first."],
  ["Are your car mechanics verified?", "Yes — every technician is background-verified, and every job starts with a written quote and ends with a 7-day workmanship guarantee."],
  ["Which areas of Bangalore do you cover?", "Whitefield, Koramangala, HSR Layout, Indiranagar, Electronic City, Jayanagar and more across east and south Bangalore. The full list with pincodes is on our service areas page."],
];

export const Route = createFileRoute("/cars")({
  head: () => ({
    ...pageHead({
      title: CAR_HUB.title,
      description: CAR_HUB.description,
      path: "/cars",
      ogImage: car,
      extraMeta: [
        { property: "og:title", content: CAR_HUB.title },
        { property: "og:description", content: CAR_HUB.summary },
      ],
    }),
    scripts: pageScripts(
      graphForPage([
        serviceNode({
          slug: "cars",
          name: "Doorstep Car Service",
          serviceType: "Doorstep Car Service",
          description: CAR_HUB.summary,
        }),
        breadcrumbNode([
          ["Home", "/"],
          ["Car Service", "/cars"],
        ]),
        faqNode(HUB_FAQS),
      ]),
    ),
  }),
  component: Cars,
});

function Cars() {
  const carServices = CAR_SERVICES as ServiceDef[];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      {/* Hero — overview + answer-first summary */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <img
          src={car}
          alt="Mechanic inspecting a car engine during a doorstep periodic service"
          fetchPriority="high"
          decoding="async"
          width={1600}
          height={1200}
          className="aspect-[4/3] w-full rounded-3xl border border-neon/25 object-cover shadow-glow ring-1 ring-white/10 sm:aspect-[16/10]"
        />
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Four Wheelers</span>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold">{CAR_HUB.h1}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{CAR_HUB.summary}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Call <a href="tel:+918069409289" {...ctcProps("call_click", { vehicle_type: "car" })} className="text-primary hover:underline">080 6940 9289</a> or WhatsApp{" "}
            <a href="https://wa.me/918296950339" target="_blank" rel="noopener" {...ctcProps("whatsapp_click", { vehicle_type: "car" })} className="text-primary hover:underline">82969 50339</a> — the price is confirmed in writing before work starts.
          </p>
          <BookingButton vehicle="car" className="mt-6 h-12 rounded-full bg-grad-primary px-6 font-semibold text-primary-foreground shadow-glow">Book a Car Service</BookingButton>
        </div>
      </div>

      {/* Core services — deep links to the money pages */}
      <h2 className="mt-16 text-3xl font-bold">Car services at your doorstep</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {carServices.map((s) => (
          <Link
            key={s.slug}
            to="/$service"
            params={{ service: s.slug }}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/60"
          >
            <h3 className="font-semibold group-hover:text-primary transition-colors">{s.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.summary}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
              Learn More <span aria-hidden className="text-neon">→</span>
            </span>
          </Link>
        ))}
      </div>

      {/* How it works */}
      <h2 className="mt-16 text-3xl font-bold">How it works</h2>
      <ol className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {carServices[0].steps.map(([t, d]) => (
          <li key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>

      {/* Brands — owner-confirmed list only */}
      <h2 className="mt-16 text-3xl font-bold">Car brands we service</h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{CAR_BRAND_LIST.join(" · ")}</p>

      {/* Where we serve */}
      <h2 className="mt-16 text-3xl font-bold">Car service across Bangalore</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {PRIORITY_AREAS.map((a) => (
          <Link
            key={a.slug}
            to="/areas/$slug"
            params={{ slug: a.slug }}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            📍 {a.name}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Not listed? We cover {AREAS.length} localities — see all <Link to="/areas" className="text-primary">service areas</Link>.
      </p>

      {/* FAQs — same array drives the FAQPage JSON-LD above */}
      <h2 className="mt-16 text-3xl font-bold">Car service FAQs</h2>
      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
        {HUB_FAQS.map(([q, a]) => (
          <details key={q} className="group p-6">
            <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
              <span className="font-semibold">{q}</span>
              <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>

      {/* Closing CTA */}
      <div className="mt-16 rounded-3xl bg-grad-primary p-10 text-center shadow-glow">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">Book your car service today</h2>
        <p className="mt-2 text-primary-foreground/90">The price is confirmed in writing before any work starts.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href="tel:+918069409289" {...ctcProps("call_click", { vehicle_type: "car" })} className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Call 080 6940 9289</a>
          <BookingButton vehicle="car" variant="outline" className="rounded-full border-background/40 bg-transparent px-6 py-3 text-primary-foreground hover:bg-background hover:text-foreground">Book Now</BookingButton>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">Last reviewed: 2026-09-19</p>
    </div>
  );
}
