import { useEffect, useRef, useState } from 'react';
import {
  HiFiOption1,
  NATIVE_W,
  OptionRectangle,
  RECT_W,
  RECT_H,
  SCROLL_CURSOR,
} from './HiFiCompare';
import { OlysenseBar } from './polyps/PolypsDashboard';

// Footer for square 6 — divider + Olympus mark + © text. Spacing matches
// the charts above (24 px top / 24 px gap / 24 px bottom + 24 px horizontal
// inset) so the footer reads as part of the dashboard's natural rhythm
// rather than a cramped tail.
function CompactFooter() {
  return (
    <div
      style={{
        marginTop: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0 24px 24px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div style={{ height: 1, width: '100%', backgroundColor: '#d8dbe2' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', width: '100%' }}>
        <img src="/polyps/olympus-logo.svg" alt="Olympus" style={{ width: 128.348, height: 16, display: 'block' }} />
        <span
          style={{
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.4,
            letterSpacing: '0.24px',
            color: '#546274',
            whiteSpace: 'nowrap',
          }}
        >
          © 2024 Olympus Corporation
        </span>
      </div>
    </div>
  );
}

// Square 6 — "Correlated charts". Reuses Option 1 (the tabs dashboard) but
// instead of clicking through tabs, the scroll-gesture cursor scrolls the
// dashboard from the top all the way down through every chart row, pausing
// at each one, then scrolls back to the top. State machine plus CSS
// transitions on `top` (cursor) and `transform: translateY` (dashboard).

const CYCLE_S = 14;
// One-shot fade-in — plays exactly ONCE per reveal (the wrapper is keyed by
// revealCount so the element remounts on each IO entry and the animation
// restarts from frame 0). animation-fill-mode "forwards" locks the end
// state, so the rectangle stays at opacity 1 / scale 1 for the rest of the
// 14-s timer cycle and the next cycle does not fade it out and back in
// (which was reading as a "flash" at the loop boundary).
const correlatedAnim = `
@keyframes hifi-correlated-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
`;

// Scroll stops in rectangle px. 0 = top, each next stop centres a chart row
// in the rectangle. Numbers derived from the scaled native layout of
// HiFiOption1 (chart card heights + 16-px gaps × 0.6 render scale).
type ScrollPhase =
  | 'idle'
  | 'enter'   // cursor fades in at the top, dashboard still at scroll 0
  | 'stop1'   // 2-Up row: Polyps by Number + Location
  | 'stop2'   // 2-Up row: Resection Method + By Size histogram
  | 'stop3'   // 2-Up row: Time of Day donuts
  | 'stop4'   // By Type table
  | 'return'  // scrolled back to top
  | 'done';   // cursor fades out

// stop1..stop3 centre each 2-Up chart row in the rectangle — these positions
// are fixed by the dashboard content stack and don't change with the footer.
// stop4 scrolls to the dashboard's bottom (By Type table + footer) and is
// tuned so the footer sits flush at the rectangle's bottom edge.
const SCROLL_STOPS: Record<Exclude<ScrollPhase, 'idle' | 'done'>, number> = {
  enter: 0,
  stop1: 400,
  stop2: 680,
  stop3: 940,
  stop4: 1030,
  return: 0,
};

// Scroll cursor positioning. The cursor stays roughly centred in the
// rectangle and drifts gently downward as the dashboard scrolls — reading as
// a continuous swipe gesture rather than discrete clicks.
const SCROLL_CURSOR_X = 308;
const SCROLL_CURSOR_TOP_Y = 200;
const SCROLL_CURSOR_BOTTOM_Y = 340;

function CorrelatedScrollCursor({ phase }: { phase: ScrollPhase }) {
  const showing = phase !== 'idle' && phase !== 'done';
  // Cursor y interpolates from top to bottom across stop1..stop4, then snaps
  // back at `return`. The CSS transition smooths the change.
  let cy = SCROLL_CURSOR_TOP_Y;
  if (phase === 'stop1') cy = SCROLL_CURSOR_TOP_Y + (SCROLL_CURSOR_BOTTOM_Y - SCROLL_CURSOR_TOP_Y) * 0.25;
  else if (phase === 'stop2') cy = SCROLL_CURSOR_TOP_Y + (SCROLL_CURSOR_BOTTOM_Y - SCROLL_CURSOR_TOP_Y) * 0.5;
  else if (phase === 'stop3') cy = SCROLL_CURSOR_TOP_Y + (SCROLL_CURSOR_BOTTOM_Y - SCROLL_CURSOR_TOP_Y) * 0.75;
  else if (phase === 'stop4') cy = SCROLL_CURSOR_BOTTOM_Y;
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: SCROLL_CURSOR_X,
        top: cy,
        transform: 'translate(-13px, -12px)',
        transformOrigin: '13px 12px',
        opacity: showing ? 1 : 0,
        transition:
          'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {SCROLL_CURSOR}
    </div>
  );
}

export function HiFiCorrelated() {
  // Reveal-gated: animation only runs while the square is actively in view,
  // and restarts cleanly on every re-entry. Threshold 0.5 matches the other
  // process squares (4 & 5) so the cycle starts when half the square is in
  // view. `inView` tracks the current state so the timer cycle stops when
  // scrolling away (the dashboard resets to scroll 0 too).
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealCount, setRevealCount] = useState(0);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        setInView(visible);
        if (visible) setRevealCount((c) => c + 1);
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const playing = inView;

  // Measure the rendered dashboard height so stop4 always lands flush at the
  // footer's bottom regardless of content changes. scrollHeight returns the
  // NATURAL (unscaled) layout height — independent of the OptionRectangle's
  // transform timing — so multiplying by the same scale (RECT_W / NATIVE_W)
  // gives the scaled height, and max scroll = scaledHeight - RECT_H.
  // A ResizeObserver keeps this fresh if charts settle their layout later.
  const dashRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(1500);
  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    const scale = RECT_W / NATIVE_W;
    const measure = () => {
      const natural = el.scrollHeight;
      if (!natural) return;
      const scaled = natural * scale;
      const max = Math.max(0, Math.floor(scaled - RECT_H));
      setMaxScroll(max);
    };
    // Two RAFs for initial layout + fonts/images.
    const rafId = requestAnimationFrame(() => requestAnimationFrame(measure));
    // Catch any later layout shifts (chart cards settling, async images).
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [revealCount]);

  const [phase, setPhase] = useState<ScrollPhase>('idle');
  useEffect(() => {
    if (!playing) return;
    let timers: number[] = [];
    const cycle = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
      setPhase('idle');
      // Timeline (14 s cycle):
      //   600  ms  cursor fades in at top
      //   1.7  s   scroll to row 1 (Number + Location)
      //   3.4  s   scroll to row 2 (Resection + Histogram)
      //   5.1  s   scroll to row 3 (Time-of-day donuts)
      //   6.8  s   scroll to row 4 (By Type table)
      //   8.8  s   2-second hold at bottom, then return to top
      //   11.5 s   cursor fades out
      timers.push(window.setTimeout(() => setPhase('enter'),    600));
      timers.push(window.setTimeout(() => setPhase('stop1'),   1700));
      timers.push(window.setTimeout(() => setPhase('stop2'),   3400));
      timers.push(window.setTimeout(() => setPhase('stop3'),   5100));
      timers.push(window.setTimeout(() => setPhase('stop4'),   6800));
      timers.push(window.setTimeout(() => setPhase('return'),  8800));
      timers.push(window.setTimeout(() => setPhase('done'),   11500));
    };
    cycle();
    const restart = window.setInterval(cycle, CYCLE_S * 1000);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(restart);
    };
  }, [playing, revealCount]);

  // stop4 is overridden to the dynamically measured maxScroll so the scroll
  // always lands flush at the dashboard's bottom edge.
  const stops: typeof SCROLL_STOPS = { ...SCROLL_STOPS, stop4: maxScroll };
  const scrollY = phase === 'idle' || phase === 'done' || phase === 'enter'
    ? 0
    : phase === 'return'
      ? 0
      : stops[phase];

  return (
    <div
      ref={containerRef}
      data-name="hifi-correlated"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{correlatedAnim}</style>
      <div
        key={revealCount}
        style={{
          position: 'relative',
          width: RECT_W,
          height: RECT_H + 24 + 30 /* rect + gap + label */,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            // Before reveal: static at full opacity (shows Option 1 as the
            // square's static state). On reveal: the wrapper is keyed by
            // revealCount so it remounts; the one-shot fade-in plays once
            // and `forwards` locks the end state. No looping animation
            // means no flash at the 14-s timer-cycle boundary — only the
            // scroll/cursor are driven by the timer chain.
            opacity: playing ? 0 : 1,
            animation: playing
              ? 'hifi-correlated-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards'
              : 'none',
          }}
        >
          <OptionRectangle
            scrollY={scrollY}
            overlay={playing ? <CorrelatedScrollCursor phase={phase} /> : null}
            stickyBar={<OlysenseBar />}
          >
            <div ref={dashRef}>
              <HiFiOption1 tab={0} footer={<CompactFooter />} />
            </div>
          </OptionRectangle>
          {/* Label — same style as the polyp-morphology card body
              (Manrope Regular 18 / leading-normal / centred / #000000). */}
          <p
            style={{
              margin: 0,
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: 18,
              lineHeight: 'normal',
              color: '#000000',
              textAlign: 'center',
            }}
          >
            Correlated info
          </p>
        </div>
      </div>
    </div>
  );
}
