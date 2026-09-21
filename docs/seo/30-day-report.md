# 30-Day Report — Ride N Care SEO/GEO program

Reporting date: 21 Sep 2026. Sitemap: **211 URLs, 0 duplicates**. Validator: **53 checks (51 pages + llms.txt + sitemap.xml) / 0 errors / 0 warnings**.

## 1. What shipped, part by part

| Part | Shipped | Commit(s) | Verified live? |
|---|---|---|---|
| Parts 1–8 (baseline) | Site rebuild for SEO: semantic SSR pages, unique titles/descriptions/canonicals, schema graph via src/lib/schema.ts, robots.txt (AI crawlers allowed), llms.txt, GA4 events wired (call_click, whatsapp_click, booking_form_submit, book_with_ai_open), pricing-driven bike answers, guides, blog scaffold, side panel rebuild with SEO links in DOM, area pages with uniqueness checks, breakdown hub/cannibalisation rulings, claim-sweep system (banned-strings validator), coverage single-source-of-truth, 14 car answers, meta/dates standardisation | c10fdef (+ Part 7/8 work inside it) | Yes — each part verified on live URLs at the time (STATE.md parts 1–8) |
| Task A | Desktop top nav: 8-item bar, services dropdown built from data files, sliding pill, 72→60px shrink; 62/62 Playwright checks | b77d4d8 | Yes (5 widths + live HTML) |
| Task B | /breakdown-assistance hub + /car-breakdown-assistance, wired nav/footer/sitemap/llms/keyword-map; Q35/Q36 logged | e6cd852 | Yes (live HTML + schema 44p/0 errors) |
| Part 8B | Coverage truth (33 confirmed), claim sweep Q37–Q45, one brand list (12+7), 14 car answers, 120–155-char metas, de-dup entity block, Kengeri removed, EV card → /scooter-service | 52107d9 + fde2a4d | Yes (live, cache-busted) |
| A–E combined | Header restore (wordmark+tagline at 320px+, labelled Book with AI), panel Book Now pill, hero brand-name sparkle treatment, ONE process guide replacing 3 sections, five new car pages (/car-oil-change, /car-inspection, /car-jump-start, /car-repair, /car-electrical-repair) with full wiring; Q46–Q50 logged | 52cfcd0 | Yes (Playwright screenshots + live HTML + schema 49p/0 errors) |
| Part 9 (GEO) | Entity audit, About at-a-glance, /guarantee + /sample-invoice (noindex), crawler-access report (7 AI bots → 200 identical HTML), AI-visibility protocol, offsite plan, date-display unification | 472b1d6 (+ ce2df3e, 4b4ed96) | Yes (live, Worker 0f8ac1d1) |
| Task 1 | Public email → info@ridencare.co.in everywhere (footer, contact, privacy, terms, sample invoice, About at-a-glance, schema, MCP tool, llms.txt); old Gmail banned in validator (text, JSON-LD, llms.txt, sitemap) | 7112516 | Yes (10 live URLs, grep proof) |
| Task 2 | GBP pack, profile copy, citations CSV, measurement checklist, OWNER-ACTIONS consolidation, this report | (this commit) | Docs — n/a live |

## 2. Page counts (sitemap = 211 URLs)

- **Service pages:** 16 bike (incl. periodic + breakdown) + 9 car + 2 breakdown (hub/car) — 27 service surfaces
- **Answers:** 50 one-question pages under /answers (bike, car, cost, process, monsoon, EV…) + hub
- **Areas:** 40 locality pages (33 confirmed + 7 pending owner confirmation), /areas hub by zone
- **Guides:** 8; **Blog:** DB-driven (sample seed: 3)
- **Company:** /, /about, /contact, /faq, /franchise, /privacy, /terms, /guarantee*, /sample-invoice* (*noindex)
- Note: sitemap was 297 in the Part 2 era; the count dropped as thin/duplicate entries were consolidated and truth-filtered — 211 is the deliberate, cleaner set.

## 3. Technical fixes of note

- One shared nav data file (src/lib/nav.ts) drives desktop menu, dropdown and side panel — no hard-coded route lists; only live routes.
- Schema 100% via src/lib/schema.ts helpers (no hand-written JSON-LD anywhere).
- validate-schema.py: schema checks + visible-text banned-claims scan + llms.txt/sitemap banned-strings scan; exits non-zero on regression.
- Serving: SSR with s-maxage=60 + stale-while-revalidate; deploy auto-purge still 401 (purge token scope, Q10) — freshness covered by the 60s TTL.
- Known sandbox constraints: build needs NODE_OPTIONS=--max-old-space-size≈1300; dev server occasionally serves stale modules until `freebuff-preview restart`.

## 4. Content published (30-day totals)

50 answers · 27 service pages · 40 area pages · 8 guides · process guide · guarantee + sample invoice (noindex evidence pages) · llms.txt entity map · 6 SEO/GEO docs (09*, 10*, OWNER-ACTIONS, this report).

## 5. AI-visibility baseline (instructions)

Run the baseline **once this week** per `docs/seo/09-ai-visibility-tests.md`: 50 prompts × 5 engines (ChatGPT, Perplexity, Gemini, Google AI Overviews, Copilot), fresh chat per prompt, record mention/citation/position, save to `docs/seo/results/ai-visibility-<date>.csv`. Repeat every 30 days.

## 6. Early metrics (owner fills from GSC / GA4 / GBP)

| Metric | Day 0 (fill) | Day 30 (fill) | Source |
|---|---|---|---|
| GSC clicks / impressions (7d) | | | Search Console |
| GSC avg position for the 25 tracked queries | | | 10-measurement-checklist.md sheet |
| GA4 key events: call_click / whatsapp_click / booking_form_submit / book_with_ai_open | | | GA4 (mark as key events first) |
| GBP profile views / calls / direction requests | | | GBP insights |
| AI mention rate (blended, 5 engines) | | | 09-ai-visibility-tests.md |
| Reviews: count + average | | | GBP |

## 7. Open risks

1. **Owner questions unanswered (Q1–Q50 + hours + GA4/GBP access)** — the single biggest brake: every removed claim stays removed, GBP hours blank, stats stay unpublished. OWNER-ACTIONS.md is the one-list reply sheet.
2. **Cache purge 401** (Q10): deploys rely on 60s s-maxage; grant the purge scope to make updates instant.
3. **/guarantee + /sample-invoice noindex** until the owner confirms the 7-day terms wording.
4. **7 north/west area pages** parked (noindex-quality risk mitigated by exclusion from all "we serve" copy) pending Q33.
5. **Rate limiting**: the live schema validator occasionally trips bot-rate-limits on rapid full-site fetches — local runs are the fallback (same code).
6. **No email transport exists in the repo** — invoices go via WhatsApp/email manually by the owner; if automation is wanted later, a provider must be chosen and the recipient set to info@ridencare.co.in.

## 8. Weeks 5–13 plan (adjusted for what is already built)

| Week | Focus |
|---|---|
| 5 | Owner answers land (OWNER-ACTIONS) → restore approved claims; GBP profile applied from 10-gbp-pack.md; key events marked in GA4; AI-visibility baseline run |
| 6 | Landmark/local fixes from Q34; unconfirmed localities resolved (Q33) → index or prune the 7 parked pages; refresh area metas |
| 7 | Citations wave 1 (GBP, Bing Places, Apple Business Connect, Justdial, Sulekha) with NAP rule; review-request flow live |
| 8 | Retrieval-shaping pass 2 on the 25 tracked queries' pages (tables, self-contained sections); fix any query with position >20 |
| 9 | GBP posts cadence steady (1–2/week); first 3 YouTube shorts; guest-post pitches (3 local blogs) |
| 10 | AI-visibility run #2 (day 30) → compare vs baseline; double down on engine that cites most |
| 11 | Content: 10 new answers from real call/WhatsApp questions logged by the owner; internal-link tightening on money pages |
| 12 | Car answers ↔ car service pages cross-link audit; expand car page FAQs with owner-confirmed details (Q46–Q50 outcomes) |
| 13 | 60-day AI-visibility run; month-2 metrics review vs 30-day blanks; re-prioritise |

## 9. Verification statement

**Verified on the live site (cache-busted fetches):** Task 1 email swap (10 URLs), banned-strings absence, mailto/JSON-LD email, sitemap URL count, noindex pages, coverage numbers, header/panel/process/hero treatments, crawler UA matrix, schema validator (53 checks / 0 errors, latest local run with identical code after live rate-limiting).
**Not verifiable from here (owner actions):** GBP application, review link, GA4 property access, Search Console sitemap submission, Bing import, profile updates on social platforms, AI-visibility baseline runs, review/WhatsApp message sending.
