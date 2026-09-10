import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({ siteUrl: z.string().max(300).optional() });

export const getSeoMonitorReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data ?? {}))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Forbidden: admin access required");

    const { buildSeoMonitorReport } = await import("@/lib/gsc.report.server");
    try {
      return await buildSeoMonitorReport(data.siteUrl);
    } catch (e) {
      console.error("[seo-monitor] failed:", e);
      return { status: "error" as const, message: "Could not load Search Console data right now." };
    }
  });
