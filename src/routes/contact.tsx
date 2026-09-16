import { createFileRoute } from "@tanstack/react-router";
import { BookingButton } from "@/components/booking/BookingButton";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book Doorstep Bike Service in Bangalore | Ride N Care" },
      { name: "description", content: "Book doorstep bike or car service in Bangalore in 60 seconds. Call 08296950339 or WhatsApp us — pickup, drop and on-the-spot repair." },
      { property: "og:title", content: "Book a Service — Ride N Care" },
      { property: "og:description", content: "Book bike or car service. Doorstep, fast, transparent." },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: Contact,
});

function Contact() {
  return <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
    <h1 className="text-5xl font-bold">Book doorstep bike &amp; car service in Bangalore</h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">Use the Ride N Care booking flow to select your exact vehicle, verified service package, price and inclusions. Your details will be prepared for WhatsApp, where you send the request for confirmation.</p>
    <BookingButton className="mt-8 h-12 rounded-full bg-grad-primary px-7 font-semibold text-primary-foreground shadow-glow">Book Now</BookingButton>
    <div className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
      <a href="tel:08069409289"><Info title="Phone" value="080 6940 9289" /></a>
      <a href="https://wa.me/918296950339"><Info title="WhatsApp" value="+91 82969 50339" /></a>
      <a href="mailto:ridencareinfo@gmail.com"><Info title="Email" value="ridencareinfo@gmail.com" /></a>
    </div>
    <div className="mt-4 text-sm"><Info title="Address" value="Bangalore, Karnataka, India" /></div>
  </main>;
}

function Info({ title, value }: { title: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div><div className="mt-1 font-semibold">{value}</div></div>;
}