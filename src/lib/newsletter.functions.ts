import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().max(60).optional(),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: data.email, source: data.source ?? "website" });

    if (error) {
      // Treat duplicates as success — user is already subscribed.
      if (error.code === "23505") {
        return { ok: true, alreadySubscribed: true };
      }
      console.error("[newsletter] insert failed:", error);
      throw new Error("Could not subscribe right now. Please try again.");
    }

    return { ok: true, alreadySubscribed: false };
  });