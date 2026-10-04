import {
  Award,
  BadgeCheck,
  Bike,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  FileText,
  House,
  MapPin,
  MessageCircle,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * ExperienceSection — "The Ride N Care Experience" (owner request
 * 2026-10-04, PREVIEW FIRST).
 *
 * Replaces the third-party Trustindex Google reviews widget, whose 7-day free
 * trial expired and left a subscription notice on the homepage. This section
 * is fully native: no external scripts, no iframes, no subscription states.
 *
 * Content rules (owner brief):
 *  - 10–12 visually consistent cards (here: 12) with honest, service-focused
 *    copy — every claim is already confirmed by existing site content
 *    (written quotes, 45-day warranty, OEM-grade spares, 40+ Bangalore areas,
 *    verified mechanics, 7:00 AM–11:30 PM daily hours, etc.)
 *  - NO fake names, photos, dates, locations, review counts or testimonials
 *  - NO star rating for the section — decorative accents are soft glows only,
 *    never star shapes that could read as a rating
 *  - No Review / AggregateRating structured data is added anywhere
 *
 * Design: the homepage's existing language — eyebrow pill + H2, rounded-3xl
 * plates on the `bg-card` band (same shell the replaced section used, so the
 * page rhythm and scroll layout stay stable), lucide icons in a neon-tinted
 * chip, subtle top-edge gradient wash, gentle hover lift. Static markup → no
 * layout shift, no client-side data fetch.
 */
type ExperienceCard = { title: string; desc: string; Icon: LucideIcon };

const EXPERIENCE_CARDS: ExperienceCard[] = [
  {
    title: "Doorstep Service Convenience",
    desc: "A trained mechanic comes to your home or office with the right tools — no workshop queues, no waiting around all day.",
    Icon: House,
  },
  {
    title: "Bike and Car Service Options",
    desc: "Routine bike servicing, car care, EV support and planned maintenance — one doorstep team for both your vehicles.",
    Icon: Bike,
  },
  {
    title: "Clear, Written Quotes",
    desc: "You approve a written quote before any work begins, so the price is agreed up front — and there are no surprise bills after.",
    Icon: FileText,
  },
  {
    title: "Convenient Booking",
    desc: "Book by call, WhatsApp or the online booking flow in about a minute — open 7:00 AM to 11:30 PM, every day of the week.",
    Icon: CalendarCheck,
  },
  {
    title: "Experienced Service Support",
    desc: "Every visit is handled by background-verified, trained mechanics who work on bikes and cars every single day.",
    Icon: BadgeCheck,
  },
  {
    title: "Genuine Communication",
    desc: "Straight answers while your vehicle is being serviced — no upselling, no hidden charges, just honest updates.",
    Icon: MessageCircle,
  },
  {
    title: "Repair and Maintenance Assistance",
    desc: "From an oil change at your doorstep to a Sunday breakdown rescue — everyday repairs and planned maintenance, all at home.",
    Icon: Wrench,
  },
  {
    title: "Service Across Selected Bangalore Areas",
    desc: "Doorstep service across 40+ areas in Bangalore — from Koramangala and HSR Layout to Whitefield and beyond.",
    Icon: MapPin,
  },
  {
    title: "A Focus on Customer Convenience",
    desc: "Flexible slots that fit around your day — service happens while you get on with work, family or the commute.",
    Icon: Clock,
  },
  {
    title: "Transparent Service Information",
    desc: "Digital invoices, genuine OEM-grade spares and clear pricing at every step — you can see exactly what was done and what it cost.",
    Icon: ClipboardCheck,
  },
  {
    title: "Support for Everyday Riders",
    desc: "Answers, guides and service pages explain what your bike or car actually needs — helpful information before you even book.",
    Icon: Users,
  },
  {
    title: "A Commitment to Quality Service",
    desc: "Careful workmanship backed by a 45-day service warranty on eligible repairs — quality you can rely on, mile after mile.",
    Icon: Award,
  },
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="overflow-hidden border-y border-border bg-card py-14 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/45 bg-neon/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
            The Ride N Care Standard
          </span>
          <h2 id="experience-heading" className="mt-3 text-3xl font-bold md:text-4xl">
            The Ride N Care Experience
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Discover the convenience and care behind our doorstep bike and car service in Bangalore.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {EXPERIENCE_CARDS.map(({ title, desc, Icon }) => (
            <div
              key={title}
              className="group relative h-full overflow-hidden rounded-3xl border border-border bg-plate p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/45 sm:p-7"
            >
              {/* soft top-edge wash — decorative depth, same treatment as the
                  premium blocks elsewhere on the homepage */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 to-transparent"
              />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition duration-300 group-hover:border-primary/55 group-hover:bg-primary/15">
                <Icon aria-hidden className="h-6 w-6" />
              </span>
              <h3 className="relative mt-4 text-[17px] font-semibold leading-snug text-foreground">
                {title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
