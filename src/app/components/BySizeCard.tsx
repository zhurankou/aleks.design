// "Polyps by Size" card recreated from Figma (node 15768:2700): a title and four
// horizontal bars (label + count + a gradient fill on an #F5F8FF track). The bar
// fill is constant #007AFF with an alpha ramp (~0.1 → 0.8), sampled from the Figma
// PNGs and reproduced as a CSS gradient. Fills its parent carousel card. On focus
// each bar springs out a little (0.7→1) from the left, with a small stagger.

import { useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { CountUp } from './CountUp';
import { useFocusPlay } from './useFocusPlay';

const FONT = "'Manrope', sans-serif";
const TRACK_W = 304;
const BAR_FILL = 'linear-gradient(to right, rgba(0,122,255,0.1), rgba(0,122,255,0.8))';
const BAR_SPRING = { tension: 90, friction: 26 }; // smooth, no bounce
const STAGGER_MS = 30;
const GROW_FROM = 0.4; // grow from 40% → a clearly visible rise

// Count per size bin; sums to the 206 detected polyps, skewed to smaller sizes.
// Bar width is scaled so the largest bin fills the track.
const ITEMS: { label: string; value: number }[] = [
  { label: '<5 mm', value: 72 },
  { label: '5-10 mm', value: 104 },
  { label: '10-20 mm', value: 22 },
  { label: '>20 mm', value: 8 },
];
const MAX = Math.max(...ITEMS.map((it) => it.value));

export function BySizeCard({ focused }: { focused: boolean }) {
  const play = useFocusPlay(focused);
  const [springs, api] = useSprings(ITEMS.length, () => ({ s: GROW_FROM }));
  useEffect(() => {
    // Rest shrunk when off-screen, then grow up from there on focus (no snap-down jerk).
    if (play) api.start((i) => ({ to: { s: 1 }, delay: i * STAGGER_MS, config: BAR_SPRING }));
    else api.set(() => ({ s: GROW_FROM }));
  }, [play, api]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 20 }}>
      <span style={{ position: 'absolute', left: 24, top: 24, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: 1.4, color: '#6E6E73', whiteSpace: 'nowrap' }}>
        Polyps by Size
      </span>
      {ITEMS.map((it, i) => (
        <div key={it.label} style={{ position: 'absolute', left: 24, top: 56 + i * 41, width: TRACK_W, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 12, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: FONT, fontWeight: 500, lineHeight: 1.4, color: '#6E6E73' }}>{it.label}</span>
            <span style={{ fontFamily: FONT, fontWeight: 500, lineHeight: 1.4, color: '#000000' }}>
              <CountUp to={it.value} from={Math.round(it.value * 0.7)} play={play} />
            </span>
          </div>
          <div style={{ width: '100%', height: 12, borderRadius: 6, backgroundColor: '#F5F8FF' }}>
            <animated.div style={{ width: (it.value / MAX) * TRACK_W, height: 12, borderRadius: 6, backgroundColor: '#ECF2FF', backgroundImage: BAR_FILL, transformOrigin: 'left', willChange: 'transform', transform: springs[i].s.to((v) => `scaleX(${v})`) }} />
          </div>
        </div>
      ))}
    </div>
  );
}
