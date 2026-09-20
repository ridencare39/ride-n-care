import { SITE_URL, OG_IMAGE } from "@/lib/seo";

/** Paths kept out of search + AI indexes (mirrored in public/robots.txt). */
export const PAGE_ROBOTS = [
  "/track-booking",
  "/auth",
  "/admin",
  "/isolate",
  "/seo-monitor",
  "/map",
] as const;

export interface PageMeta {
  /** Unique title, ideally 50–60 characters: primary keyword + Bangalore + brand. */
  title: string;
  /** Benefit + CTA description, ideally 140–160 characters. */
  description: string;
  /** Canonical path on the preferred host, e.g. "/bike-service". */
  path: string;
  /** Per-page OG image; falls back to the default brand image. */
  ogImage?: string;
  /** Override for special pages, e.g. "noindex, nofollow". */
  robots?: string;
  /** Extra meta tags appended after the standard set (article:*, og overrides…). */
  extraMeta?: { name?: string; property?: string; content: string }[];
}

/**
 * One reusable head block: title, meta description, canonical (absolute https,
 * preferred host), robots, Open Graph, Twitter cards and en-IN locale.
 */
export function pageHead({ title, description, path, ogImage, robots, extraMeta }: PageMeta) {
  const url = `${SITE_URL}${path}`;
  const image = ogImage ?? OG_IMAGE;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(robots ? [{ name: "robots", content: robots }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:image", content: image },
      { property: "og:locale", content: "en_IN" },
      { property: "og:site_name", content: "Ride N Care" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      ...(extraMeta ?? []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** JSON-LD <script> descriptors for one or more schema objects. */
export function pageScripts(...objects: unknown[]) {
  return objects.map((obj) => ({
    type: "application/ld+json",
    children: JSON.stringify(obj),
  }));
}

/** BreadcrumbList JSON-LD from [name, path-or-absolute-url] pairs. */
export function breadcrumbs(crumbs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: path.startsWith("http") ? path : `${SITE_URL}${path}`,
    })),
  };
}

/** ItemList JSON-LD pointing at sibling service pages (related-services module). */
export function relatedServicesJsonLd(services: { slug: string; name: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/${s.slug}`,
    })),
  };
}

/** ItemList JSON-LD pointing at nearby area pages (nearby-areas module). */
export function nearbyAreasJsonLd(areas: { slug: string; name: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: areas.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${a.name}, Bangalore`,
      url: `${SITE_URL}/areas/${a.slug}`,
    })),
  };
}

/**
 * Trim a "…, Bangalore | Ride N Care" title to <=60 chars by dropping the
 * city qualifier when the area name alone already identifies the page.
 */
export function seoTitle(primary: string, area: string) {
  const full = `${primary} in ${area}, Bangalore | Ride N Care`;
  if (full.length <= 60) return full;
  return `${primary} in ${area} | Ride N Care`;
}
