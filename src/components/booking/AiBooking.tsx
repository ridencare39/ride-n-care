import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatBookingAssistant } from "@/lib/ai-booking.functions";
import { Summary } from "@/components/booking/BookingFlow";
import type { Booking } from "@/lib/booking";
import { createBooking } from "@/lib/bookings.functions";
import { BIKE_PACKAGES, CAR_PACKAGES, ELECTRIC_BIKE_PACKAGES, getBikePackagesForCc } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm the Ride N Care booking assistant. Tell me what you need — for example \"doorstep service for my Honda Activa in Koramangala tomorrow\".";

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
  const packages = vehicle === "car" ? CAR_PACKAGES : power === "electric" ? ELECTRIC_BIKE_PACKAGES : engineCc ? getBikePackagesForCc(engineCc) : BIKE_PACKAGES;
  const packageHint = (fields["packageName"] ?? fields["package"] ?? "").toLowerCase();
  const matchedPackage = packages.find(
    (item) => packageHint.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(packageHint),
  );
  return {
    ...(vehicle ? { vehicle } : {}),
    ...(power ? { power } : {}),
    brand: fields["brand"],
    model: fields["model"],
    variant: fields["variant"] ?? matchedPackage && "cc" in matchedPackage ? (matchedPackage as { cc: string }).cc : undefined,
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
    address: fields["address"],
    date: fields["date"],
    time: fields["time"],
    issue: fields["issue"],
    paymentMethod: fields["paymentMethod"]?.toLowerCase().includes("now") ? "pay_now" : "pay_later",
    source: "ai",
  };
}

export function AiBooking() {
  const ask = useServerFn(chatBookingAssistant);
  const create = useServerFn(createBooking);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [complete, setComplete] = useState(false);
  const [created, setCreated] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy]);
  useEffect(() => {
    inputRef.current?.focus();
  }, [busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const history = [...messages.filter((m, i) => !(i === 0 && m.role === "assistant")), { role: "user" as const, content: text }];
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await ask({ data: { messages: history } });
      if (res.error) {
        setError(res.error);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
        setFields((f) => ({ ...f, ...res.booking }));
        if (res.complete) setComplete(true);
      }
    } catch {
      setError("Something went wrong. Please use the normal booking form or WhatsApp.");
    } finally {
      setBusy(false);
    }
  };

  if (created) return <Summary booking={created} />;
  if (complete) {
    const booking = toBooking(fields);
    return <div><Summary booking={booking} mode="review" /><Button className="mt-4 h-12 w-full rounded-full" disabled={busy} onClick={async () => {
      if (!booking.vehicle || !booking.brand || !booking.model || !booking.packageId || !booking.name || !booking.mobile || !booking.whatsapp || !booking.address || !booking.date || !booking.time || !booking.paymentMethod) { setError("A required booking detail is missing. Please use the normal booking form."); setComplete(false); return; }
      setBusy(true); try { const result = await create({ data: { vehicle: booking.vehicle, power: booking.power ?? null, brand: booking.brand, model: booking.model, engineCc: booking.engineCc ?? null, variant: booking.variant ?? null, packageId: booking.packageId, name: booking.name, mobile: booking.mobile, whatsapp: booking.whatsapp, email: booking.email ?? "", registration: booking.registration ?? "", address: booking.address, latitude: null, longitude: null, date: booking.date, time: booking.time, issue: booking.issue ?? "", paymentMethod: booking.paymentMethod, source: "ai" } }); setCreated(result.booking); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not create booking."); } finally { setBusy(false); }
    }}>{busy ? "Creating…" : "Create Confirmed Booking"}</Button>{error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}</div>;
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-col">
      <div ref={listRef} className="max-h-[45vh] min-h-40 space-y-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
              m.role === "user" ? "ml-auto bg-grad-primary text-primary-foreground" : "border border-border bg-card"
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && <div className="max-w-[85%] rounded-2xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted-foreground">Typing…</div>}
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}

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
      {Object.keys(fields).length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Captured: {Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join(" · ")}
        </p>
      )}
    </div>
  );
}
