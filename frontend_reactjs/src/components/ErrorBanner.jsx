export default function ErrorBanner({ error, onRetry }) {
  /** Error banner with retry option. */
  if (!error) return null;
  return (
    <div
      className="section pixel-border"
      role="alert"
      aria-live="assertive"
      style={{ borderColor: "rgba(239,68,68,0.6)" }}
    >
      <div className="caption" style={{ color: "rgba(239,68,68,0.9)" }}>
        Error: {error.message || "Something went wrong"}
      </div>
      {onRetry && (
        <button
          type="button"
          className="btn"
          onClick={onRetry}
          aria-label="Retry loading content"
          style={{ marginTop: 10 }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
