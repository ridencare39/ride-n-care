import { createFileRoute, Link } from "@tanstack/react-router";
import heroAvif from "@/assets/hero-3d-mechanic.avif";
import bike from "@/assets/bike-service.webp";
import car from "@/assets/car-service.webp";
import { AreasMarquee } from "@/components/AreasMarquee";
import { Newsletter } from "@/components/Newsletter";
import { BrandsMarquee } from "@/components/BrandsMarquee";
import { StatsRow } from "@/components/StatsRow";
import { HeroBackground, HeroCardImage } from "@/components/HeroBackground";
import { Testimonials } from "@/components/Testimonials";
import { AreasSection } from "@/components/AreasSection";
import { AnswerBlocks } from "@/components/AnswerBlocks";
import { ANSWERS, BRAND, ENTITY_SUMMARY } from "@/lib/answers";
import { GUIDES } from "@/lib/guides";
import { AREAS } from "@/lib/areas";
import { SERVICES } from "@/lib/services";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL } from "@/lib/seo";

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
      { title: "Ride N Care | Doorstep Bike & Car Service in Bangalore" },
      { name: "description", content: "Doorstep bike & car service in Bangalore. Certified mechanics, genuine parts, upfront pricing and free pickup & drop across 50+ localities." },
      { property: "og:title", content: "Ride N Care | Doorstep Bike & Car Service in Bangalore" },
      { property: "og:description", content: "Bangalore's trusted doorstep bike and car service — genuine parts, transparent pricing, certified mechanics at your home." },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:site_name", content: "Ride N Care" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "preload", as: "image", href: heroAvif, type: "image/avif", fetchPriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          ...LOCAL_BUSINESS_JSONLD,
          areaServed: [
            ...LOCAL_BUSINESS_JSONLD.areaServed,
            ...AREAS.map((a) => ({ "@type": "Place", name: `${a.name}, Bangalore`, ...(a.pincode ? { address: { "@type": "PostalAddress", postalCode: a.pincode, addressLocality: "Bangalore", addressCountry: "IN" } } : {}) })),
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Bike and Car Repair",
          provider: { "@type": "AutoRepair", "@id": `${SITE_URL}/#business`, name: "Ride N Care" },
          areaServed: ["Bangalore"],
          offers: { "@type": "AggregateOffer", lowPrice: "399", priceCurrency: "INR" },
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
        {/* 3D mechanic background */}
        <HeroBackground />
        {/* readability scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        {/* soft 3D glow orbs */}
        <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl float-slow" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl float-slower" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              ⭐ Bangalore's Trusted Doorstep Garage
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05]">
              Trusted Bike Service & <span className="text-primary">Doorstep Bike Repair in Bangalore</span>
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
            <StatsRow className="mt-10 max-w-md" />
          </div>
          <div className="hidden md:block">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-glow float-slow">
              <HeroCardImage />
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

      {/* Bike services — internal links */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-6">
        <SectionHeading eyebrow="Bike services" title="Pick the service your bike needs" />
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to="/$service"
              params={{ service: s.slug }}
              className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition"
            >
              <h3 className="font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.intro}</p>
              <span className="mt-3 inline-block text-sm text-primary font-semibold">
                {s.priceFrom ? `From ₹${s.priceFrom} →` : "Learn more →"}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="tel:08296950339" className="rounded-full border border-border px-5 py-2.5 font-semibold text-sm hover:bg-card">Call 08296950339</a>
          <a href="tel:08069409289" className="rounded-full border border-border px-5 py-2.5 font-semibold text-sm hover:bg-card">Call 08069409289</a>
          <a href="https://wa.me/918296950339" className="rounded-full bg-grad-primary px-5 py-2.5 font-semibold text-sm text-primary-foreground shadow-glow">WhatsApp us</a>
        </div>
      </section>

      {/* Answer-first entity summary for search & AI assistants */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <SectionHeading eyebrow="About the business" title="Who is Ride N Care?" />
        <p className="mt-6 text-muted-foreground leading-relaxed">{ENTITY_SUMMARY}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Reach us on <a href={`tel:${BRAND.phonePrimary}`} className="text-primary hover:underline">{BRAND.phonePrimary}</a> or{" "}
          <a href={`tel:${BRAND.phoneSecondary}`} className="text-primary hover:underline">{BRAND.phoneSecondary}</a>, open {BRAND.hours} in {BRAND.city}, {BRAND.region}.
        </p>
        <AnswerBlocks items={ANSWERS.slice(0, 7)} headingLevel={3} />
        <div className="mt-6">
          <Link to="/answers" className="text-primary font-semibold hover:underline">See all answers about Ride N Care →</Link>
        </div>
      </section>

      {/* Areas We Serve */}
      <AreasMarquee />

      {/* Service areas / locations */}
      <AreasSection />

      {/* Trust & testimonials */}
      <Testimonials />

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
              ["Expert", "Certified pros"],
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

      {/* How it works — compact */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">How it works</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold">Booking to keys-back in 4 steps</h2>
        <ol className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ["01", "Book online", "60 seconds."],
            ["02", "Mechanic arrives", "On time, at home."],
            ["03", "Service on the spot", "Live updates."],
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
