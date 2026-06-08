import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-mechanic.jpg";
import bike from "@/assets/bike-service.jpg";
import car from "@/assets/car-service.jpg";
import { AreasMarquee } from "@/components/AreasMarquee";
import { Newsletter } from "@/components/Newsletter";
import { BrandsMarquee } from "@/components/BrandsMarquee";

const HOME_FAQS: [string, string][] = [
  ["Do you offer doorstep bike service in Bangalore?", "Yes — our certified mechanics arrive at your home or office anywhere in Bangalore with tools, diagnostics and genuine spares. Most bike services finish in 60–90 minutes."],
  ["What car services do you provide at home?", "Periodic maintenance, brake jobs, battery replacement, AC service, denting & painting, breakdown assistance and pre-buy inspections — all at your doorstep."],
  ["Is doorstep car service in Bangalore cheaper than a garage?", "End-to-end it usually costs the same or less. You save on pickup-drop, half a day off, and there are zero hidden labour charges — every quote is upfront."],
  ["Which Bangalore areas do you cover?", "All major Bangalore localities — Whitefield, Koramangala, HSR, Indiranagar, Electronic City, Hebbal, Marathahalli, Sarjapur, Jayanagar and 50+ more."],
  ["Do you use genuine parts?", "Always. We fit OEM-grade spares with a printed invoice and standard manufacturer warranty."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Doorstep Bike & Car Service in Bangalore | Ride N Care" },
      { name: "description", content: "Book #1 rated doorstep bike & car service in Bangalore. Expert mechanics, genuine parts, transparent pricing, free pickup & drop across 50+ localities. Care in every mile." },
      { property: "og:title", content: "Ride N Care — Doorstep Bike & Car Service" },
      { property: "og:description", content: "Bangalore's trusted doorstep bike and car service — genuine parts, transparent pricing, certified mechanics at your home." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Bike and Car Repair",
          provider: { "@type": "LocalBusiness", name: "Ride N Care" },
          areaServed: ["Bangalore"],
          offers: { "@type": "Offer", price: "499", priceCurrency: "INR" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: HOME_FAQS.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 opacity-30">
          <img src={hero} alt="" width={1600} height={1200} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              ⭐ Bangalore's Trusted Doorstep Garage
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05]">
              Doorstep bike & car service, <span className="text-primary">delivered to your gate.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              From Whitefield to Kengeri — book a certified mechanic in 60 seconds. We service every two‑wheeler and four‑wheeler with OEM parts, live updates and a printed warranty. <span className="text-foreground font-medium">Care in every mile.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow hover:opacity-90">
                Book a Service
              </Link>
              <Link to="/pricing" className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-card">
                View Pricing
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <li>✅ Same-day slots</li>
              <li>✅ 7-day workmanship guarantee</li>
              <li>✅ Free pickup & drop</li>
              <li>✅ Cashless payments</li>
            </ul>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <Stat label="Years" value="12+" />
              <Stat label="Mechanics" value="150+" />
              <Stat label="Happy Riders" value="12,000+" />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-glow">
              <img src={hero} alt="Mechanic servicing a sport bike at home" width={1600} height={1200} className="w-full h-[520px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SEO-rich intro */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Bangalore's friendliest doorstep mechanics</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Stuck in traffic, juggling a hectic week, or simply tired of waiting at a service centre? Ride N Care brings the entire workshop to your driveway. Whether it's a routine bike oil change in <strong className="text-foreground">Koramangala</strong>, a car AC top-up in <strong className="text-foreground">HSR Layout</strong>, or a Sunday breakdown rescue in <strong className="text-foreground">Whitefield</strong> — we are 30 minutes away with the right tools and the right price.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Every service is performed by a background-verified, trained mechanic, uses genuine OEM-grade spares and ends with a digital invoice plus a 7-day workmanship guarantee. No upselling. No surprise bills. Just honest, on-time, doorstep care for your ride.
        </p>
      </section>

      {/* Areas We Serve */}
      <AreasMarquee />

      {/* Brands We Service */}
      <BrandsMarquee />

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeading eyebrow="Our Services" title="Built for two wheels and four" />
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <ServiceCard
            image={bike}
            title="Bike Service"
            desc="Periodic, breakdown, and premium maintenance for all bike CCs — TVS to Harley."
            to="/bikes"
          />
          <ServiceCard
            image={car}
            title="Car Service"
            desc="Engine, brakes, AC, battery, denting — handled on the spot by certified mechanics."
            to="/cars"
          />
        </div>
      </section>

      {/* Why us */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <SectionHeading eyebrow="Why Ride N Care" title="Quality, precision & honesty" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Doorstep", "Repairs at your home — no garage runs."],
              ["Expert Mechanics", "Certified, background-verified pros."],
              ["Quick Turnaround", "Most services done in 60–90 mins."],
              ["Transparent Pricing", "Quote upfront. Zero surprises."],
              ["Genuine Parts", "OEM-grade spares with warranty."],
              ["All Vehicles", "Bikes, scooters, sedans, SUVs."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-border bg-background p-6 hover:border-primary/50 transition">
                <div className="h-10 w-10 rounded-lg bg-grad-primary mb-4" />
                <h3 className="font-semibold text-lg">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeading eyebrow="How it works" title="From booking to keys-back in 4 steps" />
        <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["01", "Book online", "Pick your vehicle & service. 60 seconds."],
            ["02", "Mechanic arrives", "Trained pro at your doorstep, on time."],
            ["03", "Service on the spot", "Live updates, genuine parts."],
            ["04", "Pay & rate", "Cashless payment. Rate your mechanic."],
          ].map(([n, t, d]) => (
            <li key={n} className="rounded-2xl border border-border p-6 bg-card">
              <div className="text-primary font-display text-3xl font-bold">{n}</div>
              <h3 className="mt-2 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
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

      {/* Newsletter */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <Newsletter />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20">
        <div className="rounded-3xl bg-grad-primary p-10 text-center shadow-glow">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready for a smoother ride?
          </h2>
          <p className="mt-3 text-primary-foreground/90">Book now and get ₹200 off your first service.</p>
          <Link to="/contact" className="mt-6 inline-block rounded-full bg-background px-6 py-3 font-semibold text-foreground">
            Book Now
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-display font-bold text-primary">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{eyebrow}</div>
      <h2 className="mt-2 text-4xl md:text-5xl font-bold">{title}</h2>
    </div>
  );
}

function ServiceCard({ image, title, desc, to }: { image: string; title: string; desc: string; to: "/bikes" | "/cars" }) {
  return (
    <Link to={to} className="group relative overflow-hidden rounded-3xl border border-border bg-card">
      <img src={image} alt={title} loading="lazy" width={1200} height={900} className="h-72 w-full object-cover transition group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute bottom-0 p-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{desc}</p>
        <span className="mt-3 inline-block text-primary font-semibold">Explore →</span>
      </div>
    </Link>
  );
}
