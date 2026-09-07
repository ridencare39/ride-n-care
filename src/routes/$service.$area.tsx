import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, type ServiceDef } from "@/lib/services";
import { getArea, AREAS, type Area } from "@/lib/areas";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/$service/$area")({
  loader: ({ params }) => {
    const service = getService(params.service);
    const area = getArea(params.area);
    if (!service || !service.local || !area) throw notFound();
    return { service, area };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    const { service: s, area: a } = loaderData;
    const url = `${SITE_URL}/${s.slug}/${a.slug}`;
    const title = `${s.name} in ${a.name}, Bangalore | Ride N Care`;
    const desc = `${s.name} near you in ${a.name}, Bangalore at your doorstep. Certified mechanics, OEM parts, same-day slots, 7-day guarantee. Call 08296950339.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: `${s.name.toLowerCase()} ${a.name}, doorstep bike service ${a.name}, bike repair ${a.name} Bangalore` },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
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
            name: `${s.name} in ${a.name}`,
            serviceType: s.serviceType,
            description: desc,
            url,
            provider: {
              "@type": "AutoRepair",
              "@id": `${SITE_URL}/#business`,
              name: "Ride N Care",
              telephone: ["+91-80-6940-9289", "+91-82969-50339"],
              email: "ridencareinfo@gmail.com",
              priceRange: "₹₹",
            },
            areaServed: {
              "@type": "Place",
              name: `${a.name}, Bangalore`,
              address: {
                "@type": "PostalAddress",
                addressLocality: a.name,
                postalCode: a.pincode,
                addressRegion: "Karnataka",
                addressCountry: "IN",
              },
              geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
            },
            hasMap: `https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`,
            ...(s.priceFrom
              ? { offers: { "@type": "Offer", priceCurrency: "INR", price: String(s.priceFrom), availability: "https://schema.org/InStock", url } }
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
              { "@type": "ListItem", position: 2, name: s.name, item: `${SITE_URL}/${s.slug}` },
              { "@type": "ListItem", position: 3, name: a.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: LocalServicePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">We may not cover this combination yet.</p>
      <Link to="/areas" className="mt-4 inline-block text-primary">← See all service areas</Link>
    </div>
  ),
});

function LocalServicePage() {
  const { service: s, area: a } = Route.useLoaderData() as { service: ServiceDef; area: Area };
  const sameZone = AREAS.filter((x) => x.zone === a.zone && x.slug !== a.slug).slice(0, 6);
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <Link to="/$service" params={{ service: s.slug }} className="hover:text-primary">{s.name}</Link>
        <span className="mx-1">/</span> <span>{a.name}</span>
      </nav>

      <span className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-primary font-semibold">
        {a.zone} Bangalore · {a.pincode ?? ""}
      </span>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">
        {s.name} in <span className="text-primary">{a.name}</span>, Bangalore
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        {s.intro} In {a.name} our mechanics reach you within about 30 minutes of a confirmed slot, and we also cover{" "}
        {(a.nearby ?? []).join(", ") || "nearby streets"} from the same unit.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`https://wa.me/918296950339?text=${encodeURIComponent(`Hi Ride N Care, I need ${s.name} in ${a.name}.`)}`} className="rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
          WhatsApp for {a.name}
        </a>
        <a href="tel:08069409289" className="rounded-full border border-border px-6 py-3 font-semibold">Call 080 6940 9289</a>
        {s.priceFrom && <span className="rounded-full border border-border bg-card px-6 py-3 font-semibold">From ₹{s.priceFrom}</span>}
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat v="≤30 min" l={`Avg response in ${a.name}`} />
        <Stat v="60–90 min" l="Typical job time" />
        <Stat v="7-day" l="Workmanship guarantee" />
      </div>

      <h2 className="mt-12 text-2xl font-bold">What the {a.name} visit covers</h2>
      <ul className="mt-4 grid sm:grid-cols-2 gap-2">
        {s.includes.map((i) => (
          <li key={i} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">✔ {i}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl font-bold">Why {a.name} riders book us</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {s.benefits.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">{s.name} FAQs — {a.name}</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {s.faqs.map(([q, ans]) => (
          <div key={q} className="p-4">
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{ans}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold">More services in {a.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {s.related.map(getService).filter((r): r is ServiceDef => Boolean(r?.local)).map((r) => (
              <Link key={r.slug} to="/$service/$area" params={{ service: r.slug, area: a.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                {r.name} in {a.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">{s.name} in nearby areas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {sameZone.map((o) => (
              <Link key={o.slug} to="/$service/$area" params={{ service: s.slug, area: o.slug }} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary">
                📍 {o.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book {s.name.toLowerCase()} in {a.name}</h2>
        <p className="mt-2 text-primary-foreground/90">Send your bike model and preferred time — quote in 2 minutes.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href="https://wa.me/918296950339" className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
          <Link to="/contact" className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">Book online</Link>
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        See the full <Link to="/$service" params={{ service: s.slug }} className="text-primary">{s.name}</Link> page, our{" "}
        <Link to="/pricing" className="text-primary">pricing</Link> or the <Link to="/areas/$slug" params={{ slug: a.slug }} className="text-primary">{a.name} area page</Link>.
      </p>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-2xl font-display font-bold text-primary">{v}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}
