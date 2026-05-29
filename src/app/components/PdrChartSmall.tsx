// Compact PDR line chart recreated from Figma node 15854:957. White rounded
// panel with title, 6-stop Y-axis, 5-month X-axis, a thin black plot line with
// solid dots, and a dot-marker "PDR" legend centred at the bottom. Rendered as
// a single SVG with viewBox so it scales + centres inside its container.

const DATA = [
  // Values match the Figma plot (line image spans y=40%→68% of the panel).
  { month: 'Dec', value: 65 },
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 50 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 68 },
];

// viewBox sized to fit the Figma card exactly: 24px padding + 28 title +
// 16 gap + 204 Y-axis range + 24 gap + 17 X-label + 16 gap + ~17 legend + 24
// padding ≈ 386 tall, 448 wide (400 container + 48 padding).
const VB_W = 448;
const VB_H = 386;
// Match Figma X-label centres (card-local 108→380) — pl-64 + 5×40 items at
// justify-between in the 400-wide container, with card padding 24 added in.
const PLOT_LEFT = 108;
const PLOT_RIGHT = 380;
// Y labels: 6 items at fontSize 12 / line-height 1.4 = 16.8 tall, gap-24 →
// centre-to-centre = 40.8. First (100%) centre at y=76.4 (24 padding + 28
// title + 16 gap + 8.4 half-label); last (0%) at y=280.4.
const PLOT_TOP = 76.4;
const PLOT_BOTTOM = 280.4;
const stepX = (PLOT_RIGHT - PLOT_LEFT) / (DATA.length - 1);
const PX = (i: number) => PLOT_LEFT + i * stepX;
const PY = (pct: number) => PLOT_BOTTOM - (pct / 100) * (PLOT_BOTTOM - PLOT_TOP);

const COL_TITLE = '#1f2124';
const COL_MUTED = '#8e8e93';
const COL_INK = '#000000';

export function PdrChartSmall({
  sizePct = 70,
  hoveredIndex,
}: {
  sizePct?: number;
  /** Index of the data point to render in a "hover" state (enlarged dot). */
  hoveredIndex?: number;
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
      data-name="pdr-chart-small"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: sizeStyle, height: sizeStyle, display: 'block' }}
        aria-label="Polyp Detection Rate, Dec to Apr"
      >
        {/* White card */}
        <rect x={0} y={0} width={VB_W} height={VB_H} fill="#ffffff" stroke="#d1d5db" strokeWidth={1} />

        {/* Title — Manrope SemiBold 20, baseline 40 so its cap-height sits at
            y=24 (Figma card padding-top). */}
        <text
          x={24}
          y={40}
          fontFamily="'Manrope', sans-serif"
          fontWeight={600}
          fontSize={20}
          fill={COL_TITLE}
        >
          Polyp Detection Rate
        </text>

        {/* Y-axis labels — right-aligned at x=64 (24 padding + 40 label width),
            evenly spaced from PLOT_TOP to PLOT_BOTTOM. */}
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

        {/* Plot line + filled dots. */}
        <polyline
          points={DATA.map((d, i) => `${PX(i)},${PY(d.value)}`).join(' ')}
          fill="none"
          stroke={COL_INK}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {DATA.map((d, i) => (
          <circle
            key={d.month}
            cx={PX(i)}
            cy={PY(d.value)}
            r={i === hoveredIndex ? 5.5 : 4}
            fill={COL_INK}
            style={{ transition: 'r 70ms ease-out' }}
          />
        ))}

        {/* X-axis labels — centred under each dot. Y-axis container bottom is
            PLOT_BOTTOM + 8.4 = 288.8; gap-24 + 8.4 half-label = 321.2 centre. */}
        {DATA.map((d, i) => (
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

        {/* Legend — black dot + "PDR" text, flex-centred via foreignObject.
            X-label visual bottom = 321.2 + 8.4 = 329.6; outer-card gap-16 →
            legend top at 345.6. */}
        <foreignObject x={0} y={345.6} width={VB_W} height={20}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
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
        </foreignObject>
      </svg>
    </div>
  );
}
