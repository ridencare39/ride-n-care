import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GUIDES, getGuide } from "@/lib/guides";
import { getService } from "@/lib/services";
import { BRAND } from "@/lib/answers";
import { LOCAL_BUSINESS_JSONLD, OG_IMAGE, SITE_URL, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ params, loaderData }) => {
    const g = loaderData?.guide ?? GUIDES[0]!;
    const url = `${SITE_URL}/guides/${params.slug}`;
    return {
      meta: [
        { title: g.title },
        { name: "description", content: g.description },
        { property: "og:title", content: g.h1 },
        { property: "og:description", content: g.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
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
            "@type": "Article",
            "@id": `${url}#article`,
            headline: g.h1,
            description: g.description,
            abstract: g.summary,
            datePublished: g.published,
            dateModified: g.published,
            inLanguage: "en-IN",
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.name },
            publisher: { "@id": `${SITE_URL}/#organization` },
            about: { "@id": `${SITE_URL}/#business` },
            articleSection: "Two-wheeler maintenance",
            keywords: [
              "bike service Bangalore",
              "bike repair Bangalore",
              "doorstep bike service",
              "two wheeler maintenance",
            ],
          }),
        },
        { type: "application/ld+json", children: JSON.stringify(faqPageJsonLd(g.faqs, `${url}#faq`)) },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              ["Home", `${SITE_URL}/`],
              ["Guides", `${SITE_URL}/guides`],
              [g.h1, url],
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_JSONLD) },
      ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide: g } = Route.useLoaderData();
  const services = g.services.map((s) => getService(s)).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span>/</span>{" "}
        <Link to="/guides" className="hover:text-primary">Guides</Link> <span>/</span>{" "}
        <span className="text-foreground">{g.h1}</span>
      </nav>

      <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">{g.h1}</h1>
      <p className="mt-3 text-xs text-muted-foreground">
        {BRAND.name}, {BRAND.city} · updated {new Date(g.published).toLocaleDateString("en-IN", { year: "numeric", month: "long" })} · {g.readMinutes} min read
      </p>

      <p className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-base leading-relaxed">
        <strong className="text-foreground">In short: </strong>
        <span className="text-muted-foreground">{g.summary}</span>
      </p>

      {g.sections.map((s) => (
        <section key={s.h} className="mt-10">
          <h2 className="text-2xl font-bold">{s.h}</h2>
          {s.p?.map((para) => (
            <p key={para} className="mt-3 text-muted-foreground leading-relaxed">{para}</p>
          ))}
          {s.bullets ? (
            <ul className="mt-4 space-y-2 text-muted-foreground">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {s.table ? (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr>
                    {s.table.head.map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row) => (
                    <tr key={row.join("|")} className="border-t border-border">
                      {row.map((cell) => (
                        <td key={cell} className="px-4 py-3 text-muted-foreground align-top">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ))}

      <section className="mt-14">
        <h2 className="text-2xl font-bold">FAQs</h2>
        <div className="mt-4 divide-y divide-border rounded-3xl border border-border bg-card">
          {g.faqs.map(([q, a]) => (
            <div key={q} className="p-6">
              <h3 className="font-semibold">{q}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {services.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">Book the related service</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
            {services.map((s) => (
              <li key={s!.slug}>
                <Link to="/$service" params={{ service: s!.slug }} className="text-primary hover:underline">
                  {s!.name} in {BRAND.city}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Related guides</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {g.related.map((slug) => {
            const r = getGuide(slug);
            if (!r) return null;
            return (
              <li key={slug}>
                <Link to="/guides/$slug" params={{ slug }} className="text-primary hover:underline">{r.h1}</Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-14 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Want this done for you?</h2>
        <p className="mt-2 text-primary-foreground/90">
          {BRAND.name} services and repairs bikes and scooters at your doorstep in {BRAND.city}. {BRAND.tagline}.
        </p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a href={`tel:${BRAND.phonePrimary}`} className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Call {BRAND.phonePrimary}</a>
          <a href={`https://wa.me/${BRAND.whatsapp}`} className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">WhatsApp</a>
          <Link to="/answers" className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground">All answers</Link>
        </div>
      </div>
    </article>
  );
}
