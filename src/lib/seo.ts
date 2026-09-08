export const SITE_URL = "https://ridencare.co.in";
export const OG_IMAGE = `${SITE_URL}/__l5e/assets-v1/2cb2a7d0-57c5-42f3-9ebc-6e2a4ca0cccd/og-ridencare.jpg`;
export const OG_IMAGE_ABOUT = `${SITE_URL}/__l5e/assets-v1/f4639b52-45f0-4f94-83ac-67b268204b29/og-about-ridencare.jpg`;

/** Official Ride N Care profiles — used for schema sameAs and footer links. */
export const SOCIAL = {
  instagram: "https://www.instagram.com/ride_n_care_care_in_every_mile",
  facebook: "https://www.facebook.com/share/1DUdsHtp16/",
  youtube: "https://youtube.com/@ridencare_care_with_every_mile",
  googleBusiness: "https://maps.app.goo.gl/PHpPyTNBj9cmPf4w9",
  whatsapp: "https://wa.me/918296950339",
};

export const SAME_AS = [
  SOCIAL.instagram,
  SOCIAL.facebook,
  SOCIAL.youtube,
  SOCIAL.googleBusiness,
  SOCIAL.whatsapp,
];


export const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "@id": `${SITE_URL}/#business`,
  name: "Ride N Care",
  alternateName: "Ride N Care — Care in every mile",
  slogan: "Care in every mile",
  description:
    "Doorstep bike and car service in Bangalore. Certified mechanics, genuine OEM parts, transparent pricing and a 7-day workmanship guarantee.",
  url: SITE_URL,
  logo: `${SITE_URL}/__l5e/assets-v1/760c4f79-dc2d-4a56-a959-0c73577c8f73/ride-n-care-logo.jpg`,
  image: OG_IMAGE,
  telephone: ["+91-80-6940-9289", "+91-82969-50339"],
  email: "ridencareinfo@gmail.com",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bangalore",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    postalCode: "560001",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 12.9716, longitude: 77.5946 },
  areaServed: [
    { "@type": "City", name: "Bangalore" },
    { "@type": "AdministrativeArea", name: "Karnataka, India" },
  ],
  serviceArea: { "@type": "GeoCircle", geoMidpoint: { "@type": "GeoCoordinates", latitude: 12.9716, longitude: 77.5946 }, geoRadius: 40000 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
  ],
  sameAs: SAME_AS,
  paymentAccepted: ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking"],
  currenciesAccepted: "INR",
  knowsAbout: [
    "Bike service Bangalore",
    "Bike repair Bangalore",
    "Doorstep bike service Bangalore",
    "Two wheeler service Bangalore",
    "Motorcycle repair Bangalore",
    "Scooter repair Bangalore",
    "Emergency bike breakdown assistance Bangalore",
  ],
  knowsLanguage: ["en", "hi", "kn"],
  subjectOf: { "@type": "WebPage", "@id": `${SITE_URL}/answers` },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-82969-50339",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Kannada"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-80-6940-9289",
      contactType: "booking",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Kannada"],
    },
  ],
};

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Ride N Care",
  url: SITE_URL,
  logo: `${SITE_URL}/__l5e/assets-v1/760c4f79-dc2d-4a56-a959-0c73577c8f73/ride-n-care-logo.jpg`,
  email: "ridencareinfo@gmail.com",
  telephone: ["+91-82969-50339", "+91-80-6940-9289"],
  sameAs: SAME_AS,
  contactPoint: LOCAL_BUSINESS_JSONLD.contactPoint,
};

export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Ride N Care",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-IN",
};
/** FAQPage JSON-LD from [question, answer] pairs. */
export function faqPageJsonLd(faqs: [string, string][], id?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** BreadcrumbList JSON-LD from [name, url] pairs. */
export function breadcrumbJsonLd(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, item], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item,
    })),
  };
}
