import { useEffect, useMemo, useRef } from 'react';

// 2D SVG version of the PDR chart: a smooth stroked path with a round dot that
// steps along it, pausing on each data point (ping-pong). On every pause it drives
// the dashed line (lineRef) to that x and reports the dot's value (onRate). Replaces
// the 3D pipe/ball canvas; same behaviour, plain SVG + DOM.

const SMOOTH = 0.2; // Catmull-Rom handle length (matches the prior CHART_PATH)
const DWELL_MS = 1100; // pause at each dot
const MOVE_MS = 700; // glide between adjacent dots
const RATE_LOW = 44;
const RATE_HIGH = 66;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function PdrChartSvg({
  points,
  fromIndex,
  toIndex,
  size = 792,
  color = '#E83C5C',
  strokeWidth = 8,
  dotRadius = 12,
  lineRef,
  onRate,
}: {
  points: [number, number][];
  fromIndex: number;
  toIndex: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
  dotRadius?: number;
  lineRef?: React.RefObject<HTMLDivElement | null>;
  onRate?: (rate: number) => void;
}) {
  const dotRef = useRef<HTMLDivElement>(null);

  // Build the smooth path + its cubic-bezier control points (so the dot can be
  // evaluated on the exact same curve), plus the dot value range over [from,to].
  const { path, c1, c2, cyMin, cyMax } = useMemo(() => {
    const p = points;
    const n = p.length;
    const c1: [number, number][] = [];
    const c2: [number, number][] = [];
    for (let i = 0; i < n - 1; i++) {
      const p0 = p[i - 1] ?? p[i];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = p[i + 2] ?? p[i + 1];
      c1.push([p1[0] + (p2[0] - p0[0]) * SMOOTH, p1[1] + (p2[1] - p0[1]) * SMOOTH]);
      c2.push([p2[0] - (p3[0] - p1[0]) * SMOOTH, p2[1] - (p3[1] - p1[1]) * SMOOTH]);
    }
    let d = `M ${p[0][0]} ${p[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      d += ` C ${c1[i][0]} ${c1[i][1]}, ${c2[i][0]} ${c2[i][1]}, ${p[i + 1][0]} ${p[i + 1][1]}`;
    }
    let cyMin = Infinity;
    let cyMax = -Infinity;
    for (let i = fromIndex; i <= toIndex; i++) {
      if (p[i][1] < cyMin) cyMin = p[i][1];
      if (p[i][1] > cyMax) cyMax = p[i][1];
    }
    return { path: d, c1, c2, cyMin, cyMax };
  }, [points, fromIndex, toIndex]);

  useEffect(() => {
    // Evaluate cubic-bezier segment s (point s → s+1) at t.
    const evalSeg = (s: number, t: number): [number, number] => {
      const P0 = points[s];
      const A = c1[s];
      const B = c2[s];
      const P3 = points[s + 1];
      const mt = 1 - t;
      const ka = mt * mt * mt;
      const kb = 3 * mt * mt * t;
      const kc = 3 * mt * t * t;
      const kd = t * t * t;
      return [ka * P0[0] + kb * A[0] + kc * B[0] + kd * P3[0], ka * P0[1] + kb * A[1] + kc * B[1] + kd * P3[1]];
    };

    // Ping-pong stop sequence of dot indices: from→to then back (endpoints once).
    const idx: number[] = [];
    for (let i = fromIndex; i <= toIndex; i++) idx.push(i);
    for (let i = toIndex - 1; i > fromIndex; i--) idx.push(i);

    const segMs = DWELL_MS + MOVE_MS;
    const cycle = idx.length * segMs;
    const start = performance.now();
    let lastStop = -1;
    let raf = 0;

    const tick = (now: number) => {
      const tt = (now - start) % cycle;
      const si = Math.floor(tt / segMs);
      const local = tt - si * segMs;
      const a = idx[si];
      const b = idx[(si + 1) % idx.length];
      let x: number;
      let y: number;
      if (local < DWELL_MS) {
        [x, y] = points[a]; // paused on the dot
      } else {
        const prog = easeInOutCubic((local - DWELL_MS) / MOVE_MS);
        [x, y] = b === a + 1 ? evalSeg(a, prog) : evalSeg(b, 1 - prog); // fwd seg a / back seg a-1
      }
      const dot = dotRef.current;
      if (dot) {
        dot.style.left = `${(x / size) * 100}%`;
        dot.style.top = `${(y / size) * 100}%`;
      }
      if (lineRef?.current) lineRef.current.style.left = `${(x / size) * 100}%`;
      // Rate updates only when the dot is reached (new pause).
      if (si !== lastStop) {
        lastStop = si;
        const frac = cyMax === cyMin ? 0 : (cyMax - points[a][1]) / (cyMax - cyMin);
        onRate?.(Math.round(RATE_LOW + frac * (RATE_HIGH - RATE_LOW)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points, c1, c2, cyMin, cyMax, fromIndex, toIndex, size, lineRef, onRate]);

  return (
    <>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          left: `${(points[fromIndex][0] / size) * 100}%`,
          top: `${(points[fromIndex][1] / size) * 100}%`,
          width: dotRadius * 2,
          height: dotRadius * 2,
          borderRadius: '50%',
          backgroundColor: color,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
