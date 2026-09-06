import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { dbListPosts } from "@/lib/blog.db";
import { AREAS, PRIORITY_AREAS } from "@/lib/areas";
import { SERVICES, LOCAL_SERVICES } from "@/lib/services";
import { SITE_URL } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";

const BASE_URL = SITE_URL;

type Entry = { path: string; priority: string; changefreq: string; lastmod?: string };

const staticEntries: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/bikes", priority: "0.9", changefreq: "monthly" },
  { path: "/cars", priority: "0.9", changefreq: "monthly" },
  { path: "/pricing", priority: "0.8", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "yearly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/faq", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
  { path: "/areas", priority: "0.8", changefreq: "monthly" },
  { path: "/map", priority: "0.7", changefreq: "monthly" },
  { path: "/answers", priority: "0.9", changefreq: "monthly" },
  { path: "/guides", priority: "0.8", changefreq: "monthly" },
  ...GUIDES.map((g) => ({
    path: `/guides/${g.slug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: g.published,
  })),
  ...SERVICES.map((s) => ({ path: `/${s.slug}`, priority: "0.9", changefreq: "monthly" })),
  ...LOCAL_SERVICES.flatMap((s) =>
    PRIORITY_AREAS.map((a) => ({ path: `/${s.slug}/${a.slug}`, priority: "0.7", changefreq: "monthly" })),
  ),
  ...AREAS.map((a) => ({ path: `/areas/${a.slug}`, priority: "0.7", changefreq: "monthly" })),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await dbListPosts({ limit: 500 });
        const entries: Entry[] = [
          ...staticEntries,
          ...posts.map((p) => ({
            path: `/blog/${p.slug}`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: p.date,
          })),
        ];
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ""}    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
