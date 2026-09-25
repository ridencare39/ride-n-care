import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/blog";
import { listPublishedPosts } from "@/lib/blog.functions";
import { SITE_URL } from "@/lib/seo";
import { pageHead, formatDate } from "@/lib/head";

export const Route = createFileRoute("/blog/")({
  loader: async () => await listPublishedPosts(),
  head: ({ loaderData }) => ({
    ...pageHead({
      title: "Blog — Ride N Care | Bike & Car Care Tips",
      description:
        "Expert tips on bike and car maintenance, doorstep service guides, and Bangalore-specific car care advice from Ride N Care mechanics.",
      path: "/blog",
      extraMeta: [
      { property: "og:title", content: "Ride N Care Blog — Bike & Car Care Tips" },
      { property: "og:description", content: "Maintenance tips, doorstep service guides, and Bangalore car-care advice." },
    ],
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Ride N Care Blog",
          description: "Bike and car maintenance tips from Ride N Care mechanics — service schedules, monsoon care, breakdowns and fuel economy, written for Bangalore roads.",
          blogPost: (loaderData?.posts ?? []).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            datePublished: p.date,
            author: { "@id": `${SITE_URL}/#organization` },
            publisher: { "@id": `${SITE_URL}/#organization` },
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
              <span>{formatDate(p.date)}</span>
              <span>{p.readMins} min read</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground">No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
}
