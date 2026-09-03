import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AREAS } from "@/lib/areas";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";

const TITLE = "Service Area Map — Ride N Care Bangalore";
const DESC =
  "Google Maps view of every Bangalore locality Ride N Care covers for doorstep bike & car service — with pincodes, zones and directions.";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "ride n care map, doorstep bike service near me Bangalore, car mechanic near me map" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${SITE_URL}/map` },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/map` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          "@id": `${SITE_URL}/#business`,
          name: "Ride N Care",
          url: SITE_URL,
          hasMap: "https://www.google.com/maps/search/?api=1&query=12.9716,77.5946",
          telephone: ["+91-80-6940-9289", "+91-82969-50339"],
          priceRange: "₹₹",
          geo: { "@type": "GeoCoordinates", latitude: 12.9716, longitude: 77.5946 },
          areaServed: AREAS.map((a) => ({
            "@type": "Place",
            name: `${a.name}, Bangalore`,
            geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
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
            { "@type": "ListItem", position: 2, name: "Service Area Map", item: `${SITE_URL}/map` },
          ],
        }),
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [active, setActive] = useState(AREAS[0]);
  const query = encodeURIComponent(`${active.name}, Bengaluru, Karnataka`);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Coverage Map</span>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">Ride N Care service area map</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pick a locality to see it on Google Maps. Our doorstep mechanics reach any address inside these {AREAS.length} Bangalore
        zones, usually within 30 minutes of confirmation.
      </p>

      <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="rounded-2xl border border-border bg-card p-3 max-h-[520px] overflow-y-auto">
          {AREAS.map((a) => (
            <button
              key={a.slug}
              onClick={() => setActive(a)}
              className={`w-full text-left rounded-xl px-3 py-2 text-sm transition ${
                a.slug === active.slug ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent"
              }`}
            >
              📍 {a.name}
              <span className="block text-[11px] opacity-70">
                {a.zone} · {a.pincode}
              </span>
            </button>
          ))}
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title={`Google Map of Ride N Care service area in ${active.name}, Bangalore`}
              src={`https://www.google.com/maps?q=${query}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-grad-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Open in Google Maps
            </a>
            <Link
              to="/areas/$slug"
              params={{ slug: active.slug }}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {active.name} service page
            </Link>
            <a
              href="https://wa.me/918296950339"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              Book on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <h2 className="mt-14 text-2xl font-bold">All covered localities</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <Link
            key={a.slug}
            to="/areas/$slug"
            params={{ slug: a.slug }}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            {a.name} {a.pincode}
          </Link>
        ))}
      </div>
    </div>
  );
}
