# CSP Security Monitoring + Technical SEO Protection

Date: 2026-10-02 · Site: https://ridencare.co.in · Worker: `ridencare39-ride-n-care`
Deploy: Worker version **325fe949-d6e0-4f93-b9dc-36e9cba88c46** (baseline for this round: 6e50e119-c304-4769-b3da-119e7ac2283e)

## Scope

Monitoring round for the Report-Only Content-Security-Policy. **CSP was NOT switched to enforcing.** No HSTS preload changes. Everything shipped in Parts 1–2 verified intact.

## 1. CSP audit findings

- `src/server.ts` holds the full policy (`CSP_DIRECTIVES`) applied by `withSecurityHeaders` on https responses only; static assets carry nosniff/XFO/Referrer-Policy via `public/_headers` and intentionally no CSP (document-level policy is what matters).
- The allowlist remains the evidence-based one from `scripts/csp-inventory.mjs` (GA4/googletagmanager, Trustindex CDN, Cloudflare Insights beacon, Google Fonts via Trustindex CSS, lh3.googleusercontent review avatars, Google Maps hosts, `www.google.com` frame, `*.supabase.co` connect, places.googleapis).
- **Before this round no violation reporting existed**: no `report-uri`, no `report-to`, no `Reporting-Endpoints` header anywhere — so no server-side violation reports were ever collectable. Prior "clean" evidence was console-only.

### Change shipped (monitoring enablement, not enforcement)

- `CSP_DIRECTIVES` += `report-uri https://ridencare.co.in/csp-report; report-to csp-endpoint` (still under `Content-Security-Policy-Report-Only`; nothing blocks, nothing weakens — no wildcard, no unsafe-eval, no directive relaxation).
- `Reporting-Endpoints: csp-endpoint="https://ridencare.co.in/csp-report"` added alongside HSTS/Permissions-Policy.
- New same-origin collector in `server.ts` (`cspReportResponse`): POST-only (GET → 405 + `Allow: POST`), accepts `application/csp-report` (legacy report-uri) and `application/reports+json` (Reporting API), content-length cap 64 KB → 413, parses both envelopes into one compact `[csp-report]` log line, always answers 204 (worthless endpoint for bots, best-effort error handling). Nothing is persisted server-side; log lines are readable with `wrangler tail ridencare39-ride-n-care`.
- `scripts/test-csp-console.mjs` added: reusable console-violation sweep (desktop/mobile viewports, booking-flow interaction, exit 1 on any CSP violation).

## 2. CSP violations found

- **Genuine violations on real pages: zero** — 23 page loads across 17 route loads + 3 booking-modal interactions (desktop 1280×900, mobile 390×844, extension-free Chromium): 0 CSP console violations, 0 page errors. GA4 beacons fired (`analytics.google.com/g/collect` seen in-flight on every page); booking modal opened and exercised (Supabase/server-fn calls all allowed).
- **Deliberate control violation (verification probe)**: injecting `violation-probe.example` image on `/` produced exactly one client-side Report-Only console line for `img-src` — the policy detects unknown origins as designed; the synthetic POST was received, parsed and logged by the collector end-to-end (verified live via `wrangler tail`).
- **Organic report POSTs: none observed** during ~6 minutes of `wrangler tail` sampling (windows saw zero-to-only-probe worker invocations; a 100 s window had 0 requests — quiet period, and edge-cached HTML does not invoke the worker, though report POSTs always do). This is a data-volume statement, not a clean-policy claim; the clean-policy evidence is the 23-load sweep.

## 3. Classification of possible report sources

1. **Genuine violations**: none observed; if they appear during monitoring they will name the exact directive/URI in the `[csp-report]` log line and get a precise origin added (never a wildcard).
2. **Required third-party resources**: the inventory list above — all present in the allowlist, all exercised in the sweep without a violation.
3. **Browser-extension noise**: invisible in the stock-Chromium sweep by construction; expected in future report data as `source-file: chrome-extension://…`/`moz-extension://…` or unknown script hosts — filter, do not chase.
4. **Bot/irrelevant**: `/csp-report` will collect junk POSTs from bots; they arrive as `unparsed(...)` log lines or non-report content types and are discarded with 204. Filter on parse success.
5. **False positives**: SEO scanners flagging "CSP not enforced" — by design during a Report-Only monitoring period; `net::ERR_ABORTED` on GA `g/collect` in test runs is a teardown artifact of short-lived test contexts, not a site issue; the Radix `aria-describedby` DialogContent warning on booking-modal open is a pre-existing benign console nit (no axe impact), noted for a future minor a11y polish.

## 4. Security-header status (verified live post-deploy)

| Header | Status |
| --- | --- |
| `content-security-policy-report-only` | Present, unchanged directives + new `report-uri`/`report-to`; **not enforcing** |
| `reporting-endpoints` | `csp-endpoint="https://ridencare.co.in/csp-report"` |
| `strict-transport-security` | `max-age=15552000; includeSubDomains` — unchanged; **no preload**, nothing submitted |
| `permissions-policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` — unchanged |
| HTTPS / X-Content-Type-Options / Referrer-Policy / X-Frame-Options | Unchanged (nosniff, strict-origin-when-cross-origin, DENY) |

## 5. Routes tested

Desktop sweep: `/`, `/cars`, `/bike-service`, `/doorstep-bike-service`, `/ev-two-wheeler-service`, `/royal-enfield-service`, `/car-periodic-service`, `/car-brake-service`, `/breakdown-assistance`, `/contact`, `/map`, `/answers/car-service-cost-bangalore`, `/areas/koramangala`, `/blog/doorstep-vs-garage-service`, `/guarantee` + booking modal on `/` and `/bike-service`. Mobile: `/`, `/bike-service`, `/doorstep-bike-service`, `/contact`, `/map` + booking modal on `/`. All 15 sitemap-checked routes confirmed in-sitemap (except `/map`, `/guarantee` — utility pages intentionally out, both 200).

## 6. Test results

- TypeScript: clean (`tsc -b --noEmit`).
- Production build: completed (`[make-dist] wrote dist/index.html`); prior OOM recovered with the documented recipe.
- Regression suites vs production: hero-cta 18/18, book-now-yellow 16/16 (booking flow), brand-totals 8/8, trustindex-live 12/12, reviews-cleanup 15/15 — **69/69 pre-deploy and 69/69 post-deploy**; data-sync PASS.
- Accessibility (axe, 5 pages): no violations; skip link + reduced-motion intact.
- Sitemap: 229 URLs, spot checks 200 (`/`, `/motorcycle-service/hsr-layout`, `/blog/doorstep-vs-garage-service`).
- Schema: 66 pages / 125 blocks / 125 parsed OK / 0 errors, 0 warnings.
- GA4: `G-EQ8P35TH54` present.
- `/csp-report` behavior: GET 405, valid POST 204 + parsed log, junk POST 204, oversized 413-by-policy.
- End-to-end: synthetic report observed in `wrangler tail`; real-Chromium control violation detected client-side (console) — headless Chromium did not perform the background report upload within the test window (known short-lived-session limitation; delivery from real user browsers is expected and will be confirmed from organic data during the monitoring period).

## 7. Deployment

Worker version **325fe949-d6e0-4f93-b9dc-36e9cba88c46** (deploy-5). Purge-cache 401 expected (token unavailable, as documented in Part 1); post-deploy cache-freshness confirmed by header diff. Client bundle unchanged (server.ts-only change).

## 8. Remaining CSP/security work

1. **Monitoring period**: sample `wrangler tail ridencare39-ride-n-care` for `[csp-report]` lines periodically (weekly is sufficient); classify per §3 before any change.
2. **Enforcement flip**: owner approval required — change `Content-Security-Policy-Report-Only` → `Content-Security-Policy` in `src/server.ts` only after a clean report review (policy is already console-verified on every key route; risk is low).
3. **HSTS preload**: unchanged by decision; owner submission to hstspreload.org required first.
4. **Optional upgrades**: report persistence (today's logs are tail-only) — either a Supabase table or a managed reporting service; only worth it if the monitoring period produces meaningful volume.
5. Minor polish backlog: Radix Dialog `aria-describedby` warning in the booking modal.
