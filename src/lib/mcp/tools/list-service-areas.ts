import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { AREAS } from "@/lib/areas";

export default defineTool({
  name: "list_service_areas",
  title: "List service areas",
  description: "List the Bangalore localities where Ride N Care offers doorstep bike and car service, with pincodes and zones.",
  inputSchema: {
    zone: z.enum(["Central", "North", "South", "East", "West"]).optional().describe("Filter by Bangalore zone."),
    query: z.string().trim().optional().describe("Filter by locality name or pincode."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ zone, query }) => {
    const q = query?.toLowerCase();
    const areas = AREAS.filter(
      (a) =>
        (!zone || a.zone === zone) &&
        (!q || a.name.toLowerCase().includes(q) || (a.pincode ?? "").includes(q)),
    ).map((a) => ({
      name: a.name,
      zone: a.zone,
      pincode: a.pincode,
      nearby: a.nearby ?? [],
      url: `/areas/${a.slug}`,
    }));
    const payload = { city: "Bangalore", count: areas.length, areas };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
