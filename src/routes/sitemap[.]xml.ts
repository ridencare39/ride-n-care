import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/bikes", priority: "0.9", changefreq: "monthly" as const },
  { path: "/cars", priority: "0.9", changefreq: "monthly" as const },
  { path: "/pricing", priority: "0.8", changefreq: "monthly" as const },
  { path: "/about", priority: "0.6", changefreq: "yearly" as const },
  { path: "/faq", priority: "0.7", changefreq: "monthly" as const },
  { path: "/contact", priority: "0.8", changefreq: "yearly" as const },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
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