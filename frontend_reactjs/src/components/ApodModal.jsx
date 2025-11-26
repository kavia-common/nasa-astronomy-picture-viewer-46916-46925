import { useEffect } from "react";

export default function ApodModal({ apod, onClose }) {
  /** Modal displaying APOD with explanation and HD link. */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!apod) return null;

  const isImage = apod.media_type === "image";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${apod.title}`}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="section crt" style={{ maxWidth: 900, width: "92vw", maxHeight: "90vh", overflow: "auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>{apod.title}</h3>
          <button
            className="btn"
            onClick={onClose}
            aria-label="Close details dialog"
          >
            Close ✖
          </button>
        </header>
        <div className="caption" style={{ marginBottom: 10 }}>{apod.date}</div>
        <div>
          {isImage ? (
            <img
              src={apod.url}
              alt={apod.title}
              className="pixel"
              style={{ width: "100%", height: "auto", maxHeight: "60vh", objectFit: "contain" }}
            />
          ) : (
            <div className="section">
              <div className="caption">Video</div>
              <a className="btn" href={apod.url} target="_blank" rel="noreferrer noopener">
                Open Video ⤴
              </a>
            </div>
          )}
        </div>
        <p className="caption" style={{ marginTop: 14, whiteSpace: "pre-wrap" }}>{apod.explanation}</p>
        <footer style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {apod.hdurl && (
            <a
              className="btn"
              href={apod.hdurl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open HD image in new tab"
              title="Open HD image"
            >
              View HD ⤴
            </a>
          )}
          {apod.copyright && (
            <span className="caption">© {apod.copyright}</span>
          )}
        </footer>
      </div>
    </div>
  );
}
