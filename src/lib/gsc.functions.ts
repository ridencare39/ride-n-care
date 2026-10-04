import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
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
    const { parseCookies, RT_COOKIE } = await import("@/lib/gsc-oauth.server");
    // Refresh token lives only in the connecting browser's HttpOnly cookie.
    const request = getRequest();
    const refreshToken = parseCookies(request?.headers.get("cookie") ?? null)[RT_COOKIE] ?? null;
    try {
      return await buildSeoMonitorReport(refreshToken, data.siteUrl);
    } catch (e) {
      console.error("[seo-monitor] failed:", e);
      const message = String(e).includes("gsc_unauthorized")
        ? "Google rejected the stored authorization — reconnect Search Console."
        : "Could not load Search Console data right now.";
      return { status: "error" as const, message };
    }
  });
