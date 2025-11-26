export default function Loader({ message = "Loading..." }) {
  /** Loading indicator with CRT style and ARIA live region. */
  return (
    <div
      className="section crt"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{ textAlign: "center" }}
    >
      <div style={{ fontSize: 12, marginBottom: 8 }}>{message}</div>
      <div
        aria-hidden="true"
        style={{
          display: "inline-block",
          border: "2px solid var(--crt-border)",
          padding: "8px 10px",
          boxShadow: "var(--crt-shadow)",
        }}
      >
        <span className="caption">▮▯▮▯▮ Loading ▯▮▯▮▯</span>
      </div>
    </div>
  );
}
