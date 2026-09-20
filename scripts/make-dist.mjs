// Emits dist/ with a lightweight redirect page to the live SSR deployment.
// Freebuff's managed hosting serves static dist/ output; real production is the
// Cloudflare Worker (bun run deploy). This keeps the static pipeline green and
// gives visitors a graceful handoff instead of a build error.
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const target =
  process.env.PUBLIC_LANDING_REDIRECT_URL ||
  "https://ridencare39-ride-n-care.ridenrepair399.workers.dev";

const distDir = resolve("dist");
rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ride N Care — Doorstep Bike &amp; Car Service in Bangalore</title>
    <meta name="description" content="Ride N Care: doorstep two-wheeler and car service in Bangalore. Care in every mile." />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <style>
      body { font: 16px/1.6 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; }
      a { color: #0b7285; font-weight: 600; }
    </style>
  </head>
  <body>
    <div style="text-align:center; padding: 2rem;">
      <h1>Ride N Care</h1>
      <p>Taking you to our full site…</p>
      <p><a href="${target}" rel="noopener">Continue to ridencare →</a></p>
    </div>
  </body>
</html>
`;

writeFileSync(resolve(distDir, "index.html"), html);
console.log(`[make-dist] wrote dist/index.html → ${target}`);
