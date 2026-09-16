import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { BIKE_PACKAGES, CAR_PACKAGES, ELECTRIC_BIKE_PACKAGES } from "@/lib/pricing";

export default defineTool({
  name: "get_service_pricing",
  title: "Get service pricing",
  description: "Get Ride N Care's published doorstep bike and car service prices in Bangalore.",
  inputSchema: {
    vehicle: z.enum(["bike", "car", "both"]).default("both").describe("Which vehicle pricing to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ vehicle }) => {
    const payload = {
      currency: "INR",
      note: "Flat rates. No hidden charges. Parts billed at MRP with bill copy.",
      ...(vehicle !== "car" ? { bikeService: BIKE_PACKAGES, electricBikeService: ELECTRIC_BIKE_PACKAGES } : {}),
      ...(vehicle !== "bike" ? { carService: CAR_PACKAGES } : {}),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
