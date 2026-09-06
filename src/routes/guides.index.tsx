import { createFileRoute, Link } from "@tanstack/react-router";
import { GUIDES } from "@/lib/guides";
import { BRAND } from "@/lib/answers";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL, breadcrumbJsonLd } from "@/lib/seo";

const URL = `${SITE_URL}/guides`;

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Bike Maintenance Guides for Bangalore | Ride N Care" },
      {
        name: "description",
        content:
          "Free, factual bike guides from Ride N Care: service intervals, maintenance checklists, common problems, breakdown troubleshooting and doorstep service explained.",
      },
      { property: "og:title", content: "Bike Maintenance & Service Guides | Ride N Care" },
      { property: "og:description", content: "Practical two-wheeler maintenance and repair guides written for Bangalore riding conditions." },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_JSONLD) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            ["Home", `${SITE_URL}/`],
            ["Guides", URL],
          ]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ride N Care bike maintenance guides",
          itemListElement: GUIDES.map((g, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: g.h1,
            url: `${SITE_URL}/guides/${g.slug}`,
          })),
        }),
      },
    ],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span>/</span> <span className="text-foreground">Guides</span>
      </nav>
      <span className="mt-6 block text-xs uppercase tracking-[0.2em] text-primary font-semibold">Knowledge</span>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">Bike maintenance &amp; service guides</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
        Reference guides written by the {BRAND.name} workshop team for Bangalore riding conditions — service intervals,
        maintenance checklists, symptom diagnosis and roadside troubleshooting. No sales pitch, just what we tell customers.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            to="/guides/$slug"
            params={{ slug: g.slug }}
            className="rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition"
          >
            <h2 className="text-lg font-semibold">{g.h1}</h2>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{g.summary}</p>
            <span className="mt-3 inline-block text-sm text-primary font-semibold">Read guide · {g.readMinutes} min →</span>
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold">Need a mechanic instead of a guide?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {BRAND.name} services and repairs two-wheelers at your doorstep across {BRAND.city}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a href={`tel:${BRAND.phonePrimary}`} className="rounded-full border border-border px-5 py-2.5 font-semibold hover:bg-background">Call {BRAND.phonePrimary}</a>
          <a href={`https://wa.me/${BRAND.whatsapp}`} className="rounded-full bg-grad-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow">WhatsApp</a>
          <Link to="/answers" className="rounded-full border border-border px-5 py-2.5 font-semibold hover:bg-background">Read our answers page</Link>
        </div>
      </div>
    </div>
  );
}
