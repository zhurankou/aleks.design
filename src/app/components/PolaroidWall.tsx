import { memo, useMemo } from 'react';

// About-view background: three rows of tilted polaroid frames filled with the about-media
// photos, scrolling as infinite marquees in alternating directions (top→left, middle→right,
// bottom→left). Photos are fit cover with an upper-centre focus so faces aren't cropped.

// Numbers of the files present in public/about-media (`About - N.png`).
const NUMS = [1, 3, 4, 5, 9, 12, 14, 15, 17, 18, 19, 20, 24, 26, 27, 28, 29, 30, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 63, 64, 65, 67, 68, 69, 70, 71, 72, 73, 74];
const src = (n: number) => `/about/${n}.jpg`; // web-optimized copies (~640px) of public/about-media

const PHOTO_W = 240;
const PHOTO_H = 320; // 3:4 portrait

// Per-photo horizontal focus overrides (default 'center'); vertical stays 28%.
const FOCUS_X: Record<number, string> = { 3: 'right', 5: '65%', 9: '65%' };

const wallAnim = `
@keyframes polaroid-left { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
@keyframes polaroid-right { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }
`;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

type Card = { n: number; tilt: number };

function Polaroid({ card }: { card: Card }) {
  return (
    <div style={{
      flexShrink: 0,
      margin: '0 16px',
      padding: '14px 14px 40px 14px',
      backgroundColor: '#FFFFFF',
      borderRadius: 3,
      boxShadow: '0 12px 40px rgba(20,24,40,0.12)',
      transform: `rotate(${card.tilt}deg)`,
    }}>
      <img
        src={src(card.n)}
        alt=""
        draggable={false}
        decoding="async"
        style={{ width: PHOTO_W, height: PHOTO_H, objectFit: 'cover', objectPosition: `${FOCUS_X[card.n] ?? 'center'} 28%`, display: 'block', backgroundColor: '#E8E8EA' }}
      />
    </div>
  );
}

function Row({ items, dir, duration }: { items: Card[]; dir: 'left' | 'right'; duration: number }) {
  const seq = [...items, ...items]; // duplicated so the -50% translate loops seamlessly
  return (
    <div style={{ display: 'flex', width: 'max-content', willChange: 'transform', animation: `polaroid-${dir} ${duration}s linear infinite` }}>
      {seq.map((c, i) => <Polaroid key={i} card={c} />)}
    </div>
  );
}

// memo + no props: the wall renders once (the marquee animation then runs undisturbed). The
// parent fades it via a wrapper's opacity, so per-frame scroll re-renders don't touch it.
export const PolaroidWall = memo(function PolaroidWall() {
  // Shuffle once, give each a small left/right tilt, split across the two rows.
  const rows = useMemo(() => {
    const cards: Card[] = shuffle(NUMS).map((n) => ({ n, tilt: (Math.random() * 2 - 1) * 3 })); // −3°…+3°
    const half = Math.ceil(cards.length / 2);
    return [cards.slice(0, half), cards.slice(half)];
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
      <style>{wallAnim}</style>
      <Row items={rows[0]} dir="left" duration={130} />
      <Row items={rows[1]} dir="right" duration={150} />
    </div>
  );
});
