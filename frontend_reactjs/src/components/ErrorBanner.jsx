export default function ErrorBanner({ error, onRetry }) {
  /** Error banner with retry option. */
  if (!error) return null;
  const msg = error?.message || "Something went wrong";
  return (
    <div
      className="section pixel-border"
      role="alert"
      aria-live="assertive"
      style={{ borderColor: "rgba(239,68,68,0.6)" }}
    >
      <div className="caption" style={{ color: "rgba(239,68,68,0.9)" }}>
        Error: {msg}
      </div>
      {/* For debugging responses that include additional context beyond message */}
      {String(error) !== msg && (
        <div className="caption" style={{ marginTop: 6 }}>
          Details: {String(error)}
        </div>
      )}
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
