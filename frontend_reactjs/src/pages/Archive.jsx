import { useState } from "react";
import { useApod } from "../hooks/useApod";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";
import DatePicker from "../components/DatePicker";
import ApodCard from "../components/ApodCard";
import ApodModal from "../components/ApodModal";

// PUBLIC_INTERFACE
export default function Archive() {
  /** Archive page shows APOD for any selected date. */
  const [date, setDate] = useState("");
  const { data, loading, error, refetch } = useApod(date || undefined);
  const [open, setOpen] = useState(null);

  return (
    <main className="container" aria-label="APOD archive content">
      <section className="section pixel-border" style={{ marginTop: 16 }}>
        <h1 style={{ fontSize: 14, margin: 0 }}>Archive</h1>
      </section>

      <DatePicker value={date} onChange={setDate} />

      {loading && <Loader message={date ? `Fetching APOD for ${date}...` : "Fetching today's APOD..."} />}
      <ErrorBanner error={error} onRetry={refetch} />
      {!loading && !error && data && (
        <div className="grid">
          <ApodCard apod={data} onOpen={setOpen} />
        </div>
      )}

      <ApodModal apod={open} onClose={() => setOpen(null)} />
    </main>
  );
}
