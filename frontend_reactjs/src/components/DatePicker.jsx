import { useEffect, useState } from "react";

/**
 * Clamp to valid APOD range if needed (APOD started 1995-06-16).
 */
const MIN_APOD = "1995-06-16";

// PUBLIC_INTERFACE
export default function DatePicker({ value, onChange, id = "apod-date" }) {
  /** Accessible date picker for APOD date selection. */
  const [val, setVal] = useState(value || "");

  useEffect(() => {
    setVal(value || "");
  }, [value]);

  const today = new Date().toISOString().slice(0, 10);

  function handleChange(e) {
    const v = e.target.value;
    setVal(v);
    onChange?.(v);
  }

  return (
    <div className="section pixel-border" role="group" aria-labelledby={`${id}-label`}>
      <label id={`${id}-label`} htmlFor={id} className="caption" style={{ display: "block", marginBottom: 8 }}>
        Select date (YYYY-MM-DD)
      </label>
      <input
        id={id}
        type="date"
        className="btn"
        min={MIN_APOD}
        max={today}
        value={val}
        onChange={handleChange}
        aria-describedby={`${id}-help`}
        aria-label="APOD date selector"
        style={{ background: "rgba(33,255,126,0.06)" }}
      />
      <div id={`${id}-help`} className="caption" style={{ marginTop: 8 }}>
        Tip: APOD archive starts on 1995-06-16
      </div>
    </div>
  );
}
