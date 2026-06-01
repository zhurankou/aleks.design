import * as React from "react";

// Scales fixed-size (designW × designH) content down to the available column
// width, never up past 1. Reserves the post-scale height so layout doesn't jump.
// Used on mobile to shrink desktop-sized content (timelines, process squares,
// the dashboard preview, canvases) into a narrow column.
export function FitWidth({
  designW,
  designH,
  children,
  style,
}: {
  designW: number;
  designH: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / designW));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designW]);
  return (
    <div
      ref={ref}
      style={{ width: "100%", height: scale ? designH * scale : undefined, overflow: "hidden", ...style }}
    >
      <div style={{ width: designW, height: designH, transformOrigin: "top left", transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
