// Recreation of the OLYSENSE Insights "Polyp Detection Rate" dashboard
// (Figma: Polyps-Redesign, node 12413:4899). Built section by section from the
// Figma spec — exact typography, colors, spacing. Fluid/responsive: the menu
// stays fixed width and the content column flexes. Self-contained scroll area.

import { useState, forwardRef } from 'react';

const FONT = "'Noto Sans', sans-serif";

// Hover affordances. Nav items preview the selected-state tint (#e6f0fe, a real
// design token) on hover; !important is needed to beat the inline idle fills.
const HOVER_CSS = `
  .polyps-nav-item:hover,
  .polyps-nav-subitem:hover { background-color: #e6f0fe !important; }
  .polyps-ghost-btn:hover { background-color: rgba(15,17,19,0.06); }
  .polyps-select:hover { border-color: #546274 !important; }
  .polyps-iconbtn:hover { background-color: rgba(15,17,19,0.06); }
  .polyps-tab:hover .polyps-tab-label { color: #0068f0 !important; }
  @keyframes polyps-tip-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  /* Chart-content fade when the active tab changes — the keyed wrapper
     remounts on tab flip and plays this from frame 0. */
  @keyframes polyps-tab-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
`;

// ── Design tokens (resolved from the Figma variable system) ──────────────────
const C = {
  blue500: '#004eb4', // brand bar
  white: '#ffffff',
  label: '#f9fafc', // text/label (on accent)
  divider: '#ebedf1',
};

// ── Top application bar ──────────────────────────────────────────────────────
// node I12413:4900 — OS-level app bar, sticky to top.
export function OlysenseBar() {
  return (
    <div
      style={{
        backgroundColor: C.blue500,
        height: 64,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Application name */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <img src="/polyps/olysense-logo.svg" alt="OlySense" style={{ width: 148.29, height: 16, display: 'block' }} />
          <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 20, lineHeight: 1.4, color: C.white, whiteSpace: 'nowrap' }}>
            Insights
          </span>
        </div>
        {/* Utilities */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, lineHeight: 1.5, color: C.label, whiteSpace: 'nowrap', textAlign: 'right' }}>
              Dr. Jill Lopez M.D.
            </span>
            <img src="/polyps/user-settings.svg" alt="" style={{ width: 16, height: 16, display: 'block' }} />
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: C.divider }} />
          <img src="/polyps/app-switcher.svg" alt="" style={{ width: 24, height: 24, display: 'block' }} />
        </div>
      </div>
    </div>
  );
}

// ── Sidebar menu (264px) ── node 12413:4902 ──────────────────────────────────
const MENU_IDLE = '#1f2124'; // text/menu/idle + active + selected all resolve here
const MENU_SELECTED_BG = '#e6f0fe'; // background/menu/selected
export const PAGE_BG = '#f9fafc'; // background/page (sub-item idle fill in spec)

// Sub-items under "Procedures". Per the Figma spec every sub-item except the
// first carries the page-bg fill; the first ("Over Time") is transparent.
const SUB_ITEMS = [
  'Over Time',
  'By Exam Type',
  'By Procedure Type',
  'Bowel Preparation',
  'Cecal Intubation Rate',
  'Withdrawal Time',
  'Procedure Duration',
  'Total Endoscope Time',
  'Retroflexion Detection',
];

function NavTop({ icon, iconSize, label, weight, selected, chevron, chevronOpen, onClick }: {
  icon: string; iconSize: number; label: string; weight: number; selected?: boolean; chevron?: boolean; chevronOpen?: boolean; onClick?: () => void;
}) {
  return (
    <div
      className={selected ? undefined : 'polyps-nav-item'}
      onClick={onClick}
      style={{
        display: 'flex', gap: 12, height: 32, alignItems: 'center', padding: '0 12px',
        borderRadius: 4, boxSizing: 'border-box', cursor: 'pointer',
        backgroundColor: selected ? MENU_SELECTED_BG : 'transparent',
        transition: 'background-color 0.15s ease',
      }}
    >
      <span style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={icon} alt="" style={{ width: iconSize, height: iconSize, display: 'block' }} />
      </span>
      <span style={{ flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: weight, fontSize: 14, lineHeight: 1.5, color: MENU_IDLE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {chevron && (
        // 16px slot; arrow drawn at its natural 12×6.29 aspect (the SVG is
        // preserveAspectRatio="none", so sizing it square would distort it).
        // Points down when open, rotates to point right when collapsed.
        <span style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease', transform: chevronOpen ? 'none' : 'rotate(-90deg)' }}>
          <img src="/polyps/nav-chevron-down.svg" alt="" style={{ width: 12, height: 6.29, display: 'block' }} />
        </span>
      )}
    </div>
  );
}

function Menu() {
  const [proceduresOpen, setProceduresOpen] = useState(false);
  return (
    <div style={{ width: 264, flexShrink: 0, boxSizing: 'border-box', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 8, borderRadius: 4 }}>
      <NavTop icon="/polyps/nav-dashboard.svg" iconSize={16} label="Dashboard" weight={600} />
      <NavTop icon="/polyps/nav-procedures.svg" iconSize={24} label="Procedures" weight={600} chevron chevronOpen={proceduresOpen} onClick={() => setProceduresOpen((o) => !o)} />
      {/* Sub-items — smooth collapse/expand (height + opacity). marginTop cancels
          the extra flex gap when collapsed so Procedures/Polyps stay 8px apart. */}
      <div
        style={{
          display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden',
          maxHeight: proceduresOpen ? 360 : 0,
          opacity: proceduresOpen ? 1 : 0,
          marginTop: proceduresOpen ? 0 : -8,
          transition: 'max-height 0.3s ease, opacity 0.25s ease, margin-top 0.3s ease',
        }}
      >
        {SUB_ITEMS.map((label, i) => (
          <div
            key={label}
            className="polyps-nav-subitem"
            style={{
              display: 'flex', height: 32, alignItems: 'center', paddingLeft: 48, paddingRight: 16,
              borderRadius: 4, boxSizing: 'border-box', cursor: 'pointer', flexShrink: 0,
              backgroundColor: i === 0 ? 'transparent' : PAGE_BG,
              transition: 'background-color 0.15s ease',
            }}
          >
            <span style={{ flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: MENU_IDLE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <NavTop icon="/polyps/nav-findings.svg" iconSize={16} label="Polyps" weight={600} selected />
    </div>
  );
}

// ── Content header ── node 12413:4904 ────────────────────────────────────────
function GhostButton({ icon, iconW, iconH, label }: { icon: string; iconW: number; iconH: number; label: string }) {
  return (
    <div className="polyps-ghost-btn" style={{ display: 'flex', gap: 4, height: 48, alignItems: 'center', padding: '12px 16px', borderRadius: 4, boxSizing: 'border-box', cursor: 'pointer', transition: 'background-color 0.15s ease' }}>
      <span style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={icon} alt="" style={{ width: iconW, height: iconH, display: 'block' }} />
      </span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, lineHeight: 1.5, color: '#0f1113', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

export function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
      <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, lineHeight: 1.4, color: '#393f4c', whiteSpace: 'nowrap', margin: 0 }}>Polyps</p>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <GhostButton icon="/polyps/icon-filter.svg" iconW={18} iconH={16.2} label="Filters" />
        <div style={{ width: 1, height: 16, backgroundColor: '#0f1113' }} />
        <GhostButton icon="/polyps/icon-export.svg" iconW={16} iconH={16} label="Export" />
      </div>
    </div>
  );
}

// ── Controls ── node 12413:4914 ──────────────────────────────────────────────
export function Controls() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 8, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* Data source select (184px) */}
      <div style={{ width: 184, display: 'flex', alignItems: 'center' }}>
        <div
          className="polyps-select"
          style={{
            flex: '1 0 0', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#ffffff', border: '1px solid #9da5b7', borderRadius: 6, padding: '8px 12px',
            boxSizing: 'border-box', cursor: 'pointer', transition: 'border-color 0.15s ease',
          }}
        >
          <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: '#0f1113', whiteSpace: 'nowrap' }}>Last 6 months</span>
          <img src="/polyps/select-chevron.svg" alt="" style={{ width: 24, height: 24, display: 'block', flexShrink: 0 }} />
        </div>
      </div>
      {/* Data info */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingRight: 6 }}>
        <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.4, color: '#546274', whiteSpace: 'nowrap', textAlign: 'right' }}>Data updated just now</span>
      </div>
    </div>
  );
}

// ── Full-size report (tabs + title + KPIs + PDR line chart) ── node 12413:4921 ─
const SOFT = '#393f4c'; // text/soft
const SOFTER = '#546274'; // text/softer (axis labels)
const GRID = '#ebedf1'; // border/base
const DIVIDER = '#d8dbe2'; // border/divider
const SELECTED = '#0068f0'; // interactive/selected
const CARD_SHADOW = '0px 1px 1.5px rgba(0,0,0,0.08), 0px 1px 1px rgba(0,0,0,0.04)';
const GRID_PCTS = ['100%', '80%', '60%', '40%', '20%'];
const MONTHS = ['May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024'];
// Per-tab report config. Dot centres are derived from each line's path
// (x% = pathX/878.322; top% = 0.75 + (pathY/viewBoxH)·46.75 within the line box),
// so each dot lands on its line's bend. August tooltip values are exact from
// Figma; other months are illustrative (rate read off the line).
type Dot = { left: number; top: number };
type EsgeLine = { label: string; bg: string; line: string; chartTop: number };
type MonthCard = { month: string; primary: string[]; secondary: string[] };
type ReportConfig = {
  title: string; descPre: string; descPost: string;
  kpiMain: { value: string; label: string };
  kpiRow: { value: string; label: string }[];
  line: string; area: string; boxTop: number; boxHeight: number;
  dots: Dot[]; esge: EsgeLine[]; months: MonthCard[];
};
// Shared secondary tooltip metrics (same fields in both reports).
const sec = (bowel: number, cecal: number, withdrawal: string) => [
  `${bowel}% Adequate Bowel Preparation Rate`, `${cecal}% Cecal Intubation Rate`, `${withdrawal} Average Withdrawal Time`,
];

const PDR_CFG: ReportConfig = {
  title: 'Polyp Detection Rate',
  descPre: 'The percentage of colonoscopies in patients aged 50 years or older in which at least one polyp was identified. ',
  descPost: ' Emergency colonoscopy; endoscopy with a specific therapeutic indication, including work-up of a previously detected lesion or follow-up of disease activity in inflammatory bowel disease.',
  kpiMain: { value: '52%', label: 'of colonoscopies with ≥1 polyp identified.' },
  kpiRow: [{ value: '160', label: 'Total Procedures' }, { value: '89', label: 'Procedures with ≥1 polyp identified' }],
  // boxHeight = 0%-line (316) − boxTop, so the area fill bottoms exactly on the 0% gridline.
  line: '/polyps/pdr-line.svg', area: '/polyps/pdr-area.svg', boxTop: 123, boxHeight: 193,
  dots: [
    { left: 7.26, top: 24.74 }, { left: 24.48, top: 1.23 }, { left: 41.54, top: 13.96 },
    { left: 58.65, top: 47.02 }, { left: 75.70, top: 17.39 }, { left: 92.87, top: 19.60 },
  ],
  esge: [{ label: '40% ESGE', bg: '#1f2124', line: '/polyps/esge-line.svg', chartTop: 192 }],
  months: [
    { month: 'May 2024', primary: ['46% Polyp Detection Rate', '24 Total procedures', '12 Procedures with ≥1 polyp'], secondary: sec(82, 80, '11m 45s') },
    { month: 'Jun 2024', primary: ['60% Polyp Detection Rate', '30 Total procedures', '19 Procedures with ≥1 polyp'], secondary: sec(86, 83, '12m 50s') },
    { month: 'Jul 2024', primary: ['53% Polyp Detection Rate', '31 Total procedures', '17 Procedures with ≥1 polyp'], secondary: sec(85, 82, '12m 20s') },
    { month: 'Aug 2024', primary: ['32% Polyp Detection Rate', '20 Total procedures', '8 Procedures with ≥1 polyp'], secondary: sec(84, 81, '12m 30s') },
    { month: 'Sep 2024', primary: ['50% Polyp Detection Rate', '29 Total procedures', '17 Procedures with ≥1 polyp'], secondary: sec(83, 82, '12m 05s') },
    { month: 'Oct 2024', primary: ['49% Polyp Detection Rate', '26 Total procedures', '16 Procedures with ≥1 polyp'], secondary: sec(85, 80, '11m 55s') },
  ],
};

const PRR_CFG: ReportConfig = {
  title: 'Polyp Retrieval Rate',
  descPre: 'The percentage of polyps removed that were retrieved for histopathology. ',
  descPost: ' Removal of diminutive polyps ( ≤ 5 mm.)',
  kpiMain: { value: '92%', label: 'of polyps retrieved for histopathology' },
  kpiRow: [{ value: '160', label: 'Total Procedures' }, { value: '128', label: 'Total retrieved polyps' }],
  // boxTop 14 + boxHeight 302 = 316 → area bottoms exactly on the 0% gridline.
  line: '/polyps/prr-line.svg', area: '/polyps/prr-area.svg', boxTop: 14, boxHeight: 302,
  dots: [
    { left: 7.26, top: 24.74 }, { left: 24.48, top: 1.08 }, { left: 41.54, top: 13.90 },
    { left: 58.65, top: 47.18 }, { left: 75.70, top: 17.35 }, { left: 92.87, top: 19.57 },
  ],
  esge: [
    { label: '95% ESGE', bg: '#02850f', line: '/polyps/prr-esge-95.svg', chartTop: 18 },
    { label: '90% ESGE', bg: '#1f2124', line: '/polyps/prr-esge-90.svg', chartTop: 34 },
  ],
  months: [
    { month: 'May 2024', primary: ['73% Polyp Retrieval Rate', '24 Polypectomies of polyps ≤ 5mm', '20 Retrieved polyps'], secondary: sec(82, 80, '11m 45s') },
    { month: 'Jun 2024', primary: ['95% Polyp Retrieval Rate', '31 Polypectomies of polyps ≤ 5mm', '29 Retrieved polyps'], secondary: sec(86, 83, '12m 50s') },
    { month: 'Jul 2024', primary: ['83% Polyp Retrieval Rate', '29 Polypectomies of polyps ≤ 5mm', '24 Retrieved polyps'], secondary: sec(85, 82, '12m 20s') },
    { month: 'Aug 2024', primary: ['86% Polyp Retrieval Rate', '27 Polypectomies of polyps ≤ 5mm', '23 Retrieved polyps'], secondary: sec(84, 81, '12m 30s') },
    { month: 'Sep 2024', primary: ['80% Polyp Retrieval Rate', '28 Polypectomies of polyps ≤ 5mm', '22 Retrieved polyps'], secondary: sec(83, 82, '12m 05s') },
    { month: 'Oct 2024', primary: ['78% Polyp Retrieval Rate', '25 Polypectomies of polyps ≤ 5mm', '20 Retrieved polyps'], secondary: sec(85, 80, '11m 55s') },
  ],
};

function Tab({ label, selected, hovered = false, onClick }: { label: string; selected: boolean; hovered?: boolean; onClick: () => void }) {
  // `hovered` is a programmatic hover (used by square 5's animated cursor,
  // which can't trigger the real :hover); it tints the label a lighter grey,
  // leaving the underline alone like a real hover.
  return (
    <div className="polyps-tab" onClick={onClick} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', paddingTop: 8, cursor: 'pointer' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0 12px' }}>
        <span className="polyps-tab-label" style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, lineHeight: 1.5, color: selected ? SELECTED : hovered ? '#8e95a1' : SOFT, textAlign: 'center', whiteSpace: 'nowrap', transition: 'color 0.15s ease' }}>{label}</span>
      </div>
      <div style={{ height: 1, width: '100%', backgroundColor: selected ? SELECTED : DIVIDER, transition: 'background-color 0.2s ease' }} />
    </div>
  );
}

// A KPI segment: bold number/value + regular trailing label.
function Kpi({ value, valueSize, label }: { value: string; valueSize: number; label: string }) {
  return (
    <p style={{ margin: 0, color: SOFT }}>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: valueSize, lineHeight: 1.4 }}>{value}</span>
      <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.4 }}>{' ' + label}</span>
    </p>
  );
}

export function FullSizeReport({
  lockedTab,
  hideTabs = false,
  hoveredTab = null,
}: { lockedTab?: 0 | 1; hideTabs?: boolean; hoveredTab?: 0 | 1 | null } = {}) {
  // `lockedTab` (when set) is a CONTROLLED value — every render reflects the
  // current prop, so a parent can drive the active tab via state or a
  // setTimeout (e.g. the Hi-Fi compare carousel switches PDR → PRR after the
  // cursor click). When `lockedTab` is undefined the card behaves
  // uncontrolled and remembers the user's last click.
  const [internalTab, setInternalTab] = useState(0);
  const tab = lockedTab ?? internalTab;
  const setTab = setInternalTab;
  const showTabs = !hideTabs;
  const [hoverDot, setHoverDot] = useState<number | null>(null);
  const cfg = tab === 0 ? PDR_CFG : PRR_CFG;
  const selectTab = (i: number) => { setTab(i); setHoverDot(null); };

  return (
    <div style={{ backgroundColor: '#ffffff', boxShadow: CARD_SHADOW, display: 'flex', flexDirection: 'column', gap: 16, padding: 16, borderRadius: 8, boxSizing: 'border-box', width: '100%' }}>
      {/* Tabs — hidden when the card is locked to a single metric (Option 2). */}
      {showTabs && (
        <div style={{ borderBottom: `1px solid ${DIVIDER}`, display: 'flex', gap: 12, alignItems: 'center', padding: '0 8px' }}>
          <Tab label="Polyp Detection Rate" selected={tab === 0} hovered={hoveredTab === 0} onClick={() => selectTab(0)} />
          <Tab label="Polyp Retrieval Rate" selected={tab === 1} hovered={hoveredTab === 1} onClick={() => selectTab(1)} />
        </div>
      )}

      {/* Tab content — keyed on `tab` so it re-mounts and plays the
          polyps-tab-fade keyframe whenever the active tab flips. */}
      <div
        key={tab}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', animation: 'polyps-tab-fade 0.35s ease-out' }}
      >
      {/* Header: title + more, description, KPIs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 20, lineHeight: 1.4, color: SOFT, whiteSpace: 'nowrap' }}>{cfg.title}</p>
            <div className="polyps-iconbtn" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, cursor: 'pointer', transition: 'background-color 0.15s ease' }}>
              <img src="/polyps/report-more.svg" alt="" style={{ width: 16, height: 4, display: 'block' }} />
            </div>
          </div>
          <p style={{ margin: 0, maxWidth: 869, fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.4, color: SOFT }}>
            {cfg.descPre}
            <span style={{ fontWeight: 600 }}>ESGE Exclusions</span>
            <img src="/polyps/info-circle.svg" alt="" style={{ width: 14, height: 14, display: 'inline-block', verticalAlign: '-2px', margin: '0 4px' }} />
            <span style={{ fontWeight: 600 }}>:</span>
            {cfg.descPost}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Kpi value={cfg.kpiMain.value} valueSize={20} label={cfg.kpiMain.label} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {cfg.kpiRow.map((k, i) => <Kpi key={i} value={k.value} valueSize={14} label={k.label} />)}
          </div>
        </div>
      </div>

      {/* Chart — fixed 400px height, fluid width. */}
      <div style={{ height: 400, width: '100%', position: 'relative' }}>
        {/* Gridlines + axis labels (responsive HTML) */}
        <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', width: '100%', height: '100%' }}>
          {/* "Percentage" rotated y-title */}
          <div style={{ width: 17, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>Percentage</span>
          </div>
          {/* Gridlines */}
          <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
            {GRID_PCTS.map((pct) => (
              <div key={pct} style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
                <span style={{ width: 32, textAlign: 'right', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>{pct}</span>
                <div style={{ flex: '1 0 0', minWidth: 0, height: 0.952, backgroundColor: GRID }} />
              </div>
            ))}
            {/* 0% row + x-axis labels + legend */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%' }}>
              <span style={{ width: 32, textAlign: 'right', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>0%</span>
              <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', paddingTop: 8 }}>
                <div style={{ height: 1.905, width: '100%', backgroundColor: GRID }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', width: '100%', boxSizing: 'border-box' }}>
                    {MONTHS.map((m) => (
                      <span key={m} style={{ width: 64, textAlign: 'center', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER }}>{m}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', width: '100%', boxSizing: 'border-box' }}>
                    <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFTER, whiteSpace: 'nowrap' }}>Month</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <img src="/polyps/legend-colonoscopy.svg" alt="" style={{ width: 12, height: 12, display: 'block' }} />
                      <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.4, color: SOFT, whiteSpace: 'nowrap' }}>Colonoscopy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line + area + dots overlay — plot starts 61px in (17 + 32 + 12). */}
        <div style={{ position: 'absolute', left: 61, right: 0, top: cfg.boxTop, height: cfg.boxHeight, pointerEvents: 'none' }}>
          <img src={cfg.area} alt="" style={{ position: 'absolute', left: 0, right: 0, top: '0.75%', width: '100%', height: '99.25%', display: 'block' }} />
          <img src={cfg.line} alt="" style={{ position: 'absolute', left: 0, right: 0, top: '0.75%', height: '46.75%', width: '100%', display: 'block' }} />
          {cfg.dots.map((d, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoverDot(i)}
              onMouseLeave={() => setHoverDot((cur) => (cur === i ? null : cur))}
              style={{ position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, transform: `translate(-50%, -50%) scale(${hoverDot === i ? 1.3 : 1})`, width: 10, height: 10, pointerEvents: 'auto', cursor: 'pointer', transition: 'transform 0.12s ease' }}
            >
              <img src="/polyps/data-dot.svg" alt="" style={{ width: 10, height: 10, display: 'block' }} />
            </div>
          ))}
        </div>

        {/* ESGE reference line(s) — aligned to their gridline %. */}
        {cfg.esge.map((e, i) => (
          <div key={i} style={{ position: 'absolute', left: 18, right: 0, top: e.chartTop, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <span style={{ backgroundColor: e.bg, color: '#f9fafc', fontFamily: FONT, fontWeight: 400, fontSize: 10, lineHeight: 1.4, padding: 2, borderRadius: 2, whiteSpace: 'nowrap' }}>{e.label}</span>
            <img src={e.line} alt="" style={{ flex: '1 0 0', minWidth: 0, height: 2, display: 'block' }} />
          </div>
        ))}

        {/* Hover tooltip card — follows the hovered data point. Opens toward the side
            with more room (right/down for points near the left/top edges). */}
        {hoverDot !== null && (() => {
          const d = cfg.dots[hoverDot];
          const m = cfg.months[hoverDot];
          const tx = d.left < 50 ? '12px' : 'calc(-100% - 12px)';
          const ty = d.top < 30 ? '12px' : 'calc(-100% - 12px)';
          return (
            // Outer = positioning (translate); inner = the card, which fades + scales in.
            <div style={{ position: 'absolute', left: `calc(61px + (100% - 61px) * ${d.left / 100})`, top: cfg.boxTop + (d.top / 100) * cfg.boxHeight, transform: `translate(${tx}, ${ty})`, pointerEvents: 'none', zIndex: 2 }}>
              <div style={{ backgroundColor: '#ffffff', boxShadow: '0px 4px 4px rgba(0,0,0,0.06), 0px 2px 2px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 8, padding: 16, borderRadius: 8, animation: 'polyps-tip-in 0.15s ease-out' }}>
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 12, lineHeight: 1.4, color: '#0f1113' }}>{m.month}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: FONT, fontWeight: 400, fontSize: 12, color: SOFT, whiteSpace: 'nowrap' }}>
                  {m.primary.map((s, j) => <span key={j}>{s}</span>)}
                </div>
                <div style={{ height: 1, width: '100%', backgroundColor: GRID }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: FONT, fontWeight: 400, fontSize: 12, color: SOFT, whiteSpace: 'nowrap' }}>
                  {m.secondary.map((s, j) => <span key={j}>{s}</span>)}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      </div>
    </div>
  );
}

// ── 2-up bar charts (Polyps by Size / by Location) ── nodes 12413:4995 / 5073 ─
export const DETECTED = '#2683d1'; // chart/dataset-01
export const RETRIEVED = '#eb4850'; // chart/dataset-02
const BASE_TEXT = '#0f1113'; // text/base
const NUM_FONT = "'Segoe UI', system-ui, sans-serif"; // bar value labels (Segoe UI Semibold)
const TWO_UP_SHADOW = '0px 2px 2px rgba(0,0,0,0.04), 0px 1px 1px rgba(0,0,0,0.04)';

// Each item carries literal bar pixel widths from Figma (normalised per card).
type Bar = { w: number; v: string; c: string };
export const SIZE_DATA: { label: string; bars: Bar[] }[] = [
  { label: '<5mm', bars: [{ w: 165, v: '90', c: DETECTED }] },
  { label: '5-10mm', bars: [{ w: 247.5, v: '140', c: DETECTED }] },
  { label: '10-20mm', bars: [{ w: 67.5, v: '40', c: DETECTED }] },
  { label: '>20mm', bars: [{ w: 157.5, v: '85', c: DETECTED }] },
  { label: 'Not specified', bars: [{ w: 20, v: '10', c: DETECTED }] },
];
export const LOCATION_DATA: { label: string; bars: Bar[] }[] = [
  { label: 'Cecum, Ilium, and Ascending Colon', bars: [{ w: 165, v: '105', c: DETECTED }, { w: 142.5, v: '95', c: RETRIEVED }] },
  { label: 'Transverse Colon', bars: [{ w: 247.5, v: '152', c: DETECTED }, { w: 240, v: '150', c: RETRIEVED }] },
  { label: 'Descending Colon', bars: [{ w: 67.5, v: '45', c: DETECTED }, { w: 52.5, v: '35', c: RETRIEVED }] },
  { label: 'Sigmoid Colon and Rectum', bars: [{ w: 157.5, v: '100', c: DETECTED }, { w: 142.5, v: '95', c: RETRIEVED }] },
  { label: 'Not Specified', bars: [{ w: 15, v: '10', c: DETECTED }, { w: 7.5, v: '5', c: RETRIEVED }] },
];

// Bars are sized relative to the card's widest bar so they fit any card width
// (the longest fills ~80% of the plot, leaving room for the value label). This
// preserves the Figma proportions while staying responsive in the narrow frame.
function BarItem({ label, bars, maxW }: { label: string; bars: Bar[]; maxW: number }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
      <span style={{ width: 120, flexShrink: 0, textAlign: 'right', fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: 1, color: BASE_TEXT }}>{label}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, height: 32, flex: '1 0 0', minWidth: 0 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: 'flex', flex: '1 0 0', gap: 4, alignItems: 'center', minHeight: 0 }}>
            <div style={{ height: '100%', width: `${(b.w / maxW) * 80}%`, borderRadius: 1, backgroundColor: b.c, flexShrink: 0 }} />
            <span style={{ fontFamily: NUM_FONT, fontWeight: 600, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: BASE_TEXT, whiteSpace: 'nowrap' }}>{b.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChartCard({ title, data, legend }: { title: string; data: { label: string; bars: Bar[] }[]; legend: { color: string; label: string }[] }) {
  return (
    <div style={{ flex: '1 1 0', minWidth: 0, minHeight: 400, backgroundColor: '#ffffff', boxShadow: TWO_UP_SHADOW, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16, padding: 16, borderRadius: 8, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, lineHeight: 1.4, color: BASE_TEXT, whiteSpace: 'nowrap' }}>{title}</span>
        <div className="polyps-iconbtn" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, cursor: 'pointer', transition: 'background-color 0.15s ease' }}>
          <img src="/polyps/report-more.svg" alt="" style={{ width: 16, height: 4, display: 'block' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
        {(() => {
          const maxW = Math.max(...data.flatMap((it) => it.bars.map((b) => b.w)));
          return data.map((it, i) => <BarItem key={i} {...it} maxW={maxW} />);
        })()}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {legend.map((l, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: l.color }} />
            <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: BASE_TEXT, whiteSpace: 'nowrap' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TwoUpCharts() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%' }}>
      <BarChartCard title="Polyps by Size" data={SIZE_DATA} legend={[{ color: DETECTED, label: 'Detected polyps' }]} />
      <BarChartCard title="Polyps by Location" data={LOCATION_DATA} legend={[{ color: DETECTED, label: 'Detected polyps' }, { color: RETRIEVED, label: 'Retrieved polyps' }]} />
    </div>
  );
}

// ── Data tables (By Type / By Resection Method) ── nodes 12413:5142 / 5143 ────
const TABLE_HEADER_BG = '#ebedf1'; // background/component-alt
type Col = { label: string; align: 'left' | 'right'; flex?: boolean; width?: number };

// Column-based table (matches Figma) so each column owns one width and its cells
// align — needed for the auto-width numeric columns in the Resection table.
export function DataTable({ title, columns, rows, total }: { title: string; columns: Col[]; rows: string[][]; total: string[] }) {
  const cellShell = (align: 'left' | 'right', extra?: object): object => ({
    height: 46, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: align === 'right' ? 'flex-end' : 'flex-start', padding: '0 16px', boxSizing: 'border-box', ...extra,
  });
  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff', boxShadow: TWO_UP_SHADOW, display: 'flex', flexDirection: 'column', gap: 16, padding: 16, borderRadius: 8, boxSizing: 'border-box' }}>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, lineHeight: 1.4, color: BASE_TEXT, whiteSpace: 'nowrap' }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        {columns.map((col, ci) => {
          const colStyle = col.flex ? { flex: '1 1 0', minWidth: 0 } : col.width ? { width: col.width, flexShrink: 0 } : { flexShrink: 0 };
          const txt = (val: string, weight: number, size: number, lh: number, nowrap: boolean) => (
            <span style={{ fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: lh, color: BASE_TEXT, textAlign: col.align, whiteSpace: nowrap ? 'nowrap' : 'normal' }}>{val}</span>
          );
          return (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', ...colStyle }}>
              <div style={cellShell(col.align, { backgroundColor: TABLE_HEADER_BG, borderLeft: ci > 0 ? '1px solid #ffffff' : undefined })}>
                {txt(col.label, 600, 10, 1.4, true)}
              </div>
              {rows.map((row, ri) => (
                <div key={ri} style={cellShell(col.align, { borderBottom: `1px solid ${GRID}` })}>{txt(row[ci], 400, 12, 1, !col.flex)}</div>
              ))}
              <div style={cellShell(col.align, { borderBottom: `1px solid ${GRID}` })}>{txt(total[ci], 600, 12, 1.4, !col.flex)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const BY_TYPE_COLS: Col[] = [
  { label: 'Type', align: 'left', flex: true },
  { label: 'Procedures', align: 'right', width: 126 },
  { label: 'Detected Polyps', align: 'right', width: 126 },
  { label: 'Retrieved polyps', align: 'right', width: 126 },
];
export const BY_TYPE_ROWS: string[][] = [
  ['Pedunculated (Ip)', '1', '3', '1'],
  ['Semi-Pedunculated (Isp)', '1', '3', '1'],
  ['Sessile (Is)', '1', '3', '1'],
  ['Flat elevated (IIa)', '1', '3', '1'],
  ['Completely flat (IIb)', '1', '3', '1'],
  ['Excavated (III)', '1', '3', '1'],
  ['Not specified', '1', '3', '1'],
];

export const BY_RESECTION_COLS: Col[] = [
  { label: 'Method', align: 'left', flex: true },
  { label: 'Procedures', align: 'right' },
  { label: 'Resected polyps', align: 'right' },
  { label: 'Partially retrieved polyps', align: 'right' },
  { label: 'Fully retrieved polyps', align: 'right' },
];
export const BY_RESECTION_ROWS: string[][] = [
  ['Polypectomy', '1', '2', '1', '1'],
  ['Mucosectomy (EMR)', '1', '2', '1', '1'],
  ['Endoscopic submucosal dissection (ESD)', '1', '2', '1', '1'],
  ['Endoscopic full thickness resection (EFTR)', '1', '2', '1', '1'],
  ['Endoscopic intermuscular resection (EID)', '1', '2', '1', '1'],
  ['Not specified', '1', '2', '1', '1'],
];

// ── Content column ───────────────────────────────────────────────────────────
function Content() {
  return (
    <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Header />
      <Controls />
      <FullSizeReport />
      <TwoUpCharts />
      <DataTable title="Polyps by Type (Paris Classification)" columns={BY_TYPE_COLS} rows={BY_TYPE_ROWS} total={['Total', '7', '21', '7']} />
      <DataTable title="Polyps by Resection Method" columns={BY_RESECTION_COLS} rows={BY_RESECTION_ROWS} total={['Total', '6', '12', '6', '6']} />
      {/* TODO: Full-size Report — tabs / title / KPIs / PDR chart (12413:4921) */}
      {/* TODO: 2-Up bar charts (12413:4994) */}
      {/* TODO: By Type table (12413:5142) */}
      {/* TODO: By Resection Method table (12413:5143) */}
    </div>
  );
}

// ── Footer ── node 12413:5144 ────────────────────────────────────────────────
export function Footer() {
  return (
    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start', justifyContent: 'center', padding: '0 16px 24px', boxSizing: 'border-box', width: '100%' }}>
      <div style={{ height: 1, width: '100%', backgroundColor: '#d8dbe2' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', width: '100%' }}>
        <img src="/polyps/olympus-logo.svg" alt="Olympus" style={{ width: 128.348, height: 16, display: 'block' }} />
        <span style={{ fontFamily: NUM_FONT, fontWeight: 400, fontSize: 12, lineHeight: 1.4, letterSpacing: '0.24px', color: SOFT, whiteSpace: 'nowrap' }}>© 2024 Olympus Corporation</span>
      </div>
    </div>
  );
}

// `topInset` reserves space at the top of the scroll content for host chrome.
// `selfScroll` (default true) makes the root its own scroll container; set false
// when a host drives scrolling via the forwarded ref (overflow:hidden still allows
// programmatic scrollTop, and the wheel bubbles to the host's scroller).
export const PolypsDashboard = forwardRef<HTMLDivElement, { topInset?: number; selfScroll?: boolean }>(
  function PolypsDashboard({ topInset = 0, selfScroll = true }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          overflowY: selfScroll ? 'auto' : 'hidden',
          overflowX: 'hidden',
          backgroundColor: PAGE_BG, // background/page (#f9fafc) — cards are white and pop against it
          fontFamily: FONT,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: topInset,
          boxSizing: 'border-box',
        }}
      >
        <style>{HOVER_CSS}</style>
        <OlysenseBar />
        {/* Menu + Content — 24px below the bar; 16px side insets, 16px column gap. */}
        <div style={{ display: 'flex', gap: 16, padding: '24px 16px 0', alignItems: 'flex-start' }}>
          <Menu />
          <Content />
        </div>
        <Footer />
      </div>
    );
  }
);
