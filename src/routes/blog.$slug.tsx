import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { type Post } from "@/lib/blog";
import { getPublishedPost } from "@/lib/blog.functions";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import { faqsForPostCategory } from "@/lib/service-faqs";
import { AREAS } from "@/lib/areas";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { post, related } = await getPublishedPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post, related };
  },

  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Post not found" }] };
    const suffixed = `${p.title} | Ride N Care`;
    const title = suffixed.length <= 60 ? suffixed : p.title.length <= 60 ? p.title : `${p.title.slice(0, 57)}...`;
    const desc = p.excerpt.length > 160 ? `${p.excerpt.slice(0, 157)}...` : p.excerpt;
    const faqs = faqsForPostCategory(p.category);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: p.tags.join(", ") },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${SITE_URL}/blog/${params.slug}` },
        { property: "og:image", content: OG_IMAGE },
        { property: "article:section", content: p.category },
        { property: "article:published_time", content: p.date },
        { property: "article:author", content: p.author },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/blog/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.date,
            dateModified: p.date,
            author: { "@type": "Organization", name: "Ride N Care" },
            publisher: {
              "@type": "Organization",
              name: "Ride N Care",
              logo: { "@type": "ImageObject", url: "/__l5e/assets-v1/760c4f79-dc2d-4a56-a959-0c73577c8f73/ride-n-care-logo.jpg" },
            },
            keywords: p.tags.join(", "),
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${params.slug}` },
            about: { "@id": `${SITE_URL}/#business` },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
              { "@type": "ListItem", position: 3, name: p.title, item: `/blog/${params.slug}` },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        },
      ],
    };
  },
  component: Post,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Post not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-primary">← Back to blog</Link>
    </div>
  ),
});

function Post() {
  const { post, related } = Route.useLoaderData() as { post: Post; related: Post[] };

  const faqs = faqsForPostCategory(post.category);
  const relatedAreas = AREAS.slice(0, 6);
  const serviceLink = post.category === "Car Care" ? "/cars" : "/bikes";
  const serviceLabel = post.category === "Car Care" ? "doorstep car service" : "doorstep bike service";
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/blog" className="hover:text-primary">← Blog</Link>
      </nav>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {post.tags.map((t) => (
          <span key={t} className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{t}</span>
        ))}
      </div>
      <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
      <div className="mt-4 text-sm text-muted-foreground">
        By {post.author} · {new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })} · {post.readMins} min read
      </div>
      <div className="mt-10 space-y-5 text-lg leading-relaxed text-foreground/90">
        {post.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Related services</h2>
        <p className="mt-2 text-muted-foreground">
          Ready to act on this? Book a{" "}
          <Link to={serviceLink} className="text-primary font-medium">{serviceLabel} in Bangalore</Link>
          {" "}or explore our{" "}
          <Link to="/pricing" className="text-primary font-medium">transparent pricing</Link>.
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <Link to="/bikes" className="rounded-2xl border border-border bg-card p-4 hover:border-primary">
            <div className="font-semibold">🏍 Doorstep Bike Service</div>
            <p className="mt-1 text-sm text-muted-foreground">All CCs — TVS, Royal Enfield, KTM, Harley and more.</p>
          </Link>
          <Link to="/cars" className="rounded-2xl border border-border bg-card p-4 hover:border-primary">
            <div className="font-semibold">🚗 Doorstep Car Service</div>
            <p className="mt-1 text-sm text-muted-foreground">Periodic, AC, brakes, battery and detailing at home.</p>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">We serve these Bangalore areas</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {relatedAreas.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              📍 {a.name}
            </Link>
          ))}
          <Link to="/areas" className="rounded-full bg-grad-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
            All areas →
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-border rounded-3xl border border-border bg-card">
          {faqs.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="cursor-pointer list-none flex justify-between items-center gap-4">
                <span className="font-semibold">{q}</span>
                <span className="text-primary text-2xl group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-16 rounded-2xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Need a service done?</h2>
        <p className="mt-2 text-primary-foreground/90">Book a doorstep visit in 60 seconds.</p>
        <Link to="/contact" className="mt-4 inline-block rounded-full bg-background px-6 py-3 font-semibold">Book Now</Link>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-bold">Keep reading</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="rounded-2xl border border-border bg-card p-5 hover:border-primary">
                <div className="font-semibold">{r.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}