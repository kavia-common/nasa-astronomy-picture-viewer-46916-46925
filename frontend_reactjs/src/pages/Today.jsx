import { useState } from "react";
import { useApod } from "../hooks/useApod";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";
import ApodCard from "../components/ApodCard";
import ApodModal from "../components/ApodModal";

// PUBLIC_INTERFACE
export default function Today() {
  /** Today page shows today's APOD with details modal. */
  const { data, loading, error, refetch } = useApod(undefined);
  const [open, setOpen] = useState(null);

  return (
    <main className="container" aria-label="Today's APOD content">
      <section className="section pixel-border" style={{ marginTop: 16 }}>
        <h1 style={{ fontSize: 14, margin: 0 }}>Today</h1>
      </section>

      {loading && <Loader message="Fetching today's APOD..." />}
      <ErrorBanner error={error} onRetry={refetch} />
      {!loading && !error && data?.url && (
        <ApodCard apod={data} onOpen={setOpen} />
      )}

      <ApodModal apod={open} onClose={() => setOpen(null)} />
    </main>
  );
}
