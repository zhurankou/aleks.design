// Generic stat card recreated from Figma (PDR 15768:2630, PRR 15768:2660,
// detected 15768:2888): grey title + a coloured ↑/↓ change pill, a big KPI number,
// and a `chart` slot rendered along the bottom (line chart, bar chart, etc.).
// Fills its parent carousel card.

import type { ReactNode } from 'react';
import { CountUp } from './CountUp';

const FONT = "'Manrope', sans-serif";

// Up-arrow (Figma 15768:2643); rotated 180° for a downward trend.
const ARROW_PATH =
  'M2.25105 9.27276C1.91632 8.93802 1.91632 8.39531 2.25105 8.06058L7.39391 2.91772C7.72864 2.58298 8.27136 2.58298 8.60609 2.91772L13.7489 8.06058C14.0837 8.39531 14.0837 8.93802 13.7489 9.27276C13.4142 9.60749 12.8715 9.60749 12.5368 9.27276L8.85714 5.59314V13.8095C8.85714 14.2829 8.47339 14.6667 8 14.6667C7.52661 14.6667 7.14286 14.2829 7.14286 13.8095V5.59314L3.46323 9.27276C3.1285 9.60749 2.58579 9.60749 2.25105 9.27276Z';

// Tag arrow nudge — like the button arrows: up for an up trend, down for a down trend.
const tagArrowAnim = `
  @keyframes tag-arrow-up   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
  @keyframes tag-arrow-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2px); } }
`;

export function StatCard({
  title,
  value,
  change,
  trend,
  accentColor,
  tagBg,
  chart,
  play,
  subtleCount = false,
  valueNode,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  accentColor: string;
  tagBg: string;
  chart: ReactNode;
  play: boolean;
  subtleCount?: boolean;
  valueNode?: ReactNode;
}) {
  // Split the KPI into its number + suffix (e.g. "54%" → 54, "%") for the count-up.
  const m = value.match(/^(\d+)(.*)$/);
  const kpiNum = m ? parseInt(m[1], 10) : 0;
  const kpiSuffix = m ? m[2] : '';
  // Bar cards tick up just a little (from ~88%, so the digits wrap only a couple of
  // times for a smooth roll); area cards count the full way.
  const countFrom = subtleCount ? Math.round(kpiNum * 0.88) : 0;
  // The change pill rolls too: an up/green trend counts up (digits slide up), a
  // down/red trend counts down (digits slide down).
  const cm = change.match(/^(\d+)(.*)$/);
  const changeNum = cm ? parseInt(cm[1], 10) : 0;
  const changeSuffix = cm ? cm[2] : '';
  const changeFrom = trend === 'up' ? Math.round(changeNum * 0.6) : Math.round(changeNum * 1.4);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 20 }}>
      <style>{tagArrowAnim}</style>
      <div style={{ position: 'absolute', left: 24, top: 16, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: 1.4, color: '#6E6E73', whiteSpace: 'nowrap' }}>
            {title}
          </span>
          <div style={{ display: 'flex', gap: 2, alignItems: 'center', backgroundColor: tagBg, padding: '3px 6px', borderRadius: 3 }}>
            <div style={{ display: 'flex', flexShrink: 0, animation: play ? `${trend === 'up' ? 'tag-arrow-up' : 'tag-arrow-down'} 0.8s ease-in-out infinite` : 'none' }}>
              <svg width="16" height="17.333" viewBox="0 0 16 17.3333" fill="none" style={{ display: 'block', transform: trend === 'down' ? 'rotate(180deg)' : 'none' }}>
                <path fillRule="evenodd" clipRule="evenodd" d={ARROW_PATH} fill={accentColor} />
              </svg>
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: 1.4, color: accentColor, whiteSpace: 'nowrap' }}>
              <CountUp to={changeNum} from={changeFrom} suffix={changeSuffix} play={play} />
            </span>
          </div>
        </div>
        <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 48, lineHeight: 1, letterSpacing: '-1.44px', color: '#000000', whiteSpace: 'nowrap' }}>
          {valueNode ?? <CountUp to={kpiNum} from={countFrom} suffix={kpiSuffix} play={play} />}
        </p>
      </div>
      {chart}
    </div>
  );
}
