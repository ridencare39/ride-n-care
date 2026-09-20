import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

// The standalone pricing page was retired. All package prices live inside the
// booking architecture (/bikes, /cars, service detail pages) — this route
// permanently redirects so old links never break.
export const Route = createFileRoute("/pricing")({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 301,
          headers: { Location: `${SITE_URL}/bikes` },
        }),
    },
  },
});
