import type { AnswerBlock } from "@/lib/answers";

/**
 * Answer-first Q&A blocks. Rendered as plain server-side HTML (no accordion, no
 * JavaScript gating) so crawlers and answer engines read every answer directly.
 */
export function AnswerBlocks({ items, headingLevel = 3 }: { items: AnswerBlock[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="mt-8 space-y-6">
      {items.map((item) => (
        <article key={item.id} id={item.id} className="scroll-mt-24 rounded-2xl border border-border bg-card p-6">
          <H className="text-lg md:text-xl font-semibold">{item.q}</H>
          <p className="mt-2 text-muted-foreground leading-relaxed">{item.a}</p>
          {item.detail ? <p className="mt-3 text-muted-foreground leading-relaxed">{item.detail}</p> : null}
          {item.bullets ? (
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {item.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
