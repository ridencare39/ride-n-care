import { createFileRoute, Link } from "@tanstack/react-router";
import bike from "@/assets/bike-service.jpg";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL } from "@/lib/seo";

const brands = ["TVS","Bajaj","Royal Enfield","Yamaha","Honda","Hero","Suzuki","KTM","Jawa","Harley Davidson","Ducati","Kawasaki","Benelli","Triumph","BMW","Aprilia","Yezdi","Husqvarna"];
const tiers = [
  { name: "Regular", cc: "Below 125 CC", old: 899, price: 499 },
  { name: "Classic", cc: "125 – 199 CC", old: 999, price: 799 },
  { name: "Premium", cc: "200 – 299 CC", old: 1899, price: 1199 },
  { name: "Royal", cc: "300 – 349 CC", old: 1699, price: 1399 },
  { name: "Sports", cc: "Above 350 CC", old: 2199, price: 1899 },
];

export const Route = createFileRoute("/bikes")({
  head: () => ({
    meta: [
      { title: "Doorstep Bike Service in Bangalore — All CCs | Ride N Care" },
      { name: "description", content: "Book at-home bike service in Bangalore for every CC — TVS, Bajaj, Royal Enfield, KTM, Harley. Genuine OEM parts, certified mechanics, 60–90 min service and a 7-day workmanship guarantee." },
      { property: "og:title", content: "Doorstep Bike Service in Bangalore | Ride N Care" },
      { property: "og:description", content: "At-home bike service in Bangalore for all CCs with genuine parts, transparent pricing and certified mechanics." },
      { property: "og:url", content: `${SITE_URL}/bikes` },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/bikes` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_JSONLD) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Doorstep Bike Service",
          areaServed: { "@type": "City", name: "Bangalore" },
          provider: { "@type": "AutoRepair", name: "Ride N Care", telephone: "+91-82969-50339" },
          offers: { "@type": "Offer", price: "499", priceCurrency: "INR" },
        }),
      },
    ],
  }),
  component: Bikes,
});

function Bikes() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Two Wheelers</span>
          <h1 className="mt-2 text-5xl font-bold">Bike Service at Home</h1>
          <p className="mt-4 text-muted-foreground">From scooters to litre-class superbikes — our mechanics show up with genuine parts and finish most jobs in under 90 minutes.</p>
          <Link to="/contact" className="mt-6 inline-block rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">Book a Bike Service</Link>
        </div>
        <img src={bike} alt="Bike being serviced" width={1200} height={900} loading="lazy" className="rounded-3xl border border-border" />
      </div>

      <h2 className="mt-20 text-3xl font-bold">Service Packages</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-card p-6 hover:border-primary transition">
            <div className="text-primary text-sm font-semibold uppercase tracking-wider">At-Home {t.name}</div>
            <div className="mt-1 text-muted-foreground text-sm">{t.cc}</div>
            <div className="mt-4">
              <span className="text-3xl font-bold">₹{t.price}</span>
              <span className="ml-2 text-muted-foreground line-through">₹{t.old}</span>
            </div>
            <ul className="mt-4 text-sm space-y-1 text-muted-foreground">
              <li>• Engine oil top-up</li>
              <li>• Oil filter clean</li>
              <li>• Air filter clean</li>
              <li>• Spark plug clean</li>
            </ul>
            <Link to="/contact" className="mt-5 inline-block w-full text-center rounded-full bg-grad-primary px-4 py-2 font-semibold text-primary-foreground">Book Now</Link>
          </div>
        ))}
      </div>

      <h2 className="mt-20 text-3xl font-bold">Brands We Service</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {brands.map((b) => (
          <span key={b} className="rounded-full border border-border px-4 py-2 text-sm bg-card">{b}</span>
        ))}
      </div>
    </div>
  );
}