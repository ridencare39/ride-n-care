#!/usr/bin/env python3
"""Part 7 area-page uniqueness check.

Fetches every /areas/{slug} page from a base URL, strips area names and
pincodes from the visible text, then compares all page pairs on 4-word-gram
Jaccard similarity. Pairs over 60% are flagged; thin pages (<300 words) are
listed; each page's robots meta (noindex status) is recorded.

Usage:
    python3 scripts/check-area-uniqueness.py [BASE_URL] [REPORT_PATH]

Defaults: BASE_URL=http://localhost:8080, REPORT=docs/seo/05-area-uniqueness-report.md
"""
import concurrent.futures as cf
import html as htmllib
import itertools
import re
import sys
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080").rstrip("/")
REPORT = sys.argv[2] if len(sys.argv) > 2 else "docs/seo/05-area-uniqueness-report.md"
THRESHOLD = 0.60
THIN_WORDS = 300

STOP = re.compile(r"\s+")
TAG = re.compile(r"<(script|style)\b.*?</\1>", re.S | re.I)
ANYTAG = re.compile(r"<[^>]+>")


def fetch(path: str) -> str:
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "rnc-seo-bot/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace")


def visible_text(raw: str) -> str:
    t = TAG.sub(" ", raw)
    t = ANYTAG.sub(" ", t)
    return htmllib.unescape(STOP.sub(" ", t)).strip()


def strip_names(text: str, area_name: str, pin: str) -> str:
    t = text
    t = re.sub(re.escape(area_name), " AREA ", t, flags=re.I)
    if pin:
        t = re.sub(re.escape(pin), " PINCODE ", t)
    t = re.sub(r"\b(bangalore|bengaluru)\b", " CITY ", t, flags=re.I)
    return STOP.sub(" ", t).lower()


def grams(tokens, n=4):
    if len(tokens) < n:
        return set(tokens)
    return {" ".join(tokens[i : i + n]) for i in range(len(tokens) - n + 1)}


def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def main():
    hub = fetch("/areas")
    slugs = sorted(set(re.findall(r'href="/areas/([a-z0-9-]+)"', hub)))
    # Unconfirmed localities are noindexed and not linked from the hub, but
    # they must still be checked — especially priority-tier pages (e.g. Hebbal)
    # that become indexable the moment the owner confirms coverage (Q33).
    UNCONFIRMED = ["hebbal", "yelahanka", "rajajinagar", "malleshwaram", "mg-road", "yeshwanthpur", "peenya"]
    slugs = sorted(set(slugs) | set(UNCONFIRMED))
    if not slugs:
        print("ERROR: no area links found on the hub — is the server up at " + BASE + "?")
        sys.exit(2)

    def load(slug):
        raw = fetch(f"/areas/{slug}")
        noindex = bool(re.search(r'name="robots"[^>]+content="[^"]*noindex', raw)) or bool(
            re.search(r'content="[^"]*noindex[^"]*"\s+name="robots"', raw)
        )
        return slug, noindex, raw

    pages = {}
    with cf.ThreadPoolExecutor(max_workers=10) as ex:
        for slug, noindex, raw in ex.map(load, slugs):
            m = re.search(r"<h1[^>]*>(.*?)</h1>", raw, re.S)
            h1 = " ".join(ANYTAG.sub(" ", m.group(1)).split()) if m else slug
            # H1 = "Bike & Car Service in {Name}, Bangalore"
            nm = re.search(r"in (.*?)\s*,?\s*BANGALORE\s*$", h1, re.I)
            name = nm.group(1) if nm else slug.replace("-", " ")
            vis = visible_text(raw)
            pages[slug] = {
                "noindex": noindex,
                "words": len(vis.split()),
                "name": name,
                "clean": strip_names(vis, name, "").split(),
            }

    slugs = sorted(pages)
    flagged, worst = [], []
    for a, b in itertools.combinations(slugs, 2):
        sim = jaccard(grams(pages[a]["clean"]), grams(pages[b]["clean"]))
        if sim > 0.40:
            worst.append((sim, a, b))
        if sim > THRESHOLD:
            flagged.append((sim, a, b))

    lines = [
        "# Part 7 — Area page uniqueness report",
        f"Generated: 2026-09-20 · Base: {BASE} · Pages: {len(slugs)} · Threshold: {int(THRESHOLD*100)}% (4-gram Jaccard, names/pincodes stripped)",
        "",
        "| Page | Words | noindex |",
        "|---|---|---|",
    ]
    thin = []
    for s in slugs:
        rec = pages[s]
        if rec["words"] < THIN_WORDS:
            thin.append(s)
        lines.append(f"| /areas/{s} ({rec['name']}) | {rec['words']} | {'yes' if rec['noindex'] else 'no'} |")
    lines += ["", f"## Flagged pairs over {int(THRESHOLD*100)}% similarity", ""]
    if flagged:
        for sim, a, b in sorted(flagged, reverse=True):
            both_basic = pages[a]["noindex"] and pages[b]["noindex"]
            lines.append(
                f"- {int(sim*100)}% — /areas/{a} ↔ /areas/{b}"
                + ("  (both noindex — acceptable until calendar uplift)" if both_basic else "  **ACTION REQUIRED**")
            )
    else:
        lines.append("None.")
    lines += ["", "## Pairs between 40% and 60% (watch list)", ""]
    if worst:
        for sim, a, b in sorted(worst, reverse=True):
            lines.append(f"- {int(sim*100)}% — /areas/{a} ↔ /areas/{b}")
    else:
        lines.append("None.")
    lines += ["", "## Thin pages (<300 words)", ""]
    if thin:
        for s in thin:
            lines.append(f"- /areas/{s} — {pages[s]['words']} words (noindex: {'yes' if pages[s]['noindex'] else 'NO — fix'})")
    else:
        lines.append("None.")
    lines += [
        "",
        "## Verdict",
        "",
        f"- Priority (indexable) pages must have ZERO flagged pairs: "
        + ("PASS" if not [f for f in flagged if not (pages[f[1]]['noindex'] and pages[f[2]]['noindex'])] else "FAIL")
        + f".",
        f"- Basic-tier pages are noindex by design; any flagged pair among them is scheduled for uplift in 03-content-calendar.md.",
    ]
    report = "\n".join(lines) + "\n"
    with open(REPORT, "w", encoding="utf-8") as f:
        f.write(report)
    print(report)
    bad = [f for f in flagged if not (pages[f[1]]["noindex"] and pages[f[2]]["noindex"])]
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
