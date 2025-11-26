export default function ApodCard({ apod, onOpen }) {
  /** Card for APOD summary. */
  if (!apod) return null;
  const isImage = apod.media_type === "image";
  return (
    <article className="section crt" aria-label={`APOD ${apod.date}: ${apod.title}`}>
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 14, margin: 0 }}>{apod.title}</h2>
        <div className="caption" style={{ marginTop: 6 }}>{apod.date}</div>
      </header>
      <div>
        {isImage ? (
          <img
            src={apod.url}
            alt={apod.title}
            className="pixel"
            style={{ width: "100%", maxHeight: 380, objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div className="caption" style={{ padding: 10 }}>
            Video content
          </div>
        )}
      </div>
      <footer style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          className="btn"
          onClick={() => onOpen?.(apod)}
          aria-label={`Open details for ${apod.title}`}
        >
          View details
        </button>
        {apod.hdurl && (
          <a
            className="btn"
            href={apod.hdurl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open HD image in new tab"
            title="Open HD image"
          >
            HD ⤴
          </a>
        )}
      </footer>
    </article>
  );
}
