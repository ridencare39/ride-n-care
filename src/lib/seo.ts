export const SITE_URL = "https://ride-n-care.lovable.app";
export const OG_IMAGE = `${SITE_URL}/__l5e/assets-v1/2cb2a7d0-57c5-42f3-9ebc-6e2a4ca0cccd/og-ridencare.jpg`;

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
  sameAs: ["https://wa.me/918296950339"],
};