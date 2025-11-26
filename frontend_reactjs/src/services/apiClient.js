const BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Build a URL with query parameters safely.
 * @param {string} path
 * @param {Record<string, string|number|boolean|undefined>} params
 * @returns {string}
 */
function buildUrl(path, params = {}) {
  const url = new URL(path, BASE_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.append(k, String(v));
    }
  });
  return url.toString();
}

/**
 * Handle JSON fetch with errors normalized.
 * @param {string} url
 * @returns {Promise<any>}
 */
async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const message = `HTTP ${res.status} ${res.statusText}${text ? ": " + text : ""}`;
    throw new Error(message);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchApodToday() {
  /** Fetch today's APOD from backend. GET /apod/today */
  const url = buildUrl("/apod/today");
  return getJson(url);
}

// PUBLIC_INTERFACE
export async function fetchApodByDate(date) {
  /** Fetch APOD for a date (YYYY-MM-DD). GET /apod?date=YYYY-MM-DD */
  if (!date) throw new Error("date is required (YYYY-MM-DD)");
  const url = buildUrl("/apod", { date });
  return getJson(url);
}
