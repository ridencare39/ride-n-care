import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatBookingAssistant } from "@/lib/ai-booking.functions";
import { Summary } from "@/components/booking/BookingFlow";
import { BIKE_BRANDS, bookingIssues, bikeModels, CAR_BRANDS, CAR_FUEL_OPTIONS, carModels, openWhatsAppUrl, PREFERRED_TIME_SLOTS, reserveWhatsAppWindow, whatsappBookingUrl, withTimeout, WHATSAPP_NUMBER, type Booking } from "@/lib/booking";
import { createBooking } from "@/lib/bookings.functions";
import { BIKE_PACKAGES, CAR_PACKAGES, ELECTRIC_BIKE_PACKAGES, formatPrice, getBikePackagesForCc } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import { toast } from "sonner";
import { trackCtc } from "@/lib/analytics";
import { Bot, RotateCcw } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };
type Suggestion = { label: string; value: string };

const GREETING =
  "Hi! I'm the Ride N Care booking assistant. Tell me what you need — for example \"doorstep service for my Honda Activa in Koramangala tomorrow\".";

const NOT_CONFIGURED = "The AI assistant isn't connected yet.";

function toBooking(fields: Record<string, string>): Booking {
  const num = (v?: string) => {
    if (!v) return undefined;
    const n = Number(v.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const vehicle = fields["vehicle"]?.toLowerCase().includes("car") ? "car" : fields["vehicle"] ? "bike" : undefined;
  const power = fields["power"]
    ? fields["power"].toLowerCase().includes("non")
      ? "non-electric"
      : fields["power"].toLowerCase().includes("electric")
        ? "electric"
        : undefined
    : undefined;
  const engineCc = num(fields["engineCc"]);
  const packages = vehicle === "car" ? CAR_PACKAGES : power === "electric" ? ELECTRIC_BIKE_PACKAGES : engineCc ? getBikePackagesForCc(engineCc) : [];
  const packageHint = (fields["packageName"] ?? fields["package"] ?? "").toLowerCase();
  const matchedPackage = packageHint ? packages.find(
    (item) => packageHint.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(packageHint),
  ) : undefined;
  return {
    ...(vehicle ? { vehicle } : {}),
    ...(power ? { power } : {}),
    brand: fields["brand"],
    model: fields["model"],
    variant: fields["variant"] ?? (matchedPackage && "cc" in matchedPackage ? matchedPackage.cc : undefined),
    engineCc: engineCc ?? null,
    packageId: matchedPackage?.id,
    packageName: matchedPackage?.name ?? fields["packageName"] ?? fields["package"],
    mrp: matchedPackage && "mrp" in matchedPackage ? matchedPackage.mrp ?? null : num(fields["mrp"]) ?? null,
    price: matchedPackage?.price ?? null,
    includes: matchedPackage?.includes,
    name: fields["name"],
    mobile: fields["mobile"],
    whatsapp: fields["whatsapp"],
    email: fields["email"],
    registration: fields["registration"],
    date: fields["date"],
    time: fields["time"],
    issue: fields["issue"],
    source: "ai",
  };
}

export function AiBooking() {
  const ask = useServerFn(chatBookingAssistant);
  const create = useServerFn(createBooking);
  const { openBooking } = useBooking();
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [complete, setComplete] = useState(false);
  const [created, setCreated] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const [lastUserText, setLastUserText] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Contextual quick-reply chips ("suggested answers"). Derived from the first
   * missing booking field, in the same order the server prompt asks questions,
   * so the chips always match what the assistant just asked. Personal fields
   * (name, mobile, address) return no chips — those must be typed.
   */
  const suggestions = useMemo<Suggestion[]>(() => {
    if (complete || created) return [];
    const val = (k: string) => fields[k]?.trim() ?? "";
    const vehicle = val("vehicle").toLowerCase();
    const isBike = vehicle.startsWith("bike");
    const isCar = vehicle.startsWith("car");
    const powerLower = val("power").toLowerCase();
    const isElectric = powerLower.includes("electric") && !powerLower.includes("non");

    if (!isBike && !isCar) return [{ label: "🏍️ Bike", value: "Bike" }, { label: "🚗 Car", value: "Car" }];
    if (isBike && !powerLower) return [{ label: "⚡ Electric", value: "Electric" }, { label: "⛽ Petrol", value: "Non-Electric" }];
    if (!val("brand")) {
      const brands = isBike
        ? [...new Set(BIKE_BRANDS.filter((b) => b.power === (isElectric ? "electric" : "non-electric")).map((b) => b.name))]
        : CAR_BRANDS.map((b) => b.name);
      return [...brands.filter((name) => name !== "Other").slice(0, 5).map((name) => ({ label: name, value: name })), { label: "Other", value: "Other" }];
    }
    if (!val("model")) {
      const models = isBike ? bikeModels(isElectric ? "electric" : "non-electric", val("brand")) : carModels(val("brand"));
      const real = models.filter((name) => name.toLowerCase() !== "other model");
      if (models.length === 0) return [];
      return [...real.slice(0, 4).map((name) => ({ label: name, value: name })), { label: "Other model", value: "Other model" }];
    }
    if (isCar && !val("variant")) return CAR_FUEL_OPTIONS.map((fuel) => ({ label: fuel, value: fuel }));
    if (isBike && !isElectric && !val("engineCc")) return [110, 125, 150, 200, 350].map((cc) => ({ label: `${cc}cc`, value: String(cc) }));
    if (!val("packageName")) {
      if (isCar) return CAR_PACKAGES.map((p) => ({ label: p.name, value: p.name }));
      if (isElectric) return ELECTRIC_BIKE_PACKAGES.map((p) => ({ label: `${p.name} — ${formatPrice(p.price)}`, value: p.name }));
      const cc = Number(val("engineCc").replace(/[^\d.]/g, ""));
      if (Number.isFinite(cc) && cc > 0) {
        const pkgs = getBikePackagesForCc(cc);
        if (pkgs.length > 0) return pkgs.map((p) => ({ label: `${p.name} — ${formatPrice(p.price)}`, value: p.name }));
      }
      return [];
    }
    if (!val("name")) return [];
    if (!val("mobile")) return [];
    if (!val("whatsapp")) return val("mobile") ? [{ label: "Same as mobile number", value: val("mobile") }] : [];
    if (!val("email")) return [{ label: "Skip email", value: "Skip email" }];
    if (!val("registration")) return [{ label: "Skip registration", value: "Skip registration" }];
    if (!val("date")) return [{ label: "Today", value: "Today" }, { label: "Tomorrow", value: "Tomorrow" }];
    if (!val("time")) return PREFERRED_TIME_SLOTS.map((slot) => ({ label: slot, value: slot }));
    if (!val("issue")) return [{ label: "No other issue", value: "No other issue" }];
    return [
      { label: "✅ Yes, confirm my booking", value: "Yes, confirm my booking" },
      { label: "✏️ Change a detail", value: "Change a detail" },
    ];
  }, [fields, complete, created]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy]);
  useEffect(() => {
    inputRef.current?.focus();
  }, [busy]);

  const reset = () => {
    setMessages([{ role: "assistant", content: GREETING }]);
    setInput("");
    setFields({});
    setComplete(false);
    setCreated(null);
    setError(null);
    setRetryable(false);
    setLastUserText(null);
  };

  /**
   * Retry = re-send a message that is ALREADY in the transcript.
   * Passing just `text` starts a NEW turn — this is what quick-reply chips use.
   * (Earlier versions reused the retry path for chips, which sent an empty
   * history and the server rejected it — that is why chips did nothing.)
   */
  const send = async (text?: string, opts?: { retry?: boolean }) => {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    const retry = opts?.retry === true;
    const prior = messages.filter((m, i) => !(i === 0 && m.role === "assistant"));
    // A retry re-sends the last user message that is already in the transcript.
    const history = retry ? prior : [...prior, { role: "user" as const, content: value }];
    if (!retry) {
      setMessages((m) => [...m, { role: "user", content: value }]);
      setInput("");
      setLastUserText(value);
    }
    setBusy(true);
    setError(null);
    setRetryable(false);
    try {
      const res = await ask({ data: { messages: history } });
      if (res.error) {
        setError(res.error);
        setRetryable(Boolean(res.retryable));
      } else {
        setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
        setFields((f) => ({ ...f, ...res.booking }));
        if (res.complete) setComplete(true);
      }
    } catch {
      setError("Something went wrong. Please use the normal booking form or WhatsApp.");
      setRetryable(true);
    } finally {
      setBusy(false);
    }
  };

  if (created) return <Summary booking={created} />;
  if (complete) {
    const booking = toBooking(fields);
    const issues = bookingIssues(booking);
    const confirm = async () => {
      if (issues.length > 0) {
        setError(`Please complete: ${issues.join(" ")}`);
        return;
      }
      trackCtc("booking_form_submit", { vehicle_type: booking.vehicle, service: booking.packageName ?? undefined });
      // Reserve the tab synchronously so the browser keeps the tap gesture.
      const whatsappWindow = reserveWhatsAppWindow();
      setBusy(true);
      setError(null);
      let finalBooking = booking;
      try {
        const result = await withTimeout(create({ data: { vehicle: booking.vehicle!, power: booking.power ?? null, brand: booking.brand!, model: booking.model!, engineCc: booking.engineCc ?? null, variant: booking.variant ?? null, packageId: booking.packageId!, name: booking.name!, mobile: booking.mobile!, whatsapp: booking.whatsapp!, email: booking.email ?? "", registration: booking.registration ?? "", date: booking.date!, time: booking.time!, issue: booking.issue ?? "", source: "ai" } }), 15000, "Booking");
        finalBooking = result.booking;
        setCreated(result.booking);
      } catch (e) {
        // Never block the WhatsApp handoff because the backend was unreachable.
        console.error("Ride N Care: AI booking could not be saved — continuing to WhatsApp.", e);
        toast.info("Sending your details on WhatsApp so we can confirm.");
      }
      setBusy(false);
      openWhatsAppUrl(whatsappBookingUrl(finalBooking), whatsappWindow);
    };
    return <div><Summary booking={booking} mode="review" issues={issues} /><Button className="mt-4 h-12 w-full rounded-full" disabled={busy} onClick={() => void confirm()}>{busy ? "Preparing…" : "Continue to WhatsApp"}</Button>{error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}</div>;
  }

  const unconfigured = error === NOT_CONFIGURED;

  return (
    <div className="flex min-h-0 min-w-0 flex-col">
      {unconfigured ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold text-foreground">AI booking isn't set up on this deployment yet.</p>
          <p className="mt-1 text-muted-foreground">You can still book in seconds — chat with us directly or use the standard booking form. (Site owner: add the <code className="rounded bg-background/60 px-1">GOOGLE_API_KEY</code> secret to enable the assistant.)</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button className="h-11 flex-1 rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank", "noopener")}>
              Book on WhatsApp
            </Button>
            <Button variant="outline" className="h-11 flex-1 rounded-full" onClick={() => openBooking()}>
              Use booking form
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div ref={listRef} className="max-h-[45vh] min-h-40 space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] break-words rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === "user" ? "ml-auto bg-grad-primary text-primary-foreground" : "border border-border bg-card"
                }`}
              >
                {m.content}
              </div>
            ))}
            {busy && <div className="max-w-[85%] animate-pulse rounded-2xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted-foreground">Typing…</div>}
          </div>

          {suggestions.length > 0 && !busy && (
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Suggested answers">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => void send(s.value)}
                  className="min-h-10 rounded-full border border-border bg-card px-3.5 text-sm font-semibold transition hover:bg-accent active:scale-[0.98]"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2">
              <p className="text-sm font-semibold text-destructive">{error}</p>
              {retryable && lastUserText && (
                <button onClick={() => void send(lastUserText, { retry: true })} disabled={busy} className="flex shrink-0 items-center gap-1 rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-50">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Retry
                </button>
              )}
            </div>
          )}

          <div className="mt-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Type your answer…"
              className="min-h-12 min-w-0 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm"
            />
            <button
              onClick={() => void send()}
              disabled={busy || !input.trim()}
              className="min-h-12 shrink-0 rounded-full bg-grad-primary px-5 font-semibold text-primary-foreground disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </>
      )}

      {messages.length > 1 && (
        <button onClick={reset} className="mx-auto mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
          <Bot className="h-3.5 w-3.5" aria-hidden /> Start over
        </button>
      )}
      {Object.keys(fields).length > 0 && !complete && (
        <p className="mt-2 text-xs text-muted-foreground">
          Captured: {Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join(" · ")}
        </p>
      )}
    </div>
  );
}
