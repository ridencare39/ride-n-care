import { createFileRoute, Link } from "@tanstack/react-router";
import { getService, type ServiceDef } from "@/lib/services";
import { AREAS, PRIORITY_AREAS } from "@/lib/areas";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/$service/")({
  head: ({ params }) => {
    const s = getService(params.service);
    if (!s) return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    const url = `${SITE_URL}/${s.slug}`;
    return {
      meta: [
        { title: s.title },
        { name: "description", content: s.description },
        { property: "og:title", content: s.title },
        { property: "og:description", content: s.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${url}#service`,
            name: s.serviceType,
            serviceType: s.serviceType,
            description: s.description,
            url,
            provider: { "@type": "AutoRepair", "@id": `${SITE_URL}/#business`, name: "Ride N Care" },
            areaServed: AREAS.map((a) => ({ "@type": "Place" as const, name: `${a.name}, Bangalore` })),
            ...(s.priceFrom
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "INR",
                    price: String(s.priceFrom),
                    availability: "https://schema.org/InStock",
                    url,
                  },
                }
              : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: s.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const service = getService(params.service);
    if (!service) throw notFound();
    return { service };
  },
  component: ServiceLanding,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">This service page does not exist.</p>
      <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">This page didn't load</h1>
      <Link to="/" className="mt-4 inline-block text-primary">← Back to home</Link>
    </div>
  ),
});

function ServiceLanding() {
  const { service: s } = Route.useLoaderData() as { service: ServiceDef };
  const related = s.related.map(getService).filter(Boolean) as ServiceDef[];
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span> <span>{s.name}</span>
      </nav>

      <h1 className="mt-6 text-4xl md:text-5xl font-bold">{s.h1}</h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{s.intro}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href="https://wa.me/918296950339" className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
          Book on WhatsApp
        </a>
        <a href="tel:08069409289" className="rounded-full border border-border px-6 py-3 font-semibold">Call 080 6940 9289</a>
        {s.priceFrom && (
          <span className="rounded-full border border-border bg-card px-6 py-3 font-semibold">From ₹{s.priceFrom}</span>
        )}
      </div>

      <div className="mt-10 space-y-4 text-muted-foreground leading-relaxed">
        {s.detail.map((p) => <p key={p}>{p}</p>)}
      </div>

      <h2 className="mt-12 text-2xl font-bold">What's included</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2">
        {s.includes.map((i) => (
          <li key={i} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {i}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl font-bold">Why riders choose Ride N Care</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {s.benefits.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">How booking works</h2>
      <ol className="mt-4 space-y-3">
        {s.steps.map(([t, d]) => (
          <li key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>

      {s.local && (
        <>
          <h2 className="mt-12 text-2xl font-bold">{s.name} near you in Bangalore</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PRIORITY_AREAS.map((a) => (
              <Link
                key={a.slug}
                to="/$service/$area"
                params={{ service: s.slug, area: a.slug }}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                📍 {s.name} in {a.name}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Not listed? We cover {AREAS.length}+ localities — see all <Link to="/areas" className="text-primary">service areas</Link>.
          </p>
        </>
      )}

      <h2 className="mt-12 text-2xl font-bold">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {s.faqs.map(([q, a]) => (
          <div key={q} className="p-4">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold">Related services</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/$service"
                params={{ service: r.slug }}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book {s.name.toLowerCase()} today</h2>
        <p className="mt-2 text-primary-foreground/90">Same-day slots across Bangalore, 8 AM to 9 PM.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href="https://wa.me/918296950339" className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">WhatsApp us</a>
          <Link to="/contact" className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">Book online</Link>
        </div>
      </div>
    </div>
  );
}
