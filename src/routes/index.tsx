import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Siren } from "lucide-react";
import { BrandsMarquee } from "@/components/BrandsMarquee";
import { TrustPoints } from "@/components/TrustPoints";
import { HeroVehicles } from "@/components/HeroVehicles";
import { Testimonials } from "@/components/Testimonials";
import { AreasSection } from "@/components/AreasSection";
import { AnswerBlocks } from "@/components/AnswerBlocks";
import { ANSWERS, BRAND, ENTITY_SUMMARY } from "@/lib/answers";
import { GUIDES } from "@/lib/guides";
import { SERVICES } from "@/lib/services";
import { CONFIRMED_AREAS, CONFIRMED_ZONE_PHRASE, COVERAGE_HEADLINE_NAMES, COVERAGE_NAMES_LIST } from "@/lib/areas";
import { SITE_URL } from "@/lib/seo";
import { pageHead } from "@/lib/head";
import { graphForPage, faqNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";

/** Emoji icon per service category for the homepage grid (box style, no photos). */
const SERVICE_ICONS: Record<string, string> = {
  "bike-service": "🏍️",
  "doorstep-bike-service": "🏠",
  "bike-repair": "🔧",
  "doorstep-bike-repair": "🛠️",
  "periodic-bike-service": "🗓️",
  "motorcycle-service": "🏁",
  "scooter-service": "🛵",
  "emergency-bike-repair": "🚨",
  "bike-breakdown-assistance": "🆘",
  "engine-repair": "⚙️",
  "brake-service": "🛑",
  "clutch-repair": "🔩",
  "battery-service": "🔋",
  "electrical-repair": "⚡",
  "general-two-wheeler-repair": "🧰",
};

const HOME_FAQS: [string, string][] = [
  ["Do you offer doorstep bike service in Bangalore?", "Yes — our background-verified mechanics arrive at your home or office anywhere in Bangalore with tools, OEM-grade spares and a written quote before work starts. Most periodic bike services finish in 60–90 minutes."],
  ["What car services do you provide at home?", "Periodic maintenance, AC service, battery replacement, brake work and pre-purchase inspections — all at your doorstep, with the price confirmed in writing before work starts."],
  ["Is doorstep car service in Bangalore cheaper than a garage?", "Doorstep work cuts the hidden costs of a garage visit — getting the vehicle there, waiting, and the trip back — and every quote is confirmed in writing before work starts."],
  ["Which Bangalore areas do you cover?", `${COVERAGE_NAMES_LIST} and ${CONFIRMED_AREAS.length - COVERAGE_HEADLINE_NAMES.length} more confirmed localities across ${CONFIRMED_ZONE_PHRASE} Bangalore — the full list with pincodes is on our service areas page.`],
  ["Do you use genuine parts?", "Always. We fit OEM-grade spares, listed with part numbers on the digital invoice you receive on WhatsApp."],
];

/**
 * Homepage services: one merged grid with equal weight for bikes and cars.
 * Bike and car cards deep-link to the matching money pages; the EV card points
 * at /bikes (the EV hub) until the dedicated EV page ships in Week 9.
 */
const MERGED_SERVICES = [
  { icon: "🏍️", name: "Bike Service", desc: "Periodic, repair & doorstep maintenance for every CC", to: "/bike-service" },
  { icon: "🚗", name: "Car Periodic Service", desc: "Oil, filters, brakes & multi-point inspection at home", to: "/car-periodic-service" },
  { icon: "❄️", name: "Car AC Service", desc: "Cooling check, coil clean & gas refill at your doorstep", to: "/car-ac-service" },
  { icon: "🔧", name: "Bike Repair", desc: "Diagnosis-led repairs at your parking spot", to: "/bike-repair" },
  { icon: "🛠️", name: "Car Battery", desc: "Test first, replacement fitted at your gate", to: "/car-battery-service" },
  { icon: "🛑", name: "Car Brakes", desc: "Pad & disc measurement, fluid change at home", to: "/car-brake-service" },
  { icon: "🛵", name: "Scooter Service", desc: "Activa, Jupiter, Access — CVT care included", to: "/scooter-service" },
  { icon: "🔋", name: "Bike Battery", desc: "Testing, jump-start & doorstep replacement", to: "/battery-service" },
  { icon: "⚡", name: "EV Service", desc: "Electric scooter service at home — running gear & brakes", to: "/scooter-service" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      title: "Doorstep Bike & Car Service in Bangalore | Ride N Care",
      description:
        "Doorstep bike & car service in Bangalore. Book a verified mechanic in 60 seconds — OEM parts, written quote, 7-day guarantee. Care in every mile.",
      path: "/",
    }),
    scripts: pageScripts(
      graphForPage([faqNode(HOME_FAQS)]),
    ),
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden navy-sheen">
        {/* soft neon glow orbs — the hero visual is the animated vehicle road scene below */}
        <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl float-slow" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl float-slower" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-16 md:pt-10 md:pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rise-in inline-flex items-center gap-1.5 rounded-full border border-neon/45 bg-neon/10 px-3 py-1 text-xs font-semibold text-neon uppercase tracking-wider shadow-glow">
              ⭐ Bangalore's Trusted Doorstep Garage
            </span>
            <h1 className="neon-line rise-in mt-6 text-4xl md:text-6xl font-bold leading-[1.05] text-white [text-shadow:0_2px_18px_rgba(2,10,26,0.95),0_0_3px_rgba(2,10,26,0.8)]">
              <span className="block">Trusted Bike &amp; Car Service</span>
              <span className="block text-neon">
                Doorstep{" "}
                <span className="rotor">
                  <span className="rotor-word rotor-bike">Bike</span>
                  <span className="rotor-word rotor-car">Car</span>
                </span>{" "}
                Repair in Bangalore
              </span>
            </h1>
            <p className="rise-in-late mt-6 text-lg text-white/80 max-w-lg mx-auto [text-shadow:0_1px_12px_rgba(2,10,26,0.9)]">
              Book a verified mechanic in 60 seconds. Ride N Care brings bike service, car service and repair to your home or office across Bangalore, from Whitefield and HSR Layout to Electronic City and Sarjapur Road. OEM parts, written quote, 7-day guarantee.
            </p>
            {/* Hero CTA pair: equal-height 2-col grid, 12px gap, wraps on narrow phones */}
            <div className="rise-in-later mx-auto mt-8 grid w-full max-w-xl grid-cols-2 gap-3">
              <BookingButton className="hero-cta bg-grad-primary text-primary-foreground shadow-glow">
                <CalendarCheck aria-hidden className="h-5 w-5 shrink-0" /> Book Now
              </BookingButton>
              <Link to="/breakdown-assistance" className="hero-cta hero-cta-glass">
                <Siren aria-hidden className="h-5 w-5 shrink-0 text-neon" /> Breakdown Assistance
              </Link>
            </div>
          </div>
        </div>
        <HeroVehicles />
        {/* text-protection scrim: darkens vehicles passing behind the copy */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_62%_58%_at_50%_40%,rgba(2,10,26,0.78),rgba(2,10,26,0.35)_55%,transparent_78%)]" />
      </section>

      {/* Trust points — the single six-point block (replaces the old duplicate rows).
          Bottom padding clears the fixed Call/WhatsApp bar on mobile. */}
      <section aria-label="Why riders trust Ride N Care" className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28">
        <TrustPoints />
      </section>

      {/* SEO-rich intro */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Bangalore's friendliest doorstep mechanics</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Stuck in traffic, juggling a hectic week, or simply tired of waiting at a service centre? Ride N Care brings the entire workshop to your driveway. Whether it's a routine bike oil change in <strong className="text-foreground">Koramangala</strong>, a car AC top-up in <strong className="text-foreground">HSR Layout</strong>, or a Sunday breakdown rescue in <strong className="text-foreground">Whitefield</strong> — book a slot, approve a written quote, and the mechanic comes to you with the right tools and the right price.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Every service is performed by a background-verified, trained mechanic, uses genuine OEM-grade spares and ends with a digital invoice plus a 7-day workmanship guarantee. No upselling. No surprise bills. Just honest, on-time, doorstep care for your ride.
        </p>
      </section>

      {/* Services — single merged grid, bikes and cars at parity.
          #services anchor target for the top-nav "Our Services" link. */}
      <section id="services" className="mx-auto max-w-7xl scroll-mt-[76px] px-4 sm:px-6 pb-6">
        <SectionHeading eyebrow="Our Services" title="Pick your service" />
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MERGED_SERVICES.map((s) => (
            <Link
              key={s.name}
              to={s.to}
              className="card-hover shadow-card group flex flex-col items-center rounded-3xl border border-border bg-card p-5 text-center sm:p-6"
            >
              <span aria-hidden className="text-4xl transition duration-300 group-hover:scale-110">{s.icon}</span>
              <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
                Learn More
                <span aria-hidden className="text-neon">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Answer-first entity summary for search & AI assistants */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <SectionHeading eyebrow="About the business" title="Who is Ride N Care?" />
        <p className="mt-6 text-muted-foreground leading-relaxed">{ENTITY_SUMMARY}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Call <a href="tel:+918069409289" className="text-primary hover:underline">080 6940 9289</a> or WhatsApp{" "}
          <a href="https://wa.me/918296950339" target="_blank" rel="noopener" className="text-primary hover:underline">82969 50339</a> in {BRAND.city}, {BRAND.region}.
        </p>
        <AnswerBlocks items={ANSWERS.filter((a) => a.id !== "who-is-ride-n-care").slice(0, 6)} headingLevel={3} />
        <div className="mt-6">
          <Link to="/answers" className="text-primary font-semibold hover:underline">See all answers about Ride N Care →</Link>
        </div>
      </section>

      {/* Areas We Serve */}
      <AreasSection />

      {/* Trust & testimonials */}
      <Testimonials />

      {/* Brands We Service */}
      <BrandsMarquee />

      {/* Why us — compact */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Why Ride N Care</div>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold">Quality, precision & honesty</h2>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              ["Doorstep", "At your home"],
              ["Expert", "Background-verified"],
              ["Quick", "60–90 mins"],
              ["Transparent", "Upfront quote"],
              ["Genuine", "OEM parts"],
              ["All Vehicles", "2W & 4W"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-border bg-background p-3">
                <h3 className="font-semibold text-sm">{t}</h3>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — compact. #process anchor target for the top-nav link. */}
      <section id="process" className="mx-auto max-w-7xl scroll-mt-[76px] px-4 sm:px-6 py-10">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">How it works</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold">Booking to keys-back in 4 steps</h2>
        <ol className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ["01", "Book online", "60 seconds."],
            ["02", "Mechanic arrives", "On time, at home."],
            ["03", "Service on the spot", "Work done in front of you."],
            ["04", "Pay & rate", "Cashless."],
          ].map(([n, t, d]) => (
            <li key={n} className="rounded-xl border border-border p-3 bg-card flex gap-3 items-start">
              <div className="text-primary font-display text-xl font-bold">{n}</div>
              <div>
                <h3 className="font-semibold text-sm">{t}</h3>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20">
        <SectionHeading eyebrow="FAQ" title="Quick answers for first-time customers" />
        <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
          {HOME_FAQS.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
                <span className="font-semibold">{q}</span>
                <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/faq" className="text-primary font-semibold hover:underline">Read all FAQs →</Link>
        </div>
      </section>

      {/* Guides */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <SectionHeading eyebrow="Guides" title="Bike maintenance knowledge, free to read" />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.slice(0, 6).map((g) => (
            <Link
              key={g.slug}
              to="/guides/$slug"
              params={{ slug: g.slug }}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition"
            >
              <h3 className="font-semibold">{g.h1}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{g.summary}</p>
              <span className="mt-3 inline-block text-sm text-primary font-semibold">Read · {g.readMinutes} min →</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/guides" className="text-primary font-semibold hover:underline">All bike guides →</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-32 pt-20 sm:px-6 sm:pb-36">
        <div className="rounded-3xl bg-grad-primary p-10 text-center shadow-glow">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready for a smoother ride?
          </h2>
          <p className="mt-3 text-primary-foreground/90">Written quote before work starts. OEM-grade parts, digital invoice, 7-day workmanship guarantee.</p>
          <BookingButton className="mt-6 rounded-full bg-background px-6 py-3 font-semibold text-foreground">Book Now</BookingButton>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
        {eyebrow}
      </div>
      <h2 className="mt-2 text-4xl md:text-5xl font-bold">{title}</h2>
    </div>
  );
}
