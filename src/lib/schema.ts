import { SITE_URL, OG_IMAGE, SAME_AS, LOGO_URL } from "@/lib/seo";
import { AREAS, CONFIRMED_AREAS, PRIORITY_AREAS } from "@/lib/areas";
import { pageScripts } from "@/lib/head";
export { pageScripts };
// Slim summaries only — schema.ts is imported by the root route, so it must
// not pull the full service content into the shared client bundle.
import { CAR_SERVICE_SUMMARY, SERVICE_SUMMARY } from "@/lib/service-summary";
import { ENTITY_SUMMARY } from "@/lib/answers";

/** Stable entity @ids for the whole site. */
export const IDS = {
  organization: `${SITE_URL}/#organization`,
  localBusiness: `${SITE_URL}/#localbusiness`,
  website: `${SITE_URL}/#website`,
} as const;

/**
 * Site-name identity for Google Search (may be shown above the URL in
 * results). RIDE N CARE is the display brand; "Ride N Care" is the plain
 * written form carried as alternateName so either casing matches.
 */
export const BRAND_NAME = "RIDE N CARE";
export const BRAND_NAME_PLAIN = "Ride N Care";

/** Business facts (single source: the owner's confirmed facts). */
export const BIZ = {
  name: "Ride N Care",
  alternateName: "Ride N Care - Care in Every Mile",
  url: SITE_URL,
  logo: LOGO_URL,
  image: OG_IMAGE,
  email: "info@ridencare.co.in",
  /** Call number only — the WhatsApp number must never appear in a telephone field. */
  telephone: "+918069409289",
  whatsappUrl: "https://wa.me/918296950339",
  description: ENTITY_SUMMARY,
  priceRange: "₹₹",
} as const;

/** Contact points: customer-service call line + WhatsApp booking URL (never a telephone field). */
export const CONTACT_POINTS = [
  {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: BIZ.telephone,
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Kannada"],
  },
  {
    "@type": "ContactPoint",
    contactType: "WhatsApp booking",
    url: BIZ.whatsappUrl,
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Kannada"],
  },
] as const;

/** Postal address: service-area business — locality/region/country only, no street. */
export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Bengaluru",
  addressRegion: "Karnataka",
  addressCountry: "IN",
} as const;

/**
 * areaServed: City Bengaluru + one Place per OWNER-CONFIRMED locality only
 * (east/south Bangalore — the north/west/central pages are noindexed and
 * excluded from schema until the owner confirms coverage, Q3/Q27 in
 * OWNER-QUESTIONS.md).
 */
export function areaServedPlaces() {
  return [
    { "@type": "City", name: "Bengaluru" },
    ...CONFIRMED_AREAS.map((a) => ({ "@type": "Place", name: `${a.name}, Bengaluru` })),
  ] as const;
}

/** Organization node (referenced by @id from every page). */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": IDS.organization,
    name: BRAND_NAME,
    alternateName: BRAND_NAME_PLAIN,
    url: `${SITE_URL}/`,
    logo: BIZ.logo,
    image: BIZ.image,
    email: BIZ.email,
    telephone: [BIZ.telephone],
    contactPoint: CONTACT_POINTS,
    sameAs: SAME_AS,
  };
}

/**
 * LocalBusiness node: AutoRepair + MotorcycleRepair. Opening hours reflect the
 * owner-confirmed operating hours 7:00 AM–11:30 PM, every day (2 Oct 2026).
 */
export function localBusinessNode() {
  return {
    "@type": ["AutoRepair", "MotorcycleRepair"],
    "@id": IDS.localBusiness,
    name: BIZ.name,
    alternateName: BIZ.alternateName,
    url: SITE_URL,
    logo: BIZ.logo,
    image: BIZ.image,
    email: BIZ.email,
    telephone: [BIZ.telephone],
    contactPoint: CONTACT_POINTS,
    description: BIZ.description,
    address: POSTAL_ADDRESS,
    areaServed: areaServedPlaces(),
    // Owner-confirmed (2 Oct 2026): open 7:00 AM to 11:30 PM, 7 days a week.
    // Describes SERVICE VISITS (service-area business, no walk-in premises);
    // actual booking and mechanic availability may vary and is confirmed when booking.
    openingHoursSpecification: [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    ].map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens: "07:00",
      closes: "23:30",
      description: "Doorstep service visits 7:00 AM to 11:30 PM, every day",
    })),
    sameAs: SAME_AS,
    knowsAbout: [
      "Doorstep bike service",
      "Bike repair",
      "Scooter service",
      "Electric two-wheeler service",
      "Emergency bike repair",
      "Bike breakdown assistance",
      "Bike battery replacement",
      "Bike engine repair",
      "Doorstep car service",
      "Car periodic maintenance",
      "Car AC service",
      "Car battery replacement",
      "Pre-purchase car inspection",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ride N Care services",
      itemListElement: [...SERVICE_SUMMARY, ...CAR_SERVICE_SUMMARY].map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.serviceType ?? s.name,
          url: `${SITE_URL}/${s.slug}`,
        },
      })),
    },
  };
}

/**
 * WebSite node. No SearchAction — the site has no on-site search.
 * name/alternateName feed Google's site-name signal for the brand
 * "RIDE N CARE" instead of the bare domain.
 */
export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": IDS.website,
    url: `${SITE_URL}/`,
    name: BRAND_NAME,
    alternateName: BRAND_NAME_PLAIN,
    publisher: { "@id": IDS.organization },
    inLanguage: "en-IN",
  };
}

/** One @graph per page. Nodes not relevant to the page are omitted, not duplicated. */
export function graphForPage(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/** BreadcrumbList node from [name, path-or-absolute-url] pairs. */
export function breadcrumbNode(crumbs: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: path.startsWith("http") ? path : `${SITE_URL}${path}`,
    })),
  };
}

/** FAQPage node from [question, answer] pairs that are visible on the page. */
export function faqNode(faqs: readonly (readonly [string, string])[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Service node for one live service page. Offers only with a real, visible price. */
export function serviceNode(opts: {
  slug: string;
  name: string;
  serviceType: string;
  description: string;
  priceFrom?: number;
  areaName?: string;
  pincode?: string;
}) {
  const url = `${SITE_URL}/${opts.slug}`;
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url,
    provider: { "@id": IDS.localBusiness },
    areaServed: opts.areaName
      ? {
          "@type": "Place",
          name: `${opts.areaName}, Bengaluru`,
          ...(opts.pincode ? { address: { "@type": "PostalAddress", postalCode: opts.pincode, addressLocality: "Bengaluru", addressCountry: "IN" } } : {}),
        }
      : areaServedPlaces(),
    ...(opts.priceFrom
      ? { offers: { "@type": "Offer", priceCurrency: "INR", price: String(opts.priceFrom), availability: "https://schema.org/InStock", url } }
      : {}),
  };
}

/** ItemList node pointing at nearby area pages (data-driven internal linking). */
export function nearbyAreasNode(areas: { slug: string; name: string }[]) {
  return {
    "@type": "ItemList",
    itemListElement: areas.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${a.name}, Bengaluru`,
      url: `${SITE_URL}/areas/${a.slug}`,
    })),
  };
}

/** WebPage node with a real dateModified (AEO answer pages, Part 8). */
export function webPageNode(opts: { url: string; name: string; description: string; dateModified: string }) {
  return {
    "@type": "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    dateModified: opts.dateModified,
    inLanguage: "en-IN",
    isPartOf: { "@id": IDS.website },
    about: { "@id": IDS.organization },
    primaryImageOfPage: BIZ.image,
  };
}

/** BlogPosting/Article node. publisher @id; author only when a real one exists. */
export function articleNode(opts: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
  type?: "Article" | "BlogPosting";
}) {
  return {
    "@type": opts.type ?? "Article",
    "@id": `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    ...(opts.image ? { image: opts.image } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    author: opts.authorName
      ? { "@type": "Person", name: opts.authorName }
      : { "@id": IDS.organization },
    publisher: { "@id": IDS.organization },
    inLanguage: "en-IN",
  };
}
