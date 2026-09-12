import { useMemo, useState } from "react";
import {
  BIKE_PACKAGES,
  CAR_PACKAGES,
  formatPrice,
  type BikePackage,
  type CarPackage,
} from "@/lib/pricing";
import {
  CALL_NUMBER,
  CAR_BRANDS,
  CAR_FUEL_OPTIONS,
  PREFERRED_TIME_SLOTS,
  bikeBrands,
  bikeModels,
  carModels,
  copyBookingDetails,
  isValidIndianMobile,
  sendBookingToWhatsApp,
  type Booking,
  type PowerType,
} from "@/lib/booking";
import { toast } from "sonner";

type Step =
  | "vehicle"
  | "power"
  | "brand"
  | "model"
  | "variant"
  | "package"
  | "includes"
  | "checkout"
  | "summary";

const chip =
  "w-full min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm font-medium transition hover:border-primary hover:bg-card active:scale-[0.99]";
const chipActive = "border-primary bg-card text-primary";

export function BookingFlow({
  initialVehicle,
  initialPackageId,
  onDone,
}: {
  initialVehicle?: "bike" | "car";
  initialPackageId?: string;
  onDone?: () => void;
}) {
  const [booking, setBooking] = useState<Booking>(() => {
    const base: Booking = {};
    if (initialVehicle) base.vehicle = initialVehicle;
    if (initialVehicle === "bike" && initialPackageId) {
      const p = BIKE_PACKAGES.find((x) => x.id === initialPackageId);
      if (p) Object.assign(base, packageFields(p), { variant: p.cc });
    }
    if (initialVehicle === "car" && initialPackageId) {
      const p = CAR_PACKAGES.find((x) => x.id === initialPackageId);
      if (p) Object.assign(base, carPackageFields(p));
    }
    return base;
  });
  const [step, setStep] = useState<Step>(initialVehicle ? (initialVehicle === "bike" ? "power" : "brand") : "vehicle");
  const [showAllIncludes, setShowAllIncludes] = useState(false);

  const set = (patch: Partial<Booking>) => setBooking((b) => ({ ...b, ...patch }));

  const bikeSelected = booking.vehicle === "bike";
  const order: Step[] = bikeSelected
    ? ["vehicle", "power", "brand", "model", "variant", "package", "includes", "checkout", "summary"]
    : ["vehicle", "brand", "model", "variant", "package", "includes", "checkout", "summary"];
  const idx = Math.max(0, order.indexOf(step));

  const back = () => {
    if (idx <= 0) return;
    setStep(order[idx - 1] as Step);
  };
  const next = () => setStep(order[Math.min(order.length - 1, idx + 1)] as Step);

  const includes = booking.includes ?? [];
  const visibleIncludes = showAllIncludes ? includes : includes.slice(0, 6);

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-3">
        {idx > 0 && (
          <button onClick={back} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
            ← Back
          </button>
        )}
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-grad-primary transition-all"
            style={{ width: `${((idx + 1) / order.length) * 100}%` }}
          />
        </div>
      </div>

      {step === "vehicle" && (
        <Section title="What do you want serviced?">
          <div className="grid grid-cols-2 gap-3">
            {(["bike", "car"] as const).map((v) => (
              <button
                key={v}
                className={chip}
                onClick={() => {
                  set({ vehicle: v, power: undefined, brand: undefined, model: undefined, variant: undefined, packageId: undefined, packageName: undefined, includes: undefined });
                  setStep(v === "bike" ? "power" : "brand");
                }}
              >
                {v === "bike" ? "🏍️ Book Bike" : "🚗 Book Car"}
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === "power" && (
        <Section title="Is it electric?">
          <div className="grid grid-cols-2 gap-3">
            {(["non-electric", "electric"] as PowerType[]).map((p) => (
              <button
                key={p}
                className={`${chip} ${booking.power === p ? chipActive : ""}`}
                onClick={() => {
                  set({ power: p, brand: undefined, model: undefined });
                  setStep("brand");
                }}
              >
                {p === "electric" ? "Electric" : "Non-Electric"}
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === "brand" && (
        <Section title="Select brand">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(bikeSelected ? bikeBrands(booking.power ?? "non-electric").map((b) => b.name) : CAR_BRANDS.map((b) => b.name)).map(
              (name) => (
                <button
                  key={name}
                  className={`${chip} ${booking.brand === name ? chipActive : ""}`}
                  onClick={() => {
                    set({ brand: name, model: undefined });
                    setStep("model");
                  }}
                >
                  {name}
                </button>
              ),
            )}
          </div>
        </Section>
      )}

      {step === "model" && (
        <Section title="Select model">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(bikeSelected
              ? bikeModels(booking.power ?? "non-electric", booking.brand ?? "")
              : carModels(booking.brand ?? "")
            ).map((m) => (
              <button
                key={m}
                className={`${chip} ${booking.model === m ? chipActive : ""}`}
                onClick={() => {
                  set({ model: m });
                  setStep("variant");
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === "variant" && (
        <Section title={bikeSelected ? "Engine capacity (CC)" : "Fuel / variant"}>
          <div className="grid grid-cols-2 gap-3">
            {(bikeSelected ? BIKE_PACKAGES.map((p) => p.cc) : CAR_FUEL_OPTIONS).map((v) => (
              <button
                key={v}
                className={`${chip} ${booking.variant === v ? chipActive : ""}`}
                onClick={() => {
                  if (bikeSelected) {
                    const p = BIKE_PACKAGES.find((x) => x.cc === v);
                    set({ variant: v, ...(p ? packageFields(p) : {}) });
                    setStep("package");
                  } else {
                    set({ variant: v });
                    setStep("package");
                  }
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === "package" && (
        <Section title="Choose your package">
          <div className="grid gap-3 sm:grid-cols-2">
            {bikeSelected
              ? BIKE_PACKAGES.map((p) => (
                  <PackageCard
                    key={p.id}
                    title={p.name}
                    sub={p.cc}
                    mrp={p.mrp}
                    price={p.price}
                    duration={p.duration}
                    active={booking.packageId === p.id}
                    onSelect={() => {
                      set({ variant: booking.variant ?? p.cc, ...packageFields(p) });
                      setShowAllIncludes(false);
                      setStep("includes");
                    }}
                  />
                ))
              : CAR_PACKAGES.map((p) => (
                  <PackageCard
                    key={p.id}
                    title={p.name}
                    sub={p.desc}
                    mrp={p.mrp ?? null}
                    price={p.price}
                    duration={p.duration}
                    active={booking.packageId === p.id}
                    onSelect={() => {
                      set(carPackageFields(p));
                      setShowAllIncludes(false);
                      setStep("includes");
                    }}
                  />
                ))}
          </div>
        </Section>
      )}

      {step === "includes" && (
        <Section title={`${booking.packageName ?? "Package"} includes`}>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline gap-2">
              {booking.mrp ? <span className="text-sm text-muted-foreground line-through">{formatPrice(booking.mrp)}</span> : null}
              <span className="text-2xl font-bold">{formatPrice(booking.price ?? null)}</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {visibleIncludes.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span className="min-w-0">{i}</span>
                </li>
              ))}
            </ul>
            {includes.length > 6 && (
              <button
                onClick={() => setShowAllIncludes((v) => !v)}
                className="mt-3 text-xs font-bold uppercase tracking-wider text-primary"
              >
                {showAllIncludes ? "Hide inclusions" : "View all inclusions"}
              </button>
            )}
          </div>
          <button onClick={next} className="mt-4 w-full rounded-full bg-grad-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow">
            Continue to checkout
          </button>
        </Section>
      )}

      {step === "checkout" && (
        <CheckoutForm
          booking={booking}
          onBack={back}
          onSubmit={(values) => {
            set(values);
            setStep("summary");
          }}
        />
      )}

      {step === "summary" && <Summary booking={booking} onEdit={() => setStep("checkout")} onDone={onDone} />}
    </div>
  );
}

function packageFields(p: BikePackage): Partial<Booking> {
  return { packageId: p.id, packageName: p.name, mrp: p.mrp, price: p.price, includes: p.includes };
}
function carPackageFields(p: CarPackage): Partial<Booking> {
  return { packageId: p.id, packageName: p.name, mrp: p.mrp ?? null, price: p.price, includes: p.includes };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function PackageCard({
  title,
  sub,
  mrp,
  price,
  duration,
  active,
  onSelect,
}: {
  title: string;
  sub: string;
  mrp: number | null;
  price: number | null;
  duration: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? "border-primary" : "border-border"} bg-card`}>
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        {mrp ? <span className="text-sm text-muted-foreground line-through">₹{mrp.toLocaleString("en-IN")}</span> : null}
        <span className="text-xl font-bold">{formatPrice(price)}</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{duration}</div>
      <button onClick={onSelect} className="mt-3 w-full min-h-11 rounded-full bg-grad-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
        Select
      </button>
    </div>
  );
}

function CheckoutForm({
  booking,
  onSubmit,
  onBack,
}: {
  booking: Booking;
  onSubmit: (v: Partial<Booking>) => void;
  onBack: () => void;
}) {
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="min-w-0 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const get = (k: string) => String(fd.get(k) ?? "").trim();
        const mobile = get("mobile");
        if (!isValidIndianMobile(mobile)) {
          setError("Enter a valid 10-digit Indian mobile number.");
          return;
        }
        const whatsapp = sameWhatsapp ? mobile : get("whatsapp");
        if (!sameWhatsapp && !isValidIndianMobile(whatsapp)) {
          setError("Enter a valid 10-digit WhatsApp number.");
          return;
        }
        setError(null);
        onSubmit({
          name: get("name"),
          mobile: `+91 ${mobile}`,
          whatsapp: `+91 ${whatsapp.replace(/\D/g, "").slice(-10)}`,
          email: get("email"),
          registration: get("registration"),
          address: get("address"),
          date: get("date"),
          time: get("time"),
          issue: get("issue"),
        });
      }}
    >
      <div className="rounded-2xl border border-border bg-card p-4 text-sm">
        <div className="font-semibold">{booking.packageName}</div>
        <div className="mt-1 text-muted-foreground">
          {[booking.vehicle === "car" ? "Car" : "Bike", booking.brand, booking.model, booking.variant].filter(Boolean).join(" · ")}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          {booking.mrp ? <span className="text-muted-foreground line-through">{formatPrice(booking.mrp)}</span> : null}
          <span className="text-lg font-bold">{formatPrice(booking.price ?? null)}</span>
        </div>
      </div>

      <Input label="Full name" name="name" required defaultValue={booking.name} />
      <Input label="Mobile number" name="mobile" type="tel" inputMode="numeric" required placeholder="10-digit mobile" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={sameWhatsapp} onChange={(e) => setSameWhatsapp(e.target.checked)} className="h-4 w-4" />
        WhatsApp number is the same
      </label>
      {!sameWhatsapp && <Input label="WhatsApp number" name="whatsapp" type="tel" inputMode="numeric" placeholder="10-digit WhatsApp" />}
      <Input label="Email (optional)" name="email" type="email" />
      <Input label="Vehicle registration number" name="registration" placeholder="KA-01-AB-1234" />
      <Input label="Address / location" name="address" required placeholder="Flat, street, area, Bangalore" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Preferred date" name="date" type="date" required />
        <label className="block min-w-0">
          <span className="text-sm font-semibold">Preferred time</span>
          <select name="time" className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-3 text-sm">
            {PREFERRED_TIME_SLOTS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block min-w-0">
        <span className="text-sm font-semibold">Additional issue (optional)</span>
        <textarea name="issue" rows={3} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
      </label>

      {error && <p className="text-sm font-semibold text-destructive">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onBack} className="min-h-12 rounded-full border border-border px-5 py-3 text-sm font-semibold">
          Back
        </button>
        <button className="min-h-12 flex-1 rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
          Review booking
        </button>
      </div>
    </form>
  );
}

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-semibold">{label}</span>
      <input {...p} className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-3 text-sm" />
    </label>
  );
}

export function Summary({ booking, onEdit, onDone }: { booking: Booking; onEdit?: () => void; onDone?: () => void }) {
  const rows = useMemo(
    () =>
      (
        [
          ["Vehicle", booking.vehicle === "car" ? "Car" : booking.vehicle === "bike" ? "Bike" : ""],
          ["Power", booking.power === "electric" ? "Electric" : booking.power ? "Non-Electric" : ""],
          ["Brand", booking.brand],
          ["Model", booking.model],
          [booking.vehicle === "car" ? "Variant / Fuel" : "CC", booking.variant],
          ["Package", booking.packageName],
          ["MRP", booking.mrp ? formatPrice(booking.mrp) : ""],
          ["Offer price", booking.price !== undefined ? formatPrice(booking.price ?? null) : ""],
          ["Name", booking.name],
          ["Mobile", booking.mobile],
          ["WhatsApp", booking.whatsapp],
          ["Email", booking.email],
          ["Registration", booking.registration],
          ["Address", booking.address],
          ["Date", booking.date],
          ["Time", booking.time],
          ["Issue", booking.issue],
        ] as [string, string | undefined][]
      ).filter(([, v]) => v && v.length > 0),
    [booking],
  );

  return (
    <div className="min-w-0">
      <h3 className="text-lg font-bold">Booking summary</h3>
      <div className="mt-3 space-y-2 rounded-2xl border border-border bg-card p-4 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{k}</span>
            <span className="min-w-0 break-words text-right font-semibold">{v}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          sendBookingToWhatsApp(booking);
          onDone?.();
        }}
        className="mt-4 w-full min-h-12 rounded-full bg-whatsapp px-6 py-3.5 font-bold text-whatsapp-foreground shadow-lg"
      >
        CONFIRM &amp; BOOK ON WHATSAPP
      </button>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={async () => {
            const ok = await copyBookingDetails(booking);
            toast[ok ? "success" : "error"](ok ? "Booking details copied" : "Could not copy — please screenshot the summary");
          }}
          className="min-h-11 flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold"
        >
          Copy booking details
        </button>
        <a
          href={`tel:${CALL_NUMBER}`}
          className="min-h-11 flex-1 rounded-full border border-border px-4 py-2.5 text-center text-sm font-semibold"
        >
          Call Ride N Care
        </a>
        {onEdit && (
          <button onClick={onEdit} className="min-h-11 flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold">
            Edit details
          </button>
        )}
      </div>
    </div>
  );
}
