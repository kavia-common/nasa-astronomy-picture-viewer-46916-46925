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
      throw new Error(message);
    }
    return await res.json();
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err instanceof Error ? err : new Error("Network error");
  } finally {
    clearTimeout(timeout);
  }
}

// PUBLIC_INTERFACE
export async function fetchApodToday() {
  /**
   * Fetch today's APOD from backend.
   * Prefer explicit /apod/today path if available, while remaining compatible with backends
   * that serve today's APOD at /apod (no query).
   */
  // Primary target per request: /api/apod/today
  const primary = buildUrl("/apod/today");
  try {
    return await getJson(primary);
  } catch (e) {
    // Fallback to /apod without date if /today is not available
    const fallback = buildUrl("/apod");
    return getJson(fallback);
  }
}

// PUBLIC_INTERFACE
export async function fetchApodByDate(date) {
  /**
   * Fetch APOD for a date (YYYY-MM-DD).
   * The backend may accept 'date' or 'apod_date'. We'll prioritize 'date'
   * but include 'apod_date' to maintain compatibility.
   */
  if (!date) throw new Error("date is required (YYYY-MM-DD)");
  const isoDate = String(date).slice(0, 10);

  // Try with 'date' param first
  try {
    const urlDate = buildUrl("/apod", { date: isoDate });
    return await getJson(urlDate);
  } catch (e) {
    // Fallback to 'apod_date'
    const urlApodDate = buildUrl("/apod", { apod_date: isoDate });
    return getJson(urlApodDate);
  }
}
