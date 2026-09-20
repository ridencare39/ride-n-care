import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ANSWER_PAGES, ANSWER_CATEGORIES, getAnswerPage } from "@/lib/answer-pages";
import { SERVICES } from "@/lib/services";
import { CAR_SERVICES } from "@/lib/car-services";
import { SITE_URL } from "@/lib/seo";
import { pageHead, formatDate } from "@/lib/head";
import { graphForPage, webPageNode, breadcrumbNode, faqNode, pageScripts } from "@/lib/schema";
import { BookingButton } from "@/components/booking/BookingButton";
import { ctcProps } from "@/lib/analytics";

export const Route = createFileRoute("/answers/$slug")({
  loader: ({ params }) => {
    const page = getAnswerPage(params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.page ?? ANSWER_PAGES[0]!;
    const url = `${SITE_URL}/answers/${params.slug}`;
    return {
      ...pageHead({
        title: `${p.question} | Ride N Care`,
        description: p.meta ?? p.answer,
        path: `/answers/${p.slug}`,
        extraMeta: [{ property: "og:type", content: "article" }],
      }),
      scripts: pageScripts(
        graphForPage([
          webPageNode({
            url,
            name: p.question,
            description: p.answer,
            dateModified: p.updated,
          }),
          // FAQPage covers exactly the Q&A visible on this page: the main
          // answer (H1 + first paragraph) plus the related questions below.
          faqNode([[p.question, p.answer], ...p.faqs]),
          breadcrumbNode([
            ["Home", "/"],
            ["Answers", "/answers"],
            [p.question, `/answers/${p.slug}`],
          ]),
        ]),
      ),
    };
  },
  component: AnswerPageView,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Answer not found</h1>
      <Link to="/answers" className="mt-4 inline-block text-primary">← All answers</Link>
    </div>
  ),
});

function AnswerPageView() {
  const { page: p } = Route.useLoaderData();
  const category = ANSWER_CATEGORIES.find((c) => c.id === p.category);
  const related = p.related.map((slug) => getAnswerPage(slug)).filter(Boolean);
  const services = p.services
    .map((slug) => SERVICES.find((s) => s.slug === slug) ?? CAR_SERVICES.find((s) => s.slug === slug))
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span>/</span>{" "}
        <Link to="/answers" className="hover:text-primary">Answers</Link> <span>/</span>{" "}
        <span className="text-foreground">{p.question}</span>
      </nav>

      <div className="mt-6 flex items-center gap-3">
        {category && (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {category.label}
          </span>
        )}
        <span className="text-xs text-muted-foreground">Last updated {formatDate(p.updated)}</span>
      </div>

      {/* The question IS the H1 — one question per page. */}
      <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">{p.question}</h1>

      {/* Quick answer — 40–60 words, self-contained, safe to lift alone. */}
      <section aria-label="Quick answer" className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Quick answer</p>
        <p className="mt-2 text-base leading-relaxed text-foreground">{p.answer}</p>
      </section>

      {/* Detail */}
      {p.detail?.map((para) => (
        <p key={para} className="mt-5 text-muted-foreground leading-relaxed">{para}</p>
      ))}

      {p.bullets && (
        <ul className="mt-5 space-y-2 text-muted-foreground">
          {p.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {p.table && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-card">
              <tr>
                {p.table.head.map((h, i) => (
                  <th key={`${h}-${i}`} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.table.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-border">
                  {row.map((cell, i) => (
                    <td key={`${cell}-${i}`} className={`px-4 py-3 align-top ${i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Related questions — visible Q&A, same content emitted as FAQPage JSON-LD */}
      {p.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Related questions</h2>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {p.faqs.map(([q, a]) => (
              <div key={q} className="p-5">
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Book the related service */}
      {services.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Book the related service</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
            {services.map((s) => (
              <li key={s!.slug}>
                <Link to="/$service" params={{ service: s!.slug }} className="text-primary hover:underline">
                  {s!.name} in Bangalore →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related answer pages */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">People also read</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {related.map((r) => (
              <li key={r!.slug}>
                <Link to="/answers/$slug" params={{ slug: r!.slug }} className="text-primary hover:underline">
                  {r!.question}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/answers" className="mt-4 inline-block text-sm text-muted-foreground hover:text-primary">
            ← All answers
          </Link>
        </section>
      )}

      {/* CTA band */}
      <div className="mt-14 rounded-3xl bg-grad-primary p-8 text-center shadow-glow">
        <h2 className="text-2xl font-bold text-primary-foreground">Want this handled for you?</h2>
        <p className="mt-2 text-primary-foreground/90">Written quote first. OEM-grade parts, digital invoice, 7-day guarantee.</p>
        <div className="mt-4 flex justify-center gap-3 flex-wrap">
          <a
            href="tel:+918069409289"
            {...ctcProps("call_click", { page_path: `/answers/${p.slug}` })}
            className="rounded-full bg-background px-6 py-3 font-semibold text-foreground"
          >
            Call 080 6940 9289
          </a>
          <a
            href={`https://wa.me/918296950339?text=${encodeURIComponent(`Hi Ride N Care, I have a question: ${p.question}`)}`}
            target="_blank"
            rel="noopener"
            {...ctcProps("whatsapp_click", { page_path: `/answers/${p.slug}` })}
            className="rounded-full border border-background/40 px-6 py-3 font-semibold text-primary-foreground"
          >
            WhatsApp 82969 50339
          </a>
          <BookingButton variant="outline" className="rounded-full border-background/40 bg-transparent px-6 py-3 text-primary-foreground hover:bg-background hover:text-foreground">
            Book Now
          </BookingButton>
        </div>
      </div>
    </article>
  );
}
