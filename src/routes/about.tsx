import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ride N Care — Bangalore's Doorstep Bike & Car Service" },
      { name: "description", content: "Founded in 2021, Ride N Care is Bangalore's most trusted doorstep mechanic service. 60+ certified pros, 3,200+ happy customers, genuine parts, transparent pricing across 50+ city localities." },
      { property: "og:title", content: "About Ride N Care — Care in every mile" },
      { property: "og:description", content: "Bangalore's trusted doorstep bike & car service. Certified mechanics, OEM parts, transparent pricing." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Ride N Care",
          description: "Bangalore's doorstep bike and car service company.",
          mainEntity: {
            "@type": "Organization",
            name: "Ride N Care",
            foundingDate: "2021",
            foundingLocation: "Bangalore, Karnataka, India",
            numberOfEmployees: "60+",
            slogan: "Care in every mile",
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

      <div className="mt-10 grid sm:grid-cols-3 gap-6">
        <Stat v="12+" l="Years in business" />
        <Stat v="150+" l="Certified mechanics" />
        <Stat v="12,000+" l="Happy riders" />
      </div>

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

      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Ready to try doorstep service?</h2>
        <p className="mt-2 text-primary-foreground/90">Get a free quote on WhatsApp in under 2 minutes.</p>
        <a href="https://wa.me/918296950339" className="mt-4 inline-block rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
      </div>
    </div>
  );
}
function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-3xl font-display font-bold text-primary">{v}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}