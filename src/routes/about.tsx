import { createFileRoute } from "@tanstack/react-router";
import { StatsRow } from "@/components/StatsRow";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ride N Care — Bangalore's Doorstep Bike & Car Service" },
      { name: "description", content: "Founded in 2021, Ride N Care is Bangalore's most trusted doorstep mechanic service. 60+ certified pros, 3,200+ happy customers, genuine parts, transparent pricing across 50+ city localities." },
      { property: "og:title", content: "About Ride N Care — Care in every mile" },
      { property: "og:description", content: "Bangalore's trusted doorstep bike & car service. Certified mechanics, OEM parts, transparent pricing." },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Ride N Care",
          alternateName: "Ride N Care — Care in every mile",
          slogan: "Care in every mile",
          url: SITE_URL,
          logo: LOCAL_BUSINESS_JSONLD.logo,
          image: OG_IMAGE,
          email: LOCAL_BUSINESS_JSONLD.email,
          telephone: LOCAL_BUSINESS_JSONLD.telephone,
          address: LOCAL_BUSINESS_JSONLD.address,
          areaServed: LOCAL_BUSINESS_JSONLD.areaServed,
          foundingDate: "2014",
          foundingLocation: "Bangalore, Karnataka, India",
          numberOfEmployees: { "@type": "QuantitativeValue", value: 150 },
          sameAs: LOCAL_BUSINESS_JSONLD.sameAs,
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+91-80-6940-9289",
              contactType: "customer service",
              areaServed: "IN",
              availableLanguage: ["en", "hi", "kn"],
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${SITE_URL}/about#aboutpage`,
          url: `${SITE_URL}/about`,
          name: "About Ride N Care",
          description:
            "Bangalore's doorstep bike and car service company — 12+ years, 150+ certified mechanics, 12,000+ happy riders.",
          mainEntity: { "@id": `${SITE_URL}/#organization` },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
            ],
          },
        }),
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Our Story</span>
      <h1 className="mt-2 text-5xl font-bold">About Ride N Care</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        Ride N Care was founded in <strong className="text-foreground">Bangalore</strong> with one stubborn belief — getting your bike or car serviced should not eat up an entire weekend. What began as two friends fixing neighbours' scooters in a Koramangala parking lot has grown into the city's most trusted doorstep automotive service brand, with <strong className="text-foreground">150+ certified mechanics</strong> covering <strong className="text-foreground">50+ Bangalore localities</strong> and over <strong className="text-foreground">12,000 happy riders</strong> across <strong className="text-foreground">12+ years</strong> on the road.
      </p>

      <StatsRow className="mt-10 max-w-md" />

      <h2 className="mt-14 text-3xl font-bold">Why Bangalore loves us</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Bangalore's traffic, dust and unpredictable monsoon are uniquely brutal on vehicles. We built Ride N Care specifically for this city — every mechanic carries a full diagnostics kit, OEM-grade spares for the top 25 bike and car models on Bangalore roads, and a printed price list so there are zero surprises. From a quick oil change in Indiranagar to a full periodic service in Electronic City, we show up on time, work in front of you, and leave your driveway cleaner than we found it.
      </p>

      <h2 className="mt-12 text-3xl font-bold">Services we specialise in</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-muted-foreground">
        <li>🏍 Bike periodic & general service</li>
        <li>🚗 Car periodic & comprehensive service</li>
        <li>🧰 Brake, clutch & chain repairs</li>
        <li>❄ Car AC gas refill & cleaning</li>
        <li>🔋 Battery jump-start & replacement</li>
        <li>🛞 Tyre puncture, change & alignment</li>
        <li>🎨 Denting, painting & detailing</li>
        <li>🛠 Pre-purchase used-vehicle inspection</li>
      </ul>

      <h2 className="mt-12 text-3xl font-bold">Our promise</h2>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        <li>✅ Genuine, OEM-grade parts with manufacturer warranty.</li>
        <li>✅ Upfront pricing — a written quote before any spanner is lifted.</li>
        <li>✅ Trained, polite, background-verified mechanics in uniform.</li>
        <li>✅ Live job updates over WhatsApp + detailed digital invoice.</li>
        <li>✅ 7-day post-service workmanship guarantee.</li>
        <li>✅ 100% cashless — UPI, cards, NetBanking accepted.</li>
      </ul>

      <h2 className="mt-12 text-3xl font-bold">Bangalore coverage</h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        We currently serve Whitefield, Koramangala, HSR Layout, Indiranagar, Marathahalli, BTM Layout, Jayanagar, JP Nagar, Bellandur, Sarjapur Road, Electronic City, Banashankari, Rajajinagar, Malleshwaram, Yelahanka, Hebbal, Kalyan Nagar, CV Raman Nagar, MG Road, Brigade Road, Mahadevapura, KR Puram, Kadugodi, Varthur, Hoskote, Bannerghatta Road, Kanakapura Road, Yeshwanthpur, Peenya and 20+ more neighbourhoods. New areas added every month — call us if you don't see yours.
      </p>

      {/* Testimonials / trust */}
      <section className="mt-14">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Trusted by riders</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-bold">What Bangalore says about us</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {[
            ["Priya S.", "HSR Layout", "Booked a car service at 9am, mechanic showed up at 10 sharp. Watched the whole job from my balcony — zero upselling."],
            ["Arjun M.", "Whitefield", "My Duke's chain and brakes were done in my parking lot in 75 minutes. Printed bill, genuine parts, fair price."],
            ["Rakesh N.", "Jayanagar", "Battery died on a Sunday. They reached in 30 minutes and replaced it on the spot. Now my default garage."],
          ].map(([name, area, quote]) => (
            <figure key={name} className="rounded-xl border border-border bg-card p-4">
              <div className="text-primary text-sm">★★★★★</div>
              <blockquote className="mt-2 text-sm text-muted-foreground">“{quote}”</blockquote>
              <figcaption className="mt-3 text-xs font-semibold">
                {name} <span className="text-muted-foreground font-normal">· {area}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["4.8★", "Average rating"],
            ["7-day", "Workmanship guarantee"],
            ["OEM", "Genuine parts only"],
            ["50+", "Areas covered"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-background p-3">
              <h3 className="font-semibold text-sm text-primary">{t}</h3>
              <p className="text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Ready to try doorstep service?</h2>
        <p className="mt-2 text-primary-foreground/90">Get a free quote on WhatsApp in under 2 minutes.</p>
        <a href="https://wa.me/918296950339" className="mt-4 inline-block rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
      </div>
    </div>
  );
}