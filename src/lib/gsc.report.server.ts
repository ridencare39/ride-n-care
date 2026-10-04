import { SITE_URL } from "@/lib/seo";
import { getOAuthCreds, getAccessToken } from "@/lib/gsc-oauth.server";
import {
  resolveSiteUrl,
  searchAnalyticsByDate,
  topRows,
  queryPageRows,
  listSitemaps,
  inspectUrl,
} from "@/lib/gsc.server";

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export type SeoMonitorReport =
  | { status: "not_configured"; message: string; missing: string[] }
  | { status: "not_connected"; message: string; connectUrl: string }
  | { status: "no_property"; message: string }
  | { status: "selection_required"; message: string; candidates: string[] }
  | {
      status: "ok";
      siteUrl: string;
      refreshedAt: string;
      series: { date: string; clicks: number; impressions: number; ctr: number; position: number }[];
      totals: { clicks: number; impressions: number; ctr: number; position: number };
      previousTotals: { clicks: number; impressions: number; ctr: number; position: number };
      topQueries: { key: string; clicks: number; impressions: number; ctr: number; position: number }[];
      topPages: { key: string; clicks: number; impressions: number; ctr: number; position: number }[];
      nearMeBaseline: NearMeBaselineRow[];
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

/** One baseline row: a target query's real 28-day performance from the API. */
export type NearMeBaselineRow = {
  query: string;
  matched: "exact" | "variant";
  source: "gsc-api";
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  landingPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
};

/** Owner's four priority "near me" queries (Part 2, docs/seo/35). */
const NEAR_ME_TARGETS = [
  "bike service near me",
  "bike repair near me",
  "doorstep bike service near me",
  "doorstep bike repair near me",
];

const MONITORED_URLS = [`${SITE_URL}/`, `${SITE_URL}/bikes`, `${SITE_URL}/cars`, `${SITE_URL}/areas`, `${SITE_URL}/blog`];

function sum(rows: { clicks: number; impressions: number; position: number }[]) {
  const clicks = rows.reduce((a, r) => a + r.clicks, 0);
  const impressions = rows.reduce((a, r) => a + r.impressions, 0);
  const position = rows.length ? rows.reduce((a, r) => a + r.position, 0) / rows.length : 0;
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

function buildNearMeBaseline(rows: { query: string; page: string; clicks: number; impressions: number; ctr: number; position: number }[]): NearMeBaselineRow[] {
  const norm = (q: string) => q.trim().toLowerCase().replace(/\s+/g, " ");
  const out: NearMeBaselineRow[] = [];
  for (const target of NEAR_ME_TARGETS) {
    const exact = rows.filter((r) => norm(r.query) === target);
    const variants = rows.filter((r) => norm(r.query) !== target && norm(r.query).includes(target));
    const matched = exact.length ? exact : variants;
    if (!matched.length) {
      // No rows in range — GSC can drop/threshold very low-impression queries.
      out.push({
        query: target,
        matched: "exact",
        source: "gsc-api",
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
        landingPages: [],
      });
      continue;
    }
    const agg = sum(matched);
    const pages = new Map<string, { page: string; clicks: number; impressions: number; ctr: number; position: number }>();
    for (const r of matched) {
      const p = pages.get(r.page);
      if (p) {
        p.clicks += r.clicks;
        p.impressions += r.impressions;
        p.ctr = p.impressions ? p.clicks / p.impressions : 0;
        p.position = (p.position + r.position) / 2;
      } else {
        pages.set(r.page, { page: r.page, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });
      }
    }
    out.push({
      query: target,
      matched: exact.length ? "exact" : "variant",
      source: "gsc-api",
      clicks: agg.clicks,
      impressions: agg.impressions,
      ctr: agg.ctr,
      position: agg.position,
      landingPages: [...pages.values()].sort((a, b) => b.clicks - a.clicks),
    });
  }
  return out;
}

export async function buildSeoMonitorReport(refreshToken: string | null, selectedSiteUrl?: string): Promise<SeoMonitorReport> {
  if (!getOAuthCreds()) {
    const missing = ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"].filter((k) => !process.env[k]);
    return {
      status: "not_configured",
      message: "The OAuth client is not configured for this deployment yet — add the two Google OAuth keys to the environment.",
      missing,
    };
  }
  if (!refreshToken) {
    return {
      status: "not_connected",
      message: "Google Search Console is not connected yet. Connect the verified property with a read-only (webmasters.readonly) authorization to load live performance, sitemap and indexing data.",
      connectUrl: "/gsc/connect",
    };
  }

  const accessToken = await getAccessToken(refreshToken);

  const resolution = await resolveSiteUrl(accessToken, SITE_URL, selectedSiteUrl);
  if (resolution.status === "no_property") {
    return { status: "no_property", message: "No verified Search Console property covers this site yet." };
  }
  if (resolution.status === "selection_required") {
    return { status: "selection_required", message: "Multiple verified properties match this site.", candidates: resolution.candidates };
  }
  const siteUrl = resolution.siteUrl;

  const today = new Date();
  const end = new Date(today.getTime() - 2 * 86400000);
  const start = new Date(end.getTime() - 89 * 86400000);
  const prevEnd = new Date(end.getTime() - 28 * 86400000);
  const prevStart = new Date(prevEnd.getTime() - 27 * 86400000);
  const recentStart = new Date(end.getTime() - 27 * 86400000);

  const [series, recent, previous, topQueries, topPages, qpRows, sitemapList, ...inspections] = await Promise.all([
    searchAnalyticsByDate(accessToken, siteUrl, ymd(start), ymd(end)),
    searchAnalyticsByDate(accessToken, siteUrl, ymd(recentStart), ymd(end)),
    searchAnalyticsByDate(accessToken, siteUrl, ymd(prevStart), ymd(prevEnd)),
    topRows(accessToken, siteUrl, "query", ymd(recentStart), ymd(end)),
    topRows(accessToken, siteUrl, "page", ymd(recentStart), ymd(end)),
    queryPageRows(accessToken, siteUrl, ymd(recentStart), ymd(end)),
    listSitemaps(accessToken, siteUrl),
    ...MONITORED_URLS.map((u) => inspectUrl(accessToken, siteUrl, u).catch(() => ({}))),
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
    nearMeBaseline: buildNearMeBaseline(qpRows),
    sitemaps,
    coverage,
    history,
  };
}
