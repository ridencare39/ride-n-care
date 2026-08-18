import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { BIKE_FAQS, CAR_FAQS, GENERAL_FAQS } from "@/lib/service-faqs";

const toObjects = (rows: [string, string][]) => rows.map(([question, answer]) => ({ question, answer }));

export default defineTool({
  name: "get_faqs",
  title: "Get FAQs",
  description: "Get Ride N Care's published FAQs about doorstep bike service, car service, coverage, warranty and timings.",
  inputSchema: {
    topic: z.enum(["bike", "car", "general", "all"]).default("all").describe("Which FAQ set to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ topic }) => {
    const payload = {
      ...(topic === "bike" || topic === "all" ? { bike: toObjects(BIKE_FAQS) } : {}),
      ...(topic === "car" || topic === "all" ? { car: toObjects(CAR_FAQS) } : {}),
      ...(topic === "general" || topic === "all" ? { general: toObjects(GENERAL_FAQS) } : {}),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
