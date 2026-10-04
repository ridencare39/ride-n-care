# AI-Visibility Baseline — Ride N Care (Batch 3)

**Created 2026-09-27. Status: NOT YET MEASURED — every result field below is intentionally empty. The measurement protocol is 09-ai-visibility-tests.md (50 prompts × 5 engines). Nothing on this page is a simulated, guessed or projected result; blanks fill only after real runs.**

This document is the recording template for the AI-visibility runs defined in `09-ai-visibility-tests.md`. The owner (or whoever holds accounts for the engines below) runs the protocol and records results here. The first run should happen 2–4 weeks after the Batch 3 deploy so the new pages have a chance to be crawled.

## Engines to test

| Engine | Access | Mode | Notes |
|---|---|---|---|
| ChatGPT (Search) | chatgpt.com, signed-in | Search on for site-ish queries; fresh chat per prompt | Log model/date |
| Perplexity | perplexity.ai | Default answer mode; log cited URLs | Citations matter most |
| Google AI Overviews | google.com, signed-out/incognito | Query as typed; AIO presence + links | AIO is volatile; same-day re-check |
| Gemini | gemini.google.com | Fresh chat per prompt | Log model/date |
| Claude (Search) | claude.ai | Search-enabled chat | Fresh chat per prompt |

One fresh chat/session per prompt — never ask follow-ups in the same thread, or the second answer is contaminated by the first.

## Run protocol (per 09-ai-visibility-tests.md)

1. Run all 50 prompts in one sitting per engine (keeps conditions comparable).
2. For each prompt record: engine, date, exact prompt, the answer's mention of **Ride N Care** (yes/no), rank-in-list if a list was returned, **cited URLs** (verbatim), and whether the claims made about Ride N Care are **accurate vs the site's live pages**.
3. Screenshot or copy the answer text for any prompt where the brand is mentioned or misdescribed — you will want receipts.
4. Log inaccuracies verbatim. Every fabricated claim an engine makes about the business is a fixable content gap (usually: the fact exists on no page, or exists only in schema and not in visible text).

## Prompt categories (summary; full list in 09-ai-visibility-tests.md)

- Brand questions ("does Ride N Care serve …?") — expect direct mentions.
- Comparison questions ("doorstep vs garage in Bangalore") — expect list placement.
- Locality questions ("car service in Koramangala / Electronic City") — expect area/car×area pages.
- Cost questions ("how much does bike service cost") — expect price-bearing pages (answers/bikes).
- Brand-vehicle questions ("Royal Enfield / KTM / Activa service at home") — expect the new brand pages.
- EV questions ("electric scooter service at home") — expect /ev-two-wheeler-service + EV answers.

## Result sheet — RUN 1 (owner fills)

**Run date: ____________ · Operator: ____________**

| # | Engine | Prompt (category) | RNC mentioned? | Rank/list pos | Cited URLs | Accurate? | Notes |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| … | | | | | | | |
| 50 | | | | | | | |

### Run 1 scorecard (fill after the run)

| Metric | Value |
|---|---|
| Prompts run | |
| RNC mentioned | |
| Mention rate % | |
| RNC cited by URL at least once | |
| Top-cited RNC pages (top 5, with counts) | |
| Inaccurate claims found (count + list verbatim) | |
| Competitor most-cited overall | |

## What to do with the results

- **Cited pages** → keep current, keep fast; these are already working.
- **Never-cited money pages** → check indexing in GSC, then strengthen the visible answer-first text (the quick-answer box is the pattern AI engines quote) and internal links.
- **Inaccurate claims** → either the fact is missing from the site (add it, plainly worded) or the engine hallucinated (no fix on our side; re-test next run and note persistence).
- **Locality misses** → the 20 wave-1 car×area pages and 12 bike×area priority pages are the intended fix; re-check next run before concluding more area pages are needed.
- **EV/brand misses** → the Batch 3 pages are new; give them one full crawl cycle before concluding.

## Honesty rules (same as the rest of the program)

- No result is ever estimated, projected or back-filled. Empty cells mean not measured.
- Do not run the protocol through proxies/automation that violates engine ToS; manual runs only.
- Do not create fake prompts engineered to force brand mentions and then report the mention rate as organic — use the protocol's prompts verbatim.
- Compare run-over-run only with the same engine, same prompt wording, same signed-in/out state.

## Batch 4 addendum (2026-09-27) — priority prompt set if time is short

The full 50-prompt protocol stands. If the owner can only run 10 prompts in
the first sitting, run these — they map 1:1 to the money pages and to the
Batch 3/4 expansion layer, so each result is immediately actionable:

1. doorstep bike service Bangalore
2. doorstep car service Bangalore
3. bike service at home near me (Bangalore)
4. car AC service at home Bangalore
5. bike battery replacement at home Bangalore
6. Royal Enfield service at home Bangalore
7. KTM service at home Bangalore
8. EV two-wheeler service at home Bangalore
9. car service in Electronic City / Koramangala
10. is Ride N Care trustworthy / Ride N Care reviews

Record results in the Run 1 sheet above. Rule unchanged: only actual
observations, no projections.

## Change log

| Date | Run | Change |
|---|---|---|
| 2026-09-27 | — | Template created (Batch 3). No measurement yet. |
| 2026-09-27 | — | Batch 4 addendum: 10-prompt priority set added. Still no measurement (NOT VERIFIED — OWNER ACTION REQUIRED to run the protocol). |
