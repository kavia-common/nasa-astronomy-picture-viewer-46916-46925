const BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Build a URL with query parameters safely.
 * The backend serves under /api; README instructs REACT_APP_BACKEND_URL to include /api.
 * Example: http://localhost:3001/api
 * @param {string} path path relative to BASE_URL (should not include /api again)
 * @param {Record<string, string|number|boolean|undefined>} params
 * @returns {string}
 */
function buildUrl(path, params = {}) {
  if (!BASE_URL) {
    throw new Error("REACT_APP_BACKEND_URL is not set. Please set it in .env (e.g., http://localhost:3001/api)");
  }
  // Ensure we don't double-prefix /api if user accidentally includes it in path.
  const normalizedPath = path.startsWith("/api/") ? path.replace(/^\/api/, "") : path;
  const url = new URL(normalizedPath, BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, String(v));
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
