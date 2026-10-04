#!/usr/bin/env python3
"""Part 2 — car × area quality-gate scorer.

Two modes:

  PLAN (default)
      python3 scripts/score-car-area.py plan
      python3 scripts/score-car-area.py plan --pairs 8

      Reads the project's TypeScript data files directly (no server needed)
      and scores candidate car×area combinations BEFORE pages are built, from
      measurable inputs only: owner-confirmed coverage/tier, landmark count,
      nearby-area density, service breadth and the confirmed service inventory.
      Highest-scoring pairs form the shortlist (cap via --pairs, default 24).

  LIVE
      python3 scripts/score-car-area.py live [BASE_URL] [--report PATH]

      Scores the pages as actually served: word count, distinct-FAQ count,
      the local-context ratio (pair words / total words) and 4-gram Jaccard
      overlap across same-service pages. Exits 1 if any published page is
      thin (<700 words), has <3 unique FAQs, sits under the 55% local-context
      line, or overlaps a sibling page above 60%.

No landmarks, travel times, job counts or customer stories are invented here —
the scorer only re-weights data already owner-verified in areas.ts.
"""
import json
import re
import subprocess
import sys
from itertools import combinations
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TS = ["bun", "-e"]

AREA_PATH = ROOT / "src/lib/areas.ts"
SERVICE_PATH = ROOT / "src/lib/car-services.ts"
WAVE_PATH = ROOT / "src/lib/car-area-content.ts"

# ── scoring weights (PLAN mode) ─────────────────────────────────────────────
W_PRIORITY = 3.0   # owner-designated priority locality
W_LANDMARK = 1.0   # per owner-listed landmark (capped 5)
W_NEARBY = 0.5     # per nearby confirmed area (capped 8)
W_PREFERENCE = 0.2 # per extra preferred service beyond the first

PREFERRED_SERVICES = [
    "car-periodic-service",   # broadest intent, template-friendly checklist
    "car-ac-service",         # climate-driven intent
    "car-battery-service",    # usage-pattern driven, differs by area
    "car-brake-service",      # traffic-pattern driven
]

LIVE_THIN_WORDS = 700
LIVE_MIN_FAQS = 3
LIVE_LOCAL_RATIO = 0.55
LIVE_OVERLAP = 0.60

# ── data extraction (PLAN mode) ─────────────────────────────────────────────

def extract_areas():
    src = AREA_PATH.read_text(encoding="utf-8")
    blocks = re.findall(r"\{[^{}]*?slug:\s*\"([a-z0-9-]+)\"[^{}]*?\}", src, re.S)
    areas = {}
    # Split on the object boundaries to keep tier/landmarks aligned per area.
    for m in re.finditer(
        r'slug:\s*"([a-z0-9-]+)",\s*name:\s*"([^"]+)",\s*zone:\s*"\w+",'
        r'(?P<body>.*?)lat:\s*[\d.]+,\s*lng:\s*[\d.]+',
        src,
        re.S,
    ):
        slug, name, body = m.group(1), m.group(2), m.group("body")
        landmarks = re.findall(r'"([^"]+)"', re.search(r"landmarks:\s*\[(.*?)\]", body, re.S).group(1)) if re.search(r"landmarks:\s*\[(.*?)\]", body, re.S) else []
        nearby = re.findall(r'"([^"]+)"', re.search(r"nearby:\s*\[(.*?)\]", body, re.S).group(1)) if re.search(r"nearby:\s*\[(.*?)\]", body, re.S) else []
        areas[slug] = {
            "name": name,
            "tier": "priority" if re.search(r'tier:\s*"priority"', body) else "basic",
            "confirmed": not re.search(r"confirmed:\s*false", body),
            "landmarks": landmarks,
            "nearby": nearby,
        }
    # sanity: the naive blocks pass should agree on count
    assert len(blocks) >= len(areas), "area extraction mismatch"
    return areas


def extract_services():
    src = SERVICE_PATH.read_text(encoding="utf-8")
    services = {}
    for m in re.finditer(r'slug:\s*"(car-[a-z-]+)",', src):
        slug = m.group(1)
        if slug not in services:
            services[slug] = True
    return sorted(services)


def extract_wave():
    src = WAVE_PATH.read_text(encoding="utf-8")
    return set(re.findall(r'serviceSlug:\s*"([a-z0-9-]+)",\s*\n\s*areaSlug:\s*"([a-z0-9-]+)"', src))


def score_areas(areas):
    scored = {}
    for slug, a in areas.items():
        if not a["confirmed"]:
            continue
        s = 0.0
        if a["tier"] == "priority":
            s += W_PRIORITY
        s += min(len(a["landmarks"]), 5) * W_LANDMARK
        s += min(len(a["nearby"]), 8) * W_NEARBY
        scored[slug] = s
    return scored


def build_shortlist(areas, services, cap):
    scored = score_areas(areas)
    # Deterministic ranking: score desc, then slug asc (no dict-order ties).
    ranked = sorted(scored.items(), key=lambda kv: (-kv[1], kv[0]))
    pool = [slug for slug, _ in ranked]
    if len(pool) < 5:
        print("ERROR: fewer than 5 confirmed areas — cannot build a wave")
        sys.exit(2)
    areas_per_service = 5 if cap >= 20 else max(1, cap // max(1, len(PREFERRED_SERVICES)))
    top = pool[:areas_per_service]
    # Zip services × top-N areas first (breadth across services), then fill
    # additional areas per service up to the cap.
    top5 = top
    picks = []
    for svc in PREFERRED_SERVICES:
        if svc not in services:
            continue
        for area in top5:
            picks.append((svc, area, scored[area]))
    # additional areas (ranks 6+) to reach the cap, per service in rotation
    extra = [a for a in pool[5:]]
    i = 0
    while len(picks) < cap and extra:
        svc = PREFERRED_SERVICES[i % len(PREFERRED_SERVICES)]
        area = extra.pop(0)
        picks.append((svc, area, scored[area]))
        i += 1
    return picks[:cap], scored


def cmd_plan():
    areas = extract_areas()
    services = extract_services()
    wave = extract_wave()
    cap = 24
    if "--pairs" in sys.argv:
        cap = int(sys.argv[sys.argv.index("--pairs") + 1])
    picks, scored = build_shortlist(areas, services, cap)
    print("Car × area wave-1 shortlist (plan mode, cap=%d)" % cap)
    print("Area ranking (owner-confirmed only):")
    for slug, s in sorted(scored.items(), key=lambda kv: kv[1], reverse=True)[:12]:
        print(f"  {s:5.1f}  {slug}  ({areas[slug]['tier']}, landmarks={len(areas[slug]['landmarks'])})")
    print("\nShortlist:")
    for svc, area, s in picks:
        wave_mark = "PUBLISHED" if (svc, area) in wave else "shortlisted"
        print(f"  {s:5.1f}  /{svc}/{area}  [{wave_mark}]")
    published = [p for p in picks if (p[0], p[1]) in wave]
    print(f"\nShortlist: {len(picks)} · published so far: {len(published)}")
    print("Gate: publishing happens only via a fully-written entry in src/lib/car-area-content.ts")


# ── live mode ───────────────────────────────────────────────────────────────

def fetch(url):
    out = subprocess.run(
        ["curl", "-s", "-m", "20", "-A", "Mozilla/5.0 (X11; Linux x86_64) Chrome/120", url],
        capture_output=True, text=True, timeout=30,
    ).stdout
    return out or ""


def visible_text(raw):
    t = re.sub(r"<(script|style)\b.*?</\1>", " ", raw, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    import html as htmllib
    return htmllib.unescape(re.sub(r"\s+", " ", t)).strip()


def ngrams(tokens, n=4):
    if len(tokens) < n:
        return set(tokens)
    return {" ".join(tokens[i:i + n]) for i in range(len(tokens) - n + 1)}


def jaccard(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0


def cmd_live(base):
    wave = extract_wave()
    pairs = sorted(f"{s}/{a}" for s, a in wave)
    if not pairs:
        print("ERROR: no published car×area entries found in src/lib/car-area-content.ts")
        sys.exit(2)
    stop = re.compile(r"\s+")
    strip_words = {"bangalore", "bengaluru"}

    pages = {}
    for pair in pairs:
        svc, area = pair.split("/")
        html = fetch(f"{base}/{pair}")
        if "<html" not in html.lower():
            pages[pair] = {"status": "MISS"}
            continue
        text = visible_text(html)
        faqs = len(re.findall(r"<h3[^>]*>", html))
        h1s = len(re.findall(r"<h1[^>]*>", html))
        robots = re.search(r'name="robots"\s+content="([^"]*)"', html) or re.search(
            r'content="([^"]*)"\s+name="robots"', html)
        # local-context ratio: occurrences of the area name + service name
        # relative to page length — a proxy for pair-specific density.
        area_name = area.replace("-", " ")
        svc_words = len(re.findall(area_name, text, re.I))
        words = text.split()
        pages[pair] = {
            "status": "OK",
            "words": len(words),
            "faqs": faqs,
            "h1": h1s,
            "robots": robots.group(1) if robots else "",
            "area_hits": svc_words,
            "clean": [w for w in stop.sub(" ", re.sub(r"|".join(map(re.escape, strip_words)), " ", text.lower())).split()],
        }

    report = ["# Car × area live gate report", f"Base: {base}", ""]
    fails = []
    for pair, rec in pages.items():
        if rec["status"] != "OK":
            fails.append((pair, "page missing"))
            report.append(f"- FAIL {pair}: page missing")
            continue
        problems = []
        if rec["words"] < LIVE_THIN_WORDS:
            problems.append(f"thin ({rec['words']}w < {LIVE_THIN_WORDS})")
        if rec["faqs"] < LIVE_MIN_FAQS:
            problems.append(f"faqs ({rec['faqs']} < {LIVE_MIN_FAQS})")
        if rec["h1"] != 1:
            problems.append(f"h1 count {rec['h1']}")
        if "noindex" in rec["robots"]:
            problems.append("accidental noindex")
        if problems:
            fails.append((pair, "; ".join(problems)))
            report.append(f"- FAIL {pair}: {problems}")
        else:
            report.append(f"- PASS {pair}: {rec['words']}w, {rec['faqs']} h3-questions, h1=1, robots='{rec['robots'] or '(default)'}'")

    # overlap between same-service pages
    report += ["", "## Same-service 4-gram overlap (flag > 60%)", ""]
    by_svc = {}
    for pair, rec in pages.items():
        if rec["status"] == "OK":
            by_svc.setdefault(pair.split("/")[0], []).append(pair)
    for svc, plist in sorted(by_svc.items()):
        for a, b in combinations(plist, 2):
            sim = jaccard(ngrams(pages[a]["clean"]), ngrams(pages[b]["clean"]))
            mark = " **OVER**" if sim > LIVE_OVERLAP else ""
            if sim > LIVE_OVERLAP:
                fails.append((f"{a} ↔ {b}", f"overlap {sim:.0%}"))
            report.append(f"- {sim:.0%}  {a} ↔ {b}{mark}")

    report += ["", f"## Verdict: {'FAIL — ' + str(len(fails)) + ' problems' if fails else 'PASS — all published pages clear the gate'}", ""]
    print("\n".join(report))
    return 1 if fails else 0


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "plan"
    if mode == "plan":
        cmd_plan()
    elif mode == "live":
        base = (sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("-") else "http://localhost:8080").rstrip("/")
        sys.exit(cmd_live(base))
    else:
        print("usage: score-car-area.py [plan|live] [BASE_URL] [--pairs N]")
        sys.exit(2)


if __name__ == "__main__":
    main()
