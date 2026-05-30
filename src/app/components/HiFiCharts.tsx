// Chart cards used by the Hi-Fi study comparison (square 5). Each card is
// recreated to match its corresponding Figma node from frames 15861:3403
// (Option 1 — tabs) and 15861:3390 (Option 2 — scroll). Existing dashboard
// building blocks (OlysenseBar, Header, Controls, FullSizeReport,
// horizontal-bar BarChartCard, Footer) come from `polyps/PolypsDashboard`; the
// components below cover the chart types those blocks don't:
//
//   * VerticalPairedBarsCard — paired month columns with value labels above
//     each bar (Figma 15861:4073 "By Number", 4079 "Detected By Time",
//     4080 "Retrieved By Time").
//   * DonutChartCard — SVG donut + side legend (Figma 15861:1511
//     "By Size (Pie)").
//   * ByTypeTable — grouped/sub-headed data table (Figma 15861:4081 / 1512
//     "By Type / Paris Classification").
//
// Colours mirror the dashboard's `chart/dataset-01/02` tokens.

const FONT = "'Noto Sans', sans-serif";
const NUM_FONT = "'Segoe UI', system-ui, sans-serif";
const BASE_TEXT = '#0f1113';
const SOFT = '#393f4c';
const SOFTER = '#546274';
const HEADER_BG = '#ebedf1';
const DIVIDER = '#ebedf1';
const CARD_SHADOW = '0px 2px 2px rgba(0,0,0,0.04), 0px 1px 1px rgba(0,0,0,0.04)';

// Shared card shell — white panel with a soft shadow, 16-px gap column,
// 16-px padding, 8-px radius (matches every Hi-Fi chart card in Figma).
// `minHeight` keeps siblings in a 2-up row aligned to the same minimum even
// when one card's natural content is shorter.
function CardShell({ title, minHeight = 400, children }: { title: string; minHeight?: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        boxShadow: CARD_SHADOW,
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxSizing: 'border-box',
        flex: '1 1 0',
        minWidth: 0,
        minHeight,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexShrink: 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, lineHeight: 1.4, color: BASE_TEXT, whiteSpace: 'nowrap' }}>
          {title}
        </span>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src="/polyps/report-more.svg" alt="" style={{ width: 16, height: 4, display: 'block' }} />
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Vertical paired bars (By Number / Detected/Retrieved By Time) ───────────
// Each month gets a column with two bars side-by-side: detected (blue) +
// retrieved (red). Value labels float above each bar. Months sit centred
// below their column. Figma node 15861:4073.

export type VerticalBar = { detected: number; retrieved: number };

export function VerticalPairedBarsCard({
  title,
  data,
  months,
  legend,
}: {
  title: string;
  data: VerticalBar[];
  months: string[];
  legend: { color: string; label: string }[];
}) {
  // Bars are sized relative to the largest single value across the dataset so
  // the tallest bar fills ~80 % of the chart area (matches Figma proportions).
  const max = Math.max(...data.flatMap((d) => [d.detected, d.retrieved]));
  const PLOT_H = 168; // visual plot height (Figma 167–187 px range, clamped 80%)
  const bar = (v: number) => Math.round((v / max) * PLOT_H * 0.95);
  return (
    <CardShell title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
        {/* Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px', height: 200 }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, lineHeight: 1.4, color: SOFTER }}>{d.detected}</span>
                <div style={{ width: 15, height: bar(d.detected), borderRadius: '1px 1px 0 0', backgroundColor: legend[0].color }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, lineHeight: 1.4, color: SOFTER }}>{d.retrieved}</span>
                <div style={{ width: 15, height: bar(d.retrieved), borderRadius: '1px 1px 0 0', backgroundColor: legend[1]?.color ?? legend[0].color }} />
              </div>
            </div>
          ))}
        </div>
        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px', width: '100%', boxSizing: 'border-box' }}>
          {months.map((m) => (
            <span key={m} style={{ width: 64, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>
              {m}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {legend.map((l, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: l.color }} />
            <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: BASE_TEXT, whiteSpace: 'nowrap' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

// ── Donut chart card (By Size — Pie) — Figma 15861:1511 ──────────────────────
// Sequential blue palette + grey for "Not specified". 240×240 donut on the
// left, vertical legend list on the right. Colour tokens come straight from
// the Figma variables:
//   chart/dataset-01/point/100 #2683d1  (largest segment, primary)
//   chart/dataset-01/point/200 #4d9fe3
//   chart/dataset-01/point/300 #8bc0ee
//   chart/dataset-01/point/400 #c1dcf6
//   chart/no-data/base         #768190  ("Not specified")
const PIE_PRIMARY = '#2683d1';
const PIE_200 = '#4d9fe3';
const PIE_300 = '#8bc0ee';
const PIE_400 = '#c1dcf6';
const PIE_GREY = '#768190';

export type PieSegment = { value: number; label: string; color: string };

// The donut's render order differs from the legend's display order. In Figma
// the donut is drawn clockwise starting at 12 o'clock as:
//   15% (10–20 mm) → 15% (5–10 mm) → 55% (<5 mm) → 5% (Not specified) → 10% (>20 mm)
// while the legend below the chart is sorted largest → smallest with "Not
// specified" last. Hence two arrays.
export function DonutChartCard({
  title,
  renderSegments,
  legendSegments,
}: {
  title: string;
  renderSegments: PieSegment[];
  legendSegments: PieSegment[];
}) {
  // SVG arcs — start at 12 o'clock (−π/2) and sweep clockwise. Outer radius
  // 120, inner 70 → 50-px-wide ring (matches Figma proportions).
  const total = renderSegments.reduce((s, p) => s + p.value, 0);
  const R_OUTER = 120;
  const R_INNER = 70;
  const C = 130;
  let acc = 0;
  const arcs = renderSegments.map((s) => {
    const startAngle = (acc / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((acc + s.value) / total) * 2 * Math.PI - Math.PI / 2;
    acc += s.value;
    const large = s.value / total > 0.5 ? 1 : 0;
    const x1 = C + R_OUTER * Math.cos(startAngle);
    const y1 = C + R_OUTER * Math.sin(startAngle);
    const x2 = C + R_OUTER * Math.cos(endAngle);
    const y2 = C + R_OUTER * Math.sin(endAngle);
    const x3 = C + R_INNER * Math.cos(endAngle);
    const y3 = C + R_INNER * Math.sin(endAngle);
    const x4 = C + R_INNER * Math.cos(startAngle);
    const y4 = C + R_INNER * Math.sin(startAngle);
    const d = [
      `M ${x1} ${y1}`,
      `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');
    return { d, color: s.color };
  });
  return (
    <CardShell title={title}>
      <div style={{ display: 'flex', flex: '1 1 0', gap: 24, alignItems: 'center', minHeight: 0, padding: '0 16px', overflow: 'hidden' }}>
        <svg width={240} height={240} viewBox="0 0 260 260" style={{ flexShrink: 0, display: 'block' }} aria-hidden>
          {arcs.map((a, i) => (
            <path key={i} d={a.d} fill={a.color} />
          ))}
        </svg>
        <div style={{ display: 'flex', flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', gap: 12, minWidth: 0 }}>
          {legendSegments.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: BASE_TEXT, whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

// By Size donut data — Figma 15861:1511. Render order matches the on-screen
// clockwise sweep; legend order is largest → smallest + grey last.
export const BY_SIZE_PIE_RENDER: PieSegment[] = [
  { value: 15, label: '15% of 10-20 mm', color: PIE_300 },
  { value: 15, label: '15% of 5-10 mm',  color: PIE_200 },
  { value: 55, label: '55% of <5 mm',    color: PIE_PRIMARY },
  { value: 5,  label: '5% Not specified', color: PIE_GREY },
  { value: 10, label: '10% of >20 mm',   color: PIE_400 },
];
export const BY_SIZE_PIE_LEGEND: PieSegment[] = [
  { value: 55, label: '55% of <5 mm',    color: PIE_PRIMARY },
  { value: 15, label: '15% of 5-10 mm',  color: PIE_200 },
  { value: 15, label: '15% of 10-20 mm', color: PIE_300 },
  { value: 10, label: '10% of >20 mm',   color: PIE_400 },
  { value: 5,  label: '5% Not specified', color: PIE_GREY },
];

// ── By Type — grouped data table (Figma 15861:4081 / 1512) ─────────────────
// First column "Type" wide, then "Procedures", then a 3-sub-column "Detected
// polyps" group with sizes (<5 mm / 5-20 mm / >20 mm), then "Retrieved
// polyps". A second header row shows the sub-columns under "Detected polyps";
// in the Figma frame this is achieved by giving the three sub columns their
// own small headers (<5 mm / 5-20 mm / >20 mm) and giving the grouped column
// a single wider header — we render it linearly here since the Hi-Fi view is
// shown scaled down.

type ByTypeRow = { type: string; procedures: number; det5: number; det520: number; det20: number; retrieved: number };

const BY_TYPE_DATA: ByTypeRow[] = [
  { type: 'Pedunculated (Ip)',     procedures: 1, det5: 1, det520: 1, det20: 1, retrieved: 1 },
  { type: 'Semi-Pedunculated (Isp)', procedures: 1, det5: 1, det520: 1, det20: 1, retrieved: 1 },
  { type: 'Sessile (Is)',          procedures: 1, det5: 1, det520: 1, det20: 1, retrieved: 1 },
  { type: 'Flat elevated (IIa)',   procedures: 1, det5: 1, det520: 1, det20: 1, retrieved: 1 },
  { type: 'Completely flat (IIb)', procedures: 1, det5: 1, det520: 1, det20: 1, retrieved: 1 },
  { type: 'Excavated (III)',       procedures: 1, det5: 1, det520: 1, det20: 1, retrieved: 1 },
  { type: 'Not specified ',        procedures: 1, det5: 1, det520: 1, det20: 1, retrieved: 1 },
];
const BY_TYPE_TOTAL: ByTypeRow = { type: 'Total', procedures: 7, det5: 7, det520: 7, det20: 7, retrieved: 7 };

function cellRowStyle(): React.CSSProperties {
  return { display: 'flex', alignItems: 'stretch', width: '100%', borderBottom: `1px solid ${DIVIDER}` };
}
function leftCell(label: string, bold = false): React.CSSProperties & { children?: React.ReactNode } {
  return {
    flex: '0 0 328px',
    width: 328,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    boxSizing: 'border-box',
    fontFamily: FONT,
    fontWeight: bold ? 600 : 400,
    fontSize: 12,
    lineHeight: 1.4,
    color: BASE_TEXT,
    whiteSpace: 'nowrap',
  } as React.CSSProperties;
}
function rightCell(width: number, bold = false): React.CSSProperties {
  return {
    flex: `0 0 ${width}px`,
    width,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 16px',
    boxSizing: 'border-box',
    fontFamily: FONT,
    fontWeight: bold ? 600 : 400,
    fontSize: 12,
    lineHeight: 1.4,
    color: BASE_TEXT,
    whiteSpace: 'nowrap',
  };
}
function headerCell(width: number, align: 'left' | 'right' = 'right', extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    flex: `0 0 ${width}px`,
    width,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
    padding: '0 16px',
    boxSizing: 'border-box',
    backgroundColor: HEADER_BG,
    fontFamily: FONT,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 1.4,
    color: BASE_TEXT,
    whiteSpace: 'nowrap',
    ...extra,
  };
}

export function ByTypeTable() {
  return (
    <CardShell title="Polyps by Type (Paris Classification)">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Header row — Type | Procedures | Detected (<5mm | 5-20mm | >20mm) | Retrieved */}
        <div style={cellRowStyle()}>
          <div style={{ ...headerCell(328, 'left'), borderRight: '1px solid #ffffff' }}>Type</div>
          <div style={{ ...headerCell(126), borderRight: '1px solid #ffffff' }}>Procedures</div>
          <div style={headerCell(126)}>Detected Polyps:</div>
          <div style={headerCell(80)}>&lt;5 mm</div>
          <div style={headerCell(80)}>5-20 mm</div>
          <div style={{ ...headerCell(80), borderRight: '1px solid #ffffff' }}>&gt;20 mm</div>
          <div style={{ ...headerCell(126), borderLeft: '1px solid #ffffff' }}>Retrieved polyps</div>
        </div>
        {BY_TYPE_DATA.map((r, i) => (
          <div key={i} style={cellRowStyle()}>
            <div style={leftCell(r.type)}>{r.type}</div>
            <div style={rightCell(126)}>{r.procedures}</div>
            <div style={rightCell(126)}>{r.det5}</div>
            <div style={rightCell(80)}>{r.det520}</div>
            <div style={rightCell(80)}>{r.det20}</div>
            <div style={rightCell(80)}>{r.det20}</div>
            <div style={rightCell(126)}>{r.retrieved}</div>
          </div>
        ))}
        <div style={cellRowStyle()}>
          <div style={leftCell(BY_TYPE_TOTAL.type, true)}>{BY_TYPE_TOTAL.type}</div>
          <div style={rightCell(126, true)}>{BY_TYPE_TOTAL.procedures}</div>
          <div style={rightCell(126, true)}>{BY_TYPE_TOTAL.det5}</div>
          <div style={rightCell(80, true)}>{BY_TYPE_TOTAL.det520}</div>
          <div style={rightCell(80, true)}>{BY_TYPE_TOTAL.det20}</div>
          <div style={rightCell(80, true)}>{BY_TYPE_TOTAL.det20}</div>
          <div style={rightCell(126, true)}>{BY_TYPE_TOTAL.retrieved}</div>
        </div>
      </div>
    </CardShell>
  );
}

// ── Updated data sets for the existing horizontal BarChartCard ───────────────
// LOCATION_DATA values come straight from Figma 15861:4074 (Cecum/Ilium
// 105/95, Ascending 75/60, Transverse 152/150, Descending 45/35, Sigmoid
// 100/95, Rectum 25/15, Not Specified 10/5).

// (Re-exported palette colours so the Hi-Fi sheet can share the dashboard's
// dataset hues without re-importing both modules everywhere.)
export { DETECTED, RETRIEVED } from './polyps/PolypsDashboard';

// Third dataset colour — chart/dataset-03/point/100, used by "Resected polyps"
// in the By Resection Method chart.
export const RESECTED = '#f7c80d';

import { DETECTED as D, RETRIEVED as R } from './polyps/PolypsDashboard';
const Y = RESECTED;

export const LOCATION_DATA_HIFI = [
  { label: 'Cecum and Ilium',  bars: [{ w: 165,   v: '105', c: D }, { w: 142.5, v: '95',  c: R }] },
  { label: 'Ascending Colon',  bars: [{ w: 112.5, v: '75',  c: D }, { w: 90,    v: '60',  c: R }] },
  { label: 'Transverse Colon', bars: [{ w: 247.5, v: '152', c: D }, { w: 240,   v: '150', c: R }] },
  { label: 'Descending Colon', bars: [{ w: 67.5,  v: '45',  c: D }, { w: 52.5,  v: '35',  c: R }] },
  { label: 'Sigmoid Colon',    bars: [{ w: 157.5, v: '100', c: D }, { w: 142.5, v: '95',  c: R }] },
  { label: 'Rectum',           bars: [{ w: 37.5,  v: '25',  c: D }, { w: 22.5,  v: '15',  c: R }] },
  { label: 'Not Specified',    bars: [{ w: 15,    v: '10',  c: D }, { w: 7.5,   v: '5',   c: R }] },
];

// By Number — paired vertical bars for 6 months (Figma 15861:4073).
export const BY_NUMBER_MONTHS = ['May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024'];
export const BY_NUMBER_DATA: VerticalBar[] = [
  { detected: 75, retrieved: 72 },
  { detected: 82, retrieved: 79 },
  { detected: 80, retrieved: 74 },
  { detected: 83, retrieved: 81 },
  { detected: 77, retrieved: 76 },
  { detected: 73, retrieved: 72 },
];

// ── Histogram card — "Detected Polyps by Size" (Figma 15861:4077) ──────────
// Vertical single-colour bars 1→20 mm wide, Y-axis 0%-50% with 10% gridlines,
// "Percentage" rotated label, "Size in mm" axis label.

export function HistogramCard({
  title,
  values,
  color,
  maxPct = 50,
  yStep = 10,
  xLabel = 'Size in mm',
  yLabel = 'Percentage',
}: {
  title: string;
  values: number[];          // one percentage per bar (e.g. 1..20)
  color: string;
  maxPct?: number;
  yStep?: number;
  xLabel?: string;
  yLabel?: string;
}) {
  const ticks: number[] = [];
  for (let v = maxPct; v >= 0; v -= yStep) ticks.push(v);
  const PLOT_H = 200;
  return (
    <CardShell title={title}>
      <div style={{ display: 'flex', flex: '1 1 0', minHeight: 0 }}>
        {/* Rotated y-axis title */}
        <div style={{ width: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>{yLabel}</span>
        </div>
        {/* Plot area + axis labels */}
        <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: '1 0 0', position: 'relative' }}>
            {/* Gridlines + Y labels */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {ticks.map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                  <span style={{ width: 32, textAlign: 'right', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>{t}%</span>
                  <div style={{ flex: '1 0 0', height: 1, backgroundColor: DIVIDER }} />
                </div>
              ))}
            </div>
            {/* Bars layer — sits over the gridlines, plot inset matches the
                32-px y-label + 12-px gap on the left. */}
            <div style={{ position: 'absolute', left: 44, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 8px' }}>
              {values.map((v, i) => (
                <div
                  key={i}
                  style={{
                    width: `calc((100% - ${(values.length - 1) * 6}px) / ${values.length})`,
                    height: `${Math.min(100, (v / maxPct) * 100)}%`,
                    borderRadius: '1px 1px 0 0',
                    backgroundColor: color,
                    minHeight: v > 0 ? 1 : 0,
                  }}
                />
              ))}
            </div>
          </div>
          {/* X axis labels + axis title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingLeft: 44, paddingRight: 8, boxSizing: 'border-box' }}>
              {values.map((_, i) => (
                <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 10, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>
                  {i + 1}
                </span>
              ))}
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>{xLabel}</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

// Histogram data 1→20 mm (placeholder estimates derived from the Figma
// screenshot; will swap to exact values when 15861:4077 metrics are read).
export const BY_SIZE_HISTOGRAM = [4, 13, 28, 40, 42, 32, 22, 16, 12, 9, 7, 5, 4, 3, 2.5, 2, 2, 1.5, 1.5, 1];
export const HISTOGRAM_BLUE = '#2683d1';

// ── Time-of-Day donut palettes (Figma 15861:4079 / 4080) ────────────────────
// 3-segment donuts: AM (primary), PM (lighter), Not specified (grey). The two
// charts share the same shape but use a blue palette (Detected) and red
// palette (Retrieved) respectively.

const RED_PRIMARY = '#eb4850';   // chart/dataset-02/point/100
const RED_LIGHT = '#f49fa3';     // lighter red for PM

// Detected Polyps by Time of the Day — Figma 15861:4079.
export const DETECTED_TIME_PIE_RENDER: PieSegment[] = [
  // Clockwise from 12 o'clock: AM (large) → Not specified (small) → PM.
  // The Figma image shows the dark-blue AM occupying the bottom-right half,
  // with the lighter PM slice on the top-left and the grey wedge between
  // them at ~9-10 o'clock.
  { value: 55, label: '55% AM',             color: PIE_PRIMARY },
  { value: 5,  label: '5% Not specified',   color: PIE_GREY },
  { value: 40, label: '40% PM',             color: PIE_300 },
];
export const DETECTED_TIME_PIE_LEGEND: PieSegment[] = [
  { value: 55, label: '55% AM',           color: PIE_PRIMARY },
  { value: 40, label: '40% PM',           color: PIE_300 },
  { value: 5,  label: '5% Not specified', color: PIE_GREY },
];

// Retrieved Polyps by Time of the Day — Figma 15861:4080.
export const RETRIEVED_TIME_PIE_RENDER: PieSegment[] = [
  { value: 60, label: '60% AM',           color: RED_PRIMARY },
  { value: 3,  label: '3% Not specified', color: PIE_GREY },
  { value: 37, label: '37% PM',           color: RED_LIGHT },
];
export const RETRIEVED_TIME_PIE_LEGEND: PieSegment[] = [
  { value: 60, label: '60% AM',           color: RED_PRIMARY },
  { value: 37, label: '37% PM',           color: RED_LIGHT },
  { value: 3,  label: '3% Not specified', color: PIE_GREY },
];

// ── Option 2 — full-width tables ───────────────────────────────────────────
// By Resection Method (Figma 15861:1513): Method | Procedures | Resected polyps |
// Partially retrieved polyps | Fully retrieved polyps.
export const BY_RESECTION_TABLE_COLS = [
  { label: 'Method',                       align: 'left' as const, flex: true },
  { label: 'Procedures',                   align: 'right' as const, width: 140 },
  { label: 'Resected polyps',              align: 'right' as const, width: 160 },
  { label: 'Partially retrieved polyps',   align: 'right' as const, width: 200 },
  { label: 'Fully retrieved polyps',       align: 'right' as const, width: 180 },
];
export const BY_RESECTION_TABLE_ROWS: string[][] = [
  ['Polypectomy',                                 '1', '2', '1', '1'],
  ['Mucosectomy (EMR)',                           '1', '2', '1', '1'],
  ['Endoscopic submucosal dissection (ESD)',      '1', '2', '1', '1'],
  ['Endoscopic full thickness resection (EFTR)',  '1', '2', '1', '1'],
  ['Endoscopic intermuscular resection (EID)',    '1', '2', '1', '1'],
  ['Not specified',                               '1', '2', '1', '1'],
];
export const BY_RESECTION_TABLE_TOTAL = ['Total', '6', '12', '6', '6'];

// By Time (Figma 15861:1514): Time | Procedures | Detected polyps | Resected
// polyps | Retrieved polyps. Two rows (AM, PM).
export const BY_TIME_TABLE_COLS = [
  { label: 'Time',              align: 'left' as const, flex: true },
  { label: 'Procedures',        align: 'right' as const, width: 140 },
  { label: 'Detected polyps',   align: 'right' as const, width: 160 },
  { label: 'Resected polyps',   align: 'right' as const, width: 160 },
  { label: 'Retrieved polyps',  align: 'right' as const, width: 160 },
];
export const BY_TIME_TABLE_ROWS: string[][] = [
  ['AM', '1', '1', '1', '1'],
  ['PM', '1', '1', '1', '1'],
];

// By Resection Method — horizontal paired bars (Figma 15861:4076).
// Two series per row, BUT the first dataset is YELLOW ("Resected polyps",
// chart/dataset-03) and the second is RED ("Retrieved polyps", chart/
// dataset-02) — NOT blue + red like the other 2-Up charts.
export const BY_RESECTION_HIFI = [
  { label: 'Polypectomy',                                bars: [{ w: 176,   v: '108', c: Y }, { w: 159,   v: '106', c: R }] },
  { label: 'Mucosectomy (EMR)',                          bars: [{ w: 112.5, v: '67',  c: Y }, { w: 90,    v: '59',  c: R }] },
  { label: 'Endoscopic submucosal dissection (ESD)',     bars: [{ w: 246,   v: '164', c: Y }, { w: 240,   v: '159', c: R }] },
  { label: 'Endoscopic full thickness resection (EFTR)', bars: [{ w: 57,    v: '42',  c: Y }, { w: 52.5,  v: '34',  c: R }] },
  { label: 'Endoscopic intermuscular resection (EID)',   bars: [{ w: 154.5, v: '103', c: Y }, { w: 142.5, v: '94',  c: R }] },
  { label: 'Not Specified',                              bars: [{ w: 10.5,  v: '7',   c: Y }, { w: 7.5,   v: '5',   c: R }] },
];

// Legend pair for the By Resection Method chart — yellow swatch first
// ("Resected polyps"), then red ("Retrieved polyps").
export const BY_RESECTION_LEGEND = [
  { color: Y, label: 'Resected polyps' },
  { color: R, label: 'Retrieved polyps' },
];
