import { useEffect, useState } from 'react';
import { useSprings, animated, to } from '@react-spring/web';
import { PdrCard } from './PdrCard';
import { PrrCard } from './PrrCard';
import { BySizeCard } from './BySizeCard';
import { DetectedCard } from './DetectedCard';
import { RetrievedCard } from './RetrievedCard';
import { DetectedVsCard } from './DetectedVsCard';

// Focused-center vertical carousel for the OlySense card: 5 cards stacked
// vertically; the middle one is full size/opacity, neighbours shrink, fade, and
// blur. Advances on a timer and loops, driven by @react-spring physics for
// momentum-based, natural motion. Centred in the parent (centred on screen);
// width is sized to clear the endo2 clip (bottom-left of the card).

const COUNT = 6;
const CARD_W = 352; // clears endo2 (right edge ~196) by ~24px when centred at x=396
const CARD_H = 240;
const RADIUS = 20;
const STEP = 76; // vertical centre-to-centre spacing; < CARD_H so cards overlap into a stack
const INTERVAL_MS = 4500;
const BASE_SCALE = 1.3; // focused card scale — grows toward the endo2 clip (right edge ~176)
const SPRING = { tension: 140, friction: 26 }; // gentle, smooth settle
const POP = { tension: 180, friction: 28 }; // soft scale, no bounce
// Scale uses the bouncy POP spring; everything else uses the smoother SPRING.
const springConfig = (key: string) => (key === 'scale' ? POP : SPRING);

// Per-card target props given the active index. Wrapped offset r ∈ [-2, 2].
function target(i: number, active: number) {
  let r = (i - active + COUNT) % COUNT;
  if (r > COUNT / 2) r -= COUNT;
  const ar = Math.abs(r);
  // Strong contrast between focus and neighbours so a card visibly grows,
  // brightens, and un-veils as it takes focus (a pronounced swap). `delay` staggers
  // the cards (focus leads, outer cards trail) so they don't move in lockstep.
  return { y: r * STEP, scale: BASE_SCALE * (1 - 0.12 * ar), opacity: 1 - 0.2 * ar, veil: ar * 0.45, delay: ar * 80 };
}

const CARDS = [PdrCard, DetectedCard, PrrCard, RetrievedCard, DetectedVsCard, BySizeCard];

export function OlyCarousel({ style, blurred = true, playing = true }: { style?: React.CSSProperties; blurred?: boolean; playing?: boolean }) {
  const [active, setActive] = useState(0);

  // Auto-advance only while playing (the parent staged-entrance gates when this starts).
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % COUNT), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const [springs, api] = useSprings(COUNT, (i) => ({ ...target(i, 0), config: springConfig }));
  useEffect(() => {
    api.start((i) => ({ ...target(i, active), config: springConfig }));
  }, [active, api]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      {springs.map((sp, i) => {
        // z-order isn't animated — switch it instantly based on the current focus.
        let r = (i - active + COUNT) % COUNT;
        if (r > COUNT / 2) r -= COUNT;
        const Card = CARDS[i];
        return (
          <animated.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: CARD_W,
              height: CARD_H,
              borderRadius: RADIUS,
              backgroundColor: 'rgba(223,235,255,0.55)',
              backdropFilter: blurred ? 'blur(8px)' : 'none',
              WebkitBackdropFilter: blurred ? 'blur(8px)' : 'none',
              border: '1px solid rgba(255,255,255,0.6)',
              boxSizing: 'border-box',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              zIndex: COUNT - Math.abs(r),
              opacity: sp.opacity,
              transform: to([sp.y, sp.scale], (y, s) => `translate(-50%, -50%) translateY(${y}px) scale(${s})`),
            }}
          >
            <Card focused={i === active && playing} />
            {/* Veil — washes non-prominent cards toward the light-blue card tint. */}
            <animated.div style={{ position: 'absolute', inset: 0, backgroundColor: '#DFEBFF', opacity: sp.veil, pointerEvents: 'none' }} />
          </animated.div>
        );
      })}
    </div>
  );
}
