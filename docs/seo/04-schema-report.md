# Part 4 — Structured Data (JSON-LD) Schema Report
Date: 2026-09-19 · Deployed Worker version `c858c766` · Validator: `scripts/validate-schema.py`

## What was built
- **One central schema module** — `src/lib/schema.ts`. Every page builds its graph from it. Stable `@id`s:
  - `https://ridencare.co.in/#organization` (Organization)
  - `https://ridencare.co.in/#localbusiness` (AutoRepair + MotorcycleRepair)
  - `https://ridencare.co.in/#website` (WebSite)
- **Root layout** (`__root.tsx`) emits ONE `@graph` on every page: Organization + LocalBusiness + WebSite. Page routes append a second page-specific `@graph` (Service / Article / FAQPage / BreadcrumbList / ItemList) — no duplicate blocks, no re-declared entity nodes.
- **LocalBusiness** (`["@type": ["AutoRepair","MotorcycleRepair"]]`): name, alternateName "Ride N Care - Care in Every Mile", url, logo, image, email, `telephone: ["+918069409289"]` (call number ONLY), contactPoint array = (a) customer service +918069409289, (b) WhatsApp booking → `url: https://wa.me/918296950339` (never a telephone field), description = the exact "Who is Ride N Care?" entity sentence, address = Bengaluru/Karnataka/IN with **no street**, areaServed = City Bengaluru + one Place per confirmed locality (the 40 published area pages), sameAs (Instagram, Facebook, YouTube, Google Maps), knowsAbout (real services), hasOfferCatalog (one Offer per live service page). `priceRange` and `openingHoursSpecification` **omitted** — owner has not confirmed them.
- **WebSite**: name, publisher @id, inLanguage en-IN. **No SearchAction** (no on-site search exists).
- **Service** nodes per live service page via `serviceNode()`: name, serviceType, description matching page copy, url, `provider: {"@id": .../#localbusiness}`, areaServed (per-locality Place with real pincode on area pages), offers **only** where a price is real and visible (5 service pages with `priceFrom: 799`; /cars and others without visible prices get no offers — the old "Price on Request" Offer and homepage AggregateOffer were removed).
- **BreadcrumbList** on every non-home page via `breadcrumbNode()`, matching visible breadcrumbs.
- **FAQPage** only where FAQs are visible: home (5), /bikes, /cars, /faq, /answers, guides, blog posts — text matches page copy exactly.
- **Article/BlogPosting** on guides and blog posts: real datePublished/dateModified from data, `publisher: {"@id": .../#organization}`, author = Organization @id ref (blog posts show a visible author name → Person node; no invented authors).
- **Area pages** now reference the shared LocalBusiness graph (no branch-level fake AutoRepair entities) and use `areaServed` Place with the area's real pincode. No fake addresses anywhere.
- **No AggregateRating / Review markup** anywhere (validator asserts this on every crawl).
- Old deprecated helpers in `src/lib/seo.ts` marked `@deprecated`; the MCP business-info tool now reads from the same `BIZ` constants.

## Files changed
| File | Change |
|---|---|
| `src/lib/schema.ts` | NEW — central JSON-LD factory (IDS, BIZ, CONTACT_POINTS, organizationNode, localBusinessNode, websiteNode, graphForPage, breadcrumbNode, faqNode, serviceNode, articleNode, nearbyAreasNode) |
| `src/routes/__root.tsx` | one entity @graph on every page (was 3 separate blocks) |
| `src/routes/index.tsx` | homepage graph = FAQPage only (AggregateOffer Service removed); "50+ more" claim removed from visible FAQ copy |
| `src/routes/bikes.tsx`, `src/routes/cars.tsx` | one graph each: Service (real price on /bikes, none on /cars) + Breadcrumb + FAQ |
| `src/routes/$service.index.tsx`, `src/routes/$service.$area.tsx` | templated Service + Breadcrumb (+ ItemList) via factory; area pages carry real pincode |
| `src/routes/areas.$slug.tsx` | fake branch AutoRepair entities removed; graph = Service + Breadcrumb + nearby ItemList |
| `src/routes/guides.$slug.tsx`, `src/routes/guides.index.tsx`, `src/routes/blog.$slug.tsx`, `src/routes/blog.index.tsx` | Article/BlogPosting with publisher @id; Blog index stubs carry author+publisher refs |
| `src/routes/about.tsx`, `src/routes/franchise.tsx` | AboutPage/WebPage nodes referencing entity @ids + breadcrumbs |
| `src/routes/faq.tsx`, `src/routes/answers.tsx` | single FAQPage graphs |
| `src/routes/$service.$area.tsx`, `src/lib/answers.ts` | "same-day slots" phrasing removed (unverified, Q5) |
| `src/lib/seo.ts` | old helpers marked @deprecated |
| `src/lib/mcp/tools/get-business-info.ts` | reads BIZ from central module |
| `scripts/validate-schema.py` | NEW — the validator described below |

## Validator + results
`python3 scripts/validate-schema.py <base>` crawls 29 representative pages and checks:
1. every JSON-LD block parses (JSON) · 2. one `@graph` per page with @context · 3. no duplicate `@id` **declarations** (bare `{"@id"}` references excluded) · 4. every `@id` reference resolves (declared locally or on-site) · 5. required fields per type (Organization/LocalBusiness: name,url,telephone + contactPoint roles; Service: name,serviceType,provider,areaServed,description,url; FAQ entries; Article/BlogPosting: headline,datePublished,publisher) · 6. call number `+918069409289` in every customer-service contactPoint, WhatsApp number **only** in url fields, never in a telephone field · 7. banned claims (`12,000+`, `4.8`, `150+`, `50+`, `₹200 off`, `same-day slots`, `30 minutes`) absent from schema · 8. no AggregateRating/Review markup.

**Results (dev preview AND https://ridencare.co.in after deploy):**
```
pages checked: 29 · total JSON-LD blocks: 54 · parsed OK: 54
pages with @graph: 29/29 · pages with errors: 0 · with warnings: 0
```
SSR confirmed: blocks are extracted from raw curl'd HTML (no JS execution).

## 10 URLs for manual testing (Rich Results Test / Schema Markup Validator)
1. https://ridencare.co.in/ — Organization+LocalBusiness+WebSite+FAQPage
2. https://ridencare.co.in/bikes — Service with Offer + FAQ
3. https://ridencare.co.in/cars — Service without offers + FAQ
4. https://ridencare.co.in/bike-service — templated service + Offer
5. https://ridencare.co.in/bike-service/hsr-layout — Service with locality Place (pincode 560102) + Breadcrumb + ItemList
6. https://ridencare.co.in/areas/whitefield — area Service with pincode + Breadcrumb
7. https://ridencare.co.in/guides/bike-service-guide-bangalore — Article + FAQPage
8. https://ridencare.co.in/blog — Blog with BlogPosting stubs (author/publisher refs)
9. https://ridencare.co.in/answers — large FAQPage
10. https://ridencare.co.in/about — AboutPage + Organization reference

## Acceptance — pass/fail
| Criterion | Result |
|---|---|
| Zero JSON-LD parse errors | ✅ 54/54 parse |
| One graph per page, no duplicate blocks | ✅ 29/29 pages use @graph; duplicate-declaration check passes |
| Call/WhatsApp numbers used correctly everywhere | ✅ customer service = +918069409289; WhatsApp only as wa.me URL; 0 telephone-field violations (dev + prod) |
| @id references resolve | ✅ validator check passes |
| No unverified claims (Q1–Q7 unanswered) | ✅ banned-claim scan clean; two "same-day slots" and one "50+ more" removed from copy+schema |
| No AggregateRating/self-serving Review markup | ✅ |
| priceRange/openingHours omitted until confirmed | ✅ |
| STATE.md updated | ✅ |
