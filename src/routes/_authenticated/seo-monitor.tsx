import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
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
                    <Area type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="clicks" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
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
                    <Line type="monotone" dataKey="submitted_pages" stroke="hsl(var(--primary))" dot={false} />
                    <Line type="monotone" dataKey="indexed_pages" stroke="hsl(var(--accent))" dot={false} />
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
            Property: {data.siteUrl} · refreshed {new Date(data.refreshedAt).toLocaleString()}
          </p>
        </>
      ) : null}
    </main>
  );
}
