/**
 * OAuth 2.0 (read-only) client for Google Search Console.
 *
 * Why this exists (Batch 6, 2026-10-02): the original integration talked to
 * the Lovable connector gateway with two API keys, and Google rejects that —
 * the Search Console API is OAuth2-only ("API keys are not supported by this
 * API. Expected OAuth2", verified HTTP 401). This module implements the
 * standard web-application flow against Google directly:
 *
 *   /gsc/connect  →  accounts.google.com consent  →  /gsc/oauth-callback
 *
 * Security model:
 * - Scope is webmasters.readonly ONLY — sites, searchAnalytics, sitemaps and
 *   urlInspection are all covered by it (Google's index.inspect docs: "either
 *   the webmasters or webmasters.readonly scope"). No write access.
 * - The refresh token lives ONLY in an HttpOnly cookie in the connecting
 *   browser (gsc_rt); it is never persisted server-side, never logged, and
 *   never sent to the client bundle.
 * - Access tokens are minted per report run from the refresh token and cached
 *   in memory only for their ~1h lifetime.
 * - OAuth state cookie (gsc_oauth_state) protects the callback against CSRF.
 * - Client credentials come from server env (read inside functions — Cloudflare
 *   Workers bind env at request time).
 */

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export const RT_COOKIE = "gsc_rt";
export const STATE_COOKIE = "gsc_oauth_state";

export function getOAuthCreds(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env["GOOGLE_OAUTH_CLIENT_ID"];
  const clientSecret = process.env["GOOGLE_OAUTH_CLIENT_SECRET"];
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

/** Build the Google consent URL for a given redirect URI + CSRF state. */
export function buildConnectUrl(redirectUri: string, state: string): string | null {
  const creds = getOAuthCreds();
  if (!creds) return null;
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.searchParams.set("client_id", creds.clientId);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", SCOPE);
  // offline + consent guarantee Google returns a refresh_token every reconnect.
  u.searchParams.set("access_type", "offline");
  u.searchParams.set("prompt", "consent");
  u.searchParams.set("state", state);
  return u.toString();
}

export type OAuthTokens = { accessToken: string; refreshToken: string | null; expiresIn: number };

/** Exchange an authorization code for tokens. Throws on any non-OK response. */
export async function exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens> {
  const creds = getOAuthCreds();
  if (!creds) throw new Error("OAuth client credentials are not configured.");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });
  if (!res.ok) {
    // Log the provider detail server-side; never surface it to the browser.
    console.error(`[gsc-oauth] code exchange failed [${res.status}]: ${(await res.text()).slice(0, 300)}`);
    throw new Error("token_exchange_failed");
  }
  const data = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("no_access_token");
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresIn: Number(data.expires_in ?? 3600),
  };
}

/** In-memory access-token cache (Worker isolate scope; never leaves the process). */
const tokenCache = new Map<string, { accessToken: string; expiresAt: number }>();

/** Mint an access token for a refresh token, cached until ~60 s before expiry. */
export async function getAccessToken(refreshToken: string): Promise<string> {
  const cached = tokenCache.get(refreshToken);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.accessToken;

  const creds = getOAuthCreds();
  if (!creds) throw new Error("OAuth client credentials are not configured.");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      grant_type: "refresh_token",
    }).toString(),
  });
  if (!res.ok) {
    console.error(`[gsc-oauth] refresh failed [${res.status}]: ${(await res.text()).slice(0, 300)}`);
    throw new Error("refresh_failed");
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("no_access_token");
  const expiresIn = Number(data.expires_in ?? 3600);
  tokenCache.set(refreshToken, { accessToken: data.access_token, expiresAt: Date.now() + expiresIn * 1000 });
  return data.access_token;
}

/** Minimal cookie header parser (name → value). */
export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const name = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}

/** Serialize an HttpOnly cookie for Set-Cookie. */
export function cookie(
  name: string,
  value: string,
  opts: { maxAge: number; secure: boolean; clear?: boolean },
): string {
  const parts = [
    `${name}=${encodeURIComponent(opts.clear ? "" : value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${opts.clear ? 0 : opts.maxAge}`,
  ];
  // Secure on https origins; localhost preview is plain http.
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}
