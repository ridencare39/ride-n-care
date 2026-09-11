import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

export interface AiBookingReply {
  reply: string;
  booking: Record<string, string>;
  complete: boolean;
  error?: string;
}

const SYSTEM = `You are the Ride N Care booking assistant for a doorstep bike and car service in Bangalore ("Care in every mile").
Collect a service booking by asking ONE short question at a time, in friendly plain English.

Fields to collect, in this order (skip what the user already gave):
vehicle (Bike or Car), power (Electric or Non-Electric — bikes only), brand, model, variant (bike: CC range; car: fuel/variant), package, name, mobile, whatsapp, email (optional), registration, address, date, time, issue (optional).

Bike packages and prices (use ONLY these):
- At-Home Regular Service, Below 125 CC, MRP ₹899, Price ₹499
- At-Home Classic Service, 125–199 CC, MRP ₹999, Price ₹799
- At-Home Premium Service, 200–299 CC, MRP ₹1899, Price ₹1199
- At-Home Royal Service, 300–349 CC, MRP ₹1699, Price ₹1399
- At-Home Sports Service, Above 350 CC, MRP ₹2199, Price ₹1899

Car packages: Mini Service ₹1499, Standard Service ₹2999, Comprehensive Service ₹4999, AC Service (Price on Request), Denting & Painting (Price on Request).
Never invent any other price. Pick the bike package from the CC the user gives.
Mobile numbers must be 10-digit Indian numbers starting 6-9; ask again if invalid.

Reply ONLY with JSON of this shape:
{"reply":"your next message","booking":{"vehicle":"Bike","brand":"Honda"},"complete":false}
Put every collected value in "booking" (keys: vehicle, power, brand, model, variant, packageName, mrp, price, name, mobile, whatsapp, email, registration, address, date, time, issue). Keep prices as plain numbers in rupees.
Set "complete": true only once name, mobile, address, package, brand, model and preferred date+time are collected; then "reply" should be a one-line confirmation that the summary is ready.`;

export const chatBookingAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<AiBookingReply> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { reply: "", booking: {}, complete: false, error: "Assistant is not configured right now." };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const status = res.status;
      const message =
        status === 429
          ? "Too many requests right now — please try again in a moment."
          : status === 402 || status === 403
            ? "The AI assistant is unavailable. Please use the normal booking form or WhatsApp."
            : "The assistant could not respond. Please use the normal booking form or WhatsApp.";
      return { reply: "", booking: {}, complete: false, error: message };
    }

    const payload = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = payload.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = JSON.parse(raw) as { reply?: string; booking?: Record<string, unknown>; complete?: boolean };
      const booking: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.booking ?? {})) {
        if (v !== null && v !== undefined && String(v).trim() !== "") booking[k] = String(v).trim();
      }
      return {
        reply: parsed.reply?.trim() || "Could you tell me a bit more?",
        booking,
        complete: Boolean(parsed.complete),
      };
    } catch {
      return { reply: raw || "Could you repeat that?", booking: {}, complete: false };
    }
  });
