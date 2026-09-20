# Ride N Care — Part 1 Technical SEO/AEO/GEO Audit Findings
Date: 2026-09-19 · Auditor: Buffy (automated crawl of all 166 indexable URLs + codebase review)
Crawl basis: production SSR HTML (no JS execution) — confirms content is server-rendered.

## Verdict snapshot
- 166 indexable URLs, all return 200, all SSR (H1, body copy, FAQ answers, internal links and JSON-LD present in initial HTML — no client-only content found).
- 0 duplicate titles, 0 duplicate descriptions, 0 missing meta descriptions/canonicals, 0 multi-H1 pages, 1 thin page (/contact), 15 titles >60 chars, 3 descriptions >160.
- Structured data present and well-typed on every page (AutoRepair/Service/FAQPage/BreadcrumbList/Place etc.).

## CRITICAL (fix before any content growth)
| # | Finding | Evidence | Fix |
|---|---|---|---|
| C1 | Call/WhatsApp number roles were inconsistent: tel: links on 3 route templates dialled `08069409289` without country code and AEO/Guide answer copy told users to "book on 08296950339 or 08069409289", mixing the WhatsApp number into call instructions. | `src/routes/answers.tsx`, `src/lib/answers.ts` (ANSWERS + FAQ arrays), `src/lib/services.ts` (2 FAQ rows + 8 service descriptions), `src/lib/guides.ts` (2 answers), `src/routes/contact.tsx` meta, `src/routes/$service.$area.tsx` meta | FIXED in this pass. Every `tel:` now `+918069409289`; display `080 6940 9289`; WhatsApp shown only as "WhatsApp 82969 50339" linking `wa.me/918296950339`. Full rewrite list in STATE.md. |
| C2 | Schema exposed the WhatsApp number as a telephone `contactPoint` ("booking") on every page — tells AI systems it is a call line; owner has not confirmed voice support. | `src/lib/seo.ts` LOCAL_BUSINESS_JSONLD + ORGANIZATION_JSONLD | FIXED. WhatsApp contactPoint converted to `url: https://wa.me/918296950339` (no telephone field); all `telephone` arrays now contain only `+91-80-6940-9289`. |
| C3 | No security headers served (no X-Frame-Options / X-Content-Type-Options / Referrer-Policy / HSTS). | `curl -D -` on production (0 header matches) | Add headers via `public/_headers` or Nitro route rules → backlog BL-1. |
| C4 | `https://www.ridencare.co.in/` returns **200** with duplicate content instead of redirecting to the canonical host; `http://` also serves 200. | curl checks | Host-level 301 to `https://ridencare.co.in` → backlog BL-1 (needs Cloudflare DNS/zone access — OWNER ACTION). |

## HIGH
| # | Finding | Evidence | Fix |
|---|---|---|---|
| H1 | Unverified claims sit in **AI-facing/meta surfaces**: About meta description + JSON-LD description say "12,000+ happy riders", "150+ certified mechanics", "12+ years"; StatsRow/Testimonials/About show "12,000+", "4.8★" without visible proof source; "same-day slots" in area meta template (9×), "50+ localities" (10×), "30 minutes away" (1×). Owner list flags these as unconfirmed. | `src/routes/about.tsx` (lines 9, 64, 86, 144), `src/components/StatsRow.tsx`, `src/components/Testimonials.tsx`, `src/routes/$service.$area.tsx:20`, `src/lib/answers.ts` | Quarantine: add `[OWNER TO CONFIRM]` entries; once owner supplies proof, either cite it or soften copy. Tracked in OWNER-QUESTIONS.md + backlog BL-3. Do not add to schema/AI summaries meanwhile. |
| H2 | Area-coverage contradiction: AEO answer says "most of **east, south and central** Bangalore" but the catalog also serves north/west localities (Rajajinagar, Malleshwaram, Vijayanagar, Basaveshwaranagar…). | `src/lib/answers.ts:75` vs `src/lib/areas.ts` | Reword to "across Bangalore" phrasing without inventing coverage breadth → BL-4. |
| H3 | Vertical gap: 132 bike-first URLs vs **1** car page (/cars); homepage "Car AC Repair" card links to /cars (generic), "EV Service" card links to /bikes. Cars have zero locality pages. | route tree + `src/routes/index.tsx` | Part 5 car content build-out; interim: EV card → /bikes is correct (EV two-wheelers), Car AC card keeps /cars until /car-ac-service exists. |
| H4 | GA4/GTM load but **no conversion events**: no phone-click, WhatsApp-click, booking-submit, AI-open or track-booking tracking anywhere in `src/`. | `src/routes/__root.tsx` (pageview-only) | Add `gtag event` helper + wire 5 events → BL-2 (Part 8). |
| H5 | Footer rendered the WhatsApp/voice number `08296 950 339` as a sub-line under the **Call** link (joined-number formatting issue from the brief). | `src/components/SiteFooter.tsx:129` | FIXED — sub-line now "Doorstep bike & car service desk". |

## MEDIUM
| # | Finding | Evidence | Fix |
|---|---|---|---|
| M1 | 15 titles >60 chars — all area pages (`…/electronic-city`, `/marathahalli`, `/sarjapur-road` patterns) + /franchise; 3 descriptions >160 (2 area pages, /franchise). | inventory CSV | Template trims: drop "Bangalore" from area titles (locality already implies city), shorten franchise title → BL-5. |
| M2 | /contact is the only thin page (<300 words SSR). | inventory CSV | Add contact FAQ block + booking steps → BL-6. |
| M3 | `lang="en"` instead of `en-IN`. | `src/routes/__root.tsx:167` | FIXED. |
| M4 | Every page ships the brand logo with empty alt (`alt=""`) — acceptable (decorative), but og/default images lack descriptive filenames; minor. | crawl grep | Optional → BL-8. |
| M5 | `/track-booking` is indexable but utility-only; nav link already removed. | sitemap | Consider `noindex` + drop from sitemap → BL-7 (owner preference). |
| M6 | robots.txt blocks `/api/` and `/auth` — good; but `Disallow: /isolate` references a route that does not exist (harmless). | robots.txt | Clean when touched. |

## LOW
- L1 Trailing slash: `/faq/` 307s to `/faq` (correct canonical form, single hop) — no action.
- L2 Mixed content: none found (0 `http://` subresources).
- L3 Near-duplicate risk in `/areas/*` × service slugs is managed by unique first-person locality copy — spot checks show real unique paragraphs per area page; keep Part 4 quality bar.
- L4 `llms.txt` exists (200) — feed is in place; enrich in Part 9.
- L5 GA `G-EQ8P35TH54` verified live; GSC verification meta present.

## Rendering check (Task 1) — PASS
No JS-only content detected: H1s, body copy, answer blocks, internal links and all JSON-LD blocks are in the initial HTML on all 166 URLs (crawl used raw SSR output). Flag: none.

## Performance snapshot (Task 7, code-level)
- Largest images: `car-service.webp`/`hero-3d-mechanic.webp` class (~280–300KB) — acceptable; all `<img>` use explicit width/height + `fetchPriority` on hero logo; lazy-loading present on below-fold images (grep `loading="lazy"` in route templates).
- LCP element: hero H1 (text) — text-based LCP is safe; hero background art is CSS gradients, not an image.
- CLS risks: none found (no unsized imgs in SSR output; width/height present).
- INP: booking dialog + AI chat are code-split and lazy — no heavy top-level scripts beyond GA/GTM.
- Render-blocking: GA/GTM scripts are `async`; CSS is a single bundled file.
