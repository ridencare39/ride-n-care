/**
 * Search Console data access (Google API transport, Batch 6 2026-10-02).
 *
 * This file previously talked to the Lovable connector gateway with two API
 * keys — that gateway does not exist in this deployment and Google rejects
 * API keys for this API entirely (OAuth2 required). The transport now calls
 * Google directly with a read-only OAuth access token minted by
 * gsc-oauth.server.ts from the owner's refresh-token cookie.
 *
 * All endpoints need only the `webmasters.readonly` scope:
 *   sites · searchAnalytics · sitemaps (www.googleapis.com/webmasters/v3)
 *   urlInspection (searchconsole.googleapis.com/v1)
 */

const API = "https://www.googleapis.com/webmasters/v3";
const INSPECT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

function headers(accessToken: string, hasBody = false) {
  return {
    Authorization: `Bearer ${accessToken}`,
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
  } as Record<string, string>;
}

type SiteEntry = { siteUrl: string; permissionLevel?: string };

function coversTarget(siteUrl: string, target: URL) {
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length).toLowerCase();
    const host = target.hostname.toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  }
  try {
    return target.href.startsWith(new URL(siteUrl).href);
  } catch {
    return false;
  }
}

export type SiteResolution =
  | { status: "selected"; siteUrl: string }
  | { status: "selection_required"; candidates: string[] }
  | { status: "no_property" };

export async function resolveSiteUrl(accessToken: string, targetUrl: string, selectedSiteUrl?: string): Promise<SiteResolution> {
  const res = await fetch(`${API}/sites`, { headers: headers(accessToken) });
  if (!res.ok) throw new Error(`Could not list Search Console properties [${res.status}]: ${(await res.text()).slice(0, 300)}`);
  const { siteEntry = [] } = (await res.json()) as { siteEntry?: SiteEntry[] };
  const target = new URL(targetUrl);
  const matches = siteEntry.filter(
    (e) => e.permissionLevel !== "siteUnverifiedUser" && coversTarget(e.siteUrl, target),
  );
  if (selectedSiteUrl) {
    const found = matches.find((e) => e.siteUrl === selectedSiteUrl);
    if (!found) return matches.length ? { status: "selection_required", candidates: matches.map((m) => m.siteUrl) } : { status: "no_property" };
    return { status: "selected", siteUrl: found.siteUrl };
  }
  if (matches.length === 0) return { status: "no_property" };
  if (matches.length === 1) return { status: "selected", siteUrl: matches[0]!.siteUrl };
  return { status: "selection_required", candidates: matches.map((m) => m.siteUrl) };
}

async function apiJson(accessToken: string, url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: headers(accessToken, Boolean(init?.body)),
  });
  if (res.status === 401) throw new Error("gsc_unauthorized");
  if (res.status === 403) {
    throw new Error("The connected Google account cannot access this Search Console property.");
  }
  if (!res.ok) throw new Error(`Search Console request failed [${res.status}]: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

type Rows = { rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[] };

export async function searchAnalyticsByDate(accessToken: string, siteUrl: string, startDate: string, endDate: string) {
  const data = (await apiJson(
    accessToken,
    `${API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, dimensions: ["date"], rowLimit: 500 }),
    },
  )) as Rows;
  return (data.rows ?? []).map((r) => ({
    date: r.keys[0]!,
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

export async function topRows(accessToken: string, siteUrl: string, dimension: "query" | "page", startDate: string, endDate: string) {
  const data = (await apiJson(
    accessToken,
    `${API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, dimensions: [dimension], rowLimit: 10 }),
    },
  )) as Rows;
  return (data.rows ?? []).map((r) => ({
    key: r.keys[0]!,
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

/** Query×page rows (used for the near-me baseline: query with its landing pages). */
export async function queryPageRows(accessToken: string, siteUrl: string, startDate: string, endDate: string, rowLimit = 250) {
  const data = (await apiJson(
    accessToken,
    `${API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, dimensions: ["query", "page"], rowLimit }),
    },
  )) as Rows;
  return (data.rows ?? []).map((r) => ({
    query: r.keys[0] ?? "",
    page: r.keys[1] ?? "",
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

export async function listSitemaps(accessToken: string, siteUrl: string) {
  const data = (await apiJson(accessToken, `${API}/sites/${encodeURIComponent(siteUrl)}/sitemaps`)) as {
    sitemap?: {
      path: string;
      lastSubmitted?: string;
      lastDownloaded?: string;
      isPending?: boolean;
      warnings?: string;
      errors?: string;
      contents?: { type: string; submitted: string; indexed?: string }[];
    }[];
  };
  return data.sitemap ?? [];
}

export async function inspectUrl(accessToken: string, siteUrl: string, inspectionUrl: string) {
  const data = (await apiJson(accessToken, INSPECT, {
    method: "POST",
    body: JSON.stringify({ siteUrl, inspectionUrl }),
  })) as {
    inspectionResult?: {
      indexStatusResult?: {
        verdict?: string;
        coverageState?: string;
        robotsTxtState?: string;
        indexingState?: string;
        lastCrawlTime?: string;
        googleCanonical?: string;
        userCanonical?: string;
        pageFetchState?: string;
      };
      mobileUsabilityResult?: { verdict?: string };
    };
  };
  return data.inspectionResult ?? {};
}
