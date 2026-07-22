import { createFileRoute, Link } from "@tanstack/react-router";
import car from "@/assets/car-service.jpg";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL } from "@/lib/seo";
import { CAR_FAQS } from "@/lib/service-faqs";

const services = [
  ["Periodic Service", "Oil change, filters, brake check"],
  ["AC Service", "Gas refill, cooling diagnostics"],
  ["Battery", "Jumpstart, testing, replacement"],
  ["Brakes & Suspension", "Pads, discs, shockers"],
  ["Denting & Painting", "Pick-up, paint, drop"],
  ["Cleaning & Detailing", "Interior, ceramic, polish"],
];

export const Route = createFileRoute("/cars")({
  head: () => ({
    meta: [
      { title: "Doorstep Car Service in Bangalore — Periodic, AC, Brakes | Ride N Care" },
      { name: "description", content: "Book doorstep car service in Bangalore — periodic maintenance, AC gas refill, battery, brakes, denting & painting. Genuine parts, transparent pricing, certified mechanics at your gate." },
      { property: "og:title", content: "Doorstep Car Service in Bangalore | Ride N Care" },
      { property: "og:description", content: "At-home car service in Bangalore: periodic, AC, brakes, battery, denting — done by certified mechanics with OEM parts." },
      { property: "og:url", content: `${SITE_URL}/cars` },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cars` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_JSONLD) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Doorstep Car Service",
          areaServed: { "@type": "City", name: "Bangalore" },
          provider: { "@type": "AutoRepair", name: "Ride N Care", telephone: "+91-82969-50339" },
          offers: { "@type": "Offer", price: "1499", priceCurrency: "INR" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: CAR_FAQS.map(([q, a]) => ({
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
            { "@type": "ListItem", position: 2, name: "Car Service", item: `${SITE_URL}/cars` },
          ],
        }),
      },
    ],
  }),
  component: Cars,
});

function Cars() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <img src={car} alt="Car being serviced" loading="lazy" width={1200} height={900} className="rounded-3xl border border-border" />
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Four Wheelers</span>
          <h1 className="mt-2 text-5xl font-bold">Car Service at Home</h1>
          <p className="mt-4 text-muted-foreground">From hatchbacks to SUVs, our mobile workshop arrives with diagnostic tools, genuine spares, and zero shortcuts.</p>
          <Link to="/contact" className="mt-6 inline-block rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">Book a Car Service</Link>
        </div>
      </div>

      <h2 className="mt-20 text-3xl font-bold">What we cover</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6">
            <div className="h-8 w-8 rounded bg-grad-primary mb-3" />
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-20 text-3xl font-bold">Car service FAQs</h2>
      <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card">
        {CAR_FAQS.map(([q, a]) => (
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