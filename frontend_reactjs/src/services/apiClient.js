const RAW_BASE = process.env.REACT_APP_BACKEND_URL;

/**
 * Normalize the configured backend base URL to ensure it includes a single /api suffix,
 * and never has a trailing slash. This prevents 404s from path mismatch and double-prefixes.
 *
 * PUBLIC_INTERFACE
 * resolveApiBase
 *   Returns the normalized API base.
 */
function resolveApiBase(rawBase) {
  /**
   * Normalize base URL:
   * - Require REACT_APP_BACKEND_URL
   * - Strip trailing slashes
   * - Ensure it ends with /api (append if missing)
   */
  if (!rawBase) {
    throw new Error(
      "REACT_APP_BACKEND_URL is not set. Please set it in .env (e.g., http://localhost:3001/api)."
    );
  }
  // Trim whitespace
  let base = String(rawBase).trim();

  // Remove trailing slash(es)
  base = base.replace(/\/+$/, "");

  // If base already ends with /api, keep as is; otherwise append /api
  if (!/\/api$/i.test(base)) {
    base = `${base}/api`;
  }

  return base;
}

/**
 * Build a URL to the APOD endpoint (/apod) under the normalized API base.
 * Also attaches provided query parameters.
 *
 * PUBLIC_INTERFACE
 * buildApodUrl
 */
function buildApodUrl(params = {}) {
  const apiBase = resolveApiBase(RAW_BASE);

  // Construct final URL: {apiBase}/apod (strip any trailing slash from base for safety)
  const full = `${apiBase.replace(/\/+$/, "")}/apod`;

  // Log resolved URL for debugging
  console.info("[apiClient] Resolved APOD URL:", full, params);

  const url = new URL(full, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

/**
 * Handle JSON fetch with errors normalized and a timeout.
 * Adds attempt to parse JSON error body for better error visibility in UI.
 */
async function getJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  console.debug("[apiClient] GET start:", url);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      mode: "cors",
      credentials: "omit",
    });
    if (!res.ok) {
      // Try to parse JSON error with message; fallback to text
      let messageDetail = "";
      try {
        const maybeJson = await res.clone().json();
        if (maybeJson && (maybeJson.message || maybeJson.detail || maybeJson.error)) {
          messageDetail = String(maybeJson.message || maybeJson.detail || maybeJson.error);
        }
      } catch {
        const text = await res.text().catch(() => "");
        messageDetail = text;
      }
      const message = `HTTP ${res.status} ${res.statusText}${messageDetail ? ": " + messageDetail : ""}`;
      console.debug("[apiClient] GET error:", url, message);
      throw new Error(message);
    }
    const data = await res.json();
    console.debug("[apiClient] GET success:", url);
    return data;
  } catch (err) {
    if (err?.name === "AbortError") {
      console.debug("[apiClient] GET abort/timeout:", url);
      throw new Error("Request timed out. Please try again.");
    }
    console.debug("[apiClient] GET exception:", url, String(err));
    throw err instanceof Error ? err : new Error("Network error");
  } finally {
    clearTimeout(timeout);
  }
}

// PUBLIC_INTERFACE
export async function fetchApodToday() {
  /** Fetch today's APOD from backend using /api/apod (backend defaults to today). */
  const url = buildApodUrl();
  return getJson(url);
}

// PUBLIC_INTERFACE
export async function fetchApodByDate(date) {
  /** Fetch APOD for a date (YYYY-MM-DD) using apod_date query parameter. */
  if (!date) throw new Error("date is required (YYYY-MM-DD)");
  const isoDate = String(date).slice(0, 10);
  const url = buildApodUrl({ apod_date: isoDate });
  return getJson(url);
}
