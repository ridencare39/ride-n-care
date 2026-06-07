import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPost, posts } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Post not found" }] };
    return {
      meta: [
        { title: `${p.title} — Ride N Care` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { property: "article:published_time", content: p.date },
        { property: "article:author", content: p.author },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
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
            mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${params.slug}` },
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
  const { post } = Route.useLoaderData();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
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