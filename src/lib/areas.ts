/**
 * The ONE data file for Bangalore localities (Part 7).
 * Everything coverage-related is generated from here: the homepage coverage
 * chips, /areas hub, /areas/{slug} pages, schema areaServed and the sitemap.
 *
 * Rules:
 * - `nearby` entries must be names that exist in AREAS below, so nearby-area
 *   links always resolve to a real page.
 * - `landmarks` are only well-known roads, metro stations, lakes, malls or
 *   tech parks (3–5, no invented claims). Every landmark is listed in
 *   docs/seo/OWNER-QUESTIONS.md for the owner's local verification.
 * - Coverage for ALL localities below is owner-confirmed (Q3, 21 Sep 2026;
 *   owner answered Q33). Indexability depends only on `tier`: priority pages
 *   are indexable and listed in the sitemap; basic pages stay noindex,follow
 *   and out of the sitemap until they are uplifted.
 * - `tier: "priority"` = localities with unique copy in
 *   src/lib/area-content.ts (the 12 Part-7 guides plus the 5 approved P0
 *   guides added 2026-10-05). Everything else is "basic" (data-driven; see
 *   docs/seo/03-content-calendar.md).
 */
export interface Area {
  slug: string;
  name: string;
  zone: "Central" | "North" | "South" | "East" | "West";
  pincode?: string;
  nearby?: string[];
  lat: number;
  lng: number;
  landmarks?: string[];
  /** Owner-confirmed coverage (Q3). Default true for east/south localities. */
  confirmed?: boolean;
  /** Content depth. "priority" pages carry unique copy; "basic" is data-driven. */
  tier?: "priority" | "basic";
}

export const AREAS: Area[] = [
  // --- East Bangalore (confirmed) ---
  { slug: "indiranagar", name: "Indiranagar", zone: "East", pincode: "560038", tier: "priority", confirmed: true,
    nearby: ["Domlur", "HAL", "Ejipura", "Koramangala", "Madiwala"],
    landmarks: ["100 Feet Road", "Indiranagar Metro Station", "CMH Road", "12th Main Road", "Old Airport Road"], lat: 12.9784, lng: 77.6408 },
  { slug: "whitefield", name: "Whitefield", zone: "East", pincode: "560066", tier: "priority", confirmed: true,
    nearby: ["Brookefield", "Varthur", "Mahadevapura", "Gunjur"],
    landmarks: ["ITPL (International Tech Park)", "Phoenix Marketcity", "Whitefield Railway Station", "Varthur Main Road"], lat: 12.9698, lng: 77.75 },
  { slug: "marathahalli", name: "Marathahalli", zone: "East", pincode: "560037", tier: "priority", confirmed: true,
    nearby: ["Bellandur", "Brookefield", "HAL", "Kadubeesanahalli", "Panathur Road"],
    landmarks: ["Marathahalli Bridge", "Outer Ring Road junction", "AECS Layout", "Kundalahalli Gate"], lat: 12.9569, lng: 77.7011 },
  { slug: "bellandur", name: "Bellandur", zone: "East", pincode: "560103", tier: "priority", confirmed: true,
    nearby: ["Sarjapur Road", "Marathahalli", "HSR Layout", "Panathur Road", "Kadubeesanahalli"],
    landmarks: ["Bellandur Lake", "Iblur Junction", "RMZ Ecospace", "Outer Ring Road"], lat: 12.9304, lng: 77.6784 },
  { slug: "sarjapur-road", name: "Sarjapur Road", zone: "East", pincode: "560035", tier: "priority", confirmed: true,
    nearby: ["Bellandur", "HSR Layout", "Kasavanahalli", "Harlur", "Choodasandra"],
    landmarks: ["Wipro Gate (Sarjapur Road)", "Kaikondrahalli Lake", "Sarjapur Road–ORR junction", "Harlur Road"], lat: 12.901, lng: 77.6874 },
  { slug: "kalyan-nagar", name: "Kalyan Nagar", zone: "East", pincode: "560043",
    nearby: ["KR Puram", "Hebbal", "Indiranagar"],
    landmarks: ["Hennur Main Road", "Banaswadi", "HRBR Layout"], lat: 13.0246, lng: 77.6408 },
  { slug: "mahadevapura", name: "Mahadevapura", zone: "East", pincode: "560048", tier: "priority",
    nearby: ["KR Puram", "Whitefield", "Marathahalli", "Brookefield", "Kadubeesanahalli"],
    landmarks: ["Doddanekkundi", "Varthur Road", "Outer Ring Road (Mahadevapura stretch)"], lat: 12.991, lng: 77.6994 },
  { slug: "kr-puram", name: "KR Puram", zone: "East", pincode: "560036", tier: "priority",
    nearby: ["Mahadevapura", "Kalyan Nagar", "Whitefield"],
    landmarks: ["KR Puram Railway Station", "Tin Factory Junction", "Old Madras Road", "KR Puram Bridge"], lat: 13.0076, lng: 77.6952 },
  { slug: "hal", name: "HAL", zone: "East", pincode: "560017",
    nearby: ["Marathahalli", "Domlur", "Indiranagar", "Ejipura"],
    landmarks: ["HAL Aerospace Museum", "Old Airport Road", "Suranjan Das Road", "HAL 2nd Stage"], lat: 12.9578, lng: 77.6663 },
  { slug: "brookefield", name: "Brookefield", zone: "East", pincode: "560037",
    nearby: ["Whitefield", "Marathahalli", "Mahadevapura"],
    landmarks: ["Kundalahalli", "Phoenix Marketcity", "Graphite India Road"], lat: 12.9698, lng: 77.7169 },
  { slug: "varthur", name: "Varthur", zone: "East", pincode: "560087",
    nearby: ["Whitefield", "Gunjur", "Panathur Road", "Kadubeesanahalli"],
    landmarks: ["Varthur Lake", "Varthur Kodi", "Varthur Main Road"], lat: 12.9384, lng: 77.7476 },
  { slug: "gunjur", name: "Gunjur", zone: "East", pincode: "560087",
    nearby: ["Varthur", "Panathur Road", "Sarjapur Road"],
    landmarks: ["Gunjur Main Road", "Varthur Road", "Balagere"], lat: 12.9146, lng: 77.7175 },
  { slug: "kasavanahalli", name: "Kasavanahalli", zone: "East", pincode: "560035",
    nearby: ["Sarjapur Road", "Harlur", "Choodasandra"],
    landmarks: ["Kasavanahalli Main Road", "Sarjapur Road", "Harlur Road"], lat: 12.9068, lng: 77.6706 },
  { slug: "panathur-road", name: "Panathur Road", zone: "East", pincode: "560103",
    nearby: ["Kadubeesanahalli", "Bellandur", "Varthur", "Gunjur", "Marathahalli"],
    landmarks: ["Panathur Road", "Balagere", "Varthur Kodi"], lat: 12.9346, lng: 77.6928 },
  { slug: "kadubeesanahalli", name: "Kadubeesanahalli", zone: "East", pincode: "560103",
    nearby: ["Panathur Road", "Bellandur", "Marathahalli", "Mahadevapura"],
    landmarks: ["Outer Ring Road", "RMZ Ecospace", "Panathur"], lat: 12.9385, lng: 77.6968 },
  { slug: "domlur", name: "Domlur", zone: "East", pincode: "560071",
    nearby: ["Indiranagar", "HAL", "Ejipura", "MG Road"],
    landmarks: ["Old Airport Road", "Embassy GolfLinks (EGL)", "Domlur Layout"], lat: 12.9608, lng: 77.6387 },

  // --- South Bangalore (confirmed) ---
  { slug: "koramangala", name: "Koramangala", zone: "South", pincode: "560034", tier: "priority", confirmed: true,
    nearby: ["HSR Layout", "BTM Layout", "Ejipura", "Madiwala", "Domlur"],
    landmarks: ["Forum Mall", "Sony World Junction", "Jyoti Nivas College", "80 Feet Road", "St. John's Hospital"], lat: 12.9352, lng: 77.6245 },
  { slug: "hsr-layout", name: "HSR Layout", zone: "South", pincode: "560102", tier: "priority", confirmed: true,
    nearby: ["Koramangala", "Bellandur", "BTM Layout", "Harlur", "Madiwala"],
    landmarks: ["27th Main Road", "Agara Lake", "BDA Complex Sector 2", "Sector 7 HSR"], lat: 12.9116, lng: 77.6389 },
  { slug: "btm-layout", name: "BTM Layout", zone: "South", pincode: "560076", tier: "priority", confirmed: true,
    nearby: ["JP Nagar", "Koramangala", "Madiwala", "Bommanahalli", "Ejipura"],
    landmarks: ["16th Main Road", "Silk Board Junction", "Madiwala Checkpost", "BTM 2nd Stage"], lat: 12.9166, lng: 77.6101 },
  { slug: "jayanagar", name: "Jayanagar", zone: "South", pincode: "560011", tier: "priority", confirmed: true,
    nearby: ["JP Nagar", "Banashankari", "BTM Layout", "Madiwala", "Koramangala"],
    landmarks: ["4th Block Shopping Complex", "South End Circle", "Jayanagar Metro Station", "11th Main Road"], lat: 12.925, lng: 77.5938 },
  { slug: "jp-nagar", name: "JP Nagar", zone: "South", pincode: "560078", tier: "priority", confirmed: true,
    nearby: ["Jayanagar", "Banashankari", "Bannerghatta Road", "BTM Layout", "Kanakapura Road"],
    landmarks: ["Jayadeva Hospital", "JP Nagar Metro Station", "Puttenahalli Lake", "Bannerghatta Road junction"], lat: 12.9063, lng: 77.5857 },
  { slug: "electronic-city", name: "Electronic City", zone: "South", pincode: "560100", tier: "priority", confirmed: true,
    nearby: ["Bommanahalli", "Singasandra", "Parappana Agrahara", "Kudlu Gate", "HSR Layout"],
    landmarks: ["Infosys Gate (Phase 1)", "Wipro Gate (Electronic City)", "Electronic City Flyover", "Hosur Road", "Neeladri Road"], lat: 12.8452, lng: 77.6602 },
  { slug: "banashankari", name: "Banashankari", zone: "South", pincode: "560070", tier: "priority",
    nearby: ["JP Nagar", "Jayanagar", "Kanakapura Road"],
    landmarks: ["Banashankari Temple", "Kanakapura Road junction", "Banashankari Metro Station"], lat: 12.925, lng: 77.546 },
  { slug: "bannerghatta-road", name: "Bannerghatta Road", zone: "South", pincode: "560076",
    nearby: ["JP Nagar", "Banashankari", "BTM Layout"],
    landmarks: ["Meenakshi Mall", "IIM Bangalore", "Hulimavu", "Bannerghatta Biological Park"], lat: 12.8875, lng: 77.5967 },
  { slug: "kanakapura-road", name: "Kanakapura Road", zone: "South", pincode: "560062",
    nearby: ["Banashankari", "JP Nagar"],
    landmarks: ["Kanakapura Main Road", "Konanakunte", "Vasanthapura", "Turahalli Forest"], lat: 12.8875, lng: 77.546 },
  { slug: "ejipura", name: "Ejipura", zone: "South", pincode: "560047",
    nearby: ["Koramangala", "Indiranagar", "Domlur", "Madiwala"],
    landmarks: ["Viveknagar", "Ejipura Main Road", "80 Feet Road (Koramangala)"], lat: 12.9414, lng: 77.6285 },
  { slug: "bommanahalli", name: "Bommanahalli", zone: "South", pincode: "560068",
    nearby: ["Singasandra", "Kudlu Gate", "HSR Layout", "BTM Layout", "Madiwala"],
    landmarks: ["Hosur Road", "Bommanahalli Junction", "Kudlu Gate"], lat: 12.8996, lng: 77.6186 },
  { slug: "kudlu-gate", name: "Kudlu Gate", zone: "South", pincode: "560068",
    nearby: ["Bommanahalli", "Singasandra", "Parappana Agrahara", "HSR Layout", "Electronic City"],
    landmarks: ["Kudlu Gate", "Hosur Road", "Parappana Agrahara"], lat: 12.8843, lng: 77.6462 },
  { slug: "madiwala", name: "Madiwala", zone: "South", pincode: "560068", tier: "priority",
    nearby: ["BTM Layout", "Koramangala", "HSR Layout", "Ejipura", "Bommanahalli"],
    landmarks: ["Madiwala Checkpost", "Madiwala Market", "Silk Board Junction", "St. John's Hospital"], lat: 12.9223, lng: 77.6199 },
  { slug: "harlur", name: "Harlur", zone: "South", pincode: "560102",
    nearby: ["HSR Layout", "Kasavanahalli", "Sarjapur Road", "Bellandur"],
    landmarks: ["Harlur Road", "Sarjapur Road junction", "Kasavanahalli"], lat: 12.9078, lng: 77.6528 },
  { slug: "singasandra", name: "Singasandra", zone: "South", pincode: "560068",
    nearby: ["Bommanahalli", "Kudlu Gate", "Parappana Agrahara", "Electronic City"],
    landmarks: ["Hosur Road", "Singasandra", "Hosa Road"], lat: 12.8797, lng: 77.6396 },
  { slug: "parappana-agrahara", name: "Parappana Agrahara", zone: "South", pincode: "560100",
    nearby: ["Electronic City", "Kudlu Gate", "Singasandra", "Bommanahalli"],
    landmarks: ["Parappana Agrahara", "Kudlu Gate", "Hosa Road"], lat: 12.8836, lng: 77.6535 },
  { slug: "choodasandra", name: "Choodasandra", zone: "South", pincode: "560099",
    nearby: ["Kasavanahalli", "Sarjapur Road", "Harlur"],
    landmarks: ["Sarjapur Road", "Hosa Road", "Kasavanahalli"], lat: 12.8768, lng: 77.6741 },

  // --- North / West / Central Bangalore — coverage NOT yet owner-confirmed (Q3). ---
  // Pages stay live but are noindexed and excluded from areaServed + sitemap
  // until the owner confirms each locality. See docs/seo/OWNER-QUESTIONS.md.
  { slug: "hebbal", name: "Hebbal", zone: "North", pincode: "560024", tier: "priority", confirmed: true,
    nearby: ["Yelahanka", "Kalyan Nagar", "KR Puram", "Yeshwanthpur"],
    landmarks: ["Hebbal Flyover", "Hebbal Lake", "Manyata Tech Park", "Esteem Mall"], lat: 13.0358, lng: 77.597 },
  { slug: "yelahanka", name: "Yelahanka", zone: "North", pincode: "560064", confirmed: true,
    nearby: ["Hebbal"],
    landmarks: ["Yelahanka New Town", "Yelahanka Railway Station", "Doddaballapur Road"], lat: 13.1007, lng: 77.5963 },
  { slug: "rajajinagar", name: "Rajajinagar", zone: "West", pincode: "560010", confirmed: true,
    nearby: ["Malleshwaram", "Yeshwanthpur", "MG Road"],
    landmarks: ["Orion Mall", "Dr. Rajkumar Road", "1st Block Rajajinagar", "Magadi Road"], lat: 12.9911, lng: 77.5522 },
  { slug: "malleshwaram", name: "Malleshwaram", zone: "Central", pincode: "560003", confirmed: true,
    nearby: ["Rajajinagar", "Yeshwanthpur", "MG Road"],
    landmarks: ["Mantri Square", "Sankey Tank", "Malleshwaram 8th Cross", "Margosa Road"], lat: 13.0035, lng: 77.5709 },
  { slug: "mg-road", name: "MG Road", zone: "Central", pincode: "560001", tier: "priority", confirmed: true,
    nearby: ["Malleshwaram", "Domlur", "Indiranagar"],
    landmarks: ["MG Road Metro Station", "Trinity Junction", "Brigade Road", "Chinnaswamy Stadium"], lat: 12.9752, lng: 77.606 },
  { slug: "yeshwanthpur", name: "Yeshwanthpur", zone: "West", pincode: "560022", confirmed: true,
    nearby: ["Malleshwaram", "Rajajinagar", "Peenya", "Hebbal"],
    landmarks: ["Yeshwanthpur Railway Station", "Tumkur Road (NH 48)", "Goraguntepalya Junction", "Mathikere"], lat: 13.0284, lng: 77.554 },
  { slug: "peenya", name: "Peenya", zone: "West", pincode: "560058", confirmed: true,
    nearby: ["Yeshwanthpur"],
    landmarks: ["Peenya Industrial Area", "Peenya Metro Station", "Tumkur Road", "Jalahalli"], lat: 13.029, lng: 77.515 },
];

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);

/** Fully-detailed localities: the 12 Part-7 guides + the 5 approved P0 guides (2026-10-05). */
export const PRIORITY_AREA_SLUGS = [
  "hsr-layout", "koramangala", "indiranagar", "whitefield", "electronic-city", "marathahalli",
  "bellandur", "btm-layout", "sarjapur-road", "jp-nagar", "jayanagar", "hebbal",
  "kr-puram", "mahadevapura", "madiwala", "banashankari", "mg-road",
] as const;

export const PRIORITY_AREAS = PRIORITY_AREA_SLUGS
  .map((s) => AREAS.find((a) => a.slug === s)!)
  .filter(Boolean);

/** Owner-confirmed localities (Q3). Unconfirmed = noindex + excluded from areaServed/sitemap. */
export const CONFIRMED_AREAS = AREAS.filter((a) => a.confirmed !== false);

export const isConfirmedArea = (a: Area | undefined) => Boolean(a && a.confirmed !== false);

/** Indexable = confirmed coverage AND full (priority) content. Everything else is noindex,follow. */
export const isAreaIndexed = (a: Area | undefined) => Boolean(a && isConfirmedArea(a) && a.tier === "priority");

export const areaRobots = (a: Area | undefined) => (isAreaIndexed(a) ? undefined : "noindex, follow");

/* ── Coverage copy helpers — the ONE source of truth for every place that
   names or counts localities (homepage FAQ, /areas, footer, answers,
   llms.txt, breakdown pages). Copy must never hard-code counts. ── */

/** Zones present in the confirmed data, lowercase, e.g. ["east", "south"]. */
export const CONFIRMED_ZONES = [...new Set(CONFIRMED_AREAS.map((a) => a.zone.toLowerCase()))];

/** Data-derived zone phrase, e.g. "east and south Bangalore". */
export const CONFIRMED_ZONE_PHRASE =
  CONFIRMED_ZONES.length > 1
    ? `${CONFIRMED_ZONES.slice(0, -1).join(", ")} and ${CONFIRMED_ZONES[CONFIRMED_ZONES.length - 1]}`
    : (CONFIRMED_ZONES[0] ?? "Bangalore");

/** The coverage sentence stem reused verbatim across pages and llms.txt. */
export const COVERAGE_LINE = `Ride N Care provides doorstep bike and car service in ${CONFIRMED_AREAS.length} confirmed Bangalore localities across ${CONFIRMED_ZONE_PHRASE} Bangalore`;

/** A handful of well-known confirmed locality names for short-copy lists. */
export const COVERAGE_HEADLINE_NAMES = ["Whitefield", "Koramangala", "HSR Layout", "Indiranagar", "Marathahalli", "Electronic City", "Jayanagar"].filter((n) =>
  CONFIRMED_AREAS.some((a) => a.name === n),
);

/** Comma list of the headline names, e.g. "Whitefield, Koramangala, … and Jayanagar". */
export const COVERAGE_NAMES_LIST =
  COVERAGE_HEADLINE_NAMES.length > 1
    ? `${COVERAGE_HEADLINE_NAMES.slice(0, -1).join(", ")} and ${COVERAGE_HEADLINE_NAMES[COVERAGE_HEADLINE_NAMES.length - 1]}`
    : (COVERAGE_HEADLINE_NAMES[0] ?? "Bangalore");
