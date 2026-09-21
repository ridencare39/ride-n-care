# 09 — Crawler Access Check (AI + search bots)

**Date:** 21 Sep 2026 · **Method:** `curl` with each user-agent against live URLs, comparing status codes and HTML payloads (rough check only — Cloudflare may treat spoofed agents differently than real ones).

## Test matrix

URLs tested: `/`, `/bike-service`, `/cars`, `/answers/doorstep-bike-service-cost` (+ spot-checks on `/`, `/bikes`, `/answers/how-long-bike-service`).

| User-agent | Status | HTML identical to browser fetch? |
|---|---|---|
| GPTBot (OpenAI training) | 200 | ✅ yes |
| OAI-SearchBot (ChatGPT Search) | 200 | ✅ yes |
| ChatGPT-User | 200 | ✅ yes |
| PerplexityBot | 200 | ✅ yes |
| ClaudeBot (Anthropic) | 200 | ✅ yes |
| Google-Extended | 200 | ✅ yes |
| Bingbot | 200 | ✅ yes |
| (control) normal browser UA | 200 | baseline |

`robots.txt` allows all of the above (no AI-bot disallow rules). `llms.txt` is served at `/llms.txt` with a factual site map.

## Verdict

No bot-blocking detected at the edge. All assistant crawlers tested receive the full server-rendered HTML.

## OWNER CHECK — Cloudflare dashboard steps

Do this once in the Cloudflare dashboard (zone **ridencare.co.in**) to confirm nothing is enabled that would block assistants:

1. **Security → Bots** — check "Bot Fight Mode" is **off** (its heuristics can block good bots on small plans). If "Super Bot Fight Mode" is available, ensure "Definitely automated" does **not** include verified AI crawlers being challenged, and set verified bots (incl. AI crawlers listed by Cloudflare) to **Allow**.
2. **Security → WAF → Custom rules / Managed rules** — confirm no rule blocks or challenges by user-agent (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `OAI-SearchBot`) or by ASN for OpenAI/Anthropic/Perplexity. Pay attention to any "Block AI Scrapers and Crawlers" one-click rule — remove it if present.
3. **Security → Settings** — "Browser Integrity Check" is fine to keep; do not add a JS challenge on the whole site (it blocks non-browser agents).
4. **Caching → Configuration** — confirm "Managed robots.txt" is **off** (a managed robots.txt overrides yours and may disallow AI bots).
5. **Speed → Optimization** — no "Rocket Loader" issues for crawlers (optional check; HTML is server-rendered so content is in the initial response regardless).
6. After any change, re-run the curl matrix above and confirm statuses stay 200 and payloads stay identical.

## Re-test cadence

Re-run the curl matrix after every Cloudflare setting change and once per quarter. Keep this file updated with the date and result.
