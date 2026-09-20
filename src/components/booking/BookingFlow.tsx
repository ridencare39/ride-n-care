import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bike, Car, Check, ChevronLeft, Crosshair, MapPin, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BIKE_CC_TIERS, CAR_PACKAGES, ELECTRIC_BIKE_PACKAGES, formatPrice, getBikeCcTier, getBikePackage, getBikePackageForServiceCc, getBikePackagesForCc, getServicePackage, type BikePackage, type BikeServiceId, type CarPackage } from "@/lib/pricing";
import { bikeCatalogBrands, bikeCatalogModels, getBikeModel } from "@/lib/vehicle-catalog";
import { CALL_NUMBER, CAR_BRANDS, CAR_FUEL_OPTIONS, PREFERRED_TIME_SLOTS, bookingIssues, carModels, clearBookingDraft, copyBookingDetails, isValidIndianMobile, loadBookingDraft, openWhatsAppUrl, reserveWhatsAppWindow, saveBookingDraft, whatsappBookingUrl, whatsappFallbackUrl, withTimeout,  type Booking, type PowerType, type ManualVehicleInfo } from "@/lib/booking";
import { createBooking } from "@/lib/bookings.functions";
import { trackCtc } from "@/lib/analytics";

type Step = "vehicle" | "power" | "brand" | "model" | "manual" | "variant" | "cc" | "package" | "includes" | "location" | "details" | "payment" | "review" | "confirmation";
const STEPS: Step[] = ["vehicle", "power", "brand", "model", "variant", "cc", "package", "includes", "location", "details", "payment", "review", "confirmation"];
const inputClass = "mt-1 h-12 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function BookingFlow({ initialVehicle, initialPackageId, initialServiceId, onDone }: { initialVehicle?: "bike" | "car"; initialPackageId?: string; initialServiceId?: BikeServiceId; onDone?: () => void }) {
  const create = useServerFn(createBooking);
  const preset = initialPackageId ? getServicePackage(initialPackageId) : undefined;
  const intendedServiceId = initialServiceId ?? (preset && "serviceId" in preset ? preset.serviceId : undefined);
  /** A CTA that already chose a vehicle/service starts fresh; a plain "Book" resume the draft. */
  const freshStart = Boolean(initialPackageId || initialServiceId);
  /** A plain "Book" with no preset vehicle always shows the Bike/Car chooser; the
   *  saved draft still pre-fills details once the customer picks a vehicle. */
  const forceVehicleChoice = !initialVehicle && !freshStart;
  const [restored] = useState(() => {
    if (freshStart) return null;
    const draft = loadBookingDraft();
    if (!draft) return null;
    if (initialVehicle && draft.booking.vehicle && draft.booking.vehicle !== initialVehicle) return null;
    if (forceVehicleChoice) return { ...draft, step: "vehicle" };
    return draft;
  });
  const [booking, setBooking] = useState<Booking>(() => ({ vehicle: initialVehicle, ...(preset ? seededPackageFields(preset) : {}), ...(restored?.booking ?? {}) }));
  const [step, setStep] = useState<Step>(() => {
    if (restored && STEPS.includes(restored.step as Step) && restored.step !== "confirmation") return restored.step as Step;
    if (initialVehicle) return initialVehicle === "bike" ? "power" : "brand";
    return "vehicle";
  });
  const [history, setHistory] = useState<Step[]>([]);
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAllIncludes, setShowAllIncludes] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);
  const [blockedOpen, setBlockedOpen] = useState(false);

  /** Requirement: keep the customer's selections when they come back to the site. */
  useEffect(() => {
    saveBookingDraft(booking, step === "confirmation" ? "review" : step);
  }, [booking, step]);

  const set = (patch: Partial<Booking>) => setBooking((value) => ({ ...value, ...patch }));
  const go = (next: Step) => { setHistory((items) => [...items, step]); setStep(next); setSearch(""); };
  const back = () => setHistory((items) => { const copy = [...items]; const previous = copy.pop(); if (previous) setStep(previous); return copy; });
  const progress = (["vehicle", "power", "brand", "model", "variant", "cc", "package", "includes", "location", "details", "payment", "review", "confirmation"].indexOf(step) + 1) / 13 * 100;
  const power = booking.power ?? "non-electric";
  const modelCc = booking.vehicle === "bike" && booking.brand && booking.model ? getBikeModel(power, booking.brand, booking.model)?.cc : null;
  const packages = booking.vehicle === "bike"
    ? booking.power === "electric" ? ELECTRIC_BIKE_PACKAGES : booking.engineCc ? getBikePackagesForCc(booking.engineCc) : []
    : CAR_PACKAGES;
  const continueFromCc = () => {
    if (!booking.engineCc) return;
    if (intendedServiceId) {
      const exactPackage = getBikePackageForServiceCc(intendedServiceId, booking.engineCc);
      if (exactPackage) { set(packageFields(exactPackage)); setShowAllIncludes(false); go("includes"); return; }
    }
    go("package");
  };

  const submit = async () => {
    const problems = bookingIssues(booking);
    if (problems.length > 0) {
      setIssues(problems);
      toast.error("Please complete the missing booking details.");
      return;
    }
    setIssues([]);
    setSaveWarning(null);
    setBlockedOpen(false);
    trackCtc("booking_form_submit", { vehicle_type: booking.vehicle, service: booking.packageName ?? undefined });
    // Reserve the tab synchronously so mobile browsers keep the tap gesture.
    const whatsappWindow = reserveWhatsAppWindow();
    setSubmitting(true);
    // Hand off to WhatsApp right away with the details already collected. A slow or
    // unreachable backend must never delay or block the booking handoff.
    const outgoing: Booking = { ...booking, paymentStatus: booking.paymentStatus ?? "pending", status: "awaiting_confirmation" };
    const opened = openWhatsAppUrl(whatsappBookingUrl(outgoing), whatsappWindow, { redirectIfBlocked: false });
    setBlockedOpen(opened === "blocked");
    setHistory((items) => [...items, step]);
    setStep("confirmation");
    setSubmitting(false);
    // Save in the background; if it succeeds the confirmation screen can resend
    // the same message including the Booking ID.
    try {
      const result = await withTimeout(create({ data: {
        vehicle: booking.vehicle!, power: booking.power ?? null, brand: booking.brand!, model: booking.model!,
        engineCc: booking.engineCc ?? null, variant: booking.variant ?? null, packageId: booking.packageId!,
        name: booking.name!, mobile: booking.mobile!, whatsapp: booking.whatsapp!, email: booking.email ?? "",
        registration: booking.registration ?? "", address: booking.address!, latitude: booking.latitude ?? null,
        longitude: booking.longitude ?? null, date: booking.date!, time: booking.time!,      issue: booking.issue ?? "",
      manualVehicle: booking.manualVehicle ?? undefined,
        paymentMethod: booking.paymentMethod!, source: booking.source ?? "normal",
      } }), 15000, "Booking");
      setBooking(result.booking);
      if (result.requiresPayment) toast.info("Your booking request is saved. Online payment remains pending.");
    } catch (error) {
      // The WhatsApp handoff already happened, so this is only a storage warning.
      console.error("Ride N Care: booking could not be saved — the WhatsApp handoff already went through.", error);
      setSaveWarning("We could not save this booking on our server just now, so please send the WhatsApp message — our team will confirm from there.");
    }
  };

  const locate = () => {
    if (!navigator.geolocation) { toast.error("Current location is not supported on this device."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { set({ latitude: coords.latitude, longitude: coords.longitude, address: `Current location (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})` }); setLocating(false); toast.success("Current location added."); },
      () => { setLocating(false); toast.error("Location access was not available. Enter your address below."); },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  return <div className="min-w-0">
    {step !== "confirmation" && <div className="mb-5 flex items-center gap-3">
      {history.length > 0 && <Button type="button" variant="outline" size="icon" onClick={back} aria-label="Go back" className="shrink-0 rounded-full"><ChevronLeft /></Button>}
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Booking progress"><div className="h-full rounded-full bg-grad-accent shadow-glow transition-all duration-300" style={{ width: `${progress}%` }} /></div>
    </div>}

    {step === "vehicle" && <Screen title="Choose Your Vehicle" note="Select the vehicle you want serviced">
      <div className="grid grid-cols-2 gap-3">
        <Choice icon={<Car />} label="Car" onClick={() => { set({ vehicle: "car", power: undefined, brand: undefined, model: undefined, engineCc: null, variant: undefined }); go("brand"); }} />
        <Choice icon={<Bike />} label="Bike" onClick={() => { set({ vehicle: "bike", brand: undefined, model: undefined, engineCc: null, variant: undefined }); go("power"); }} />
      </div>
    </Screen>}

    {step === "power" && <Screen title="Choose Bike Type" note="Select the power type">
      <div className="grid grid-cols-2 gap-3">
        <Choice label="Non-Electric" active={booking.power === "non-electric"} onClick={() => { set({ power: "non-electric", brand: undefined, model: undefined, engineCc: null, packageId: undefined, packageName: undefined, price: undefined, mrp: null, includes: undefined }); go("brand"); }} />
        <Choice label="Electric" active={booking.power === "electric"} onClick={() => { set({ power: "electric", brand: undefined, model: undefined, engineCc: null, packageId: undefined, packageName: undefined, price: undefined, mrp: null, includes: undefined }); go("brand"); }} />
      </div>
    </Screen>}

    {step === "brand" && <Screen title="Select Brand" note={`Choose your ${booking.vehicle === "car" ? "car" : "bike"} brand`}>
      <SearchBox value={search} onChange={setSearch} placeholder="Search brand" />
      <div className="mt-4 grid max-h-[48vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
        {(booking.vehicle === "bike" ? bikeCatalogBrands(power) : CAR_BRANDS.map((item) => ({ ...item, mark: item.name.slice(0, 2).toUpperCase() })))
          .filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) =>
          <Choice key={item.name} label={item.name} mark={item.mark} active={booking.brand === item.name} onClick={() => { set({ brand: item.name, model: undefined, engineCc: null, packageId: undefined, packageName: undefined, price: undefined, mrp: null, includes: undefined }); go("model"); }} />)}
      </div>
    </Screen>}

    {step === "model" && <Screen title="Select Model" note={booking.brand}>
      <SearchBox value={search} onChange={setSearch} placeholder="Search model" />
      <div className="mt-4 grid max-h-[42vh] grid-cols-2 gap-3 overflow-y-auto pr-1">
        {(booking.vehicle === "bike" ? bikeCatalogModels(power, booking.brand ?? "") : carModels(booking.brand ?? "").map((name) => ({ name, cc: null })))
          .filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) =>
          <Choice key={item.name} label={item.name} note={item.cc ? `${item.cc}cc` : undefined} active={booking.model === item.name} onClick={() => {
            set({ model: item.name, engineCc: item.cc, variant: item.cc ? getBikeCcTier(item.cc)?.label : undefined, packageId: undefined, packageName: undefined, price: undefined, mrp: null, includes: undefined });
            if (booking.vehicle === "bike" && power === "non-electric") go("cc"); else if (booking.vehicle === "car") go("variant"); else if (preset) go("includes"); else go("package");
          }} />)}
      </div>
      {booking.vehicle === "bike" && <Button type="button" variant="outline" className="mt-4 h-11 w-full rounded-full" onClick={() => go("manual")}>Can’t find your bike? Enter Brand &amp; Model Manually</Button>}
    </Screen>}

    {step === "manual" && <ManualVehicleStep booking={booking} power={power} onBack={back} onSubmit={(info, cc) => {
      set({ brand: info.brand, model: info.model, manualVehicle: info, engineCc: cc, variant: cc ? getBikeCcTier(cc)?.label : undefined, packageId: undefined, packageName: undefined, price: undefined, mrp: null, includes: undefined });
      go(power === "electric" ? "package" : "cc");
    }} />}

    {step === "variant" && <Screen title="Fuel / Variant" note="Choose your car's fuel type">
      <div className="grid grid-cols-2 gap-3">{CAR_FUEL_OPTIONS.map((fuel) => <Choice key={fuel} label={fuel} active={booking.variant === fuel} onClick={() => { set({ variant: fuel }); go(preset ? "includes" : "package"); }} />)}</div>
    </Screen>}

    {step === "cc" && <Screen title="Engine Capacity" note={modelCc ? "Detected automatically from your model" : "Enter the exact engine CC"}>
      {modelCc ? <div className="rounded-md border border-primary bg-primary/5 p-5 text-center"><div className="text-3xl font-bold">{modelCc}cc</div><div className="mt-1 text-sm text-muted-foreground">{getBikeCcTier(modelCc)?.label}</div></div> : <label className="block"><span className="text-sm font-semibold">Engine CC</span><input type="number" min="1" max="2500" className={inputClass} placeholder="Example: 349" onChange={(event) => { const cc = Number(event.target.value); set({ engineCc: cc || null, variant: getBikeCcTier(cc)?.label }); }} /></label>}
      <div className="mt-4 grid grid-cols-2 gap-2">{BIKE_CC_TIERS.map((tier) => <div key={tier.id} className={`rounded-full border px-3 py-2 text-center text-xs font-semibold ${booking.variant === tier.label ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{tier.label}</div>)}</div>
      <Button className="mt-5 h-12 w-full rounded-full" disabled={!booking.engineCc || !getBikeCcTier(booking.engineCc)} onClick={continueFromCc}>Continue</Button>
    </Screen>}

    {step === "package" && <Screen title="Choose Service" note={booking.vehicle === "bike" ? `${booking.engineCc}cc · ${booking.variant}` : "Price confirmed after inspection"}>
      <div className="grid max-h-[55vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">{packages.map((item) => <PackageCard key={item.id} item={item} active={booking.packageId === item.id} onSelect={() => { set(itemFields(item)); setShowAllIncludes(false); go("includes"); }} />)}</div>
    </Screen>}

    {step === "includes" && <Screen title="What’s Included" note={booking.packageName}>
      <div className="rounded-md border border-border bg-card p-4"><div className="text-2xl font-bold">{formatPrice(booking.price ?? null)}</div><ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">{(showAllIncludes ? booking.includes : booking.includes?.slice(0, 8))?.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary"/><span>{item}</span></li>)}</ul>{(booking.includes?.length ?? 0) > 8 && <Button variant="link" className="mt-2 px-0" onClick={() => setShowAllIncludes((value) => !value)}>{showAllIncludes ? "Show less" : "View all"}</Button>}</div>
      <Button className="mt-4 h-12 w-full rounded-full" onClick={() => go("location")}>Continue with this package</Button>
    </Screen>}

    {step === "location" && <Screen title="Service Location" note="Tell us where the mechanic should arrive">
      <Button type="button" variant="outline" className="h-14 w-full rounded-md border-primary text-primary" onClick={locate} disabled={locating}><Crosshair />{locating ? "Finding your location…" : "Use Current Location"}</Button>
      <label className="mt-4 block"><span className="text-sm font-semibold">Complete address</span><textarea rows={4} value={booking.address ?? ""} onChange={(event) => set({ address: event.target.value })} className={`${inputClass} h-auto py-3`} placeholder="House, street, area and landmark" /></label>
      {booking.latitude && <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Location pin added</p>}
      <Button className="mt-5 h-12 w-full rounded-full" disabled={!booking.address?.trim()} onClick={() => go("details")}>Continue</Button>
    </Screen>}

    {step === "details" && <CustomerDetails booking={booking} onSubmit={(values) => { set(values); go("payment"); }} />}

    {step === "payment" && <Screen title="Choose Payment" note="Your booking is created only after final confirmation">
      <div className="grid gap-3">
        <Choice label="Pay Now" note="Online payment provider setup in progress" disabled onClick={() => undefined} />
        <Choice label="Pay Later" note="Pay after service · payment remains pending" active={booking.paymentMethod === "pay_later"} onClick={() => set({ paymentMethod: "pay_later", paymentStatus: "pending" })} />
      </div>
      <Button className="mt-5 h-12 w-full rounded-full" disabled={!booking.paymentMethod} onClick={() => go("review")}>Review Booking</Button>
    </Screen>}

    {step === "review" && <Summary booking={booking} mode="review" onEdit={back} onConfirm={submit} submitting={submitting} issues={issues} />}
    {step === "confirmation" && <Summary booking={booking} mode="confirmation" notice={saveWarning} blockedOpen={blockedOpen} onDone={() => { clearBookingDraft(); onDone?.(); }} />}
  </div>;
}

function Screen({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) { return <section><div className="mb-5 text-center"><h3 className="text-xl font-bold">{title}</h3>{note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}</div>{children}</section>; }
function Choice({ label, note, icon, mark, active, disabled, onClick }: { label: string; note?: string; icon?: React.ReactNode; mark?: string; active?: boolean; disabled?: boolean; onClick: () => void }) { return <Button type="button" variant="outline" onClick={onClick} disabled={disabled} className={`h-auto min-h-16 whitespace-normal rounded-xl px-3 py-3 transition hover:border-neon/60 hover:bg-neon/5 ${active ? "border-neon bg-neon/10 text-primary shadow-glow" : ""}`}><span className="flex min-w-0 flex-col items-center gap-1">{icon}{mark && <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-muted px-2 text-xs font-black text-foreground">{mark}</span>}<span className="font-semibold">{label}</span>{note && <span className="text-xs font-normal text-muted-foreground">{note}</span>}</span></Button>; }
function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="relative block"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"/><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"/></label>; }
function ManualVehicleStep({ booking, power, onBack, onSubmit }: { booking: Booking; power: "non-electric" | "electric"; onBack: () => void; onSubmit: (info: ManualVehicleInfo, engineCc: number | null) => void }) {
  const [error, setError] = useState<string | null>(null);
  return <form onSubmit={(event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();
    const brand = get("brand"); const model = get("model");
    if (brand.length < 2 || model.length < 2) { setError("Enter at least the brand and model (2+ characters each)."); return; }
    const rawCc = get("cc"); const cc = rawCc ? Number(rawCc) : null;
    if (power === "non-electric" && (!cc || !Number.isFinite(cc) || cc < 20 || cc > 2500)) { setError("Enter your bike’s engine CC (20–2500) so we can apply the correct package price."); return; }
    if (cc && power === "electric") { setError("Electric vehicles don’t need an engine CC — please clear the CC field."); return; }
    const info: ManualVehicleInfo = { brand, model, variant: get("variant") || undefined, vehicleType: power === "electric" ? "Electric" : "Petrol", notes: get("notes") || undefined };
    setError(null); onSubmit(info, power === "non-electric" ? cc : null);
  }}>
    <p className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">Not in our catalog? Enter your bike below — for petrol bikes, add the engine CC so we quote the correct package price.</p>
    <div className="mt-4 space-y-3">
      <label className="block"><span className="text-sm font-semibold">Brand name *</span><input name="brand" defaultValue={booking.brand} required minLength={2} maxLength={40} className={inputClass} placeholder="Example: Hero" /></label>
      <label className="block"><span className="text-sm font-semibold">Model name *</span><input name="model" required minLength={2} maxLength={60} className={inputClass} placeholder="Example: Splendor Plus" /></label>
      <label className="block"><span className="text-sm font-semibold">Variant / year (optional)</span><input name="variant" maxLength={60} className={inputClass} placeholder="Example: 2020 i3s" /></label>
      {power === "non-electric" ? (
        <div>
          <label className="block"><span className="text-sm font-semibold">Engine CC *</span><input name="cc" type="number" min={20} max={2500} required className={inputClass} placeholder="Example: 110" /></label>
          <div className="mt-2 grid grid-cols-2 gap-2">{BIKE_CC_TIERS.map((tier) => <span key={tier.id} className="rounded-full border border-border px-3 py-1.5 text-center text-xs font-semibold text-muted-foreground">{tier.label}</span>)}</div>
          <p className="mt-2 text-xs text-muted-foreground">Unsure of the CC? Check your registration certificate (RC) — it lists the engine capacity.</p>
        </div>
      ) : <p className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">Electric vehicle — no engine CC needed. You’ll see our fixed Electric Vehicle Service packages next.</p>}
      <label className="block"><span className="text-sm font-semibold">Additional details (optional)</span><textarea name="notes" rows={2} maxLength={200} className={`${inputClass} h-auto py-3`} placeholder="Anything our mechanic should know" /></label>
    </div>
    {error && <p role="alert" className="mt-3 text-sm font-semibold text-destructive">{error}</p>}
    <div className="mt-5 flex gap-3"><Button type="button" variant="outline" className="h-12 flex-1 rounded-full" onClick={onBack}>Back</Button><Button type="submit" className="h-12 flex-1 rounded-full">Continue</Button></div>
  </form>;
}
function itemFields(item: BikePackage | CarPackage): Partial<Booking> { return { packageId: item.id, packageName: item.name, mrp: item.mrp ?? null, price: item.price, includes: item.includes }; }
function packageFields(item: BikePackage): Partial<Booking> { return { ...itemFields(item), variant: item.cc }; }
function seededPackageFields(item: BikePackage | CarPackage): Partial<Booking> { return "serviceId" in item ? packageFields(item) : itemFields(item); }

function PackageCard({ item, active, onSelect }: { item: BikePackage | CarPackage; active: boolean; onSelect: () => void }) { return <article className={`card-hover shadow-card rounded-xl border bg-card p-4 ${active ? "border-neon shadow-glow" : "border-border"}`}><div className="flex items-start justify-between gap-3"><div><h4 className="font-bold">{item.name}</h4><p className="mt-1 text-xs text-muted-foreground">{"cc" in item ? item.cc : item.desc}</p></div><Sparkles className={`h-5 w-5 ${active ? "text-neon" : "text-primary"}`}/></div><div className="mt-3 text-2xl font-bold">{formatPrice(item.price)}</div><p className="mt-1 text-xs text-muted-foreground">{item.duration}</p><ul className="mt-3 space-y-1 text-xs text-muted-foreground">{item.includes.slice(0, 4).map((text) => <li key={text} className="flex gap-1.5"><span aria-hidden className="text-neon">✓</span>{text}</li>)}</ul><Button type="button" className="btn-shine mt-4 h-11 w-full rounded-full" onClick={onSelect}>Select</Button></article>; }

function CustomerDetails({ booking, onSubmit }: { booking: Booking; onSubmit: (values: Partial<Booking>) => void }) {
  const [sameWhatsapp, setSameWhatsapp] = useState(true); const [error, setError] = useState<string | null>(null);
  return <Screen title="Customer Details" note="We’ll use these details for service updates"><form className="space-y-3" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const get = (key: string) => String(form.get(key) ?? "").trim(); const mobile = get("mobile"); const whatsapp = sameWhatsapp ? mobile : get("whatsapp"); if (!isValidIndianMobile(mobile) || !isValidIndianMobile(whatsapp)) { setError("Enter valid 10-digit Indian mobile numbers."); return; } setError(null); onSubmit({ name: get("name"), mobile, whatsapp, email: get("email"), registration: get("registration"), date: get("date"), time: get("time"), issue: get("issue") }); }}>
    <Field label="Full Name" name="name" required defaultValue={booking.name}/><Field label="Mobile Number" name="mobile" required inputMode="numeric" placeholder="10-digit mobile" defaultValue={booking.mobile}/>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sameWhatsapp} onChange={(event) => setSameWhatsapp(event.target.checked)} className="h-4 w-4 accent-primary"/>WhatsApp number is the same</label>
    {!sameWhatsapp && <Field label="WhatsApp Number" name="whatsapp" required inputMode="numeric" defaultValue={booking.whatsapp}/>}<Field label="Email (optional)" name="email" type="email" defaultValue={booking.email}/><Field label="Vehicle Registration (optional)" name="registration" defaultValue={booking.registration}/>
    <div className="grid gap-3 sm:grid-cols-2"><Field label="Preferred Date" name="date" type="date" required defaultValue={booking.date}/><label className="block"><span className="text-sm font-semibold">Preferred Time</span><select name="time" className={inputClass} defaultValue={booking.time}>{PREFERRED_TIME_SLOTS.map((time) => <option key={time}>{time}</option>)}</select></label></div>
    <label className="block"><span className="text-sm font-semibold">Additional Notes (optional)</span><textarea name="issue" rows={3} defaultValue={booking.issue} className={`${inputClass} h-auto py-3`}/></label>{error && <p className="text-sm font-semibold text-destructive">{error}</p>}<Button className="h-12 w-full rounded-full">Continue to Payment</Button>
  </form></Screen>;
}
function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className="block"><span className="text-sm font-semibold">{label}</span><input {...props} className={inputClass}/></label>; }

export function Summary({ booking, mode = "confirmation", onEdit, onConfirm, submitting, onDone, issues, notice, blockedOpen }: { booking: Booking; mode?: "review" | "confirmation"; onEdit?: () => void; onConfirm?: () => void; submitting?: boolean; onDone?: () => void; issues?: string[]; notice?: string | null; blockedOpen?: boolean }) {
  const rows = useMemo(() => ([
    ["Booking ID", booking.bookingId], ["Vehicle", booking.vehicle === "bike" ? "Bike" : "Car"], ["Type", booking.power === "electric" ? "Electric" : booking.power ? "Non-Electric" : ""], ["Vehicle details", [booking.brand, booking.model].filter(Boolean).join(" ")], ["CC", booking.engineCc ? `${booking.engineCc}cc (${booking.variant})` : booking.variant], ["Service", booking.packageName], ["Price", formatPrice(booking.price ?? null)], ["Location", booking.address], ["Customer", booking.name], ["Mobile", booking.mobile], ["WhatsApp", booking.whatsapp], ["Date", booking.date], ["Time", booking.time], ["Payment", booking.paymentMethod === "pay_now" ? `Pay Now · ${booking.paymentStatus ?? "processing"}` : "Pay Later · Pending"], ["Status", mode === "confirmation" ? "Awaiting Ride N Care confirmation" : undefined],
  ] as [string, string | undefined][]).filter(([, value]) => value), [booking]);
  return <section className="min-w-0"><div className="text-center">{mode === "confirmation" && <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-7 w-7"/></div>}<h3 className="mt-3 text-xl font-bold">{mode === "confirmation" ? "Booking Request Ready" : "Review Your Booking"}</h3>{mode === "confirmation" && <p className="mt-1 text-sm text-muted-foreground">Send the prepared WhatsApp message. Ride N Care will confirm your booking.</p>}{booking.bookingId && <p className="mt-1 font-mono text-lg font-bold text-primary">{booking.bookingId}</p>}</div>
    <div className="mt-4 divide-y divide-border rounded-md border border-border bg-card px-4">{rows.map(([key, value]) => <div key={key} className="grid grid-cols-[minmax(90px,0.7fr)_minmax(0,1.3fr)] gap-3 py-2.5 text-sm"><span className="text-muted-foreground">{key}</span><span className="break-words text-right font-semibold">{value}</span></div>)}</div>
    {!!booking.includes?.length && <details className="mt-3 rounded-md border border-border bg-card p-4"><summary className="cursor-pointer font-semibold">What’s Included ({booking.includes.length})</summary><ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">{booking.includes.map((item) => <li key={item}>✓ {item}</li>)}</ul></details>}
    {!!issues?.length && <div role="alert" className="mt-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm"><p className="font-semibold text-destructive">Please complete these details:</p><ul className="mt-1 list-disc space-y-0.5 pl-5 text-destructive">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
    {mode === "review" ? <div className="mt-4 grid grid-cols-2 gap-2"><Button variant="outline" className="h-12 rounded-full" onClick={onEdit}>Edit</Button><Button className="h-12 rounded-full" onClick={onConfirm} disabled={submitting}>{submitting ? "Preparing…" : "Continue to WhatsApp"}</Button></div> : <>{notice && <p className="mt-4 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm">{notice}</p>}{blockedOpen && <p role="status" className="mt-4 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm">Your browser blocked the automatic WhatsApp tab. Tap the green button below to send your booking — or copy the details and message us on +91 82969 50339.</p>}<Button asChild className="mt-4 h-12 w-full rounded-full bg-whatsapp text-whatsapp-foreground"><a href={whatsappBookingUrl(booking)} target="_blank" rel="noopener noreferrer">Open WhatsApp to Send</a></Button><p className="mt-3 text-sm text-muted-foreground">WhatsApp didn’t open? <a href={whatsappBookingUrl(booking)} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Open it again</a>, <a href={whatsappFallbackUrl(booking)} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">use the alternate WhatsApp link</a>, or use “Copy Details” and send the message to +91 82969 50339.</p><div className="mt-3 grid grid-cols-2 gap-2"><Button variant="outline" onClick={async () => toast[(await copyBookingDetails(booking)) ? "success" : "error"]("Booking details copied")} className="rounded-full">Copy Details</Button><Button variant="outline" asChild className="rounded-full"><a href={`tel:${CALL_NUMBER}`}>Call Ride N Care</a></Button></div>{onDone && <Button variant="ghost" className="mt-2 w-full" onClick={onDone}>Done</Button>}</>}
  </section>;
}
function titleCase(value: string) { return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
