import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ siteUrl: z.string().max(300).optional() });

export const getSeoMonitorReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data ?? {}))
  .handler(async ({ data }) => {
    const { buildSeoMonitorReport } = await import("@/lib/gsc.report.server");
    try {
      return await buildSeoMonitorReport(data.siteUrl);
    } catch (e) {
      console.error("[seo-monitor] failed:", e);
      return { status: "error" as const, message: e instanceof Error ? e.message : "Unknown error" };
    }
  });
