import { useEffect, useRef, useState } from "react";
import { fetchApodToday, fetchApodByDate } from "../services/apiClient";

/**
 * Simple in-memory cache keyed by date label ('today' or YYYY-MM-DD).
 */
const apodCache = new Map();

/**
 * Normalize APOD response to a stable shape the UI expects.
 * Ensures result.url = result.url || result.hdurl.
 */
function normalize(apod) {
  const mediaType = apod.media_type || "image";
  const primaryUrl = apod.url || apod.hdurl || null;

  return {
    date: apod.date,
    title: apod.title,
    explanation: apod.explanation,
    media_type: mediaType,
    url: primaryUrl,
    hdurl: apod.hdurl || null,
    copyright: apod.copyright || null,
    service_version: apod.service_version || null,
  };
}

/**
 * Key to cache map.
 */
function keyFromDate(dateStr) {
  return dateStr ? dateStr : "today";
}

// PUBLIC_INTERFACE
export function useApod(dateStr) {
  /**
   * React hook for fetching APOD data using backend /apod with optional apod_date.
   * - dateStr: undefined for today, or "YYYY-MM-DD" for a specific date.
   * Returns { data, loading, error, refetch } with cache-first logic.
   */
  const [data, setData] = useState(() => {
    const k = keyFromDate(dateStr);
    const cached = apodCache.get(k);
    return cached || null;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  async function load() {
    const k = keyFromDate(dateStr);
    setError(null);

    const cached = apodCache.get(k);
    if (cached) {
      console.debug("[useApod] cache hit for", k);
      if (mounted.current) {
        setData(cached);
        setLoading(false);
      }
      return;
    }

    console.debug("[useApod] request start", { dateStr, key: k });
    if (mounted.current) setLoading(true);

    try {
      const apod = dateStr ? await fetchApodByDate(dateStr) : await fetchApodToday();
      const norm = normalize(apod);
      apodCache.set(k, norm);
      if (mounted.current) {
        setData(norm);
        console.debug("[useApod] request success", { dateStr, key: k, title: norm?.title });
      }
    } catch (e) {
      if (mounted.current) {
        const err = e instanceof Error ? e : new Error("Unknown error");
        setData(null);
        setError(err);
        console.debug("[useApod] request error", { dateStr, key: k, error: String(err) });
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        console.debug("[useApod] request end", { dateStr, key: k });
      }
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateStr]);

  // PUBLIC_INTERFACE
  return {
    data,
    loading,
    error,
    refetch: load,
  };
}
