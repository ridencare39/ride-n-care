# GSC Query Review — Owner Workflow (Batch 3)

**Created 2026-09-27 (Batch 3). Status: NOT YET RUN — every data field below is empty until the owner pulls the export. No numbers on this page are estimates or placeholders that look like data; blanks stay blanks until real Search Console data fills them.**

This is the operating procedure for the weekly Search Console (GSC) review that the 90-day plan requires (Part 3 validation plan + Week 13 retrospective). It takes about 20 minutes per week and needs no tooling beyond the GSC UI and a spreadsheet.

## Why this exists

The 90-day plan's keyword map (03-keyword-map.csv) and cannibalisation rulings (03-keyword-url-map.md) make predictions about which URL should own which query. Only real GSC data can confirm or correct them. This review is where that happens — and where pages get promoted or demoted based on evidence instead of opinion.

## Step 1 — Pull the export (5 min)

1. Open [Google Search Console](https://search.google.com/search-console) → property **ridencare.co.in**.
2. Performance → Search results.
3. Set date range: **last 28 days** (compare mode: previous 28 days if you want trend).
4. Set **Search type: Web**. Optionally filter Query contains nothing; export all.
5. Export → **Download CSV** (or Google Sheets). Save as `gsc-YYYY-MM-DD.csv` in a private folder (do not commit raw exports — they are internal data).

## Step 2 — Fill the weekly table (10 min)

Copy the table below into your sheet and fill one row per reviewed query. Only fill rows for queries with real impressions; ignore zero-impression noise.

| Query | Landing page | Clicks | Impressions | CTR | Avg position | Expected URL (per keyword map) | Verdict | Action |
|---|---|---|---|---|---|---|---|---|
| *(fill from export)* | | | | | | | | |

**Verdict codes:** MATCH (landing = expected) · MISMATCH (GSC serves a different URL) · NEW (query not in the keyword map).

**Action codes:** none · watch (re-check next week) · merge (add internal links pointing queries to expected URL) · investigate (MISMATCH two weeks running).

## Step 3 — The 25 target queries

The plan's target list (01-baseline.md §target queries) is the priority set. Check each one weekly:

- Bike cluster: doorstep bike service bangalore · bike service at home · bike general service price · bike repair home visit · scooter service at home · bike battery replacement bangalore · jump start bike · bike breakdown service · royal enfield service at home · ktm service bangalore
- Car cluster: doorstep car service bangalore · car service at home · car periodic service · car ac service bangalore · car battery replacement · car brake service · pre purchase car inspection · car jump start
- Local cluster: bike service koramangala · bike service whitefield · bike service hsr layout · car service electronic city · bike service indiranagar
- Trust cluster: doorstep service safe · mechanic home visit

Fill per query after the first export:

| Query | First-seen position | Latest position | Trend | Owning URL | Notes |
|---|---|---|---|---|---|
| *(fill)* | | | | | |

## Step 4 — Promotion / demotion rules (from 03-keyword-url-map.md)

- **Promote to watch→act** when a NEW query has ≥30 impressions for two consecutive weeks: map it to an existing URL (internal links) or schedule a page in the calendar.
- **Investigate MISMATCH** after two weeks: the wrong URL is winning. Fix by strengthening internal links from strong pages to the intended URL, and de-optimising the accidental winner (tighten its title/intent) if needed.
- **Demote cannibalisation** when two URLs both appear for one query: pick the intended owner per the keyword map, add cross-links from the loser, and re-check in two weeks.
- **Kill or rewrite** when a page gets impressions but a persistently low CTR (<1% at position <10): rewrite title/meta description.

## Step 5 — Batch 3 pages to watch (added 2026-09-27)

These pages are new; their query data starts accruing after indexing. Do not judge them before ~4 weeks of data.

| Page | Watch queries (expected) | Check from |
|---|---|---|
| /ev-two-wheeler-service | ev two wheeler service bangalore · electric scooter service at home | ~4 weeks post-deploy |
| /royal-enfield-service | royal enfield service at home bangalore · classic 350 service at home | ~4 weeks |
| /ktm-service | ktm duke service bangalore · ktm service at home | ~4 weeks |
| /honda-two-wheeler-service | activa service at home bangalore · honda two wheeler service | ~4 weeks |
| /tvs-two-wheeler-service | jupiter service at home · tvs apache service bangalore | ~4 weeks |
| 20 car×area wave-1 pages | car service {area} · car periodic service {area} etc. | ~4 weeks |
| 4 new /answers pages | their exact question phrasings | ~4 weeks |
| 2 new blog posts | how often to service a car · brake noise causes | ~4 weeks |

**Submission:** after deploy, the updated sitemap is auto-referenced in robots.txt; submit once at GSC → Sitemaps if the "Last read" date does not advance within a week.

## Batch 4 (2026-09-27) — data availability + optimization backlog

**GSC API/data availability: NOT CONNECTED.** The repo's GSC integration
(`src/lib/gsc.server.ts`, seo-monitor route) requires `GOOGLE_SEARCH_CONSOLE_API_KEY`
(+ `LOVABLE_API_KEY`); neither exists in this environment (checked via the key inventory,
2026-09-27). No impressions/clicks/CTR/position data exists in this repo and none was
simulated. Owner options: (a) run the weekly manual workflow above, or (b) add the API key
to the environment so the built-in seo-monitor pipeline works.

### Optimization backlog (evidence-based entries only)

Rule: a row enters this table only with a checkable evidence source. GSC rows stay empty
until the owner supplies data; rows below were found by code/URL inspection and are
already implemented or waiting on owner action.

| URL | Observed evidence | Issue | Proposed change | Reason | Priority | Evidence source | Status |
|---|---|---|---|---|---|---|---|
| /answers/how-often-car-service | Two URLs answered the same intent (code inspection, answer-pages.ts) | Cannibalization: /answers/how-often-car-service vs /answers/car-service-interval | 301 the older slug to the newer, richer page; enrich target; merge best FAQ | One intent = one URL; split equity consolidates | P1 | Code inspection (both entries present pre-Batch-4) | DONE (Batch 4) |
| /royal-enfield-service · /ktm-service · /honda-two-wheeler-service · /tvs-two-wheeler-service | Zero answer-page links on brand pages (code inspection) | Orphaned from AEO layer | Add "Useful answers" contextual block per brand | Depth + crawl paths between brand and answer layers | P2 | Code inspection | DONE (Batch 4) |
| /ev-two-wheeler-service | EV page linked only 2 of 3 relevant EV answers | Missing contextual link | Add /answers/ev-what-can-be-serviced link | EV capability answer belongs on the EV page | P2 | Code inspection | DONE (Batch 4) |
| 20 wave-1 + 4 wave-2 car×area pages | No GSC data yet | Unknown CTR/position | Leave unchanged until ~4 weeks of data | Do not churn pages without evidence | P3 | — (no data) | WATCH |
| *(GSC-evidence rows: impressions-without-clicks, positions 4–20, query/page mismatch — added by owner from weekly export)* | | | | | | GSC export | OPEN |

### Wave-2 pages to watch (added 2026-09-27)

| Page | Watch queries (expected) | Check from |
|---|---|---|
| /car-periodic-service/hsr-layout | car periodic service hsr layout · car service hsr layout | ~4 weeks post-deploy |
| /car-ac-service/jayanagar | car ac service jayanagar · car ac gas refill jayanagar | ~4 weeks |
| /car-battery-service/jp-nagar | car battery replacement jp nagar · jump start jp nagar | ~4 weeks |
| /car-brake-service/marathahalli | car brake service marathahalli · brake pad replacement marathahalli | ~4 weeks |

## Batch 5 activation attempt (2026-09-27): GSC data still NOT accessible

The owner reports GSC is connected, so activation was attempted for real. Results:

| Check | Result |
|---|---|
| `freebuff-env list` (sandbox) | No `GOOGLE_SEARCH_CONSOLE_API_KEY`, no `LOVABLE_API_KEY` |
| `freebuff-deploy env list` (production) | **Zero** production env vars set |
| App's GSC integration (`src/lib/gsc.server.ts`) | Requires both keys above via the Lovable connector gateway; throws "Search Console is not connected for this project yet." without them |
| Direct Search Console API test | HTTP 401 "API keys are not supported by this API. Expected OAuth2" — plain API keys cannot call GSC at all |
| Existing `GOOGLE_API_KEY` | Present but cannot authorize GSC (same 401); **not** a GSC credential |
| SEO Monitor route | Admin-only + Supabase-auth-gated; requires an admin session, which the agent does not hold |

**Conclusion: the GSC connection the owner made lives in the Lovable platform, not in this
Freebuff deployment's environment.** No metric was pulled; nothing was simulated; every
metric cell stays blank. No findings exist yet — the backlog and watch tables above are
ready for real numbers the moment either of these happens:

1. **Owner adds `GOOGLE_SEARCH_CONSOLE_API_KEY` + `LOVABLE_API_KEY` to the Freebuff
   production environment** (Settings → Environment, or `freebuff-deploy env set`), or
2. **Owner runs the weekly export manually** from the GSC UI (Performance → Pages/Queries,
   last 28 days) and pastes the CSV into this workflow.

Until then the optimization backlog stays OPEN-only, and `car-area-performance-review.md`
classifies all 24 car×area pages as "observation pending".

## Batch 6 (2026-10-02): OAuth 2.0 integration implemented — awaiting owner authorization

**Exact missing connection identified**: the integration talked to the Lovable
connector gateway (`connector-gateway.lovable.dev`) with `LOVABLE_API_KEY` +
`GOOGLE_SEARCH_CONSOLE_API_KEY`. That gateway does not exist in this Freebuff
deployment, and Google rejects API keys for this API outright (HTTP 401
"API keys are not supported by this API. Expected OAuth2"). The property IS
verified in the owner's GSC UI (owner reading: 322 clicks, 131 indexed, 90 not
indexed, 17 valid breadcrumbs, no CWV yet) — only the API credential was
missing.

**Implemented (read-only OAuth 2.0)**:
- `src/lib/gsc-oauth.server.ts` — consent URL, code exchange, refresh-token
  access tokens (in-memory cache). Scope: `webmasters.readonly` ONLY (covers
  sites + searchAnalytics + sitemaps + urlInspection).
- `src/server.ts` — `GET /gsc/connect`, `GET /gsc/oauth-callback`,
  `GET /gsc/disconnect`. Refresh token lives only in an HttpOnly cookie
  (`gsc_rt`, 10 y) in the connecting browser; CSRF state cookie; tokens never
  logged or sent to the client.
- `src/lib/gsc.server.ts` — transport switched from the gateway to Google's
  real endpoints with `Authorization: Bearer <access token>`.
- `src/lib/gsc.report.server.ts` — statuses `not_configured` / `not_connected`,
  plus a **near-me baseline** (the 4 priority queries with clicks, impressions,
  CTR, avg position and landing pages, each row tagged `source: gsc-api`).
- `src/routes/_authenticated/seo-monitor.tsx` — Connect button, OAuth feedback
  banner, baseline table, and a visually separate **manual observations**
  section (`src/lib/gsc-manual.ts`, `source: manual-observation`).

**Owner steps to complete the connection** (owner message from):
1. Google Cloud Console → APIs & Services → Library → enable **Google Search Console API**.
2. APIs & Services → OAuth consent screen → External → add scope
   `.../auth/webmasters.readonly` → add your Google account (the one with
   Owner permission on the property) as a test user. Prefer Publishing status
   "In production"; if Google forces verification first, stay in Testing and
   re-connect every 7 days (test-app refresh tokens expire).
3. Credentials → Create credentials → OAuth client ID → **Web application** →
   Authorized redirect URIs:
   - `https://ridencare.co.in/gsc/oauth-callback`
   - `http://localhost:8080/gsc/oauth-callback`
   - `http://localhost:8081/gsc/oauth-callback`
4. Copy Client ID + Client Secret into Settings → Environment as
   `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` (values never
   shown or logged by the app).
5. Open `https://ridencare.co.in/seo-monitor` → **Connect Google Search
   Console** → approve the read-only consent.

**Owner's dashboard reading recorded 2026-10-02** (MANUAL, not API — stored in
`src/lib/gsc-manual.ts`, rendered in a separate dashboard section): 322 total
web clicks (displayed range unspecified), 131 indexed, 90 not indexed, 17 valid
breadcrumbs, no Core Web Vitals data. Coverage/enhancement/CWV reports are NOT
exposed by the GSC API, so those stay manual by design; clicks will be
superseded by live API rows after authorization. **No API data has been
retrieved yet — the integration is implemented but NOT connected.**

## Data-hygiene rules

- Never fill a cell from memory or estimate. Blank ≠ bad; blank = not measured.
- Keep raw CSV exports uncommitted (internal data).
- If GSC shows a query with a brand-name typo variant gaining impressions, note it — brand typos are handled by GBP/brand, not new pages.
- This file is updated weekly by the owner (or whoever holds GSC access). The implementer never invents the numbers.
