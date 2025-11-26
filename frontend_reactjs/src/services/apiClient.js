const BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Build a URL with query parameters safely.
 * The backend serves under /api; README instructs REACT_APP_BACKEND_URL to include /api.
 * Example: http://localhost:3001/api
 * If the backend is mounted directly at /apod (without /api), you may set REACT_APP_BACKEND_URL=http://localhost:3001
 * and the below normalization will still build correct URLs.
 * @param {string} path path relative to BASE_URL (should not include /api again)
 * @param {Record<string, string|number|boolean|undefined>} params
 * @returns {string}
 */
function buildUrl(path, params = {}) {
  if (!BASE_URL) {
    throw new Error("REACT_APP_BACKEND_URL is not set. Please set it in .env (e.g., http://localhost:3001/api).");
  }

  // Normalize to avoid accidental double slashes and ensure correct /api handling:
  // - If BASE_URL already ends with /api and caller passes "/api/...", strip the extra "/api".
  // - If BASE_URL does NOT end with /api but caller passes "/api/...", keep it.
  const baseUrlObj = new URL(BASE_URL, window.location.origin);
  const baseEndsWithApi = baseUrlObj.pathname.replace(/\/+$/, "") === "/api";
  const incomingStartsWithApi = path.startsWith("/api/") || path === "/api";

  let normalizedPath = path;
  if (baseEndsWithApi && incomingStartsWithApi) {
    normalizedPath = path.replace(/^\/api/, ""); // drop leading /api to avoid /api/api/...
  }

  // Ensure leading slash for URL constructor relative path handling
  if (!normalizedPath.startsWith("/")) normalizedPath = `/${normalizedPath}`;

  const url = new URL(normalizedPath, baseUrlObj.toString());

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
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<any>}
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
  /**
   * Fetch today's APOD from backend using /apod (backend defaults to today).
   * This builds either:
   *  - {REACT_APP_BACKEND_URL}/apod when REACT_APP_BACKEND_URL ends with /api
   *  - {REACT_APP_BACKEND_URL}/api/apod when REACT_APP_BACKEND_URL does not end with /api and caller uses "/api/apod"
   */
  const url = buildUrl("/apod");
  return getJson(url);
}

// PUBLIC_INTERFACE
export async function fetchApodByDate(date) {
  /**
   * Fetch APOD for a date (YYYY-MM-DD) using apod_date query parameter.
   */
  if (!date) throw new Error("date is required (YYYY-MM-DD)");
  const isoDate = String(date).slice(0, 10);
  const url = buildUrl("/apod", { apod_date: isoDate });
  return getJson(url);
}
