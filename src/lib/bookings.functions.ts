import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CAR_PACKAGES, getBikePackage } from "@/lib/pricing";
import { normalizeIndianMobile, type Booking } from "@/lib/booking";

const statusSchema = z.enum(["confirmed", "assigned", "technician_on_the_way", "service_started", "service_completed", "cancelled"]);

const bookingSchema = z.object({
  vehicle: z.enum(["bike", "car"]),
  power: z.enum(["electric", "non-electric"]).nullable().optional(),
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(100),
  engineCc: z.number().int().positive().max(2500).nullable().optional(),
  variant: z.string().trim().max(80).nullable().optional(),
  packageId: z.string().trim().min(1).max(100),
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().min(10).max(20),
  whatsapp: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(160).or(z.literal("")).optional(),
  registration: z.string().trim().max(30).optional(),
  address: z.string().trim().min(5).max(500),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(1).max(80),
  issue: z.string().trim().max(1000).optional(),
  paymentMethod: z.enum(["pay_now", "pay_later"]),
  source: z.enum(["normal", "ai"]).default("normal"),
});

function toDto(row: any, history: any[] = []): Booking & { createdAt: string; history: Array<{ status: string; note: string | null; createdAt: string }> } {
  return {
    bookingId: row.booking_id,
    vehicle: row.vehicle_type,
    power: row.power_type ?? undefined,
    brand: row.brand,
    model: row.model,
    engineCc: row.engine_cc,
    variant: row.variant ?? undefined,
    packageId: row.package_id,
    packageName: row.package_name,
    includes: row.includes,
    mrp: row.mrp,
    price: row.price,
    name: row.customer_name,
    mobile: row.customer_mobile,
    whatsapp: row.whatsapp_mobile,
    email: row.email ?? undefined,
    registration: row.registration ?? undefined,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    date: row.preferred_date,
    time: row.preferred_time,
    issue: row.issue ?? undefined,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    history: history.map((item) => ({ status: item.status, note: item.note, createdAt: item.created_at })),
  };
}

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const mobile = normalizeIndianMobile(data.mobile);
    const whatsapp = normalizeIndianMobile(data.whatsapp);
    if (!mobile || !whatsapp) throw new Error("Enter valid 10-digit Indian mobile numbers.");

    const bikePackage = data.vehicle === "bike" ? getBikePackage(data.packageId) : undefined;
    const packageItem = bikePackage ?? (data.vehicle === "car" ? CAR_PACKAGES.find((item) => item.id === data.packageId) : undefined);
    if (!packageItem) throw new Error("This service package is no longer available. Please choose it again.");
    if (data.vehicle === "bike" && data.power === "non-electric" && bikePackage) {
      if (!data.engineCc || data.engineCc < bikePackage.ccMin || (bikePackage.ccMax !== null && data.engineCc > bikePackage.ccMax)) {
        throw new Error("The selected service price does not match this bike's CC. Please choose the package again.");
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("bookings").insert({
      vehicle_type: data.vehicle,
      power_type: data.vehicle === "bike" ? data.power ?? null : null,
      brand: data.brand,
      model: data.model,
      engine_cc: data.engineCc ?? null,
      variant: data.variant ?? null,
      package_id: packageItem.id,
      package_name: packageItem.name,
      includes: packageItem.includes,
      mrp: packageItem.mrp ?? null,
      price: packageItem.price,
      customer_name: data.name,
      customer_mobile: mobile,
      whatsapp_mobile: whatsapp,
      email: data.email || null,
      registration: data.registration || null,
      address: data.address,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      preferred_date: data.date,
      preferred_time: data.time,
      issue: data.issue || null,
      source: data.source,
      payment_method: data.paymentMethod,
      payment_status: data.paymentMethod === "pay_now" ? "processing" : "pending",
      status: "confirmed",
    } as any).select("*").single();
    if (error || !row) throw new Error("We could not create the booking. Please try again.");
    return { booking: toDto(row), requiresPayment: data.paymentMethod === "pay_now" };
  });

export const trackBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ bookingId: z.string().trim().toUpperCase().regex(/^RNC-\d{8}-\d{4,}$/), mobile: z.string().trim().min(10).max(20) }).parse(data))
  .handler(async ({ data }) => {
    const mobile = normalizeIndianMobile(data.mobile);
    if (!mobile) throw new Error("Enter a valid 10-digit Indian mobile number.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("bookings").select("*").eq("booking_id", data.bookingId).eq("customer_mobile", mobile).maybeSingle();
    if (!row) return { booking: null };
    const { data: history } = await supabaseAdmin.from("booking_status_history").select("status,note,created_at").eq("booking_id", row.id).order("created_at");
    return { booking: toDto(row, history ?? []) };
  });

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden: admin access required");
}

export const adminListBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ search: z.string().trim().max(80).default("") }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from("bookings").select("*").order("created_at", { ascending: false }).limit(100);
    const mobile = normalizeIndianMobile(data.search);
    if (data.search) query = mobile ? query.eq("customer_mobile", mobile) : query.ilike("booking_id", `%${data.search.toUpperCase()}%`);
    const { data: rows, error } = await query;
    if (error) throw new Error("Could not load bookings.");
    return { bookings: (rows ?? []).map((row) => toDto(row)) };
  });

export const adminUpdateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ bookingId: z.string().trim().regex(/^RNC-\d{8}-\d{4,}$/), status: statusSchema, note: z.string().trim().max(300).optional() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("bookings").update({ status: data.status }).eq("booking_id", data.bookingId).select("id").single();
    if (error || !row) throw new Error("Could not update this booking.");
    if (data.note) await supabaseAdmin.from("booking_status_history").insert({ booking_id: row.id, status: data.status, note: data.note, changed_by: context.userId });
    return { ok: true };
  });