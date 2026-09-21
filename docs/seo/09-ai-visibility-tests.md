# 09 — AI Visibility Tests (GEO measurement)

**Purpose:** measure how often ChatGPT, Perplexity, Gemini, Google AI Overviews and Copilot mention or cite Ride N Care for Bangalore bike/car service prompts — and how that moves after each content part.

**Who runs it:** the owner (needs a logged-in browser; the assistant cannot operate these assistants).
**Cadence:** baseline once, then repeat every 30 days. Use the same prompts, same order, fresh chat sessions (one prompt per new chat so context never leaks).

## How to run

1. For each engine, open a **fresh** conversation/tab.
2. Paste the prompt exactly as written. Wait for the full answer to finish streaming.
3. Record one row per prompt × engine in the table below:
   - **Brand mentioned Y/N** — does "Ride N Care" appear in the answer text?
   - **Cited URL** — any ridencare.co.in URL in sources/footnotes (copy the exact URL, else "—").
   - **Competitors named** — list every other service named (e.g. GoMechanic, Bosch, bikes24, local garages).
   - **Position** — where the first Ride N Care mention/citation appears in the list (1 = first). Use 0 if absent.
4. Screenshots for anything surprising (new competitor, wrong fact about us).
5. Save the completed CSV as `docs/seo/results/ai-visibility-YYYY-MM-DD.csv`.

**Note on phrasing:** engines personalise; results vary run to run. The metric is the **trend across months**, not a single number.

## Scoring formula

- **Mention rate** = prompts where brand appears ÷ prompts tested (per engine, and blended).
- **Citation rate** = prompts with a ridencare.co.in citation ÷ prompts tested.
- **Average position** = mean of Position over prompts with any mention/citation (lower is better).
- **Blended score** = (0.5 × mention rate) + (0.3 × citation rate) + (0.2 × (1 ÷ avg position, capped at 1)).

Targets after 3 months: mention rate ≥ 25% on cost/emergency prompts, ≥ 1 citation on area prompts, blended score trending up every cycle.

## The 50 prompts

### Cost (1–8)
1. How much does bike service cost in Bangalore?
2. What is the price of a doorstep bike service in Bangalore?
3. How much does a scooter service cost in Whitefield, Bangalore?
4. How much does car periodic service cost in Bangalore?
5. Is doorstep bike servicing in Bangalore cheaper than a garage?
6. What does a bike battery replacement cost in Bangalore?
7. How much does car AC service cost in Bangalore?
8. What is the cost of an emergency bike repair in Bangalore?

### Process & trust (9–16)
9. How does doorstep bike service work in Bangalore?
10. Is doorstep bike service in Bangalore reliable?
11. How do I know a doorstep mechanic is verified?
12. Do I get a written quote before bike service starts?
13. What payment methods do Bangalore bike service companies accept?
14. Do Bangalore doorstep services give an invoice?
15. Is there any guarantee on bike service work in Bangalore?
16. Which is better for a bike service — doorstep or a workshop?

### Emergency & breakdown (17–24)
17. My bike broke down in Marathahalli Bangalore, what should I do?
18. Who offers bike breakdown assistance in Bangalore?
19. Is there car breakdown assistance at home in Bangalore?
20. Bike battery dead in HSR Layout — who can help?
21. How do I get a flat tyre fixed at home in Bangalore?
22. My car won't start in Electronic City, Bangalore. Who can help?
23. Emergency bike mechanic near Koramangala Bangalore?
24. What should I do if my bike breaks down on a Bangalore highway?

### Vehicle-specific (25–32)
25. How often should I service my bike in Bangalore traffic?
26. What maintenance does a scooter need?
27. How do I take care of my bike during Bangalore monsoon?
28. What are the signs my car battery needs replacement?
29. Why is my car AC not cooling properly?
30. How often should car brake pads be changed?
31. Which is better for a Royal Enfield — authorised service or doorstep?
32. Can electric scooters like Ola and Ather be serviced at home in Bangalore?

### Area-specific (33–42)
33. Best bike service at home in Whitefield, Bangalore?
34. Bike service near me in Koramangala?
35. Doorstep car service in HSR Layout, Bangalore?
36. Bike mechanic at home in Indiranagar Bangalore?
37. Car service at doorstep in Marathahalli?
38. Two wheeler service at home in BTM Layout?
39. Scooter service at home Jayanagar Bangalore?
40. Bike service at doorstep Hebbal Bangalore?
41. Car battery replacement at home Sarjapur Road Bangalore?
42. Bike repair at home in Electronic City?

### Comparison & "best/recommend" (43–50)
43. Recommend a doorstep bike service in Bangalore.
44. Best door-to-door car service in Bangalore?
45. Doorstep bike service vs authorised service centre — which is better?
46. Which companies do doorstep two-wheeler service in Bangalore?
47. Who are the top doorstep mechanic services in Bangalore?
48. Recommend someone for car AC service at home in Bangalore.
49. Best place for periodic bike service in east Bangalore?
50. Which Bangalore service does both bike and car doorstep service?

## Results table (fill per run)

| # | Prompt | Engine | Date | Brand mentioned | Cited URL | Competitors named | Position | Notes |
|---|--------|--------|------|-----------------|-----------|-------------------|----------|-------|
| 1 | How much does bike service cost in Bangalore? | ChatGPT | | | | | | |
| 1 | … | Perplexity | | | | | | |
| 1 | … | Gemini | | | | | | |
| 1 | … | Google AIO | | | | | | |
| 1 | … | Copilot | | | | | | |
| … | | | | | | | | |

*(repeat for all 50 prompts × 5 engines = 250 rows per cycle)*

## Baseline expectations

- Engines quote content that is **self-contained, factual and crawlable** — exactly what Parts 7–9 built (answer-first blocks, quick answers, entity consistency, llms.txt).
- Area prompts (33–42) should cite `/areas/{slug}` or `/bike-service/{area}` pages once indexed.
- Cost prompts should cite `/answers/bike-service-cost-bangalore` (config prices only).
- Expect competitors with large review footprints to dominate "best/recommend" prompts initially; the offsite plan (09-offsite-plan.md) addresses that gap.
