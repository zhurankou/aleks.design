import { animated, type SpringValue } from '@react-spring/web';

// Full-bleed area-line chart for a stat card. The line + gradient fill are shown
// statically; on focus the marker dot slides along the line, driven by the shared
// `p` progress (0→1) owned by the card. The card's rate read-out uses the same `p`
// and the same `sampleY`, so the number always matches the dot's height.

const VIEW_W = 362.884;
const DOT_INSET = 8; // keep the marker (r≈6) clear of the chart's left/right edges
// Dot's x stays within [DOT_INSET, VIEW_W − DOT_INSET] so it's never clipped.
const dotX = (v: number) => DOT_INSET + v * (VIEW_W - 2 * DOT_INSET);

export function LineChart({
  strokeColor,
  fillColor,
  gradientId,
  linePath,
  fillPath,
  sampleY,
  p,
}: {
  strokeColor: string;
  fillColor: string;
  gradientId: string;
  linePath: string;
  fillPath: string;
  sampleY: (frac: number) => number;
  p: SpringValue<number>;
}) {
  return (
    <svg viewBox="0 0 362.884 123.665" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 121.666, display: 'block' }}>
      <defs>
        <linearGradient id={gradientId} x1="181.442" y1="0" x2="181.442" y2="123.665" gradientUnits="userSpaceOnUse">
          <stop stopColor={fillColor} stopOpacity="0.8" />
          <stop offset="1" stopColor={fillColor} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="#ECF2FF" />
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path d={linePath} stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" vectorEffect="non-scaling-stroke" />
      <animated.circle cx={p.to(dotX)} cy={p.to((v) => sampleY(dotX(v) / VIEW_W))} r="6" fill={strokeColor} />
    </svg>
  );
}
