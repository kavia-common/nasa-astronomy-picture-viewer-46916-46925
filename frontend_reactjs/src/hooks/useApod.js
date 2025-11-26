import { useEffect, useRef, useState } from "react";
import { fetchApodToday, fetchApodByDate } from "../services/apiClient";

/**
 * Simple in-memory cache keyed by date label ('today' or YYYY-MM-DD).
 */
const apodCache = new Map();

/**
 * Normalize APOD response to a stable shape the UI expects.
 */
function normalize(apod) {
  return {
    date: apod.date,
    title: apod.title,
    explanation: apod.explanation,
    media_type: apod.media_type || "image",
    url: apod.url,
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
   * React hook for fetching APOD data.
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
    setError(null);
    const k = keyFromDate(dateStr);
    const cached = apodCache.get(k);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const apod = dateStr ? await fetchApodByDate(dateStr) : await fetchApodToday();
      const norm = normalize(apod);
      apodCache.set(k, norm);
      if (mounted.current) {
        setData(norm);
      }
    } catch (e) {
      // On any error, clear any stale data and surface a friendly message
      if (mounted.current) {
        setData(null);
        const err = e instanceof Error ? e : new Error("Unknown error");
        setError(err);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
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
