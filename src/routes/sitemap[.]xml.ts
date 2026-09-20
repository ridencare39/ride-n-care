import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { dbListPosts } from "@/lib/blog.db";
import { CONFIRMED_AREAS, PRIORITY_AREAS } from "@/lib/areas";
import { SERVICES, LOCAL_SERVICES } from "@/lib/services";
import { CAR_SERVICES } from "@/lib/car-services";
import { SITE_URL } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";
import { ANSWER_PAGES } from "@/lib/answer-pages";

const BASE_URL = SITE_URL;

/**
 * Real content-modification dates (git last-commit dates of the underlying
 * data/route files), not build time. Update when the underlying content changes.
 */
const LASTMOD = {
  core: "2026-09-18",
  services: "2026-09-18",
  carServices: "2026-09-19",
  areas: "2026-09-20",
  guides: "2026-09-18",
  answers: "2026-09-20",
} as const;

type Entry = { path: string; priority: string; changefreq: string; lastmod?: string };

const staticEntries: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly", lastmod: LASTMOD.core },
  { path: "/bikes", priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.core },
  { path: "/cars", priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.carServices },
  { path: "/about", priority: "0.6", changefreq: "yearly", lastmod: LASTMOD.core },
  { path: "/blog", priority: "0.8", changefreq: "weekly", lastmod: LASTMOD.core },
  { path: "/faq", priority: "0.7", changefreq: "monthly", lastmod: LASTMOD.core },
  { path: "/contact", priority: "0.8", changefreq: "yearly", lastmod: LASTMOD.core },
  { path: "/franchise", priority: "0.7", changefreq: "monthly", lastmod: "2026-09-18" },
  { path: "/areas", priority: "0.8", changefreq: "monthly", lastmod: LASTMOD.areas },
  { path: "/map", priority: "0.5", changefreq: "monthly", lastmod: LASTMOD.areas },
  { path: "/answers", priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.answers },
  ...ANSWER_PAGES.map((p) => ({
    path: `/answers/${p.slug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: p.updated,
  })),
  { path: "/guides", priority: "0.8", changefreq: "monthly", lastmod: LASTMOD.guides },
  ...GUIDES.map((g) => ({
    path: `/guides/${g.slug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: g.published,
  })),
  ...SERVICES.map((s) => ({ path: `/${s.slug}`, priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.services })),
  ...CAR_SERVICES.map((s) => ({ path: `/${s.slug}`, priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.carServices })),
  ...LOCAL_SERVICES.flatMap((s) =>
    PRIORITY_AREAS.filter((a) => a.confirmed !== false).map((a) => ({
      path: `/${s.slug}/${a.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: LASTMOD.services,
    })),
  ),
  ...CONFIRMED_AREAS.map((a) => ({ path: `/areas/${a.slug}`, priority: "0.7", changefreq: "monthly", lastmod: LASTMOD.areas })),
];

function urlset(entries: Entry[]) {
  return entries
    .map((e) => {
      const loc = `${BASE_URL}${e.path}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
}

function xmlResponse(body: string) {
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" },
  });
}

/** Sitemap index: static pages, service×area pages and content, split by size. */
function sitemapIndex() {
  const maps = [
    { path: "/sitemap-static.xml", lastmod: LASTMOD.core },
    { path: "/sitemap-service-areas.xml", lastmod: LASTMOD.services },
    { path: "/sitemap-content.xml", lastmod: LASTMOD.guides },
  ];
  return xmlResponse(
    [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...maps.map(
        (m) => `  <sitemap>\n    <loc>${BASE_URL}${m.path}</loc>\n    <lastmod>${m.lastmod}</lastmod>\n  </sitemap>`,
      ),
      `</sitemapindex>`,
    ].join("\n"),
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await dbListPosts({ limit: 500 });
        const contentEntries: Entry[] = [
          ...GUIDES.map((g) => ({
            path: `/guides/${g.slug}`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: g.published,
          })),
          ...posts.map((p) => ({
            path: `/blog/${p.slug}`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: p.date,
          })),
        ];
        // Single-segment pages only (hub pages + top-level service pages).
        const staticOnly = staticEntries.filter((e) => e.path.split("/").filter(Boolean).length === 1);
        // Service × area pages: exactly two segments, excluding /areas/, /guides/ and /answers/ (listed separately).
        const serviceAreaEntries = staticEntries.filter((e) => {
          const parts = e.path.split("/").filter(Boolean);
          return parts.length === 2 && !e.path.startsWith("/areas/") && !e.path.startsWith("/guides/") && !e.path.startsWith("/answers/");
        });
        const areaEntries = staticEntries.filter((e) => e.path.startsWith("/areas/"));
        const answerEntries = staticEntries.filter((e) => e.path.startsWith("/answers/"));

        if (posts.length > 300) {
          // Large sites get an index; smaller ones keep the single flat file crawlers love.
          return sitemapIndex();
        }

        const all = [...staticOnly, ...serviceAreaEntries, ...areaEntries, ...answerEntries, ...contentEntries];
        return xmlResponse(
          [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
            urlset(all),
            `</urlset>`,
          ].join("\n"),
        );
      },
    },
  },
});
