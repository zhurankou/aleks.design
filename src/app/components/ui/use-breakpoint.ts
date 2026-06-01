import * as React from "react";

// Mobile <768 (stacked layout) | Tablet 768–1023 (desktop tree scaled to fit) | Desktop ≥1024.
const TABLET_MIN = 768;
const DESKTOP_MIN = 1024;

export type Breakpoint = "mobile" | "tablet" | "desktop";

function classify(width: number): Breakpoint {
  if (width < TABLET_MIN) return "mobile";
  if (width < DESKTOP_MIN) return "tablet";
  return "desktop";
}

// Synchronous initial read — safe here because this is a pure SPA with no SSR (both pages
// already read window at init), which avoids a desktop→mobile remount flash on first paint.
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = React.useState<Breakpoint>(() =>
    typeof window === "undefined" ? "desktop" : classify(window.innerWidth),
  );

  React.useEffect(() => {
    const onChange = () => setBp(classify(window.innerWidth));
    const tablet = window.matchMedia(`(min-width: ${TABLET_MIN}px)`);
    const desktop = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    tablet.addEventListener("change", onChange);
    desktop.addEventListener("change", onChange);
    onChange();
    return () => {
      tablet.removeEventListener("change", onChange);
      desktop.removeEventListener("change", onChange);
    };
  }, []);

  return bp;
}
