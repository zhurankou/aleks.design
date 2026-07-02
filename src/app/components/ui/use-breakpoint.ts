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

// A phone is identified by its SHORT side, so the classification survives
// rotation: an iPhone is ~390–430px on the short edge in both orientations,
// whereas the smallest tablet (iPad mini) is 768. Width alone misclassifies a
// landscape phone (~844px wide) as a tablet, which then wrongly receives the
// full, GPU-heavy desktop experience and crashes mobile Safari. Tablets and up
// keep the scaled desktop tree.
const PHONE_MAX_SHORT_SIDE = 600;
export function useIsPhone(): boolean {
  const isPhone = () => Math.min(window.innerWidth, window.innerHeight) <= PHONE_MAX_SHORT_SIDE;
  const [phone, setPhone] = React.useState(() =>
    typeof window === "undefined" ? false : isPhone(),
  );
  React.useEffect(() => {
    const onChange = () => setPhone(isPhone());
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);
    onChange();
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);
  return phone;
}

// Live orientation — phones show a rotate-to-landscape prompt in portrait and
// the scaled desktop experience in landscape.
export function useIsPortrait(): boolean {
  const [portrait, setPortrait] = React.useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(orientation: portrait)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const onChange = () => setPortrait(mq.matches);
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return portrait;
}
