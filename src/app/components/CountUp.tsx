import { useEffect } from 'react';
import { useSpring, animated, easings } from '@react-spring/web';

const STRIP = '01234567890'.split(''); // 0-9 + a trailing 0 so the 9→0 wrap is seamless

// Vertical offset (0..10) for the digit column at `place`, given continuous value `v`.
// Each place shows its TRUE digit and only rolls to the next as the place below it
// wraps 9→0 — so the number reads correctly at rest (not "geared" past the digit).
function odoOffset(v: number, place: number): number {
  const pow = Math.pow(10, place);
  const digit = ((Math.floor(v / pow) % 10) + 10) % 10;
  let roll: number;
  if (place === 0) {
    roll = v - Math.floor(v); // the ones place rolls continuously
  } else {
    const lower = (v / Math.pow(10, place - 1)) % 10; // continuous digit just below
    const f = Math.min(1, Math.max(0, lower - 9)); // 0 until the lower digit nears its wrap
    roll = f * f * (3 - 2 * f); // smoothstep — ease the carry roll in and out
  }
  return digit + roll;
}

// Soft fade on the top and bottom edges only, so digits dissolve as they roll out.
const EDGE_MASK = 'linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)';

// Rolling-digit (odometer) display. `value` can be an animated react-spring value
// (SpringValue/Interpolation) or a plain number (for callers that re-render each frame).
export function Odometer({ value, places, suffix = '' }: { value: any; places: number; suffix?: string }) {
  const digitBox = { display: 'inline-block', verticalAlign: 'top', height: '1em', lineHeight: '1em', overflow: 'hidden', WebkitMaskImage: EDGE_MASK, maskImage: EDGE_MASK } as const;
  const sfxBox = { display: 'inline-block', verticalAlign: 'top', height: '1em', lineHeight: '1em' } as const;
  return (
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
      {Array.from({ length: places }).map((_, i) => {
        const place = places - 1 - i; // leftmost column = highest place
        const transform =
          typeof value === 'number'
            ? `translateY(${-odoOffset(value, place)}em)`
            : value.to((v: number) => `translateY(${-odoOffset(v, place)}em)`);
        return (
          <span key={i} style={digitBox}>
            <animated.span style={{ display: 'block', transform }}>
              {STRIP.map((d, idx) => (
                <span key={idx} style={{ display: 'block', height: '1em', lineHeight: '1em', textAlign: 'center' }}>{d}</span>
              ))}
            </animated.span>
          </span>
        );
      })}
      {suffix ? <span style={sfxBox}>{suffix}</span> : null}
    </span>
  );
}

// Rolls from `from` (default 0) up to `to` when `play` turns true; rests at `to`.
export function CountUp({ to, from = 0, suffix = '', play }: { to: number; from?: number; suffix?: string; play: boolean }) {
  const [{ n }, api] = useSpring(() => ({ n: to }));
  useEffect(() => {
    if (play) api.start({ from: { n: from }, to: { n: to }, config: { duration: 1800, easing: easings.easeInOutCubic } });
    else api.set({ n: to });
  }, [play, from, to, api]);
  const places = String(Math.max(1, Math.round(to))).length;
  return <Odometer value={n} places={places} suffix={suffix} />;
}
