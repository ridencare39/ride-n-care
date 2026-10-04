import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MANUAL_GSC_OBSERVATIONS } from "@/lib/gsc-manual";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { getSeoMonitorReport } from "@/lib/gsc.functions";
import { getAdminStatus } from "@/lib/blog.functions";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/seo-monitor")({
  beforeLoad: async () => {
    const { isAdmin } = await getAdminStatus();
    if (!isAdmin) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "SEO Monitoring — Search Console Coverage | Ride N Care" },
      { name: "description", content: "Internal dashboard tracking Ride N Care's Google Search Console clicks, impressions, crawl coverage and indexing changes over time." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "SEO Monitoring — Ride N Care" },
      { property: "og:description", content: "Track Search Console coverage and indexing changes for Ride N Care over time." },
      { property: "og:url", content: `${SITE_URL}/seo-monitor` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/seo-monitor` }],
  }),
  component: SeoMonitor,
});

function pct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}
function delta(now: number, before: number) {
  if (!before) return now ? "new" : "—";
  const d = ((now - before) / before) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(1)}%`;
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
}

function SeoMonitor() {
  const fetchReport = useServerFn(getSeoMonitorReport);
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["seo-monitor"],
    queryFn: () => fetchReport({ data: {} }),
    staleTime: 5 * 60 * 1000,
  });

  // One-shot feedback for the OAuth flow (?gsc=connected|disconnected|error|not_configured).
  const [conn, setConn] = useState<{ status: string; reason: string } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("gsc");
    if (!status) return;
    setConn({ status, reason: params.get("reason") ?? "" });
    const url = new URL(window.location.href);
    url.searchParams.delete("gsc");
    url.searchParams.delete("reason");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const CONN_COPY: Record<string, string> = {
    connected: "Search Console connected — live read-only data is loading below.",
    disconnected: "Search Console disconnected. The authorization cookie was cleared from this browser.",
    not_configured: "OAuth keys are not configured in this deployment's environment yet (GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET).",
  };
  const ERR_COPY: Record<string, string> = {
    access_denied: "Authorization was declined at the Google consent screen.",
    state_mismatch: "The connection attempt expired or the state did not match — try Connect again.",
    exchange_failed: "Google rejected the code exchange — verify the redirect URI registered on the OAuth client matches this origin exactly.",
    no_refresh_token: "Google did not return a refresh token — open Connect again so the consent screen re-issues it.",
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Search Console</div>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold">SEO monitoring</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Crawl, coverage and indexing changes for {SITE_URL} over time.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-card"
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {conn ? (
        <div
          className={`mt-6 rounded-2xl border p-4 text-sm ${
            conn.status === "connected"
              ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : conn.status === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-border bg-card text-foreground"
          }`}
        >
          {conn.status === "error"
            ? ERR_COPY[conn.reason] ?? `Google did not complete the connection (${conn.reason || "unknown error"}).`
            : CONN_COPY[conn.status] ?? conn.status}
        </div>
      ) : null}

      {isLoading ? <p className="mt-10 text-muted-foreground">Loading Search Console data…</p> : null}
      {isError ? <p className="mt-10 text-destructive">Could not load Search Console data.</p> : null}

      {data && data.status !== "ok" ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Search Console data isn't available yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {"message" in data && data.message
              ? data.message
              : data.status === "selection_required"
                ? `Multiple verified properties match this site: ${data.candidates.join(", ")}. Pick one to continue.`
                : "No data returned."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Search Console usually needs a few days after verification before it reports performance and coverage data.
          </p>
          {data.status === "not_connected" ? (
            <a
              href={data.connectUrl}
              className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Connect Google Search Console
            </a>
          ) : null}
          {data.status === "not_configured" ? (
            <p className="mt-3 rounded-xl border border-border bg-card p-3 font-mono text-xs">
              Missing keys: {data.missing.join(", ")} — add them in Settings → Environment, then redeploy.
            </p>
          ) : null}
        </div>
      ) : null}

      {data && data.status === "ok" ? (
        <>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card label="Clicks (28d)" value={String(data.totals.clicks)} sub={`vs prev 28d ${delta(data.totals.clicks, data.previousTotals.clicks)}`} />
            <Card label="Impressions (28d)" value={String(data.totals.impressions)} sub={`vs prev 28d ${delta(data.totals.impressions, data.previousTotals.impressions)}`} />
            <Card label="Avg CTR" value={pct(data.totals.ctr)} sub={`prev ${pct(data.previousTotals.ctr)}`} />
            <Card label="Avg position" value={data.totals.position ? data.totals.position.toFixed(1) : "—"} sub={`prev ${data.previousTotals.position ? data.previousTotals.position.toFixed(1) : "—"}`} />
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-bold">Clicks & impressions (last 90 days)</h2>
            <div className="mt-4 h-72 rounded-2xl border border-border bg-card p-4">
              {data.series.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.series}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="impressions" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="clicks" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No performance rows reported yet.</p>
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold">Indexed vs submitted pages over time</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A snapshot is recorded each day this page is opened, so the trend builds up from today onward.
            </p>
            <div className="mt-4 h-64 rounded-2xl border border-border bg-card p-4">
              {data.history.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.history}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="submitted_pages" stroke="var(--primary)" dot={false} />
                    <Line type="monotone" dataKey="indexed_pages" stroke="var(--accent)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Today's snapshot is saved. The trend line appears once there are at least two days of history.
                </p>
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold">Sitemap status</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Sitemap</th>
                    <th className="p-3">Submitted</th>
                    <th className="p-3">Indexed</th>
                    <th className="p-3">Errors</th>
                    <th className="p-3">Warnings</th>
                    <th className="p-3">Last read</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sitemaps.length ? (
                    data.sitemaps.map((s) => (
                      <tr key={s.path} className="border-t border-border">
                        <td className="p-3 break-all">{s.path}</td>
                        <td className="p-3">{s.submitted}</td>
                        <td className="p-3">{s.indexed}</td>
                        <td className="p-3">{s.errors}</td>
                        <td className="p-3">{s.warnings}</td>
                        <td className="p-3">{s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 text-muted-foreground" colSpan={6}>No sitemap reported yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold">Crawl & coverage per key page</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {data.coverage.map((c) => (
                <div key={c.url} className="rounded-2xl border border-border bg-card p-4">
                  <div className="font-semibold break-all text-sm">{c.url.replace(SITE_URL, "") || "/"}</div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <dt>Verdict</dt><dd className="text-foreground">{c.verdict ?? "—"}</dd>
                    <dt>Coverage</dt><dd className="text-foreground">{c.coverageState ?? "—"}</dd>
                    <dt>Robots</dt><dd className="text-foreground">{c.robotsTxtState ?? "—"}</dd>
                    <dt>Fetch</dt><dd className="text-foreground">{c.pageFetchState ?? "—"}</dd>
                    <dt>Last crawl</dt><dd className="text-foreground">{c.lastCrawlTime ? new Date(c.lastCrawlTime).toLocaleDateString() : "—"}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">“Near me” baseline — 4 priority queries (28d)</h2>
              <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">GSC API · live</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Real rows from <code>searchAnalytics.query</code>. “No data in range” means GSC returned no row for that query — positions are never guessed. “Near me” results vary by the searcher's location, so position is an average across showing locations.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Query</th>
                    <th className="p-3">Match</th>
                    <th className="p-3">Clicks</th>
                    <th className="p-3">Impr.</th>
                    <th className="p-3">CTR</th>
                    <th className="p-3">Avg pos</th>
                    <th className="p-3">Top landing page</th>
                  </tr>
                </thead>
                <tbody>
                  {data.nearMeBaseline.map((r) => (
                    <tr key={r.query} className="border-t border-border">
                      <td className="p-3 font-semibold">{r.query}</td>
                      <td className="p-3 text-xs text-muted-foreground">{r.matched}</td>
                      <td className="p-3">{r.impressions ? r.clicks : "—"}</td>
                      <td className="p-3">{r.impressions || "no data in range"}</td>
                      <td className="p-3">{r.impressions ? pct(r.ctr) : "—"}</td>
                      <td className="p-3">{r.impressions ? r.position.toFixed(1) : "—"}</td>
                      <td className="p-3 break-all text-xs">
                        {r.landingPages.length ? r.landingPages[0]!.page.replace(SITE_URL, "") || "/" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">Top queries (28d)</h2>
              <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                {data.topQueries.length ? data.topQueries.map((q) => (
                  <li key={q.key} className="flex justify-between gap-3 p-3 text-sm">
                    <span className="truncate">{q.key}</span>
                    <span className="text-muted-foreground whitespace-nowrap">{q.clicks} clicks · #{q.position.toFixed(0)}</span>
                  </li>
                )) : <li className="p-3 text-sm text-muted-foreground">No query data yet.</li>}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold">Top pages (28d)</h2>
              <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                {data.topPages.length ? data.topPages.map((p) => (
                  <li key={p.key} className="flex justify-between gap-3 p-3 text-sm">
                    <span className="truncate">{p.key.replace(SITE_URL, "") || "/"}</span>
                    <span className="text-muted-foreground whitespace-nowrap">{p.clicks} clicks · #{p.position.toFixed(0)}</span>
                  </li>
                )) : <li className="p-3 text-sm text-muted-foreground">No page data yet.</li>}
              </ul>
            </div>
          </section>

          <p className="mt-8 text-xs text-muted-foreground">
            Property: {data.siteUrl} · refreshed {new Date(data.refreshedAt).toLocaleString()} ·{" "}
            <a href="/gsc/disconnect" className="underline hover:text-primary">Disconnect Search Console</a>
          </p>
        </>
      ) : null}

      {data ? (
        <section className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">Owner-recorded dashboard observations</h2>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Manual — not API</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{MANUAL_GSC_OBSERVATIONS.rangeNote}</p>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-2">Metric</th>
                <th className="p-2">Value</th>
                <th className="p-2">Note</th>
                <th className="p-2">Available via API?</th>
              </tr>
            </thead>
            <tbody>
              {MANUAL_GSC_OBSERVATIONS.rows.map((r) => (
                <tr key={r.label} className="border-t border-border">
                  <td className="p-2 font-semibold">{r.label}</td>
                  <td className="p-2">{r.value}</td>
                  <td className="p-2 text-xs text-muted-foreground">{r.note ?? "—"}</td>
                  <td className="p-2 text-xs text-muted-foreground">{r.availableViaApi === "api-later" ? "Yes — live API data supersedes" : "No — GSC API does not expose this report"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            Source: {MANUAL_GSC_OBSERVATIONS.enteredBy} on {MANUAL_GSC_OBSERVATIONS.enteredAt}. Kept strictly separate from the live API rows above.
          </p>
        </section>
      ) : null}
    </main>
  );
}
