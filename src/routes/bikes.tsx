import { createFileRoute, Link } from "@tanstack/react-router";
import bike from "@/assets/bike-service.webp";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL } from "@/lib/seo";
import { BIKE_FAQS } from "@/lib/service-faqs";
import { BIKE_PACKAGES } from "@/lib/pricing";
import { BookingButton } from "@/components/booking/BookingButton";

const brands = ["TVS","Bajaj","Royal Enfield","Yamaha","Honda","Hero","Suzuki","KTM","Jawa","Harley Davidson","Ducati","Kawasaki","Benelli","Triumph","BMW","Aprilia","Yezdi","Husqvarna"];
export const Route = createFileRoute("/bikes")({
  head: () => ({
    meta: [
      { title: "Doorstep Bike Service in Bangalore — All CCs | Ride N Care" },
      { name: "description", content: "At-home bike service in Bangalore for every CC — TVS, Bajaj, Royal Enfield, KTM, Harley. OEM parts, certified mechanics, 60–90 min service." },
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
          provider: { "@type": "AutoRepair", "@id": `${SITE_URL}/#business`, name: "Ride N Care", telephone: "+91-82969-50339" },
          offers: { "@type": "AggregateOffer", lowPrice: "399", priceCurrency: "INR" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: BIKE_FAQS.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Bike Service", item: `${SITE_URL}/bikes` },
          ],
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
          <BookingButton vehicle="bike" className="mt-6 h-12 rounded-full bg-grad-primary px-6 font-semibold text-primary-foreground shadow-glow">Book a Bike Service</BookingButton>
        </div>
        <img src={bike} alt="Bike being serviced" width={1200} height={900} loading="lazy" className="rounded-3xl border border-border" />
      </div>

      <h2 className="mt-20 text-3xl font-bold">Service Packages</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BIKE_PACKAGES.filter((item) => item.serviceId === "general-service").map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-6 hover:border-primary transition">
            <div className="text-primary text-sm font-semibold uppercase tracking-wider">At-Home {t.tier}</div>
            <div className="mt-1 text-muted-foreground text-sm">{t.cc}</div>
            <div className="mt-4">
              <span className="text-3xl font-bold">₹{t.price.toLocaleString("en-IN")}</span>
            </div>
            <ul className="mt-4 text-sm space-y-1 text-muted-foreground">
              {t.includes.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <BookingButton vehicle="bike" packageId={t.id} className="mt-5 h-11 w-full rounded-full bg-grad-primary px-4 font-semibold text-primary-foreground">Book Now</BookingButton>
          </div>
        ))}
      </div>

      <h2 className="mt-20 text-3xl font-bold">Brands We Service</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {brands.map((b) => (
          <span key={b} className="rounded-full border border-border px-4 py-2 text-sm bg-card">{b}</span>
        ))}
      </div>

      <h2 className="mt-20 text-3xl font-bold">Bike service FAQs</h2>
      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
        {BIKE_FAQS.map(([q, a]) => (
          <details key={q} className="group p-6">
            <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
              <span className="font-semibold">{q}</span>
              <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}