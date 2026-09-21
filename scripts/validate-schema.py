#!/usr/bin/env python3
"""Part 4 JSON-LD validator: parses every JSON-LD block on sampled pages,
checks required fields, @id resolution, and business-fact consistency
(call vs WhatsApp numbers, no unverified claims). Prints a summary for docs/seo/04-schema-report.md."""
import json, re, subprocess, sys, collections, time

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"

PAGES = [
    "/", "/bikes", "/cars", "/bike-service", "/doorstep-bike-service", "/bike-repair",
    "/car-periodic-service", "/car-ac-service", "/car-battery-service", "/car-brake-service",
    "/car-oil-change", "/car-inspection", "/car-jump-start", "/car-repair", "/car-electrical-repair",
    "/scooter-service", "/emergency-bike-repair", "/bike-breakdown-assistance",
    "/breakdown-assistance", "/car-breakdown-assistance",
    "/engine-repair", "/brake-service", "/battery-service", "/periodic-bike-service",
    "/motorcycle-service", "/areas", "/areas/hsr-layout", "/areas/whitefield",
    "/areas/koramangala", "/areas/electronic-city", "/areas/madiwala",
    "/bike-service/hsr-layout", "/doorstep-bike-service/koramangala",
    "/guides", "/guides/bike-service-guide-bangalore", "/blog", "/answers", "/faq",
    "/answers/bike-service-cost-bangalore", "/answers/car-service-cost-bangalore",
    "/answers/doorstep-vs-garage-bike", "/answers/how-long-bike-service",
    "/answers/areas-covered", "/answers/ev-service-different",
    "/about", "/contact", "/franchise", "/privacy", "/terms",
    "/guarantee", "/sample-invoice",
]

CALL = "+918069409289"
WA_TEL_BAD = re.compile(r"tel:(08296950339|\+?918296950339)")
UNVERIFIED = [
    "12000", "12,000", "4.8", "150+", "50+", "₹200 off", "200 off", "same-day slots", "30 minutes",
    # Owner update 21 Sep 2026: hours wording is "Doorstep visits available 24 hours".
    # These variants/contradictions must not return:
    "24x7", "open 24 hours", "seven days a week", "any time you call",
    "8 AM", "9 PM", "next morning", "not workable",
    # No rating anywhere until the owner fills value + count (never schema-marked):
    "4.7", "4.9", "4.7★", "4.9★", " on Google (",
    # Part 8B claim sweep — these must not return without owner approval (Q37–Q45):
    "seven days a week", "uniformed", "typically attended within",
    "free pickup", "Free Pickup", "Certified pros", "Live updates",
    "details on WhatsApp before dispatch", "name and photo on WhatsApp",
    "usually costs the same or less", "printed invoice", "printed warranty",
    "standard manufacturer warranty", "Brakes & Suspension", "free towing", "minutes away",
    # Combined task Task D — banned from new copy (ProcessGuide, homepage):
    # NOTE: bare "seven days" is NOT banned — the live 7-day workmanship
    # guarantee copy legitimately spells it out. The availability claim form is.
    "certified pros", "live updates", "on time", "on-time", "free pickup & drop",
    "open seven days", "uniformed", "printed price list",
    # Task 1 — the private Gmail must never appear public again (Q51):
    "ridencareinfo@gmail.com", "ridencareinfo", "@gmail.com",
]
IDS_EXPECTED = {
    "https://ridencare.co.in/#organization",
    "https://ridencare.co.in/#localbusiness",
    "https://ridencare.co.in/#website",
}

def fetch(path, retries=2):
    """Fetch with a browser-ish UA and retry — bare rapid curl gets rate-limited."""
    url = BASE + path
    out = ""
    for attempt in range(retries + 1):
        r = subprocess.run(
            ["curl", "-s", "-m", "15", "-A", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36", url],
            capture_output=True, text=True, timeout=30,
        )
        out = r.stdout or ""
        if "<html" in out.lower():
            return out
        time.sleep(3 * (attempt + 1))
    return out

def extract_blocks(html):
    return re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S)

def walk(node, graph_ids, nodes, problems, page, path=""):
    if isinstance(node, dict):
        if "@id" in node:
            graph_ids.add(node["@id"])
        nodes.append((path, node))
        for k, v in node.items():
            walk(v, graph_ids, nodes, problems, page, path + "/" + k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, graph_ids, nodes, problems, page, f"{path}[{i}]")

results = []
fail = 0
for page in PAGES:
    html = fetch(page)
    rec = {"page": page, "blocks": 0, "parsed": 0, "graphs": 0, "errors": [], "warnings": []}
    if not html:
        rec["errors"].append("no HTML returned")
        fail += 1
        results.append(rec)
        continue
    blocks = extract_blocks(html)
    rec["blocks"] = len(blocks)
    all_nodes = []  # (path, node) pairs
    graph_ids = set()
    for b in blocks:
        try:
            data = json.loads(b)
            rec["parsed"] += 1
        except json.JSONDecodeError as e:
            rec["errors"].append(f"JSON parse error: {e}")
            fail += 1
            continue
        if "@graph" in data:
            rec["graphs"] += 1
            if data.get("@context") != "https://schema.org":
                rec["errors"].append("graph missing @context")
            walk(data["@graph"], graph_ids, all_nodes, rec["errors"], page)
        else:
            walk(data if isinstance(data, list) else [data], graph_ids, all_nodes, rec["errors"], page)

    # Real declarations have a @type; bare {"@id": ...} objects are references.
    declared = [(p, n) for p, n in all_nodes if isinstance(n, dict) and n.get("@type")]
    refs = [n for p, n in all_nodes if isinstance(n, dict) and n.get("@id") and not n.get("@type")]

    # duplicate @id declarations within the page (references excluded)
    id_list = [n.get("@id") for p, n in declared if n.get("@id")]
    dupes = [i for i, c in collections.Counter(id_list).items() if c > 1]
    if dupes:
        rec["errors"].append(f"duplicate @id declarations: {dupes}")
        fail += 1

    # every @id reference must resolve to a declared node or a page URL on this site
    declared_ids = set(id_list)
    for n in refs:
        rid = n["@id"]
        if rid not in declared_ids and not rid.startswith("https://ridencare.co.in/"):
            rec["errors"].append(f"unresolvable @id reference: {rid}")
            fail += 1

    # business facts
    joined = json.dumps(all_nodes)

    # Part 8B: banned-claims scan over VISIBLE TEXT (scripts/styles stripped),
    # so a future copy change cannot silently reintroduce removed claims.
    import html as _html
    _vis = re.sub(r"<script.*?</script>", " ", html, flags=re.S)
    _vis = re.sub(r"<style.*?</style>", " ", _vis, flags=re.S)
    _vis = _html.unescape(re.sub(r"<[^>]+>", " ", _vis))
    # Owner-approved claims (21 Sep 2026): "12,000+ customers served" is allowed
    # ONLY on / and /about, ONLY as plain text — never AggregateRating/Review schema.
    if page not in ("/", "/about"):
        for approved in ("12,000+ customers served", "12,000+"):
            if approved.lower() in _vis.lower():
                rec["errors"].append(f"owner-approved claim '{approved}' used outside / and /about")
                fail += 1
        # and the raw banned list stays fully in force there
        _claims = UNVERIFIED
    else:
        # on / and /about the 12,000 ban is lifted; everything else stays banned
        _claims = [c for c in UNVERIFIED if c not in ("12000", "12,000")]
    for claim in _claims:
        if claim.lower() in _vis.lower():
            rec["errors"].append(f"banned claim '{claim}' in page text")
            fail += 1
    if WA_TEL_BAD.search(html.replace("\\/", "/")):
        # check telephone fields specifically in schema
        for n in all_nodes:
            if isinstance(n, dict):
                tel = n.get("telephone")
                tels = tel if isinstance(tel, list) else ([tel] if tel else [])
                for t in tels:
                    if t and "8296950339" in str(t):
                        rec["errors"].append(f"WhatsApp number in telephone field: {t}")
                        fail += 1

    if "8296950339" in joined:
        # allowed only inside url fields (wa.me links)
        for pth, n in all_nodes:
            def check(v, p=""):
                if isinstance(v, dict):
                    for k, vv in v.items():
                        check(vv, p + "/" + k)
                elif isinstance(v, list):
                    for i, vv in enumerate(v):
                        check(vv, f"{p}[{i}]")
                elif isinstance(v, str) and "8296950339" in v:
                    # allowed only in sameAs/urls pointing at wa.me
                    if not (p.endswith("url") or "wa.me" in v):
                        rec["warnings"].append(f"WhatsApp number outside url field at {pth}{p}")
            check(n)
    for claim in UNVERIFIED:
        if claim in joined:
            rec["errors"].append(f"unverified claim '{claim}' inside schema")
            fail += 1
    if " Bangalore" in joined and "Bengaluru" not in joined and page not in ("/blog", "/guides"):
        rec["warnings"].append("schema says 'Bangalore' (spec asks Bengaluru in address fields)")

    # per-type required-field checks
    def req(node, fields):
        missing = [f for f in fields if f not in node or node[f] in ("", None, [])]
        return missing
    for pth, n in declared:
        if not isinstance(n, dict):
            continue
        t = n.get("@type")
        if t == "Organization" or (isinstance(t, list) and "AutoRepair" in t):
            miss = req(n, ["name", "url", "telephone"])
            if miss:
                rec["errors"].append(f"{t} missing {miss}")
                fail += 1
            cp = n.get("contactPoint", [])
            for c in (cp if isinstance(cp, list) else [cp]):
                if c.get("contactType") == "customer service" and CALL not in str(c.get("telephone", "")):
                    rec["errors"].append("customer service contactPoint lacks call number")
                    fail += 1
                if c.get("contactType") == "WhatsApp booking" and "telephone" in c:
                    rec["errors"].append("WhatsApp contactPoint must use url, not telephone")
                    fail += 1
        if t == "Service" and n.get("@id"):
            # full check only for standalone Service nodes (hasOfferCatalog stubs skipped)
            miss = req(n, ["name", "serviceType", "provider", "areaServed", "description", "url"])
            if miss:
                rec["errors"].append(f"Service missing {miss}")
                fail += 1
            prov = n.get("provider", {})
            if isinstance(prov, dict) and prov.get("@id") not in (None, IDS_EXPECTED):
                pass
        if t == "FAQPage":
            for q in n.get("mainEntity", []):
                if not q.get("name") or not q.get("acceptedAnswer", {}).get("text"):
                    rec["errors"].append("FAQ entry missing name/answer")
                    fail += 1
        if t in ("Article", "BlogPosting"):
            miss = req(n, ["headline", "datePublished", "publisher"])
            if miss:
                rec["errors"].append(f"{t} missing {miss}")
                fail += 1
            if "AggregateRating" in joined or "reviewCount" in joined:
                rec["errors"].append("self-serving rating markup present")
                fail += 1
    if "AggregateRating" in joined:
        rec["errors"].append("AggregateRating present (banned)")
        fail += 1

    results.append(rec)

# Task 1 / Part 8B: banned strings must also stay out of llms.txt and the
# sitemap (they are neither a page's visible text nor JSON-LD).
for extra in ("/llms.txt", "/sitemap.xml"):
    body = fetch(extra)
    rec = {"page": extra, "blocks": 0, "parsed": 0, "graphs": 0, "errors": [], "warnings": []}
    if not body:
        rec["errors"].append("no content returned")
        fail += 1
    else:
        low = body.lower()
        for claim in UNVERIFIED:
            if claim.lower() in low:
                rec["errors"].append(f"banned claim '{claim}' present")
                fail += 1
    results.append(rec)

print(f"BASE: {BASE}")
print(f"pages checked: {len(results)}")
print(f"total JSON-LD blocks: {sum(r['blocks'] for r in results)}  parsed OK: {sum(r['parsed'] for r in results)}")
print(f"pages with @graph: {sum(1 for r in results if r['graphs'])}/{len(results)}")
err_pages = [r for r in results if r["errors"]]
warn_pages = [r for r in results if r["warnings"]]
print(f"pages with errors: {len(err_pages)}  with warnings: {len(warn_pages)}")
for r in err_pages:
    print("ERROR", r["page"], r["errors"])
for r in warn_pages:
    print("WARN ", r["page"], r["warnings"])
sys.exit(1 if fail else 0)
