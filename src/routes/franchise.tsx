import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, CalendarCheck, ClipboardList, Copy, HandshakeIcon, MapPin, MessageCircle, Phone, Rocket, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CALL_NUMBER, isValidIndianMobile, openWhatsAppUrl, reserveWhatsAppWindow, WHATSAPP_NUMBER } from "@/lib/booking";
import { SITE_URL } from "@/lib/seo";
import { pageHead } from "@/lib/head";
import { graphForPage, breadcrumbNode, pageScripts } from "@/lib/schema";

export const Route = createFileRoute("/franchise")({
  head: () => ({
    ...pageHead({
      title: "Ride N Care Franchise — Doorstep Service Partnership",
      description:
        "Bring the Ride N Care doorstep bike and car service model to your city. Enquire about a franchise — details shared directly on WhatsApp. No obligation.",
      path: "/franchise",
      extraMeta: [
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: "Ride N Care Franchise — Partnership Enquiry" },
        { name: "twitter:description", content: "Bring trusted doorstep bike & car service to your city. Enquire on the Ride N Care franchise page." },
      ],
    }),
    scripts: pageScripts(
      graphForPage([
        breadcrumbNode([
          ["Home", "/"],
          ["Franchise", "/franchise"],
        ]),
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/franchise#webpage`,
          url: `${SITE_URL}/franchise`,
          name: "Ride N Care Franchise — Doorstep Bike & Car Service Partnership",
          description:
            "Enquire about a Ride N Care franchise and bring the doorstep bike and car service model to your city. Terms are shared directly during the enquiry.",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": `${SITE_URL}/#organization` },
        },
      ]),
    ),
  }),
  component: FranchisePage,
});

const BENEFITS: { icon: React.ReactNode; title: string; text: string }[] = [
  {
    icon: <Rocket className="h-5 w-5 text-neon" aria-hidden />,
    title: "A proven doorstep playbook",
    text: "Run the same doorstep model that customers in Bangalore already use — booking, doorstep visits, written quotes and post-service invoicing.",
  },
  {
    icon: <BadgeCheck className="h-5 w-5 text-neon" aria-hidden />,
    title: "An established brand",
    text: "Operate under the Ride N Care name and “Care in Every Mile” promise, with consistent branding across your locality.",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-neon" aria-hidden />,
    title: "Booking technology included",
    text: "Use the same website booking flow, WhatsApp booking handoff and booking records that power Ride N Care today.",
  },
  {
    icon: <ClipboardList className="h-5 w-5 text-neon" aria-hidden />,
    title: "Transparent pricing framework",
    text: "Follow a clear, package-based price list, so customers know the cost before the mechanic arrives.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-neon" aria-hidden />,
    title: "Quality standards",
    text: "Work to the same standards customers expect: OEM-grade parts and a workmanship guarantee on the work performed.",
  },
  {
    icon: <HandshakeIcon className="h-5 w-5 text-neon" aria-hidden />,
    title: "Onboarding & operational guidance",
    text: "We walk you through service checklists, customer communication and day-to-day operations when you come on board.",
  },
];

const STEPS: { icon: React.ReactNode; title: string; text: string }[] = [
  { icon: <MessageCircle className="h-5 w-5 text-neon" aria-hidden />, title: "1. Send your enquiry", text: "Fill the form below — it opens a ready-made WhatsApp message to our team." },
  { icon: <Phone className="h-5 w-5 text-neon" aria-hidden />, title: "2. Talk to us", text: "We discuss your city, your background and how a partnership could work. Franchise terms are shared directly at this stage." },
  { icon: <CalendarCheck className="h-5 w-5 text-neon" aria-hidden />, title: "3. Plan the pilot", text: "Together we agree on your launch area, the services you start with and a simple rollout plan." },
  { icon: <Wrench className="h-5 w-5 text-neon" aria-hidden />, title: "4. Launch with support", text: "Go live with the Ride N Care booking system, brand and operational guidance behind you." },
];

const FAQS: [string, string][] = [
  [
    "What does a Ride N Care franchise cost?",
    "Franchise terms — including fees and investment — depend on your city and the scope you take on, so we share them individually during the enquiry conversation rather than publishing fixed numbers. Send the enquiry form and we'll cover everything on WhatsApp or a call.",
  ],
  [
    "Which locations can apply?",
    "Ride N Care currently operates in Bangalore, Karnataka. Enquiries from other cities and towns are welcome — every application is reviewed individually based on the local market.",
  ],
  [
    "Do I need a workshop?",
    "The Ride N Care model is primarily doorstep: mechanics travel to the customer. You don't need a customer-facing showroom, and specific space or equipment needs are discussed during the enquiry.",
  ],
  [
    "How soon do I hear back?",
    "Enquiries sent on WhatsApp are usually answered the same day. Please share a working phone number so we can reach you quickly.",
  ],
];

const INVESTMENT_OPTIONS = [
  "Not sure yet — let's discuss",
  "Under ₹5 lakh",
  "₹5 – 10 lakh",
  "₹10 – 25 lakh",
  "Above ₹25 lakh",
];

interface Enquiry {
  name: string;
  phone: string;
  email: string;
  location: string;
  investment: string;
  message: string;
}

function buildEnquiryMessage(e: Enquiry): string {
  const lines: (string | false | undefined)[] = [
    "*Franchise Enquiry — Ride N Care*",
    "",
    e.name && `Name: ${e.name}`,
    e.phone && `Phone: ${e.phone}`,
    e.email && `Email: ${e.email}`,
    e.location && `Preferred Location: ${e.location}`,
    e.investment && `Investment Interest: ${e.investment}`,
    e.message && `Message: ${e.message}`,
    "",
    "Sent from ridencare.co.in/franchise",
  ];
  return lines.filter((l): l is string => typeof l === "string").join("\n").trim();
}

function enquiryWhatsAppUrl(e: Enquiry): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildEnquiryMessage(e))}`;
}

function FranchisePage() {
  const [sent, setSent] = useState<Enquiry | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Enquiry, string>>>({});

  const validate = (e: Enquiry) => {
    const next: Partial<Record<keyof Enquiry, string>> = {};
    if (e.name.trim().length < 2) next.name = "Enter your full name.";
    if (!isValidIndianMobile(e.phone)) next.phone = "Enter a valid 10-digit Indian mobile number.";
    if (e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) next.email = "Enter a valid email address or leave it blank.";
    if (e.location.trim().length < 2) next.location = "Tell us the city or area you're interested in.";
    if (!e.investment) next.investment = "Choose the option that best matches your interest.";
    return next;
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const enquiry: Enquiry = {
      name: String(form.get("name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      location: String(form.get("location") ?? "").trim(),
      investment: String(form.get("investment") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
    };
    const found = validate(enquiry);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    // Reserve the tab synchronously so mobile browsers keep the tap gesture.
    const url = enquiryWhatsAppUrl(enquiry);
    const win = reserveWhatsAppWindow();
    openWhatsAppUrl(url, win);
    setSent(enquiry);
  };

  const whatsappCta = useMemo(() => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Ride N Care, I'd like to know more about the franchise opportunity.")}`, []);

  return (
    <main className="min-w-0">
      {/* Hero */}
      <section className="bg-hero text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neon">
            <HandshakeIcon className="h-4 w-4" aria-hidden /> Franchise opportunity
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Own a <span className="text-glow-neon text-neon">Ride N Care</span> franchise in your city
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Ride N Care brings trusted doorstep bike and car service to customers in Bangalore — certified mechanics, transparent
            pricing and genuine parts, with the promise of “Care in Every Mile”. We're inviting partners who want to build the
            same trusted service in their own market.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#franchise-enquiry" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-grad-accent px-6 font-semibold text-white shadow-glow-strong transition hover:brightness-110">
              Become a Franchise Partner <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href={whatsappCta} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-whatsapp-foreground shadow-lg transition hover:opacity-95">
              <MessageCircle className="h-4 w-4" aria-hidden /> Ask on WhatsApp
            </a>
          </div>
          <p className="mt-5 max-w-2xl text-sm text-white/55">
            Franchise terms are shared individually during the enquiry — nothing on this page is a fee, earning or return commitment.
          </p>
        </div>
      </section>

      {/* Why partner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">What you get as a partner</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A franchise with Ride N Care means running a service customers already trust, with our systems behind you from day one.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <article key={b.title} className="rounded-xl border border-border bg-card p-6 transition hover:border-neon/50 hover:shadow-glow">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neon/10">{b.icon}</div>
              <h3 className="mt-4 font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold">How partnership works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <article key={s.title} className="rounded-xl border border-border bg-background p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neon/10">{s.icon}</div>
                <h3 className="mt-4 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who we look for + FAQ */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold">Who we look for</h2>
          <ul className="mt-6 space-y-4">
            {[
              "Entrepreneurs or working professionals who want to build a service business in their city.",
              "People with strong local knowledge and a customer-first mindset.",
              "Candidates who value transparency — quotes before work, invoices after service.",
              "Full-time commitment to launching and running the service locally.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-neon" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl border border-neon/30 bg-neon/5 p-5 text-sm">
            <p className="font-semibold">A note on numbers</p>
            <p className="mt-1 text-muted-foreground">
              We don't publish franchise fees, investment amounts or earnings claims. Every market is different, so terms are
              discussed directly and honestly during your enquiry.
            </p>
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold">Common questions</h2>
          <div className="mt-6 space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group rounded-xl border border-border bg-card p-5 open:border-neon/40">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <span className="mr-2 text-neon group-open:hidden">+</span>
                  <span className="mr-2 hidden text-neon group-open:inline">–</span>
                  {q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="franchise-enquiry" className="scroll-mt-24 border-t border-border bg-card/50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold">Franchise enquiry</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Share your details and the form opens a ready-made WhatsApp message to the official Ride N Care number
            (+91 82969 50339). We reply during business hours.
          </p>

          {sent ? (
            <div className="mt-8 rounded-xl border border-neon/40 bg-background p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neon/15">
                <MessageCircle className="h-7 w-7 text-neon" aria-hidden />
              </div>
              <h3 className="mt-4 text-xl font-bold">Your enquiry is ready in WhatsApp</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                If WhatsApp didn't open automatically, use one of the options below — your details are already filled in.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild className="h-12 rounded-full bg-whatsapp text-whatsapp-foreground">
                  <a href={enquiryWhatsAppUrl(sent)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Open WhatsApp</a>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full"
                  onClick={async () => toast[(await copyText(buildEnquiryMessage(sent))) ? "success" : "error"]("Enquiry details copied — paste them in a message to +91 82969 50339")}
                >
                  <Copy className="h-4 w-4" /> Copy details
                </Button>
                <Button variant="outline" asChild className="h-12 rounded-full">
                  <a href={`tel:${CALL_NUMBER}`}><Phone className="h-4 w-4" /> Call us</a>
                </Button>
              </div>
              <Button variant="ghost" className="mt-4" onClick={() => setSent(null)}>Send another enquiry</Button>
            </div>
          ) : (
            <form className="mt-8 grid gap-4 rounded-xl border border-border bg-background p-6 sm:p-8" onSubmit={submit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="name" placeholder="Your name" error={errors.name} required autoComplete="name" />
                <Field label="Phone number" name="phone" type="tel" inputMode="numeric" placeholder="10-digit mobile" error={errors.phone} required autoComplete="tel" />
              </div>
              <Field label="Email (optional)" name="email" type="email" placeholder="you@example.com" error={errors.email} autoComplete="email" />
              <Field label="Preferred location" name="location" placeholder="City / area you want to operate in" error={errors.location} required />
              <label className="block">
                <span className="text-sm font-semibold">Investment interest</span>
                <select name="investment" defaultValue="" className={`mt-1 h-12 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.investment ? "border-destructive" : "border-border"}`}>
                  <option value="" disabled>Select an option</option>
                  {INVESTMENT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {errors.investment && <span className="mt-1 block text-sm font-semibold text-destructive">{errors.investment}</span>}
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Message (optional)</span>
                <textarea name="message" rows={4} placeholder="Tell us about yourself, your city and why you'd like to partner with Ride N Care." className="mt-1 h-auto w-full rounded-md border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>
              <Button type="submit" className="mt-2 h-12 w-full rounded-full bg-whatsapp text-base font-bold text-whatsapp-foreground shadow-lg hover:opacity-95">
                <MessageCircle className="h-5 w-5" aria-hidden /> Send Enquiry on WhatsApp
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Submitting opens WhatsApp with your details pre-filled — nothing is sent until you press send there.
                Prefer talking? Call <a href={`tel:${CALL_NUMBER}`} className="font-semibold text-primary underline">+91 80694 09289</a>.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Cross-links */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link to="/" className="rounded-xl border border-border bg-card p-6 transition hover:border-neon/50 hover:shadow-glow">
            <MapPin className="h-5 w-5 text-neon" aria-hidden />
            <h3 className="mt-3 font-bold">See the service first</h3>
            <p className="mt-1 text-sm text-muted-foreground">Explore doorstep bike &amp; car service in Bangalore.</p>
          </Link>
          <Link to="/bikes" className="rounded-xl border border-border bg-card p-6 transition hover:border-neon/50 hover:shadow-glow">
            <ClipboardList className="h-5 w-5 text-neon" aria-hidden />
            <h3 className="mt-3 font-bold">Transparent pricing</h3>
            <p className="mt-1 text-sm text-muted-foreground">The package-based price list your customers will see.</p>
          </Link>
          <Link to="/contact" className="rounded-xl border border-border bg-card p-6 transition hover:border-neon/50 hover:shadow-glow">
            <Phone className="h-5 w-5 text-neon" aria-hidden />
            <h3 className="mt-3 font-bold">Talk to the team</h3>
            <p className="mt-1 text-sm text-muted-foreground">Book a service or ask us anything before you enquire.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Field({ label, name, error, required, ...props }: { label: string; name: string; error?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}{required && <span className="text-destructive"> *</span>}</span>
      <input name={name} required={required} aria-invalid={error ? true : undefined} {...props}
        className={`mt-1 h-12 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-destructive" : "border-border"}`} />
      {error && <span className="mt-1 block text-sm font-semibold text-destructive">{error}</span>}
    </label>
  );
}
