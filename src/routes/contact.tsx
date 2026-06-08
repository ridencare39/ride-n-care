import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Service — Ride N Care" },
      { name: "description", content: "Book your bike or car service in 60 seconds. Doorstep pickup, drop, and on-the-spot repair across major Indian cities." },
      { property: "og:title", content: "Book a Service — Ride N Care" },
      { property: "og:description", content: "Book bike or car service. Doorstep, fast, transparent." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const service = String(fd.get("service") || "").trim();
    const pickup = String(fd.get("pickup") || "").trim();
    const issue = String(fd.get("issue") || "").trim();
    const vehicle = String(fd.get("vehicle") || "").trim();
    const area = String(fd.get("area") || "").trim();

    const text = [
      `*New Booking — Ride N Care*`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      vehicle && `Vehicle: ${vehicle}`,
      area && `Area: ${area}`,
      `Pickup & Drop: ${pickup}`,
      issue && `Issue: ${issue}`,
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/918296950339?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="text-5xl font-bold">Book your service</h1>
      <p className="mt-3 text-muted-foreground">Fill the form — it opens WhatsApp with your booking details pre-filled. We'll confirm in minutes.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid sm:grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6"
      >
        <Field label="Your name" name="name" required />
        <Field label="Phone (WhatsApp)" name="phone" type="tel" required />
        <Field label="Vehicle (make & model)" name="vehicle" placeholder="e.g. Honda Activa 6G" />
        <Field label="Area in Bangalore" name="area" placeholder="e.g. Koramangala" />
        <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
          <Select label="Service" name="service" options={["Bike service", "Car service", "Battery / breakdown", "Denting & paint"]} />
          <Select label="Pickup & drop" name="pickup" options={["Yes, please", "No, I'll wait"]} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold">Describe the issue</label>
          <textarea name="issue" rows={4} className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <button className="sm:col-span-2 rounded-full bg-grad-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow">
          {sent ? "Opened WhatsApp — send the message to confirm ✓" : "Send booking on WhatsApp"}
        </button>
      </form>

      <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
        <a href="tel:08069409289"><Info t="Phone" v="080 6940 9289" /></a>
        <a href="https://wa.me/918296950339"><Info t="WhatsApp" v="+91 82969 50339" /></a>
        <a href="mailto:ridencareinfo@gmail.com"><Info t="Email" v="ridencareinfo@gmail.com" /></a>
      </div>
      <div className="mt-4 text-sm">
        <Info t="Address" v="Bangalore, Karnataka, India" />
      </div>
    </div>
  );
}
function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input {...p} className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm" />
    </label>
  );
}
function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <select name={name} className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Info({ t, v }: { t: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{t}</div>
      <div className="mt-1 font-semibold">{v}</div>
    </div>
  );
}