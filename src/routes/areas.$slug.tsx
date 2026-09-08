import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArea, AREAS, type Area } from "@/lib/areas";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = getArea(params.slug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.area;
    if (!a) return { meta: [{ title: "Area not found" }] };
    const nearby = a.nearby?.[0];
    const title = `Bike & Car Service in ${a.name} | Ride N Care`;
    const desc = `Doorstep bike & car service in ${a.name}${a.pincode ? ` ${a.pincode}` : ""}, ${a.zone} Bangalore${nearby ? `, near ${nearby}` : ""}. Same-day slots, OEM parts, 7-day guarantee.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: `bike service ${a.name}, car service ${a.name}, doorstep mechanic ${a.name} Bangalore, ${a.name} car repair` },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `${SITE_URL}/areas/${params.slug}` },
        { property: "og:type", content: "website" },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/areas/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            "@id": `${SITE_URL}/areas/${params.slug}#business`,
            name: `Ride N Care — ${a.name}`,
            branchOf: { "@type": "AutoRepair", "@id": `${SITE_URL}/#business`, name: "Ride N Care" },
            parentOrganization: { "@type": "Organization", "@id": `${SITE_URL}/#business`, name: "Ride N Care" },
            description: desc,
            url: `${SITE_URL}/areas/${params.slug}`,
            image: OG_IMAGE,
            hasMap: `https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`,
            areaServed: [
              { "@type": "Place", name: `${a.name}, Bangalore` },
              ...(a.nearby ?? []).map((n) => ({ "@type": "Place" as const, name: `${n}, Bangalore` })),
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: a.name,
              postalCode: a.pincode,
              addressRegion: "Karnataka",
              addressCountry: "IN",
            },
            geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
            serviceArea: {
              "@type": "GeoCircle",
              geoMidpoint: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
              geoRadius: 6000,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "08:00",
                closes: "21:00",
              },
            ],
            telephone: ["+91-80-6940-9289", "+91-82969-50339"],
            email: "ridencareinfo@gmail.com",
            priceRange: "₹₹",
            currenciesAccepted: "INR",
            paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
            sameAs: SAME_AS,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Service Areas", item: "/areas" },
              { "@type": "ListItem", position: 3, name: a.name, item: `/areas/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  component: AreaPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Area not yet covered</h1>
      <p className="mt-2 text-muted-foreground">We're adding new Bangalore areas every month.</p>
      <Link to="/areas" className="mt-4 inline-block text-primary">← Back to all areas</Link>
    </div>
  ),
});

function AreaPage() {
  const { area } = Route.useLoaderData() as { area: Area };
  const others = AREAS.filter((a) => a.zone === area.zone && a.slug !== area.slug).slice(0, 6);
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/areas" className="hover:text-primary">← All service areas</Link>
      </nav>
      <span className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-primary font-semibold">
        {area.zone} Bangalore · {area.pincode ?? ""}
      </span>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">
        Doorstep bike & car service in <span className="text-primary">{area.name}</span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        Ride N Care's certified mechanics serve every street of {area.name} — from morning office runs near the metro to weekend rides through {area.nearby?.[0] ?? "the neighbourhood"}. Book a slot online and we arrive at your gate with tools, OEM spares and a printed quote.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Highlight v="≤30 min" l="Avg response" />
        <Highlight v="60–90 min" l="Most services done in" />
        <Highlight v="7-day" l="Workmanship guarantee" />
      </div>

      <h2 className="mt-12 text-2xl font-bold">Most-booked services in {area.name}</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {[
          ["🏍 Bike periodic service", "Oil, filters, brakes, chain — under 75 minutes."],
          ["🚗 Car periodic service", "Full inspection + consumables, completed at your gate."],
          ["❄ Car AC gas refill", "Vacuum + R134a top-up with leak test."],
          ["🔋 Battery jump & swap", "Same-day delivery of Exide/Amaron batteries."],
          ["🛞 Puncture & tyre change", "On-the-spot wheel-on patch or replacement."],
          ["🛠 Breakdown assistance", "30-minute roadside rescue across {name}.".replace("{name}", area.name)],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-4">
            <div className="font-semibold">{t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      {area.nearby && area.nearby.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-bold">We also cover nearby</h2>
          <p className="mt-3 text-muted-foreground">
            Mechanics from our {area.name} unit also serve {area.nearby.join(", ")} on the same response SLA.
          </p>
        </>
      )}

      <div className="mt-12 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Book a doorstep slot in {area.name}</h2>
        <p className="mt-2 text-primary-foreground/90">WhatsApp us your model + service — quote in 2 minutes.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href="https://wa.me/918296950339" className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Chat on WhatsApp</a>
          <Link to="/contact" className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">Book Online</Link>
        </div>
      </div>

      {others.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-bold">More {area.zone} Bangalore areas</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/areas/$slug"
                params={{ slug: o.slug }}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                📍 {o.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Highlight({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-2xl font-display font-bold text-primary">{v}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}