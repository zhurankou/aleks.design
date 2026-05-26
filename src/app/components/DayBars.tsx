import { useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';

// 7-day vertical bar chart for a stat card (Figma "detected" 15768:2888 /
// "retrieved" 15768:3840). Bars use a top→bottom gradient of the given colour
// (alpha 0.8 → 0.1). On focus each bar springs up a little (0.7→1) from the
// baseline, with a small stagger. Rendered into a StatCard chart slot.

const FONT = "'Manrope', sans-serif";
const BAR_SPRING = { tension: 90, friction: 26 }; // smooth, no bounce
const STAGGER_MS = 30;
const GROW_FROM = 0.4; // grow from 40% → a clearly visible rise

// Varied week, peak mid-week (the up trend is carried by the pill, not the bars).
export const DETECTED_BARS: { day: string; h: number }[] = [
  { day: 'Mon', h: 64 },
  { day: 'Tue', h: 78 },
  { day: 'Wed', h: 52 },
  { day: 'Thu', h: 86 },
  { day: 'Fri', h: 50 },
  { day: 'Sat', h: 36 },
  { day: 'Sun', h: 44 },
];

// Varied week with a different shape from Detected; peak mid-week, not at the end.
export const RETRIEVED_BARS: { day: string; h: number }[] = [
  { day: 'Mon', h: 82 },
  { day: 'Tue', h: 56 },
  { day: 'Wed', h: 94 },
  { day: 'Thu', h: 64 },
  { day: 'Fri', h: 46 },
  { day: 'Sat', h: 34 },
  { day: 'Sun', h: 40 },
];

export function DayBars({ rgb, days, play }: { rgb: string; days: { day: string; h: number }[]; play: boolean }) {
  const fill = `linear-gradient(to bottom, rgba(${rgb},0.8), rgba(${rgb},0.1))`;
  const [springs, api] = useSprings(days.length, () => ({ s: GROW_FROM }));
  useEffect(() => {
    // Rest shrunk when off-screen, then grow up from there on focus — no instant
    // snap-down to GROW_FROM (which read as a jerk) at the start of the animation.
    if (play) api.start((i) => ({ to: { s: 1 }, delay: i * STAGGER_MS, config: BAR_SPRING }));
    else api.set(() => ({ s: GROW_FROM }));
  }, [play, api, days.length]);

  return (
    <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 304, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      {days.map(({ day, h }, i) => (
        <div key={day} style={{ width: 24, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'flex-end' }}>
          <animated.div style={{ width: '100%', height: h, borderRadius: 6, backgroundColor: '#ECF2FF', backgroundImage: fill, transformOrigin: 'bottom', willChange: 'transform', transform: springs[i].s.to((v) => `scaleY(${v})`) }} />
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.4, color: '#6E6E73', textAlign: 'center', width: '100%' }}>{day}</span>
        </div>
      ))}
    </div>
  );
}
