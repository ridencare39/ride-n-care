import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BIKE_PACKAGES, CAR_PACKAGES, ELECTRIC_BIKE_PACKAGES, formatPrice } from "@/lib/pricing";

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
  /** true when the customer can simply tap Retry (rate limit / transient outage). */
  retryable?: boolean;
}

const bikePackagePrompt = BIKE_PACKAGES.map((p) => `- ${p.name}, ${p.cc}, MRP ${formatPrice(p.mrp)}, Price ${formatPrice(p.price)}`).join("\n");
const carPackagePrompt = CAR_PACKAGES.map((p) => `- ${p.name}: ${formatPrice(p.price)}`).join("\n");
const electricPackagePrompt = ELECTRIC_BIKE_PACKAGES.map((p) => `- ${p.name}: ${formatPrice(p.price)}`).join("\n");

const SYSTEM = `You are the Ride N Care booking assistant for a doorstep bike and car service in Bangalore ("Care in every mile").
Collect a service booking by asking ONE short question at a time, in friendly plain English.

Fields to collect, in this order (skip what the user already gave):
vehicle (Bike or Car), power (Electric or Non-Electric — bikes only), brand, model, engineCc as exact integer (NON-ELECTRIC bikes only — never ask for CC on electric bikes), variant (car only), packageName (from the matching catalogue below), name, mobile, whatsapp, email (optional), registration (optional), address, date in YYYY-MM-DD, time, issue (optional), paymentMethod (Pay Now or Pay Later).

NON-ELECTRIC (petrol) bike packages — pick the row that matches the customer's CC (use ONLY these):
${bikePackagePrompt}

ELECTRIC two-wheeler packages — the SAME three packages apply to every electric brand/model, no CC needed (use ONLY these):
${electricPackagePrompt}

Car packages (use ONLY these):
${carPackagePrompt}
Never invent any other price. For non-electric bikes pick the package from the CC the user gives; if the CC is unknown, ask for it or the CC range before naming a package. For electric bikes offer ONLY EV General Service ₹999, EV Running Repair ₹450, EV Jump Start ₹399 — never the petrol "General Service + Engine Oil" package. If a needed repair is outside these packages, say additional work is quoted after inspection and requires approval. Never guess vehicle type, CC, or price — ask instead.
Mobile numbers must be 10-digit Indian numbers starting 6-9; ask again if invalid. Online Pay Now is not active yet, so collect Pay Later as the payment method and explain this briefly if asked.
Ask only for missing required details. Before setting complete=true, explicitly ask the customer to confirm the complete booking details including the exact package price. Set complete=true only after the customer clearly confirms.

Reply ONLY with JSON of this shape:
{"reply":"your next message","booking":{"vehicle":"Bike","brand":"Honda"},"complete":false}
Put every collected value in "booking" (keys: vehicle, power, brand, model, engineCc, variant, packageName, name, mobile, whatsapp, email, registration, address, date, time, issue, paymentMethod). Do not return a price; the server resolves the current price from the shared catalogue.
Set "complete": true only after all required details, WhatsApp, payment method, and explicit customer confirmation are collected; then "reply" should say the booking is ready to create.`;

/**
 * All config comes from server env — never bundled into frontend code.
 * Provider priority: explicit AI_BASE_URL > GOOGLE_API_KEY (Gemini, free tier) > OPENAI_API_KEY.
 * Gemini is used through its OpenAI-compatible endpoint, so the request shape is identical.
 */
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai";
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const OPENAI_BASE = "https://api.openai.com/v1";
const OPENAI_MODEL = "gpt-4o-mini";

function aiConfig() {
  const explicitBase = process.env["AI_BASE_URL"];
  const googleKey = process.env["GOOGLE_API_KEY"];
  const openaiKey = process.env["OPENAI_API_KEY"];
  if (explicitBase) {
    return { apiKey: googleKey ?? openaiKey, baseUrl: explicitBase.replace(/\/+$/, ""), model: process.env["AI_MODEL"] ?? GEMINI_MODEL };
  }
  if (googleKey) {
    return { apiKey: googleKey, baseUrl: GEMINI_BASE, model: process.env["AI_MODEL"] ?? GEMINI_MODEL };
  }
  return { apiKey: openaiKey, baseUrl: OPENAI_BASE, model: process.env["AI_MODEL"] ?? OPENAI_MODEL };
}

export const chatBookingAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<AiBookingReply> => {
    const { apiKey, baseUrl, model } = aiConfig();
    if (!apiKey) {
      return {
        reply: "",
        booking: {},
        complete: false,
        error: "The AI assistant isn't connected yet. Please use the normal booking form or WhatsApp us.",
      };
    }

    // Bangalore runs on IST (UTC+5:30) — the model needs today's date to resolve
    // relative words like "today"/"tomorrow" into YYYY-MM-DD correctly.
    const todayIst = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const systemWithDate = `${SYSTEM}\nToday's date is ${todayIst} (IST). Resolve "today"/"tomorrow" against it.`;

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          response_format: { type: "json_object" },
          temperature: 0.4,
          max_tokens: 400,
          messages: [{ role: "system", content: systemWithDate }, ...data.messages],
        }),
        signal: AbortSignal.timeout(25_000),
      });
    } catch (e) {
      console.error("[ai-booking] gateway request failed:", e);
      return {
        reply: "",
        booking: {},
        complete: false,
        retryable: true,
        error: "The assistant couldn't be reached. Please try again.",
      };
    }

    if (!res.ok) {
      const status = res.status;
      const body = await res.text().catch(() => "");
      console.error(`[ai-booking] gateway error ${status}: ${body.slice(0, 300)}`);
      const quotaExhausted = body.includes("insufficient_quota") || body.includes("credit_balance_exhausted");
      const keyInvalid = body.includes("API_KEY_INVALID") || body.includes("API key not valid");
      let message = "The assistant could not respond. Please use the normal booking form or WhatsApp us.";
      let retryable = status >= 500;
      if (keyInvalid || status === 401 || status === 403) {
        message = "The AI assistant isn't authorized right now. Please use the normal booking form or WhatsApp us.";
        retryable = false;
      } else if (quotaExhausted || status === 402) {
        message = "The AI assistant is out of credits right now. Please book on WhatsApp or use the booking form.";
        retryable = false;
      } else if (status === 401 || status === 403) {
        message = "The AI assistant isn't authorized right now. Please use the normal booking form or WhatsApp us.";
        retryable = false;
      } else if (status === 429) {
        message = "Too many requests right now — please try again in a moment.";
        retryable = true;
      }
      return { reply: "", booking: {}, complete: false, retryable, error: message };
    }

    const payload = (await res.json().catch(() => null)) as { choices?: { message?: { content?: string } }[] } | null;
    const raw = payload?.choices?.[0]?.message?.content ?? "";
    if (!raw.trim()) {
      return { reply: "", booking: {}, complete: false, retryable: true, error: "The assistant returned an empty response. Please try again." };
    }

    try {
      const parsed = extractJson(raw) as { reply?: string; booking?: Record<string, unknown>; complete?: boolean } | null;
      if (!parsed) throw new Error("no JSON object found");
      const booking: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.booking ?? {})) {
        if (v !== null && v !== undefined && String(v).trim() !== "") booking[k] = String(v).trim();
      }
      return {
        reply: parsed.reply?.trim() || "Could you tell me a bit more?",
        booking,
        complete: Boolean(parsed.complete),
      };
    } catch (e) {
      console.error("[ai-booking] unparseable model response:", String(raw).slice(0, 300), e);
      return { reply: "", booking: {}, complete: false, retryable: true, error: "The assistant gave a malformed response. Please try again." };
    }
  });

/**
 * Models occasionally wrap JSON in prose or code fences even with json mode.
 * Pull the first balanced {...} block out of the raw text.
 */
function extractJson(text: string): Record<string, unknown> | null {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    if (start === -1) return null;
    let depth = 0;
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === "{") depth++;
      else if (cleaned[i] === "}") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(cleaned.slice(start, i + 1)) as Record<string, unknown>;
          } catch {
            return null;
          }
        }
      }
    }
    return null;
  }
}
