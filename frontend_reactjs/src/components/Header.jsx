import { useMemo } from "react";

/**
 * Simple router-less active path detection via window.location for CRA.
 */
function useActivePath() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  return useMemo(() => pathname, [pathname]);
}

// PUBLIC_INTERFACE
export default function Header() {
  /** Header with app title and simple navigation. */
  const active = useActivePath();

  function goto(path) {
    window.history.pushState({}, "", path);
    // Dispatch a navigation event so pages can react if needed
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <header className="nav crt" role="banner" aria-label="RetroSpace navigation bar">
      <div role="heading" aria-level={1} style={{ fontSize: 14 }}>
        🚀 RetroSpace APOD
      </div>
      <nav aria-label="Main navigation">
        <a
          href="#today"
          onClick={(e) => {
            e.preventDefault();
            goto("/");
          }}
          aria-current={active === "/" ? "page" : undefined}
          aria-label="Go to today's APOD page"
        >
          Today
        </a>
        <a
          href="#archive"
          onClick={(e) => {
            e.preventDefault();
            goto("/archive");
          }}
          aria-current={active.startsWith("/archive") ? "page" : undefined}
          aria-label="Go to APOD archive page"
        >
          Archive
        </a>
      </nav>
    </header>
  );
}
