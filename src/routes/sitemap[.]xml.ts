import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { dbListPosts } from "@/lib/blog.db";
import { AREAS, PRIORITY_AREAS, isAreaIndexed } from "@/lib/areas";
import { SERVICES, LOCAL_SERVICES } from "@/lib/services";
import { CAR_SERVICES } from "@/lib/car-services";
import { CAR_AREA_WAVE_1 } from "@/lib/car-area-content";
import { BRAND_SERVICES } from "@/lib/brand-services";
import { SITE_URL } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";
import { PHOTOS, PHOTO_CAPTIONS, type PhotoKey } from "@/lib/photos";
import { ANSWER_PAGES } from "@/lib/answer-pages";

const BASE_URL = SITE_URL;

/**
 * Real content-modification dates (git last-commit dates of the underlying
 * data/route files), not build time. Update when the underlying content changes.
 */
const LASTMOD = {
  core: "2026-09-18",
  breakdown: "2026-09-20",
  services: "2026-09-18",
  carServices: "2026-09-19",
  areas: "2026-10-05",
  guides: "2026-09-18",
  answers: "2026-09-27",
  carAreas: "2026-09-27",
  brands: "2026-09-27",
  ev: "2026-09-27",
} as const;

type Entry = { path: string; priority: string; changefreq: string; lastmod?: string };

const staticEntries: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly", lastmod: LASTMOD.core },
  { path: "/bikes", priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.core },
  { path: "/cars", priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.carServices },
  { path: "/about", priority: "0.6", changefreq: "yearly", lastmod: LASTMOD.core },
  { path: "/blog", priority: "0.8", changefreq: "weekly", lastmod: LASTMOD.core },
  { path: "/faq", priority: "0.7", changefreq: "monthly", lastmod: LASTMOD.core },
  { path: "/guarantee", priority: "0.7", changefreq: "monthly", lastmod: "2026-10-02" },
  { path: "/contact", priority: "0.8", changefreq: "yearly", lastmod: LASTMOD.core },
  { path: "/franchise", priority: "0.7", changefreq: "monthly", lastmod: "2026-09-18" },
  { path: "/breakdown-assistance", priority: "0.9", changefreq: "monthly", lastmod: LASTMOD.breakdown },
  { path: "/car-breakdown-assistance", priority: "0.8", changefreq: "monthly", lastmod: LASTMOD.breakdown },
  { path: "/areas", priority: "0.8", changefreq: "monthly", lastmod: LASTMOD.areas },
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
  // Batch 3: bike brand pages + dedicated EV page (top-level, one segment).
  ...BRAND_SERVICES.map((b) => ({ path: `/${b.slug}`, priority: "0.8", changefreq: "monthly", lastmod: b.reviewed })),
  { path: "/ev-two-wheeler-service", priority: "0.8", changefreq: "monthly", lastmod: LASTMOD.ev },
  // Batch 3 wave-1 car×area pairs (4 services × 5 areas, gated registry).
  ...CAR_AREA_WAVE_1.map((e) => ({
    path: `/${e.serviceSlug}/${e.areaSlug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: LASTMOD.carAreas,
  })),
  ...LOCAL_SERVICES.flatMap((s) =>
    PRIORITY_AREAS.filter((a) => a.confirmed !== false).map((a) => ({
      path: `/${s.slug}/${a.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: LASTMOD.services,
    })),
  ),
  // Sitemap lists ONLY indexable area pages (confirmed coverage + priority
  // content). Basic-tier areas stay noindex,follow — listing them here would
  // contradict the meta robots and log them as "Excluded by noindex".
  ...AREAS.filter(isAreaIndexed).map((a) => ({ path: `/areas/${a.slug}`, priority: "0.7", changefreq: "monthly", lastmod: LASTMOD.areas })),
];

/**
 * Image sitemap entries (Google sitemap-image extension) for the owner photos
 * that are actually rendered on indexable pages. Discovery otherwise happens
 * through the on-page <img srcset> markup; these entries just make the mapping
 * explicit for crawlers. One entry per photo — no image is claimed twice.
 */
const PHOTOS_BY_PATH: Partial<Record<string, PhotoKey[]>> = {
  "/": ["doorstepApartment", "toolsTray"],
  "/bike-service": ["reAtHome"],
  "/bike-repair": ["workshopRepair"],
  "/doorstep-bike-service": ["doorstepRe"],
  "/scooter-service": ["scooterRepair"],
  "/about": ["workshopSignage"],
};

function imageBlock(key: PhotoKey) {
  const p = PHOTOS[key];
  return [
    "    <image:image>",
    `      <image:loc>${SITE_URL}${p.src}</image:loc>`,
    `      <image:title>${p.alt}</image:title>`,
    `      <image:caption>${PHOTO_CAPTIONS[key]}</image:caption>`,
    "    </image:image>",
  ].join("\n");
}

function urlset(entries: Entry[]) {
  return entries
    .map((e) => {
      const loc = `${BASE_URL}${e.path}`;
      const images = PHOTOS_BY_PATH[e.path]?.map(imageBlock) ?? [];
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        ...images,
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
        // "<= 1" (not "=== 1"): "/" splits to zero segments, so the homepage
        // must ride the same filter or it silently drops out of the sitemap.
        const staticOnly = staticEntries.filter((e) => e.path.split("/").filter(Boolean).length <= 1);
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
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
            urlset(all),
            `</urlset>`,
          ].join("\n"),
        );
      },
    },
  },
});
