// flow2.1 chart recreated from Figma node 15854:875 — same panel/typography
// specs as PdrChartSmall (flow1.1) but with title "Polyps", two plot lines
// (PDR black + PRR grey), and a two-item legend at the bottom. Defaults the
// SVG render size to 50% so it can sit smaller behind flow1.1.

const PDR = [
  { month: 'Dec', value: 65 },
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 50 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 68 },
];
const PRR = [
  // Values match the Figma plot (PRR line sits ~25 pp above PDR).
  { month: 'Dec', value: 92 },
  { month: 'Jan', value: 72 },
  { month: 'Feb', value: 75 },
  { month: 'Mar', value: 65 },
  { month: 'Apr', value: 90 },
];

const VB_W = 448;
const VB_H = 386;
// Match Figma X-label centres (card-local 108→380) — same spec as flow1.1.
const PLOT_LEFT = 108;
const PLOT_RIGHT = 380;
// Y labels: gap-24 between line-height-1.4 12px items → centre-to-centre 40.8.
const PLOT_TOP = 76.4;
const PLOT_BOTTOM = 280.4;
const stepX = (PLOT_RIGHT - PLOT_LEFT) / (PDR.length - 1);
const PX = (i: number) => PLOT_LEFT + i * stepX;
const PY = (pct: number) => PLOT_BOTTOM - (pct / 100) * (PLOT_BOTTOM - PLOT_TOP);

const COL_TITLE = '#1f2124';
const COL_MUTED = '#8e8e93';
const COL_INK = '#000000';
const COL_PRR = '#8e8e93';

export function PdrPrrChartSmall({
  sizePct = 50,
  hoveredIndex,
  hoverTransition = 'r 70ms ease-out',
}: {
  sizePct?: number;
  /** Index of the PDR data point to render in a "hover" state (enlarged dot). */
  hoveredIndex?: number;
  /** CSS transition for the hovered dot's radius — used to sync with a cursor. */
  hoverTransition?: string;
}) {
  const sizeStyle = `${sizePct}%`;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',
      }}
      data-name="pdr-prr-chart-small"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: sizeStyle, height: sizeStyle, display: 'block' }}
        aria-label="Polyps — PDR and PRR, Dec to Apr"
      >
        {/* White panel — straight corners + 1 px grey stroke, matches flow1.1. */}
        <rect x={0} y={0} width={VB_W} height={VB_H} fill="#ffffff" stroke="#d1d5db" strokeWidth={1} />

        {/* Title — Manrope SemiBold 20, baseline 40 (cap top at y=24). */}
        <text
          x={24}
          y={40}
          fontFamily="'Manrope', sans-serif"
          fontWeight={600}
          fontSize={20}
          fill={COL_TITLE}
        >
          Polyps
        </text>

        {/* Y-axis labels — right-aligned at x=64, evenly spaced. */}
        {[100, 80, 60, 40, 20, 0].map((v, i) => (
          <text
            key={v}
            x={64}
            y={PLOT_TOP + (i * (PLOT_BOTTOM - PLOT_TOP)) / 5}
            textAnchor="end"
            dominantBaseline="middle"
            fontFamily="'Manrope', sans-serif"
            fontWeight={400}
            fontSize={12}
            letterSpacing="0.24"
            fill={COL_MUTED}
          >
            {v}%
          </text>
        ))}

        {/* PRR line + dots (grey) — painted first so PDR sits on top. */}
        <polyline
          points={PRR.map((d, i) => `${PX(i)},${PY(d.value)}`).join(' ')}
          fill="none"
          stroke={COL_PRR}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {PRR.map((d, i) => (
          <circle key={d.month} cx={PX(i)} cy={PY(d.value)} r={4} fill={COL_PRR} />
        ))}

        {/* PDR line + dots (black). */}
        <polyline
          points={PDR.map((d, i) => `${PX(i)},${PY(d.value)}`).join(' ')}
          fill="none"
          stroke={COL_INK}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {PDR.map((d, i) => (
          <circle
            key={d.month}
            cx={PX(i)}
            cy={PY(d.value)}
            r={i === hoveredIndex ? 5.5 : 4}
            fill={COL_INK}
            style={{ transition: hoverTransition }}
          />
        ))}

        {/* X-axis labels — centred under each dot, 24 px below 0% Y label. */}
        {PDR.map((d, i) => (
          <text
            key={d.month}
            x={PX(i)}
            y={321.2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'Manrope', sans-serif"
            fontWeight={400}
            fontSize={12}
            letterSpacing="0.24"
            fill={COL_MUTED}
          >
            {d.month}
          </text>
        ))}

        {/* Legend — two items (PDR + PRR), centred via flex inside foreignObject.
            Sits 16 px below the X-axis labels (matches Figma outer-card gap-16). */}
        <foreignObject x={0} y={345.6} width={VB_W} height={20}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COL_INK }} />
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  letterSpacing: '0.24px',
                  color: COL_INK,
                  lineHeight: 1,
                }}
              >
                PDR
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COL_PRR }} />
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  letterSpacing: '0.24px',
                  color: COL_INK,
                  lineHeight: 1,
                }}
              >
                PRR
              </span>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
