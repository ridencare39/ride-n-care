import { SITE_URL } from "@/lib/seo";
import {
  resolveSiteUrl,
  searchAnalyticsByDate,
  topRows,
  listSitemaps,
  inspectUrl,
} from "@/lib/gsc.server";

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export type SeoMonitorReport =
  | { status: "not_connected"; message: string }
  | { status: "no_property"; message: string }
  | { status: "selection_required"; candidates: string[] }
  | {
      status: "ok";
      siteUrl: string;
      refreshedAt: string;
      series: { date: string; clicks: number; impressions: number; ctr: number; position: number }[];
      totals: { clicks: number; impressions: number; ctr: number; position: number };
      previousTotals: { clicks: number; impressions: number; ctr: number; position: number };
      topQueries: { key: string; clicks: number; impressions: number; ctr: number; position: number }[];
      topPages: { key: string; clicks: number; impressions: number; ctr: number; position: number }[];
      sitemaps: {
        path: string;
        lastSubmitted?: string;
        lastDownloaded?: string;
        isPending?: boolean;
        errors: number;
        warnings: number;
        submitted: number;
        indexed: number;
      }[];
      coverage: {
        url: string;
        verdict?: string;
        coverageState?: string;
        robotsTxtState?: string;
        indexingState?: string;
        lastCrawlTime?: string;
        pageFetchState?: string;
        googleCanonical?: string;
      }[];
      history: {
        day: string;
        submitted_pages: number;
        indexed_pages: number;
        sitemap_errors: number;
        sitemap_warnings: number;
        home_verdict: string | null;
        home_coverage_state: string | null;
      }[];
    };

const MONITORED_URLS = [`${SITE_URL}/`, `${SITE_URL}/bikes`, `${SITE_URL}/cars`, `${SITE_URL}/areas`, `${SITE_URL}/blog`];

function sum(rows: { clicks: number; impressions: number; position: number }[]) {
  const clicks = rows.reduce((a, r) => a + r.clicks, 0);
  const impressions = rows.reduce((a, r) => a + r.impressions, 0);
  const position = rows.length ? rows.reduce((a, r) => a + r.position, 0) / rows.length : 0;
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

export async function buildSeoMonitorReport(selectedSiteUrl?: string): Promise<SeoMonitorReport> {
  if (!process.env["LOVABLE_API_KEY"] || !process.env["GOOGLE_SEARCH_CONSOLE_API_KEY"]) {
    return { status: "not_connected", message: "Google Search Console is not connected for this project yet." };
  }

  const resolution = await resolveSiteUrl(SITE_URL, selectedSiteUrl);
  if (resolution.status === "no_property") {
    return { status: "no_property", message: "No verified Search Console property covers this site yet." };
  }
  if (resolution.status === "selection_required") {
    return { status: "selection_required", candidates: resolution.candidates };
  }
  const siteUrl = resolution.siteUrl;

  const today = new Date();
  const end = new Date(today.getTime() - 2 * 86400000);
  const start = new Date(end.getTime() - 89 * 86400000);
  const prevEnd = new Date(end.getTime() - 28 * 86400000);
  const prevStart = new Date(prevEnd.getTime() - 27 * 86400000);
  const recentStart = new Date(end.getTime() - 27 * 86400000);

  const [series, recent, previous, topQueries, topPages, sitemapList, ...inspections] = await Promise.all([
    searchAnalyticsByDate(siteUrl, ymd(start), ymd(end)),
    searchAnalyticsByDate(siteUrl, ymd(recentStart), ymd(end)),
    searchAnalyticsByDate(siteUrl, ymd(prevStart), ymd(prevEnd)),
    topRows(siteUrl, "query", ymd(recentStart), ymd(end)),
    topRows(siteUrl, "page", ymd(recentStart), ymd(end)),
    listSitemaps(siteUrl),
    ...MONITORED_URLS.map((u) => inspectUrl(siteUrl, u).catch(() => ({}))),
  ]);

  const sitemaps = sitemapList.map((s) => {
    const web = (s.contents ?? []).find((c) => c.type === "web") ?? (s.contents ?? [])[0];
    return {
      path: s.path,
      lastSubmitted: s.lastSubmitted,
      lastDownloaded: s.lastDownloaded,
      isPending: s.isPending,
      errors: Number(s.errors ?? 0),
      warnings: Number(s.warnings ?? 0),
      submitted: Number(web?.submitted ?? 0),
      indexed: Number(web?.indexed ?? 0),
    };
  });

  const coverage = MONITORED_URLS.map((url, i) => {
    const r = (inspections[i] ?? {}) as Awaited<ReturnType<typeof inspectUrl>>;
    const s = r.indexStatusResult ?? {};
    return {
      url,
      verdict: s.verdict,
      coverageState: s.coverageState,
      robotsTxtState: s.robotsTxtState,
      indexingState: s.indexingState,
      lastCrawlTime: s.lastCrawlTime,
      pageFetchState: s.pageFetchState,
      googleCanonical: s.googleCanonical,
    };
  });

  const totalSubmitted = sitemaps.reduce((a, s) => a + s.submitted, 0);
  const totalIndexed = sitemaps.reduce((a, s) => a + s.indexed, 0);
  const home = coverage[0];

  let history: Extract<SeoMonitorReport, { status: "ok" }>["history"] = [];
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("gsc_daily_snapshots").upsert(
      {
        day: ymd(today),
        site_url: siteUrl,
        submitted_pages: totalSubmitted,
        indexed_pages: totalIndexed,
        sitemap_errors: sitemaps.reduce((a, s) => a + s.errors, 0),
        sitemap_warnings: sitemaps.reduce((a, s) => a + s.warnings, 0),
        home_verdict: home?.verdict ?? null,
        home_coverage_state: home?.coverageState ?? null,
      },
      { onConflict: "day" },
    );
    const { data } = await supabaseAdmin
      .from("gsc_daily_snapshots")
      .select("day, submitted_pages, indexed_pages, sitemap_errors, sitemap_warnings, home_verdict, home_coverage_state")
      .order("day", { ascending: true })
      .limit(120);
    history = (data ?? []) as typeof history;
  } catch (e) {
    console.error("[seo-monitor] snapshot persistence failed:", e);
  }

  return {
    status: "ok",
    siteUrl,
    refreshedAt: new Date().toISOString(),
    series,
    totals: sum(recent),
    previousTotals: sum(previous),
    topQueries,
    topPages,
    sitemaps,
    coverage,
    history,
  };
}
