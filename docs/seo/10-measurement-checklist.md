# 10 — Measurement Checklist (Search Console, Bing, GA4, key events, UTMs, weekly tracking)

## 1. Google Search Console

- The domain property is verified via **DNS TXT** (already done — the TXT record exists) and the meta-tag fallback is on the site.
- **Submit the sitemap:** GSC → Sitemaps → enter `https://ridencare.co.in/sitemap.xml` → Submit. Re-submit after every major content part (current: 211 URLs).
- Watch **Coverage** for the noindex pages (`/guarantee`, `/sample-invoice`) appearing as "Excluded by noindex" — that is correct, not an error.
- **[OWNER TO CONFIRM]** owner login/access to the GSC property (listed in OWNER-ACTIONS group e).

## 2. Bing Webmaster Tools

1. Sign in at bing.com/webmasters with a Microsoft account.
2. Choose **Import from Google Search Console** — it copies the verified site and sitemap automatically.
3. After import, confirm `https://ridencare.co.in/sitemap.xml` is submitted and crawl rate is "Normal".
4. Bing powers **Copilot** answers, so index coverage here directly feeds the GEO goal.

## 3. GA4

- **Measurement ID `G-EQ8P35TH54` is already live** in the site header (`VITE_GA_MEASUREMENT_ID` env var → gtag script on every page). It is **not** pending — but the property owner should confirm they can log into this GA4 property (see OWNER-ACTIONS group e).
- Ahrefs Web Analytics: **[OWNER TO CONFIRM]** whether installed — no Ahrefs script was found in the site HTML during the Task 1 live fetch. If wanted, it is a one-script add via `__root.tsx`.

## 4. Key events (conversions) in GA4

The site already fires these events via the delegated `[data-ctc]` listener and `trackCtc()`:

| Event | Where it fires | Mark as key event |
|---|---|---|
| `call_click` | every Call button/row (data-ctc="call_click") | Admin → Events → find `call_click` → toggle "Mark as key event" |
| `whatsapp_click` | every WhatsApp button/row | same toggle |
| `booking_form_submit` | BookingFlow, AiBooking, QuickWhatsAppBooking | same toggle |
| `book_with_ai_open` | SiteHeader "Book with AI" trigger | same toggle |

Steps: GA4 → Admin → **Events** → wait for each event to appear in the list (fires in real traffic) → switch on **Mark as key event**. Alternatively create them in advance under Admin → **Key events** → "Create key event" with the exact event names above.

## 5. UTM conventions (use these everywhere — GBP, WhatsApp status, socials, guest posts)

| Source | Campaign | Format |
|---|---|---|
| Google Business Profile | `gbp` | `?utm_source=google&utm_medium=organic&utm_campaign=gbp` (+ `utm_content=gbp-booking` / `gbp-post-week{n}` / `gbp-qa{n}`) |
| WhatsApp status/message links | `whatsapp` | `?utm_source=whatsapp&utm_medium=message&utm_campaign=status-YYYYMM` |
| Instagram/Facebook/X/LinkedIn/YouTube | `social` | `?utm_source=instagram&utm_medium=social&utm_campaign=profile` (etc. per platform) |
| Guest posts / community | `referral` | `?utm_source={site}&utm_medium=referral&utm_campaign=guest-YYYYMM` |

Rules: all lowercase, no spaces, never more than source/medium/campaign/content, never invent a source name.

## 6. Weekly tracking sheet — 25 target queries

Copy the table into a spreadsheet. Columns fixed; fill impressions/clicks/position from GSC → Performance → Queries → filter for each query (date range = last 7 days, or set the comparison). Update every Monday.

| # | Query | Target URL | Impressions (7d) | Clicks (7d) | Avg position | Notes |
|---|---|---|---|---|---|---|
| 1 | bike service at home bangalore | /bike-service | | | | |
| 2 | doorstep bike service bangalore | /doorstep-bike-service | | | | |
| 3 | bike service cost bangalore | /answers/bike-service-cost-bangalore | | | | |
| 4 | bike repair at home bangalore | /bike-repair | | | | |
| 5 | scooter service at home bangalore | /scooter-service | | | | |
| 6 | bike breakdown assistance bangalore | /bike-breakdown-assistance | | | | |
| 7 | breakdown assistance bangalore | /breakdown-assistance | | | | |
| 8 | emergency bike repair bangalore | /emergency-bike-repair | | | | |
| 9 | car service at home bangalore | /cars | | | | |
| 10 | doorstep car service bangalore | /cars | | | | |
| 11 | car periodic service bangalore | /car-periodic-service | | | | |
| 12 | car ac service at home bangalore | /car-ac-service | | | | |
| 13 | car battery replacement at home bangalore | /car-battery-service | | | | |
| 14 | car brake service bangalore | /car-brake-service | | | | |
| 15 | car oil change at home bangalore | /car-oil-change | | | | |
| 16 | pre purchase car inspection bangalore | /car-inspection | | | | |
| 17 | car jump start bangalore | /car-jump-start | | | | |
| 18 | bike service whitefield | /bike-service/whitefield | | | | |
| 19 | bike service koramangala | /bike-service/koramangala | | | | |
| 20 | bike service hsr layout | /bike-service/hsr-layout | | | | |
| 21 | car service hsr layout | /areas/hsr-layout | | | | |
| 22 | bike service electronic city | /bike-service/electronic-city | | | | |
| 23 | bike service marathahalli | /bike-service/marathahalli | | | | |
| 24 | bike service indiranagar | /bike-service/indiranagar | | | | |
| 25 | doorstep bike and car service bangalore | / | | | | |

**Weekly review questions:** which query moved most? which target URL doesn't rank top-20 yet (needs links/coverage)? any query where a competitor page outranks a better-targeted page (cannibalisation → log a ruling in 03-keyword-map.csv)?

## 7. GBP + AI visibility cadence (cross-links)

- GBP insights (calls, direction requests, profile views) → screenshot into the same weekly sheet, one row per week.
- Run the AI-visibility baseline from `09-ai-visibility-tests.md` once now, then every 30 days.
