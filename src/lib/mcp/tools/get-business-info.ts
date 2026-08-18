import { defineTool } from "@lovable.dev/mcp-js";
import { LOCAL_BUSINESS_JSONLD, SITE_URL } from "@/lib/seo";

export default defineTool({
  name: "get_business_info",
  title: "Get business info",
  description: "Get Ride N Care's contact details, WhatsApp booking number, address, service hours and booking link.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const payload = {
      name: "Ride N Care",
      tagline: "Care in every mile",
      description: LOCAL_BUSINESS_JSONLD.description,
      phone: "08069409289",
      whatsapp: "+918296950339",
      whatsappLink: "https://wa.me/918296950339",
      email: "ridencareinfo@gmail.com",
      address: "Bangalore, Karnataka, India",
      hours: "Every day, 08:00 – 21:00 IST",
      bookingUrl: `${SITE_URL}/contact`,
      website: SITE_URL,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
