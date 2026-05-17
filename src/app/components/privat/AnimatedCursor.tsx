import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// hand.png lives in /public so it's served at the root URL.
const handPng = '/hand.png';

export type CursorPhase =
  | 'enter'
  | 'start'
  | 'copy'
  | 'click'
  | 'startBtn'
  | 'startBtnClick'
  | 'fadeBlack'
  | 'video'
  | 'videoPip'
  | 'fadeOut';

interface AnimatedCursorProps {
  phase: CursorPhase;
  copyEl: HTMLElement | null;
  startBtnEl: HTMLElement | null;
  frameEl: HTMLElement | null;
  size?: number;
}

const HIDDEN_PHASES = new Set<CursorPhase>(['fadeBlack', 'video', 'videoPip', 'fadeOut']);
const COPY_PHASES = new Set<CursorPhase>(['copy', 'click']);
const START_PHASES = new Set<CursorPhase>(['startBtn', 'startBtnClick']);

// Picks the on-screen rect for the cursor based on the current cursorPhase.
function targetRectFor(
  phase: CursorPhase,
  copyEl: HTMLElement | null,
  startBtnEl: HTMLElement | null,
): DOMRect | null {
  if (COPY_PHASES.has(phase)) return copyEl?.getBoundingClientRect() ?? null;
  if (START_PHASES.has(phase)) return startBtnEl?.getBoundingClientRect() ?? null;
  // 'enter' / 'start' / video phases: park near the start button (off-frame).
  return startBtnEl?.getBoundingClientRect() ?? copyEl?.getBoundingClientRect() ?? null;
}

export function AnimatedCursor({ phase, copyEl, startBtnEl, frameEl, size = 180 }: AnimatedCursorProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Recompute the cursor's screen position from the current target's rect.
  // Called on phase change AND on every frame resize (via ResizeObserver below)
  // so the cursor stays pinned through window resizes and frame-scale changes.
  const updatePosition = useRef<() => void>(() => {});
  updatePosition.current = () => {
    // 'enter': park the cursor off-screen below the viewport, horizontally
    // centred on the frame, so it slides up into the Copy bar when phase flips.
    if (phase === 'enter') {
      const frameRect = frameEl?.getBoundingClientRect();
      const cx = frameRect ? frameRect.left + frameRect.width / 2 : window.innerWidth / 2;
      setPos({ x: cx, y: window.innerHeight + size });
      return;
    }
    const rect = targetRectFor(phase, copyEl, startBtnEl);
    if (!rect) return;
    // Anchor 12px above the bottom edge of the target — fingertip lands just
    // inside the link / Start session, cursor body extends downward.
    const x = rect.left + rect.width / 2;
    const y = rect.bottom - 12;
    setPos({ x, y });
  };

  // Initial + phase-driven update.
  useLayoutEffect(() => {
    updatePosition.current();
  }, [phase, copyEl, startBtnEl]);

  // Reposition on frame resize (covers window resize and any future dynamic
  // frame-scale changes).
  useEffect(() => {
    if (!frameEl) return;
    const ro = new ResizeObserver(() => updatePosition.current());
    ro.observe(frameEl);
    const onWindowResize = () => updatePosition.current();
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onWindowResize, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('scroll', onWindowResize);
    };
  }, [frameEl]);

  const hidden = HIDDEN_PHASES.has(phase) || pos === null;
  const clicking = phase === 'click' || phase === 'startBtnClick';
  const moveDuration = phase === 'copy' ? 550 : phase === 'startBtn' ? 450 : 800;
  // Snap (no transition) when entering a hidden phase (so the cursor vanishes
  // immediately after the Start-session click, no lingering fade) or when the
  // loop resets to 'enter' (cursor should jump back below the viewport, not
  // slide visibly).
  const snap = HIDDEN_PHASES.has(phase) || phase === 'enter';

  return (
    <>
      <style>{`
        @keyframes ac-cursor-click {
          0% { transform: translate(-50%, 0) scale(1); }
          45% { transform: translate(-50%, 0) scale(0.9); }
          65% { transform: translate(-50%, 0) scale(0.9); }
          100% { transform: translate(-50%, 0) scale(1); }
        }
      `}</style>
      <img
        src={handPng}
        alt=""
        aria-hidden
        style={{
          position: 'fixed',
          // translate(-50%, 0) anchors the image's TOP-CENTER at (x, y), so the
          // fingertip (top of the hand image) lands on the click point and the
          // cursor body extends downward from there.
          left: pos?.x ?? -9999,
          top: pos?.y ?? -9999,
          // Use height as the reference dimension; width auto-scales so the
          // hand keeps its natural aspect ratio (forcing a square stretched it).
          height: size,
          width: 'auto',
          transform: 'translate(-50%, 0)',
          transformOrigin: '50% 0%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: hidden ? 0 : 1,
          willChange: 'left, top, transform, opacity',
          transition: snap
            ? 'none'
            : `left ${moveDuration}ms cubic-bezier(0.4, 0, 0.6, 1), top ${moveDuration}ms cubic-bezier(0.4, 0, 0.6, 1), opacity 220ms ease-out`,
          animation: clicking ? 'ac-cursor-click 220ms cubic-bezier(0.2, 0.8, 0.4, 1)' : undefined,
          imageRendering: 'auto',
        }}
      />
    </>
  );
}
