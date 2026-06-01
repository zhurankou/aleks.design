import * as React from "react";

// Plays a fade + scale-up (from 0.9) every time the wrapped element scrolls into
// view. An IntersectionObserver on a stable outer wrapper increments `count` on
// each viewport entry; that count keys an inner div so it remounts and the CSS
// animation restarts from frame 0. Self-contained — injects its own keyframe so
// it works on any page (NewPage mobile as well as OlySense).
const KEYFRAME = `@keyframes oly-load { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`;

export function ScrollFadeIn({
  children,
  style,
  threshold = 0.4,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  threshold?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCount((c) => c + 1);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <div ref={ref} style={style}>
      <style>{KEYFRAME}</style>
      <div
        key={count}
        style={{
          opacity: count === 0 ? 0 : undefined,
          animation: count === 0 ? "none" : "oly-load 0.45s ease-out both",
        }}
      >
        {children}
      </div>
    </div>
  );
}
