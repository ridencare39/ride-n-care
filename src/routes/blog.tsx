import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/lib/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Ride N Care | Bike & Car Care Tips" },
      { name: "description", content: "Expert tips on bike and car maintenance, doorstep service guides, and Bangalore-specific car care advice from Ride N Care mechanics." },
      { property: "og:title", content: "Ride N Care Blog — Bike & Car Care Tips" },
      { property: "og:description", content: "Maintenance tips, doorstep service guides, and Bangalore car-care advice." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Ride N Care Blog",
          description: "Bike and car maintenance tips by Ride N Care mechanics.",
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            datePublished: p.date,
            author: { "@type": "Organization", name: "Ride N Care" },
            url: `/blog/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Care Journal</span>
      <h1 className="mt-2 text-5xl font-bold">The Ride N Care Blog</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">Expert maintenance tips, real-world repair stories, and Bangalore-specific car care from our doorstep mechanics.</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group rounded-3xl border border-border bg-card p-6 hover:border-primary transition"
          >
            <div className="flex flex-wrap gap-2 text-xs">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{t}</span>
              ))}
            </div>
            <h2 className="mt-3 text-xl font-bold group-hover:text-primary transition">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(p.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
              <span>{p.readMins} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}