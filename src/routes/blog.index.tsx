import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/blog";
import { listPublishedPosts } from "@/lib/blog.functions";
import { Newsletter } from "@/components/Newsletter";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  loader: async () => await listPublishedPosts(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Blog — Ride N Care | Bike & Car Care Tips" },
      { name: "description", content: "Expert tips on bike and car maintenance, doorstep service guides, and Bangalore-specific car care advice from Ride N Care mechanics." },
      { property: "og:title", content: "Ride N Care Blog — Bike & Car Care Tips" },
      { property: "og:description", content: "Maintenance tips, doorstep service guides, and Bangalore car-care advice." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ride N Care Blog — Bike & Car Care Tips" },
      { name: "twitter:description", content: "Maintenance tips, doorstep service guides, and Bangalore car-care advice." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Ride N Care Blog",
          description: "Bike and car maintenance tips by Ride N Care mechanics.",
          blogPost: (loaderData?.posts ?? []).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            datePublished: p.date,
            author: { "@type": "Organization", name: "Ride N Care" },
            url: `${SITE_URL}/blog/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: Blog,
  errorComponent: () => (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Couldn’t load the blog</h1>
      <p className="mt-2 text-muted-foreground">Please refresh in a moment.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">No posts yet</h1>
    </div>
  ),
});

function Blog() {
  const { posts } = Route.useLoaderData();
  const [cat, setCat] = useState<Category>("All");
  const filtered = useMemo(
    () => (cat === "All" ? posts : posts.filter((p) => p.category === cat)),
    [cat, posts],
  );
  const sitemapUrl = typeof window !== "undefined" ? `${window.location.origin}/sitemap.xml` : "/sitemap.xml";
  const gscUrl = `https://search.google.com/search-console/welcome?utm_source=ridencare`;
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Care Journal</span>
      <h1 className="mt-2 text-5xl font-bold">The Ride N Care Blog</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">Expert maintenance tips, real-world repair stories, and Bangalore-specific car care from our doorstep mechanics.</p>

      {/* Categories */}
      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
              cat === c
                ? "bg-grad-primary text-primary-foreground border-transparent shadow-glow"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group rounded-3xl border border-border bg-card p-6 hover:border-primary transition"
          >
            <div className="flex flex-wrap gap-2 text-xs items-center">
              <span className="rounded-full bg-accent/15 text-accent px-2 py-0.5 font-semibold">{p.category}</span>
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
        {filtered.length === 0 && (
          <p className="text-muted-foreground">No posts in this category yet.</p>
        )}
      </div>

      {/* Newsletter */}
      <div className="mt-16">
        <Newsletter />
      </div>

      {/* Submit to Google */}
      <div className="mt-12 rounded-3xl border border-border bg-card p-8">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">SEO</span>
        <h2 className="mt-2 text-2xl font-bold">Submit our posts to Google</h2>
        <p className="mt-2 text-muted-foreground">
          Our XML sitemap auto-includes every blog post with <code className="text-primary">lastmod</code> dates. To get new posts indexed faster, add the sitemap to Google Search Console & Bing Webmaster Tools.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={sitemapUrl} target="_blank" rel="noopener" className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
            View Sitemap
          </a>
          <a href={gscUrl} target="_blank" rel="noopener" className="rounded-full bg-grad-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            Open Google Search Console →
          </a>
          <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener" className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
            Bing Webmaster
          </a>
        </div>
      </div>
    </div>
  );
}
