import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  buildConnectUrl,
  cookie,
  exchangeCode,
  getOAuthCreds,
  parseCookies,
  RT_COOKIE,
  STATE_COOKIE,
} from "./lib/gsc-oauth.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

const CANON_HOST = "ridencare.co.in";

/**
 * Canonical path redirects (Batch 4, AEO consolidation):
 * /answers/how-often-car-service (Part 8B) duplicated the intent of
 * /answers/car-service-interval (Batch 3). One intent, one URL: the older
 * page is 301'd to the newer, richer one so link equity and any indexed
 * history consolidate instead of splitting. Server-level so the redirect
 * exists for every request path, exactly like the host redirects above.
 */
const CANONICAL_PATHS: Record<string, string> = {
  "/answers/how-often-car-service": "/answers/car-service-interval",
};

function canonicalPathRedirect(pathname: string): Response | undefined {
  const target = CANONICAL_PATHS[pathname];
  if (!target) return undefined;
  return new Response(null, {
    status: 301,
    headers: { Location: `https://${CANON_HOST}${target}` },
  });
}

/**
 * Canonical-host redirects (Batch 1, SEO plan task 6):
 *   https://www.ridencare.co.in/*  → https://ridencare.co.in/*   (301)
 *   http://ridencare.co.in/*       → https://ridencare.co.in/*   (301)
 * Path + query preserved. The workers.dev origin and preview hosts are NOT
 * redirected (they never served as the canonical host; Cloudflare routes only
 * the custom domain to this Worker, and curl-level inspection confirmed no
 * normalization existed anywhere before this change — audit issue C4).
 */
function canonicalHostRedirect(url: URL): Response | undefined {
  if (url.hostname !== CANON_HOST && url.hostname !== `www.${CANON_HOST}`) return undefined;
  if (url.protocol === "https:" && url.hostname === CANON_HOST) return undefined;
  const target = new URL(url.toString());
  target.protocol = "https:";
  target.hostname = CANON_HOST;
  return new Response(null, {
    status: 301,
    headers: { Location: target.toString() },
  });
}

// Security headers (Batch 1, SEO plan task 5; Part 2 adds CSP/Permissions-Policy).
// None of these existed upstream (verified live via curl before the original
// change — audit issue C3), and Cloudflare does not add them for Workers
// responses, so the application layer is the right place. HSTS is served only
// on https responses (a plain-http HSTS header is ignored anyway, and http://
// here is 301-redirected above).
// X-Frame-Options: DENY is safe: the site embeds Google Maps INSIDE its own
// pages (framing others), it is not framed by third parties, and XFO does not
// affect outbound iframes, GA4 beacons or wa.me links.
//
// Content-Security-Policy (SEOmator Part 2, Oct 2026; Trustindex entries
// removed 2026-10-04 when the expired reviews widget was replaced by the
// native ExperienceSection) — evidence-based allowlist from
// scripts/csp-inventory.mjs (homepage incl. booking modal, /map Google Maps
// embed, /contact):
//   script:  self, inline (SSR JSON-LD + gtag config + click-tracking snippet),
//            googletagmanager (GA4),
//            static.cloudflareinsights.com (Cloudflare Web Analytics beacon)
//   style:   self, inline (framework-injected style tags) — fonts are
//            self-hosted from /fonts/* (styles.css @font-face), so no
//            fonts.googleapis.com entry is needed
//   font:    self (self-hosted woff2)
//   img:     self, data:, Google Maps tile hosts
//   connect: self (server fns), GA4 collection endpoints,
//            Google Places (reviews server fn is same-origin; kept for the
//            client Places path), Supabase (client auth on /auth)
//   frame:   www.google.com (Maps embed)
// Deployed as Report-Only with console verification (docs/seo/33). The CSP
// monitoring round (docs/seo/34) added report-uri/report-to collection via the
// same-origin /csp-report collector below, so the monitoring period produces
// real violation data instead of relying on browser consoles. Enforcement
// flip is an owner decision gated on a clean review of collected reports.
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com",
  "connect-src 'self' https://www.googletagmanager.com https://analytics.google.com https://stats.g.doubleclick.net https://places.googleapis.com https://*.supabase.co",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "report-uri https://ridencare.co.in/csp-report",
  "report-to csp-endpoint",
].join("; ");

function withSecurityHeaders(response: Response, requestUrl: URL): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // No camera/mic/geolocation/payment/USB use anywhere in the app; FLoC opt-out.
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()");
  if (requestUrl.protocol === "https:") {
    headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
    // Report-Only monitoring period (CSP round, docs/seo/34): violations are
    // collected by the same-origin /csp-report collector (visible via
    // `wrangler tail`) instead of only surfacing in the browser console.
    // Enforcement flip is an owner decision gated on a clean review of the
    // collected reports; HSTS preload stays off for the same reason (owner
    // submission required).
    headers.set("Reporting-Endpoints", `csp-endpoint="https://${CANON_HOST}/csp-report"`);
    headers.set("Content-Security-Policy-Report-Only", CSP_DIRECTIVES);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Every HTML page is rendered per-request. Browser-facing directive forces
// revalidation (no stale page ever comes from a browser cache); CDN-facing
// directives allow a short 60 s edge TTL with stale-while-revalidate so a
// cache rule CAN be enabled later without long staleness windows.
// scripts/purge-cache.mjs purges the Cloudflare zone right after every deploy
// (wired into the "deploy" script), so a fresh fetch after a deploy always
// sees the newest build. Static assets keep their immutable _headers policy.
// NOTE: while the purge token is unavailable, the 60 s edge TTL is the safety
// net — do not raise it until scripts/purge-cache.mjs succeeds reliably.
function withHtmlCachePolicy(response: Response): Response {
  if (!response.headers.get("content-type")?.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=300");
  headers.set("CDN-Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * CSP violation report collector (CSP monitoring round, Oct 2026 — docs/seo/34).
 * The Report-Only policy carries report-uri/report-to pointing here, so real
 * browsers POST their would-be violations for review during the monitoring
 * period. Evidence-only: nothing is blocked or changed by a report, nothing is
 * persisted (log lines are visible via `wrangler tail`), and the response is
 * always 204 so the endpoint is worthless to bots. GET returns 405; bodies are
 * capped and summarized into one log line per report.
 */
async function cspReportResponse(request: Request): Promise<Response | undefined> {
  if (new URL(request.url).pathname !== "/csp-report") return undefined;
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/csp-report") || contentType.includes("application/reports+json")) {
      const declared = Number(request.headers.get("content-length") ?? "0");
      if (Number.isFinite(declared) && declared > 65536) {
        return new Response(null, { status: 413 });
      }
      const raw = (await request.text()).slice(0, 65536);
      let reports: Record<string, unknown>[] = [];
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Reporting API (report-to) envelope: [{ type: "csp-violation", body: {...} }]
          reports = (parsed as { type?: string; body?: Record<string, unknown> }[])
            .filter((r) => r?.type === "csp-violation" && r.body)
            .map((r) => r.body as Record<string, unknown>);
        } else if (parsed && typeof parsed === "object" && "csp-report" in parsed) {
          // Legacy report-uri envelope: { "csp-report": {...} }
          const inner = (parsed as { "csp-report"?: Record<string, unknown> })["csp-report"];
          if (inner) reports = [inner];
        }
      } catch {
        // Malformed JSON — fall through with an empty summary.
      }
      const summary = reports.length
        ? JSON.stringify(
            reports.map((r) => ({
              doc: r["document-uri"],
              directive: r["effective-directive"] ?? r["violated-directive"],
              blocked: r["blocked-uri"],
              source: r["source-file"] ? `${String(r["source-file"])}:${String(r["line-number"] ?? "?")}` : undefined,
              disposition: r["disposition"],
            })),
          ).slice(0, 2048)
        : `unparsed(${raw.slice(0, 256)})`;
      console.log(`[csp-report] ${summary}`);
    }
  } catch {
    // Reporting is best-effort; never let a malformed report surface an error.
  }
  return new Response(null, { status: 204 });
}

/**
 * Google Search Console OAuth endpoints (read-only webmasters.readonly flow):
 *   GET /gsc/connect         → 302 to Google consent (sets CSRF state cookie)
 *   GET /gsc/oauth-callback  → code exchange, sets HttpOnly refresh-token cookie, 302 back to /seo-monitor
 *   GET /gsc/disconnect      → clears the refresh-token cookie, 302 back
 * Only these three paths are intercepted; every other request falls through to
 * the app. Tokens never appear in URLs, logs, or client JavaScript — only in
 * HttpOnly cookies and the server-side in-memory access-token cache.
 */
async function gscOAuthResponse(request: Request, requestUrl: URL): Promise<Response | undefined> {
  const path = requestUrl.pathname;
  if (path !== "/gsc/connect" && path !== "/gsc/oauth-callback" && path !== "/gsc/disconnect") return undefined;
  const toSeoMonitor = (params: string) => new Response(null, {
    status: 302,
    headers: { Location: `/seo-monitor${params}` },
  });
  if (request.method !== "GET") return new Response(null, { status: 405, headers: { Allow: "GET" } });

  const secure = requestUrl.protocol === "https:";
  const origin = `${requestUrl.protocol}//${requestUrl.host}`;
  const redirectUri = `${origin}/gsc/oauth-callback`;

  if (path === "/gsc/disconnect") {
    const res = toSeoMonitor("?gsc=disconnected");
    res.headers.append("Set-Cookie", cookie(RT_COOKIE, "", { maxAge: 0, secure, clear: true }));
    return res;
  }

  if (path === "/gsc/connect") {
    if (!getOAuthCreds()) return toSeoMonitor("?gsc=not_configured");
    const state = crypto.randomUUID();
    const url = buildConnectUrl(redirectUri, state);
    if (!url) return toSeoMonitor("?gsc=not_configured");
    const res = new Response(null, { status: 302, headers: { Location: url } });
    res.headers.append("Set-Cookie", cookie(STATE_COOKIE, state, { maxAge: 600, secure }));
    return res;
  }

  // /gsc/oauth-callback
  const oauthError = requestUrl.searchParams.get("error");
  if (oauthError) {
    console.error(`[gsc-oauth] consent returned error: ${oauthError.slice(0, 80)}`);
    return toSeoMonitor(`?gsc=error&reason=${encodeURIComponent(oauthError.slice(0, 60))}`);
  }
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const cookies = parseCookies(request.headers.get("cookie"));
  if (!code || !state || cookies[STATE_COOKIE] !== state) {
    return toSeoMonitor("?gsc=error&reason=state_mismatch");
  }
  try {
    const tokens = await exchangeCode(code, redirectUri);
    if (!tokens.refreshToken) {
      // Should not happen with prompt=consent, but without it no durable connection.
      console.error("[gsc-oauth] no refresh_token returned");
      return toSeoMonitor("?gsc=error&reason=no_refresh_token");
    }
    const res = toSeoMonitor("?gsc=connected");
    res.headers.append("Set-Cookie", cookie(RT_COOKIE, tokens.refreshToken, { maxAge: 10 * 365 * 24 * 3600, secure }));
    res.headers.append("Set-Cookie", cookie(STATE_COOKIE, "", { maxAge: 0, secure, clear: true }));
    return res;
  } catch {
    return toSeoMonitor("?gsc=error&reason=exchange_failed");
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const requestUrl = new URL(request.url);
      const cspReport = await cspReportResponse(request);
      if (cspReport) return withSecurityHeaders(cspReport, requestUrl);
      const gscOAuth = await gscOAuthResponse(request, requestUrl);
      if (gscOAuth) return withSecurityHeaders(gscOAuth, requestUrl);
      const redirect = canonicalHostRedirect(requestUrl) ?? canonicalPathRedirect(requestUrl.pathname);
      if (redirect) return withSecurityHeaders(redirect, requestUrl);

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(
        withHtmlCachePolicy(await normalizeCatastrophicSsrResponse(response)),
        requestUrl,
      );
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
