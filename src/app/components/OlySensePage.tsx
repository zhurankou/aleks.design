import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { PolypsDashboard } from './polyps/PolypsDashboard';
import { BrowserFrame } from './BrowserFrame';
import { LoFiPolypsCharts } from './LoFiPolypsCharts';
import { HiFiCompare } from './HiFiCompare';
import { HiFiCorrelated } from './HiFiCorrelated';

// OlySense case-study page. White canvas with a single scroll-driven transition
// modelled on the home→Privat frame move in NewPage: as you scroll, the title +
// subtext fade out while the rectangle slides up from a bottom-edge bleed and
// scales up to its full size, centred in the view.

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

// Rectangle full size = the base-view frame (1200 × 792). It rests at START_SCALE
// (25% down) until the scroll completes, then reaches full size. The Safari window
// inside owns the rounded corners / shadow.
const BASE_W = 1200;
const BASE_H = 792;
const START_SCALE = 0.75;

// Page-load entrance — same fade + scale-up as the home-load intro in NewPage.
const loadAnim = `
  @keyframes oly-load {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  /* Mirror of NewPage's arrow-nudge-right for the left-pointing arrow in the
     Back Home button — same 3px amplitude, 0.7s loop on hover. */
  @keyframes oly-arrow-nudge-left {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(-3px); }
  }
  @keyframes selected-wave {
    0%, 100% { color: #A8AFB6; }
    50%       { color: #5A626B; }
  }
  /* Caption phrase swap — gentle pure fade, position unchanged so the swap reads
     as a quiet cross-dissolve rather than a movement. X stays centred via -50%. */
  @keyframes oly-cap-fade {
    from { opacity: 0; transform: translate(-50%, 0); }
    to   { opacity: 1; transform: translate(-50%, 0); }
  }
  /* Drop-in bounce for the team avatars — translate only (no zoom). */
  @keyframes oly-avatar-bounce {
    0%   { opacity: 0; transform: translateY(-22px); }
    55%  { opacity: 1; transform: translateY(8px); }
    78%  { opacity: 1; transform: translateY(-3px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  /* Continuous gentle rock around the avatar's base tilt — slow + subtle. */
  @keyframes oly-avatar-wobble {
    0%, 100% { transform: rotate(-2deg); }
    50%      { transform: rotate(2deg); }
  }
  /* Looping marquee — track shifts left by half its width (content duplicated). */
  @keyframes oly-polaroid-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  /* Timeline phase pill — left-to-right reveal via clip-path inset (text stays
     unwarped since we're cropping a window, not scaling the box). */
  @keyframes oly-timeline-line {
    from { clip-path: inset(0 100% 0 0); opacity: 0; }
    to   { clip-path: inset(0 0 0 0);   opacity: 1; }
  }
  /* Timeline avatar — softer than Team's drop-in bounce: tiny 6px slide with
     a gentle ease-out and no overshoot. Quieter, fits the timeline's smaller
     32px circles where a larger bounce reads as noise. */
  @keyframes oly-timeline-avatar {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// Team avatars — three individual circles (Figma 15832:5687 / 5695 / 5705).
// Each is a #ebedf1 disc with a 2px white border and a 160×160 photo clipped
// inside; per-avatar alignment matches the Figma (bottom / centred / bottom +
// horizontally flipped). They bounce in one-by-one when the section enters view.
const AVATAR_SIZE = 80;
const OVERLAP = 16; // negative margin on the 2nd/3rd avatars
const AVATARS = [
  { src: '/team/a1.png', align: 'center bottom' as const, flip: false, tilt: -8,  imgScale: 1,    label: 'Designer: Aleks Zhurankou', link: 'https://www.linkedin.com/in/zhurankou/' },     // 15832:5687
  { src: '/team/a2.png', align: 'center center' as const, flip: false, tilt: 8,   imgScale: 1,    label: 'Researcher: Ailea Richter', link: 'https://www.linkedin.com/in/ailea-richter/' }, // 15832:5695
  { src: '/team/a3.png', align: 'center bottom' as const, flip: true,  tilt: -12, imgScale: 1,    label: 'PM: Jui Sathe',             link: 'https://www.linkedin.com/in/juisathe/' },      // 15832:5705
];

// Plays the same `oly-load` fade-in (fade + scale-up from 0.9) used by the
// page title every time the wrapped element scrolls into view. Pattern matches
// the TeamAvatars bounce: an IO on a stable outer wrapper increments `count`
// on each viewport entry; that count is keyed on an inner div so it remounts
// and the CSS animation restarts from frame 0.
function ScrollFadeIn({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCount((c) => c + 1); },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={style}>
      <div
        key={count}
        style={{
          opacity: count === 0 ? 0 : undefined,
          animation: count === 0 ? 'none' : 'oly-load 0.45s ease-out both',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Hover tooltip — recreated from Figma 15603:2694 (dark bubble + downward tail).
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#0F0F0F',
        color: '#D9D9D9',
        padding: '8px 14px',
        borderRadius: 4,
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
      }}
    >
      {children}
      {/* Downward tail — CSS triangle, centred under the bubble. */}
      <div
        style={{
          position: 'absolute',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid #0F0F0F',
        }}
      />
    </div>
  );
}

function TeamAvatars() {
  const ref = useRef<HTMLDivElement>(null);
  // bounceCount increments every time the avatars enter the viewport; it's part
  // of each avatar's key, so React remounts the element and the CSS animation
  // restarts from frame 0 (no disconnect on the observer).
  const [bounceCount, setBounceCount] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setBounceCount((c) => c + 1); },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center' }}>
      {AVATARS.map((a, i) => (
        // Outer = link + overlap + bounce + hover detection + tag anchoring.
        <a
          key={`${i}-${bounceCount}`}
          href={a.link}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover((cur) => (cur === i ? null : cur))}
          style={{
            position: 'relative',
            display: 'block',
            textDecoration: 'none',
            marginLeft: i > 0 ? -OVERLAP : 0,
            opacity: bounceCount === 0 ? 0 : undefined,
            animation: bounceCount === 0 ? 'none' : `oly-avatar-bounce 0.6s ${i * 0.18}s ease-out both`,
            zIndex: hover === i ? 2 : 1,
          }}
        >
          {/* Hover tag — pops up + fades in on hover, scaled from the tail. */}
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transformOrigin: 'bottom center',
              transform: hover === i ? 'translate(-50%, 0) scale(1)' : 'translate(-50%, 6px) scale(0.92)',
              opacity: hover === i ? 1 : 0,
              transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'none',
            }}
          >
            <Tag>{a.label}</Tag>
          </div>
          {/* Wobble wrapper — continuous ±3° rock around 0; composes with the
              static tilt on the inner circle. Negative animation-delay puts each
              avatar at a different phase; the wobble pauses on hover. */}
          <div
            style={{
              animation: bounceCount === 0 ? 'none' : `oly-avatar-wobble 5.5s ${-i * 1.6}s cubic-bezier(0.45, 0, 0.55, 1) infinite`,
              animationPlayState: hover === i ? 'paused' : 'running',
            }}
          >
            {/* Inner = circle frame + base tilt (straightens to 0° on hover). */}
            <div
              style={{
                width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: '50%',
                backgroundColor: '#f5f5f7', border: '2px solid #ffffff',
                boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
                transform: `rotate(${hover === i ? 0 : a.tilt}deg)`,
                transition: 'transform 0.25s ease',
              }}
            >
              <img
                src={a.src}
                alt=""
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: a.align,
                  // Compose flip + per-avatar img scale (PM is downsized 10%).
                  transform: `${a.flip ? 'scaleX(-1) ' : ''}scale(${a.imgScale})`,
                  display: 'block',
                }}
              />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

// Looping quote-card marquee — items move left → right. Track holds 2× copies
// of the cards; animating translateX from -50% to 0 advances the strip by half
// its width per cycle, so it loops seamlessly. Cards from Figma nodes
// 15834:5753/5763/5769/5773/5777 — quote testimonials, 400×320 rounded-40 with
// Manrope text; cards 1/3/5 grey, card 2 red, card 4 blue.
const QUOTES = [
  {
    bg: '#f5f5f7',
    quote: '“I need a clearer way to understand what is driving my polyp metrics, because right now I can see the result but not the reasons behind it.”',
    attribution: 'Anna de Vries, Erasmus MC,\nRotterdam, Netherlands',
  },
  {
    bg: '#FF3B30',
    quote: '“I want to see more context alongside the score, so I can tell whether a change is meaningful or just a temporary fluctuation.”',
    attribution: 'Thomas Müller, University Hospital Heidelberg, Heidelberg, Germany',
  },
  {
    bg: '#f5f5f7',
    quote: '“The data should help me focus on the most important issue first, instead of making me dig through too many charts and tables to find it.”',
    attribution: 'Marta García, Hospital Universitario\nLa Paz, Madrid, Spain',
  },
  {
    bg: '#007AFF',
    quote: '“I need a faster way to spot which results need follow-up, because the current view gives me numbers but not enough direction.”',
    attribution: 'Sophie Janssen,\nUMC Utrecht, Netherlands',
  },
  {
    bg: '#f5f5f7',
    quote: '“When I compare performance, I need case-mix context so I can tell whether variation reflects technique or just different procedures.”',
    attribution: 'Lukas Schneider, Charité – Universitätsmedizin Berlin, Germany',
  },
  {
    bg: '#34C759',
    quote: '“I want a solution that makes the results easy to interpret\nat a glance, so I can act quickly without second-guessing\nthe numbers.”',
    attribution: " Elena Rossi, Sant'Orsola-Malpighi \nHospital, Bologna, Italy",
  },
];

function PolaroidRow() {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: 32,
          width: 'fit-content',
          padding: '24px 0',
          animation: 'oly-polaroid-marquee 60s linear infinite',
        }}
      >
        {[...QUOTES, ...QUOTES].map((q, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 400,
              height: 320,
              backgroundColor: q.bg,
              borderRadius: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '32px 30px',
              boxSizing: 'border-box',
              color: '#000000',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 400,
                fontSize: 24,
                lineHeight: 'normal',
                width: 339,
                whiteSpace: 'pre-wrap',
              }}
            >
              {q.quote}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 'normal',
                width: 339,
                whiteSpace: 'pre-wrap',
              }}
            >
              {q.attribution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OlySensePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null); // wraps the Final Design sticky+rectangle below Process
  const [dashMax, setDashMax] = useState(0);
  const [vh, setVh] = useState(() => window.innerHeight);
  const [p, setP] = useState(0); // smoothed transition progress (0 = scaled-down, 1 = full)
  const [dashProgress, setDashProgress] = useState(0); // 0 = top of dashboard, 1 = scrolled to bottom; drives the tag fade-out near the end
  const [hasScrolled, setHasScrolled] = useState(false); // gates the top peel + Back Home button appearance
  const [spinDeg, setSpinDeg] = useState(0);             // avatar rotation in the peel, driven by scroll position
  const [homeHovered, setHomeHovered] = useState(false);

  // Refs mirror live values for the rAF easing loop (avoids stale closures).
  const vhRef = useRef(vh);
  const dashMaxRef = useRef(0);
  const scrollTopRef = useRef(0);
  const pRef = useRef(0);
  const rafRef = useRef(0);
  useEffect(() => { vhRef.current = vh; }, [vh]);
  useEffect(() => { dashMaxRef.current = dashMax; }, [dashMax]);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Measure how far the dashboard can scroll inside its frame.
  useEffect(() => {
    const measure = () => {
      const el = dashRef.current;
      if (el) setDashMax(Math.max(0, el.scrollHeight - el.clientHeight));
    };
    measure();
    const raf = requestAnimationFrame(measure);
    document.fonts?.ready.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    if (dashRef.current) ro.observe(dashRef.current);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  // First viewport of scroll runs the rectangle transition; everything past it
  // drives the dashboard's scroll directly (1:1, responsive). The transition
  // progress is eased toward its scroll target each frame so the rectangle scale,
  // text fade, chrome fade and panel expand glide smoothly even with coarse scroll.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tick = () => {
      const target = smoothstep(Math.min(1, scrollTopRef.current / vhRef.current));
      const next = pRef.current + (target - pRef.current) * 0.16;
      if (Math.abs(target - next) < 0.0005) {
        pRef.current = target; setP(target); rafRef.current = 0; return;
      }
      pRef.current = next; setP(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      // Track lives below Process. Compute progress relative to where the track
      // engages the sticky (its offsetTop inside the scroll container), so the
      // rectangle scale-up + dashboard scroll fire at the new location instead
      // of from page top.
      const st = el.scrollTop;
      const trackTop = trackRef.current?.offsetTop ?? 0;
      const stRel = Math.max(0, st - trackTop);
      scrollTopRef.current = stRel;
      const dash = dashRef.current;
      if (dash) dash.scrollTop = Math.max(0, Math.min(dashMaxRef.current, stRel - vhRef.current));
      const dashTop = Math.max(0, Math.min(dashMaxRef.current, stRel - vhRef.current));
      setDashProgress(dashMaxRef.current > 0 ? dashTop / dashMaxRef.current : 0);
      // Top peel + avatar — peel fades in after ~40 px of scroll; avatar spins
      // at 0.25 deg/px so a full rotation comes from ~1440 px of scroll.
      setHasScrolled(st > 40);
      setSpinDeg(st * 0.25);
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener('scroll', onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const scale = lerp(START_SCALE, 1, p);
  const dy = (vh / 2) * (1 - p);

  // Peel opacity — clears the stage early, well before the Final Design
  // rectangle reaches full width: fully visible up to p ≈ 0.12, gone by
  // p = 0.45.
  const peelTopOpacity = hasScrolled ? Math.max(0, Math.min(1, (0.45 - p) * 3)) : 0;

  const peelChrome: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    zIndex: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(24px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 8px 32px rgba(20, 24, 40, 0.08)',
    borderRadius: 999,
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transform: 'translateX(-50%)',
    transition: 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
  };

  // Shared inner content for both top and bottom peels.
  const peelInner = (
    <>
      <Link
        to="/"
        onMouseEnter={() => setHomeHovered(true)}
        onMouseLeave={() => setHomeHovered(false)}
        style={{
          border: '2px solid #000000',
          borderRadius: 32,
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          boxSizing: 'border-box',
          textDecoration: 'none',
          backgroundImage: 'linear-gradient(to right, #000000, #000000)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 0',
          backgroundSize: homeHovered ? '100% 100%' : '0% 100%',
          transition: 'background-size 0.4s ease-out',
        }}
      >
        {/* Left-pointing arrow — same lucide arrow path as the home CTA,
            flipped via scaleX(-1) so it points left; nudges leftward on
            hover via oly-arrow-nudge-left. */}
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
            width: 20,
            height: 20,
            animation: homeHovered ? 'oly-arrow-nudge-left 0.7s ease-in-out infinite' : 'none',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', transform: 'scaleX(-1)' }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4.58579L19.4142 12L12 19.4142L10.5858 18L15.5858 13H5V11H15.5858L10.5858 6L12 4.58579Z"
              style={{ fill: homeHovered ? '#FFFFFF' : '#000000' }}
            />
          </svg>
        </div>
        <p
          style={{
            fontFamily: "'Stack Sans Notch', sans-serif",
            fontWeight: 300,
            fontSize: 16,
            letterSpacing: '0.14px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            margin: 0,
            flexShrink: 0,
            paddingRight: 4,
          }}
        >
          {'Home'.split('').map((char, i) => (
            <span
              key={i}
              style={{
                color: homeHovered ? '#FFFFFF' : '#000000',
                fontSize: 16,
                lineHeight: '24px',
                transition: `color 0.35s ease-out ${i * 22}ms`,
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </p>
      </Link>

      {/* Avatar — 40 px circular avatar1 video. Rotates with page scroll. */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: '#F0F0F2',
          transform: `rotate(${spinDeg}deg)`,
          // No transition — angle follows scroll directly for a 1:1 feel.
        }}
      >
        <video
          src="/avatar1.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '36.5% center', display: 'block' }}
        />
      </div>
    </>
  );

  return (
    <div
      ref={scrollRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'none',
        backgroundColor: '#FFFFFF',
      }}
    >
      <style>{loadAnim}</style>

      {/* Peel — glass pill anchored 24 px from the top of the viewport,
          centred. Fades in once the page begins scrolling and stays visible
          for the rest of the page. */}
      <div
        style={{
          ...peelChrome,
          top: 24,
          opacity: peelTopOpacity,
          pointerEvents: peelTopOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        {peelInner}
      </div>

      {/* Hero — static title + subtext. The rectangle interaction has moved down
          to the Final Design section below Process, so this is just the page
          header now. Hero sizes to its content (no 100vh fill) so the Team
          section that follows hugs 120px below the Objective subtext. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          padding: '160px 24px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* Tag — same style as the home "SELECTED WORK" label (per-char colour wave) */}
        <p
          style={{
            fontFamily: "'Stack Sans Notch', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '34px',
            color: '#A8AFB6',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            margin: 0,
            animation: 'oly-load 0.45s ease-out both',
          }}
        >
          {Array.from('CASE STUDY').map((ch, i) => (
            <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', animation: 'selected-wave 2s ease-in-out infinite', animationDelay: `${i * 0.12}s` }}>
              {ch}
            </span>
          ))}
        </p>
        {/* Title — OlySense label style, sized to the home name (72px) */}
        <h1
          style={{
            fontFamily: "'Stack Sans Notch', sans-serif",
            fontWeight: 300,
            fontSize: 72,
            lineHeight: 'normal',
            color: '#000000',
            textAlign: 'center',
            margin: 0,
            animation: 'oly-load 0.45s ease-out both',
          }}
        >
          Polyps Metrics in
          <br />
          OlySense Insights
        </h1>
        {/* Subtext — same style as the home intro */}
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
            fontSize: 20,
            lineHeight: '34px',
            color: '#000000',
            textAlign: 'center',
            width: 440,
            margin: 0,
            animation: 'oly-load 0.45s 0.12s ease-out both',
          }}
        >
          Objective: Helping endoscopists to understand performance across key colonoscopy quality metrics.
        </p>
      </div>
      {/* Team section — sits 160px below the Objective subtext. */}
      <div style={{ marginTop: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <ScrollFadeIn>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Stack Sans Notch', sans-serif",
              fontWeight: 300, fontSize: 48, lineHeight: 'normal', color: '#000000',
            }}
          >
            Team
          </h2>
        </ScrollFadeIn>
        <TeamAvatars />
        {/* Timeline heading — 120px below the avatars (column gap 16 + marginTop 104). */}
        <ScrollFadeIn style={{ marginTop: 144 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Stack Sans Notch', sans-serif",
              fontWeight: 300, fontSize: 48, lineHeight: 'normal', color: '#000000',
            }}
          >
            Timeline
          </h2>
        </ScrollFadeIn>
        {/* Project timeline — 24px below the Timeline heading (column gap 16 + marginTop 8). */}
        <div style={{ marginTop: 8 }}>
          <PortfolioTimeline />
        </div>
        {/* PROBLEM tag — 120px below the timeline (column gap 16 + marginTop 104).
            Same style as the home SELECTED WORK label (per-char colour wave). */}
        <p
          style={{
            margin: 0,
            marginTop: 144,
            fontFamily: "'Stack Sans Notch', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '34px',
            color: '#A8AFB6',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {Array.from('PROBLEM').map((ch, i) => (
            <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', animation: 'selected-wave 2s ease-in-out infinite', animationDelay: `${i * 0.12}s` }}>
              {ch}
            </span>
          ))}
        </p>
        {/* Project statement — sits just below the PROBLEM tag via the column gap. */}
        <ScrollFadeIn>
          <p
            style={{
              margin: 0,
              fontFamily: "'Stack Sans Notch', sans-serif",
              fontWeight: 300,
              fontSize: 48,
              lineHeight: 'normal',
              color: '#000000',
              textAlign: 'center',
              maxWidth: 880,
              padding: '0 24px',
              boxSizing: 'border-box',
            }}
          >
            Clinicians needed a clearer, more actionable way to understand polyp quality metrics and what was driving their results.
          </p>
        </ScrollFadeIn>
        {/* Quote-card marquee — 24px below the paragraph (column gap 16 + marginTop 8). */}
        <div style={{ marginTop: 8, alignSelf: 'stretch' }}>
          <PolaroidRow />
        </div>
      </div>
      {/* Process scrollytell — sticky-left heading + section list, scrolling-right
          stack of light-grey mock rectangles. Active section swaps as each right-side
          rectangle reaches viewport centre. */}
      <ProcessScrollytell />
      {/* Final Design — the rectangle interaction lives here. Same mechanic as
          the old hero: 100vh of scroll scales the rectangle up from 0.75 (with
          its centre on the track's bottom edge) to full size, then the next
          `dashMax` of scroll drives the dashboard's internal scroll 1:1. The
          scroll handler computes progress relative to trackRef.offsetTop so the
          mechanic fires from this position instead of the page top. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div ref={trackRef} style={{ width: '100%', height: `calc(200vh + ${dashMax}px)`, position: 'relative' }}>
          {/* Sticky viewport — pinned while scrolling through the track. Holds
              BOTH the Final Design heading (pinned at top:120 inside the sticky
              so it lands at viewport y:120 the moment the sticky engages, same
              as the Process sticky-left column) AND the rectangle (still
              bottom-bleeding from translateY(vh/2) at p=0). When the user
              reaches this section they see the heading snap to the top and the
              rectangle simultaneously rise from the bottom. */}
          <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* Heading + summary — absolutely positioned at top:120 of the sticky.
                Sits in front of the rectangle (zIndex) so the dashboard never
                paints over it as the rectangle scales up. Both fade out as the
                user starts scrolling the rectangle into place, so the stage is
                clear by the time the rectangle reaches full size. The summary
                paragraph mirrors the hero's Objective text style. */}
            <div style={{ position: 'absolute', top: 160, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, zIndex: 10, pointerEvents: 'none', opacity: 1 - Math.min(1, p * 2) }}>
              <ScrollFadeIn>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Stack Sans Notch', sans-serif",
                    fontWeight: 300, fontSize: 48, lineHeight: 'normal', color: '#000000',
                  }}
                >
                  Final Design
                </h2>
              </ScrollFadeIn>
              {/* Workflows paragraph + THANK YOU! tag — wrapped in a 16px-gap
                  flex column so the THANK YOU! tag sits 16px below the
                  paragraph (matching PROBLEM's distance from "Clinicians needed…"
                  in the hero stack above). */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <ScrollFadeIn>
                  <p
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 500,
                      fontSize: 20,
                      lineHeight: '34px',
                      color: '#000000',
                      textAlign: 'center',
                      width: 440,
                      margin: 0,
                    }}
                  >
                    OlySense workflows were validated before launch through usability evaluation with target users, where participants completed 82% of key tasks successfully.
                  </p>
                </ScrollFadeIn>
                {/* THANK YOU! tag — same style as the home SELECTED WORK label
                    and the PROBLEM tag above (per-char colour wave). */}
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Stack Sans Notch', sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: '34px',
                    color: '#A8AFB6',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {Array.from('THANK YOU!').map((ch, i) => (
                    <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', animation: 'selected-wave 2s ease-in-out infinite', animationDelay: `${i * 0.12}s` }}>
                      {ch}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            {/* Rectangle — base frame size (1200 × 792). Rests at 0.75 scale with its
                centre on the bottom edge (half bleeds off); slides up + scales to full
                size, centred, as you scroll. Holds the Safari window with the app. */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: BASE_W,
                height: BASE_H,
                transform: `translate(-50%, -50%) translateY(${dy - 80 * (1 - p)}px) scale(${scale})`,
              }}
            >
              {/* Browser frame + dashboard. */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: p > 0.9 ? 'auto' : 'none' }}>
                <BrowserFrame expand={p}>
                  <PolypsDashboard ref={dashRef} selfScroll={false} />
                </BrowserFrame>
              </div>
              {/* Glass pill tag — anchored 48px from the bottom edge of the app rectangle. */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 48,
                  transform: 'translateX(-50%)',
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(24px) saturate(1.6)',
                  WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
                  color: '#6E6E73',
                  padding: '8px 16px',
                  borderRadius: 999,
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  opacity: Math.min(
                    Math.max(0, Math.min(1, p)),
                    Math.max(0, Math.min(1, (1 - dashProgress) * 5)),
                  ),
                  transition: 'opacity 0.15s ease-out',
                  pointerEvents: p < 0.5 || dashProgress > 0.99 ? 'none' : 'auto',
                }}
              >
                Interactive Prototype
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Process scrollytell ─────────────────────────────────────────────────────
// Sticky-left / flow-right pattern. The left column (Process h2 + section list)
// is `position: sticky` and vertically centred in the viewport, so it stays
// pinned while the right column — a tall stack of light-grey mock rectangles
// — scrolls past. An IntersectionObserver with a centred activation band
// (`rootMargin: -25% 0px -25% 0px`) reports which right-side rectangle is in
// the middle 50% of the viewport; the matching left-side row gets the active
// treatment (bold black title + expanded description). Inactive rows show
// just a muted-grey title with a thin divider above.

type ProcessDropdown = { id: string; title: string; description: string };

const PROCESS_DROPDOWNS: ProcessDropdown[] = [
  { id: 'discover', title: 'Contribution', description: 'I led the end‑to‑end product design—from translating complex guidelines into UX requirements, to low‑ and high‑fidelity testing with clinicians in multiple hospitals.\n\nThe experience focuses on ESGE‑defined (European Society of Gastrointestinal Endoscopy) metrics like Polyp Detection Rate (PDR), Polyp Retrieval Rate (PRR), morphology description, and appropriate polypectomy technique.' },
  { id: 'define', title: 'Understanding polyps & users', description: 'I started with a discovery report on ESGE polyp quality metrics, then translated it into two personas: endoscopists improving their own performance and endoscopy leads tracking department quality and outliers.\n\nTogether with our UX Researcher, I distilled user needs into three core questions: "Am I compliant with ESGE standards?", "What kinds of polyps am I detecting, resecting, and retrieving?", and "What might be driving high or low scores over time?".' },
  { id: 'design', title: 'Lo-Fi study and key learnings', description: 'I explored multiple Polyps concepts in low-fidelity prototypes — one page vs. two, charts vs. tables, and how much polyp detail to show by default. With our UX Researcher, I ran remote sessions with 10 clinicians across Spain and Germany.\n\nClinicians preferred a single Polyps page that tells the full story of detection, resection, and retrieval. They favored charts for Polyp Location and Size, with tables reserved for deeper analysis. BBPS, procedure count, and cecal intubation rate were key context for PDR; BBPS and procedure volume mattered most for PRR. Polyps by gender was low value and a candidate to remove.' },
  { id: 'hifi', title: 'Hi-Fi study and key findings', description: 'I built high-fidelity prototypes for a tabbed Polyps page and a long-scroll layout. In usability testing with seven clinicians across three hospitals, the tabbed layout reduced cognitive overload and prioritized PDR while keeping PRR accessible — though the PRR tab needed stronger affordance.\n\nParticipants preferred graphs for By Size and By Location, and tables for dense details like By Type and By Resection Method. Low-value views like By Number and By Time of Day were removed. Sizes were grouped into <5 mm, 5–10 mm, 10–20 mm, and >20 mm, and small colon segments were merged into broader regions to simplify the location chart.' },
];

// Contribution Venn — Figma node 15851:792. Three overlapping translucent
// circles (Design / Research / Product) on the square's 696×696 canvas with the
// team's existing avatars in coloured-border discs at each lobe and a label
// above. Positions and sizes come straight from the Figma node.
//
// On viewport entry: each circle slides in from its own off-canvas corner and
// scales up into place over ~0.9s; the avatars + labels fade in afterwards at
// ~0.7s delay so they land on the settled Venn. Replays on every re-entry.
const vennAnim = `
/* Outer (translate + opacity) entrance per circle. */
@keyframes oly-venn-design-t   { from { transform: translate(0px,   -260px); opacity: 0; } to { transform: translate(0, 0); opacity: 1; } }
@keyframes oly-venn-research-t { from { transform: translate(-280px, 180px); opacity: 0; } to { transform: translate(0, 0); opacity: 1; } }
@keyframes oly-venn-product-t  { from { transform: translate( 280px, 180px); opacity: 0; } to { transform: translate(0, 0); opacity: 1; } }
/* Inner (scale) entrance — shared by all three. */
@keyframes oly-venn-scale-in   { from { transform: scale(0.85); } to { transform: scale(1); } }
@keyframes oly-venn-pin-in   { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
@keyframes oly-venn-label-in { from { opacity: 0; transform: translate(-50%, 6px); } to { opacity: 1; transform: translate(-50%, 0); } }
@keyframes oly-venn-centre-in { from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
/* Ambient loops — breathe (scale) on the inner, drift (translate) on the outer. */
@keyframes oly-venn-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes oly-venn-drift {
  0%, 100% { transform: translate(0px, 0px); }
  25%      { transform: translate(5px, -4px); }
  50%      { transform: translate(0px, -7px); }
  75%      { transform: translate(-5px, -4px); }
}
`;
function ContributionVenn() {
  // revealCount-keyed remount: bumps each time the canvas enters the viewport
  // so the CSS animations restart from frame 0. Matches the TeamAvatars pattern.
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealCount, setRevealCount] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealCount((c) => c + 1); },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const firstRun = revealCount === 0;
  // Each circle is two nested divs so it can run two ambient loops with
  // different periods on the same `transform` property:
  //   • outer wrapper: handles entrance-translate + drift (translate animations)
  //   • inner disc:    handles entrance-scale + breathe (scale animations)
  // The 50% alpha lets two-layer overlaps darken naturally; paint order on the
  // OUTER list preserves Figma's teal → pink → purple stacking.
  const circleOuter = (left: number, top: number): React.CSSProperties => ({
    position: 'absolute',
    left,
    top,
    width: 300,
    height: 300,
  });
  const circleInner = (color: string): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: color,
  });
  // Team-style avatar — 80×80 disc with a 2px white ring, matching the hero
  // TeamAvatars treatment. `left/top` are top-left for an 80×80 box whose centre
  // sits at the supplied avatar centre (so it lines up with its label below).
  const AV_SIZE = 80;
  const avatar = (cx: number, cy: number): React.CSSProperties => ({
    position: 'absolute',
    left: cx - AV_SIZE / 2,
    top: cy - AV_SIZE / 2,
    width: AV_SIZE,
    height: AV_SIZE,
    borderRadius: 240,
    backgroundColor: '#f5f5f7',
    border: '2px solid #ffffff',
    boxSizing: 'border-box',
    overflow: 'hidden',
  });
  const label = (cx: number, top: number): React.CSSProperties => ({
    position: 'absolute',
    left: cx,
    top,
    transform: 'translateX(-50%)',
    margin: 0,
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 'normal',
    color: '#000000',
    whiteSpace: 'nowrap',
  });
  // Animation helpers — each element gets a revealCount-keyed remount so the
  // CSS animation restarts on every viewport entry. `firstRun` keeps everything
  // hidden until the IO has fired at least once.
  // Entrance keyframes run first (1.5s, fill-mode both holds end state); the
  // ambient breathe (scale) and drift (translate) loops then pick up forever.
  // `breatheDelay` / `driftDelay` shift each circle's loop start so the three
  // are ~1/3 of a period apart on each axis.
  const BREATHE_S = 5;
  const DRIFT_S = 12;
  const outerAnim = (translateName: string, driftDelay: number): React.CSSProperties => ({
    opacity: firstRun ? 0 : undefined,
    animation: firstRun
      ? 'none'
      : `${translateName} 1.5s cubic-bezier(0.22, 1, 0.36, 1) both, oly-venn-drift ${DRIFT_S}s ${driftDelay}s ease-in-out infinite`,
  });
  const innerAnim = (breatheDelay: number): React.CSSProperties => ({
    animation: firstRun
      ? 'none'
      : `oly-venn-scale-in 1.5s cubic-bezier(0.22, 1, 0.36, 1) both, oly-venn-breathe ${BREATHE_S}s ${breatheDelay}s ease-in-out infinite`,
  });
  const pinAnim: React.CSSProperties = {
    opacity: firstRun ? 0 : undefined,
    animation: firstRun ? 'none' : 'oly-venn-pin-in 0.7s 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
  };
  const labelAnim: React.CSSProperties = {
    opacity: firstRun ? 0 : undefined,
    animation: firstRun ? 'none' : 'oly-venn-label-in 0.7s 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
  };
  const centreAnim: React.CSSProperties = {
    opacity: firstRun ? 0 : undefined,
    animation: firstRun ? 'none' : 'oly-venn-centre-in 0.7s 1.8s cubic-bezier(0.22, 1, 0.36, 1) both',
  };

  // Shared horizontal centres so each avatar aligns precisely with its label.
  // y-centres pick the "outer tip" of each lobe (top of Design, bottom-outer of
  // the two lower circles), echoing the Figma source layout.
  const DESIGN_X = 348;
  const RESEARCH_X = 150.71;
  const PRODUCT_X = 534.5;
  const TOP_AV_Y = 126;
  const BOTTOM_AV_Y = 496;
  // Centroid of the three circle centres — where the OlySense label sits.
  const CENTRE_X = (346 + 273 + 423) / 3;   // ≈ 347.33
  const CENTRE_Y = (278 + 398 + 398) / 3;   // ≈ 358

  return (
    <div ref={containerRef} style={{ position: 'relative', width: 696, height: 696 }} data-name="contribution-venn">
      <style>{vennAnim}</style>
      {/* Translucent circles — each slides in from its off-canvas corner and
          settles into place. Paint order matches Figma (teal → pink → purple). */}
      <div key={`research-${revealCount}`} style={{ ...circleOuter(123, 248), ...outerAnim('oly-venn-research-t', 1.5) }}>
        <div style={{ ...circleInner('rgba(48, 176, 199, 0.5)'), ...innerAnim(1.5) }} />
      </div>
      <div key={`product-${revealCount}`} style={{ ...circleOuter(273, 248), ...outerAnim('oly-venn-product-t', 1.5 + DRIFT_S / 3) }}>
        <div style={{ ...circleInner('rgba(255, 45, 85, 0.5)'), ...innerAnim(1.5 + BREATHE_S / 3) }} />
      </div>
      <div key={`design-${revealCount}`} style={{ ...circleOuter(196, 128), ...outerAnim('oly-venn-design-t', 1.5 + (2 * DRIFT_S) / 3) }}>
        <div style={{ ...circleInner('rgba(175, 82, 222, 0.5)'), ...innerAnim(1.5 + (2 * BREATHE_S) / 3) }} />
      </div>

      {/* "OlySense" — fades in last at the centroid of all three circles
          (centre of the three-way overlap). White text, centred on the point. */}
      <p key={`centre-${revealCount}`} style={{
        position: 'absolute',
        left: CENTRE_X,
        top: CENTRE_Y,
        transform: 'translate(-50%, -50%)',
        margin: 0,
        fontFamily: "'Stack Sans Notch', sans-serif",
        fontWeight: 400,
        fontSize: 20,
        lineHeight: 'normal',
        color: '#FFFFFF',
        whiteSpace: 'nowrap',
        ...centreAnim,
      }}>
        OlySense
      </p>

      {/* Labels above each lobe — centred on the same X as their avatars. */}
      <p key={`l1-${revealCount}`} style={{ ...label(DESIGN_X,   54),  ...labelAnim }}>Design</p>
      <p key={`l2-${revealCount}`} style={{ ...label(RESEARCH_X, 544), ...labelAnim }}>Research</p>
      <p key={`l3-${revealCount}`} style={{ ...label(PRODUCT_X,  544), ...labelAnim }}>Product</p>

      {/* Avatars — Team-style 80×80 white-ringed discs with the existing photo
          alignments from AVATARS (a1 bottom, a2 centre, a3 bottom + flip). */}
      <div key={`a1-${revealCount}`} style={{ ...avatar(DESIGN_X,   TOP_AV_Y),    ...pinAnim }}>
        <img src="/team/a1.png" alt="Aleks" width={AV_SIZE} height={AV_SIZE}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
      </div>
      <div key={`a2-${revealCount}`} style={{ ...avatar(RESEARCH_X, BOTTOM_AV_Y), ...pinAnim }}>
        <img src="/team/a2.png" alt="Ailea" width={AV_SIZE} height={AV_SIZE}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} />
      </div>
      <div key={`a3-${revealCount}`} style={{ ...avatar(PRODUCT_X,  BOTTOM_AV_Y), ...pinAnim }}>
        <img src="/team/a3.png" alt="Jui" width={AV_SIZE} height={AV_SIZE}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', transform: 'scaleX(-1)' }} />
      </div>
    </div>
  );
}

// 5 polyp morphology cards used in square 2 — Figma nodes 15846:756/757/765/774/783.
// Each card has an identical layout (300×400 image well, 40px gap, 252-wide text
// block). Images are 280×280 PNGs downloaded into public/polyps/morphology/.
const POLYP_MORPH_CARDS: { img: string; title: string; body: string; alt: string }[] = [
  { img: '/polyps/morphology/pedunculated.png',        title: 'Pedunculated',        body: 'Grows on a stalk, like a mushroom.',                          alt: 'Pedunculated polyp illustration' },
  { img: '/polyps/morphology/sessile.png',             title: 'Sessile',             body: 'Flat or slightly raised, with no stalk',                       alt: 'Sessile polyp illustration' },
  { img: '/polyps/morphology/flat.png',                title: 'Flat',                body: 'Very low-profile and spread along the mucosal surface',        alt: 'Flat polyp illustration' },
  { img: '/polyps/morphology/depressed.png',           title: 'Depressed',           body: 'Slightly sunken below the surrounding tissue',                 alt: 'Depressed polyp illustration' },
  { img: '/polyps/morphology/laterally-spreading.png', title: 'Laterally spreading', body: 'Grows outward along the surface rather than upward',           alt: 'Laterally spreading polyp illustration' },
];

// One keyframe cycle = one full card slot. Each card uses the same keyframe with
// a negative animation-delay of -i × cycle/N, so the visible slots fan out evenly
// across the cycle and only one card is opaque at a time. The 3% / 17% / 20%
// stops give a brief fade-in, a hold, and a fade-out per slot.
const polypMorphAnim = `
@keyframes polyp-morph-carousel {
  0%   { opacity: 0; transform: scale(0.96); }
  3%   { opacity: 1; transform: scale(1); }
  17%  { opacity: 1; transform: scale(1); }
  20%  { opacity: 0; transform: scale(0.96); }
  100% { opacity: 0; transform: scale(0.96); }
}
`;

function PolypMorphologyCarousel() {
  // 5 cards × 3s per slot = 15s total cycle (~0.45s fade in / 2.1s hold / 0.45s fade out).
  const CYCLE_S = 15;
  return (
    <div style={{ position: 'relative', width: 360, height: 520 }} data-name="polyp-morphology-carousel">
      <style>{polypMorphAnim}</style>
      {POLYP_MORPH_CARDS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 360,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
            opacity: 0, // cards start hidden until the keyframe brings them in
            animation: `polyp-morph-carousel ${CYCLE_S}s linear ${(-i * CYCLE_S) / POLYP_MORPH_CARDS.length}s infinite`,
          }}
        >
          {/* Image well — square 360×360, image centred horizontally. */}
          <div style={{ position: 'relative', width: 360, height: 360, backgroundColor: '#fefefe', borderRadius: 24, overflow: 'hidden' }}>
            <img
              src={c.img}
              alt={c.alt}
              loading="lazy"
              decoding="async"
              style={{ position: 'absolute', left: '50%', top: 60, width: 280, height: 280, transform: 'translateX(-50%)', objectFit: 'cover', display: 'block' }}
            />
          </div>
          {/* Text */}
          <div style={{ width: 252, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, color: '#000000', textAlign: 'center', wordBreak: 'break-word' }}>
            <p style={{ margin: 0, fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 24, lineHeight: 'normal' }}>{c.title}</p>
            <p style={{ margin: 0, fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 18, lineHeight: 'normal' }}>{c.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// square3 — endo (left) and endo-lead (right) videos side-by-side with 24px
// rounded corners. The "active" video is enlarged and plays; the other shrinks.
// On load endo plays after a short delay; when it ends, endo shrinks while
// endo-lead simultaneously grows and starts playing. When endo-lead ends the
// cycle restarts, looping forever.
function EndoLeadDuet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const endoRef = useRef<HTMLVideoElement>(null);
  const leadRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false); // first-entry guard for the IO trigger
  const captionsTimerRef = useRef<number | null>(null);
  const [active, setActive] = useState<'endo' | 'lead'>('endo');
  // Index of the YouTube-style caption phrase currently showing on the active
  // video. Advanced from the video's playback position in handleTimeUpdate.
  const [captionIdx, setCaptionIdx] = useState(0);
  // Hidden until the active column finishes its width transition, so captions
  // don't appear over a still-expanding video.
  const [captionsReady, setCaptionsReady] = useState(false);

  // Match the colStyle width transition (0.9s). Called whenever a new video is
  // cued so the caption waits for the expansion to settle.
  const scheduleCaptions = () => {
    setCaptionsReady(false);
    if (captionsTimerRef.current) window.clearTimeout(captionsTimerRef.current);
    captionsTimerRef.current = window.setTimeout(() => setCaptionsReady(true), 900);
  };

  useEffect(() => () => {
    if (captionsTimerRef.current) window.clearTimeout(captionsTimerRef.current);
  }, []);

  const BIG = 432;
  const SMALL = 160;
  const H = 460;

  // Captions split into phrases so they reveal one chunk at a time as the video
  // plays, like burned-in YouTube subtitles. 'endo' = left column (endo-lead.mp4).
  const LEAD_CHUNKS = [
    'As an endoscopy lead,',
    'I need clear oversight of service metrics,',
    'staff scheduling, quality audits,',
    'and compliance training tracking.',
  ];
  const ENDO_CHUNKS = [
    'As an endoscopist,',
    'I need efficient tools for real-time procedure documentation,',
    'image capture,',
    'and seamless access to patient data during endoscopies.',
  ];

  // Start the loop only when square 3 scrolls into view (first time only); the
  // existing endo→lead→endo handoff keeps it running from there.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          window.setTimeout(() => {
            endoRef.current?.play().catch(() => {});
            scheduleCaptions();
          }, 500);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleEndoEnded = () => {
    setActive('lead');
    setCaptionIdx(0);
    scheduleCaptions();
    const v = leadRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const handleLeadEnded = () => {
    // Play once: endo → lead is the full sequence. Don't loop back to endo
    // (which used to create an infinite endo ↔ lead cycle). Both videos
    // rest on their final frame after the captioned pass is complete.
  };

  // Map playback progress → caption phrase index, but only for the playing video.
  const handleTimeUpdate = (which: 'endo' | 'lead') => (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (which !== active) return;
    const v = e.currentTarget;
    if (!v.duration || !isFinite(v.duration)) return;
    const chunks = which === 'endo' ? LEAD_CHUNKS : ENDO_CHUNKS;
    const idx = Math.min(chunks.length - 1, Math.floor((v.currentTime / v.duration) * chunks.length));
    setCaptionIdx((cur) => (cur === idx ? cur : idx));
  };

  const colStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? BIG : SMALL,
    flexShrink: 0,
    transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: H,
    objectFit: 'cover',
    borderRadius: 24,
    display: 'block',
  };

  // Burned-in caption look: centred near the bottom of the video, white text on
  // a translucent black plate, like YouTube auto-captions.
  const captionOverlay: React.CSSProperties = {
    position: 'absolute',
    bottom: 18,
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: '88%',
    backgroundColor: 'rgba(8, 8, 8, 0.78)',
    color: '#ffffff',
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: 1.35,
    padding: '4px 12px',
    borderRadius: 6,
    textAlign: 'center',
    pointerEvents: 'none',
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={colStyle(active === 'endo')}>
        <div style={{ position: 'relative', width: '100%' }}>
          <video
            ref={endoRef}
            src="/endo-lead.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={handleEndoEnded}
            onTimeUpdate={handleTimeUpdate('endo')}
            style={{ ...videoStyle, objectPosition: '30% center' }}
          />
          {active === 'endo' && captionsReady && (
            <div key={`endo-${captionIdx}`} style={{ ...captionOverlay, animation: 'oly-cap-fade 0.6s ease-in-out both' }}>
              {LEAD_CHUNKS[captionIdx]}
            </div>
          )}
        </div>
      </div>
      <div style={colStyle(active === 'lead')}>
        <div style={{ position: 'relative', width: '100%' }}>
          <video
            ref={leadRef}
            src="/endo.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={handleLeadEnded}
            onTimeUpdate={handleTimeUpdate('lead')}
            style={videoStyle}
          />
          {active === 'lead' && captionsReady && (
            <div key={`lead-${captionIdx}`} style={{ ...captionOverlay, animation: 'oly-cap-fade 0.6s ease-in-out both' }}>
              {ENDO_CHUNKS[captionIdx]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Right-track squares. Each square references a dropdown by index — squares
// that share a dropdownIdx all activate the same left-side row when scrolled
// into view. `content` is rendered inside; `fullBleed: true` drops the square's
// 40px padding and clips overflow so absolutely-positioned content (like the
// arc carousel) can reach into the rounded corners.
const PROCESS_SQUARES: { dropdownIdx: number; content?: React.ReactNode; fullBleed?: boolean }[] = [
  { dropdownIdx: 0, content: <ContributionVenn />, fullBleed: true },          // square1 — Contribution
  { dropdownIdx: 1, content: <PolypMorphologyCarousel /> },                    // square2 — Understanding polyps & users
  { dropdownIdx: 1, content: <EndoLeadDuet /> },                               // square3 — Understanding polyps & users (continued)
  { dropdownIdx: 2, content: <LoFiPolypsCharts />, fullBleed: true },          // square4 — Lo-Fi study and key learnings
  { dropdownIdx: 3, content: <HiFiCompare /> },                                 // square5 — Hi-Fi study and key findings
  { dropdownIdx: 3, content: <HiFiCorrelated /> },                              // square6 — Hi-Fi study and key findings (Correlated charts)
];

function ProcessScrollytell() {
  const squaresRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observers = squaresRef.current.map((el, sqIdx) => {
      if (!el) return null;
      const dropdownIdx = PROCESS_SQUARES[sqIdx]?.dropdownIdx ?? 0;
      const obs = new IntersectionObserver(
        ([entry]) => {
          // Multi-square dropdowns: every square in the group activates the
          // same left-side row.
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) setActiveIdx(dropdownIdx);
        },
        // Shrink the IO root to the middle 50% of the viewport so a section
        // becomes active when it's centred, not merely on-screen.
        { threshold: [0.5], rootMargin: '-25% 0px -25% 0px' },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section style={{ width: '100%', padding: '160px 48px 0', boxSizing: 'border-box' }}>
      <div
        style={{
          maxWidth: BASE_W,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '464px 1fr',
          gap: 40,
          alignItems: 'start',
        }}
      >
        {/* Left sticky column — Process h2 pinned at top: 160, with the dropdowns
            stack starting 24px below it. Right-column grey rectangles start at the
            same Y as the h2 (both align to the grid's top). */}
        <div
          style={{
            position: 'sticky',
            top: 160,
            height: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ScrollFadeIn>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Stack Sans Notch', sans-serif",
                fontWeight: 300,
                fontSize: 48,
                lineHeight: 'normal',
                color: '#000000',
              }}
            >
              Process
            </h2>
          </ScrollFadeIn>
          <div style={{ marginTop: 24 }}>
            {PROCESS_DROPDOWNS.map((d, i) => (
              <DropdownRow key={d.id} dropdown={d} active={i === activeIdx} isFirst={i === 0} />
            ))}
          </div>
        </div>
        {/* Right track — one light-grey rectangle per entry in PROCESS_SQUARES.
            Multiple squares can share the same dropdownIdx so one left-side row
            stays active across them as the viewer scrolls through. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {PROCESS_SQUARES.map((s, sqIdx) => (
            <div
              key={sqIdx}
              ref={(el) => {
                squaresRef.current[sqIdx] = el;
              }}
              data-dropdown={PROCESS_DROPDOWNS[s.dropdownIdx]?.id}
              data-square={sqIdx + 1}
              style={{
                backgroundColor: '#f5f5f7',
                borderRadius: 40,
                width: 696,
                height: 696,
                boxSizing: 'border-box',
                ...(s.fullBleed
                  ? { padding: 0, overflow: 'hidden' }
                  : { padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
              }}
            >
              {s.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Portfolio timeline ──────────────────────────────────────────────────────
// Recreation of Figma node 15841:741: a horizontal calendar timeline spanning
// March → May 2025. Month labels (#B2B2B2) sit at the top, weekly day numbers
// (Mar 3, Mar 10, … May 5) sit on a baseline below them, team avatars cluster
// at the start of each phase, and each phase is a coloured-border pill on a
// white fill. All positions are absolute in design-pixel coords so the layout
// matches the Figma exactly.

const TIMELINE_MONTHS = [
  { label: 'Mar 25', x: 0.98 },
  { label: 'Apr 25', x: 485.98 },
  { label: 'May 25', x: 874.98 },
];

// Light-grey card behind each month's date row. Each card fills its month's
// section of the timeline; cards are separated by a 4px gap.
const TIMELINE_MONTH_BGS = [
  { x: -6,  width: 480 }, // March: -6 → 474 (4px gap before April at 478)
  { x: 478, width: 385 }, // April: 478 → 863 (4px gap before May at 867)
  { x: 867, width: 68  }, // May:   867 → 935 (container end)
];

const TIMELINE_DAYS = [
  { label: '03', x: 0.98   },
  { label: '10', x: 99.98  },
  { label: '17', x: 195.98 },
  { label: '24', x: 290.98 },
  { label: '31', x: 389.98 },
  { label: '07', x: 485.98 },
  { label: '14', x: 583.98 },
  { label: '21', x: 679.98 },
  { label: '28', x: 775.98 },
  { label: '05', x: 874.98 },
];

const TIMELINE_PHASES = [
  { label: 'Discovery',              x: 0.98,   width: 115, color: '#FF3B30' },
  { label: 'Lo-Fi study',            x: 195.98, width: 190, color: '#FF9500' },
  { label: 'Hi-Fi study',            x: 389.98, width: 190, color: '#34C759' },
  { label: 'Design specs',           x: 583.98, width: 92,  color: '#AF52DE' },
  { label: 'Engineering support...', x: 679.98, width: 248.04, color: '#007AFF' },
];

// Per-phase avatars. Mapping derived from the Figma's three avatar assets:
// imgAvatar (flipped) = Jui (a3.png, also flipped in TeamAvatars); imgAvatar1
// = Ailea (a2.png, research phases only); imgAvatar2 = Aleks (a1.png, in every
// phase). Each entry's x is the design-pixel left-edge of that avatar circle.
// `phaseIdx` ties each avatar to its phase so they share the same stagger delay
// during the entrance reveal.
const TIMELINE_AVATARS = [
  // Discovery: Jui, Ailea, Aleks
  { x: 0.98,   src: '/team/a3.png', flip: true,  phaseIdx: 0 },
  { x: 28.98,  src: '/team/a2.png', flip: false, phaseIdx: 0 },
  { x: 56.98,  src: '/team/a1.png', flip: false, phaseIdx: 0 },
  // Lo-Fi: Ailea, Aleks
  { x: 195.98, src: '/team/a2.png', flip: false, phaseIdx: 1 },
  { x: 223.98, src: '/team/a1.png', flip: false, phaseIdx: 1 },
  // Hi-Fi: Ailea, Aleks
  { x: 389.98, src: '/team/a2.png', flip: false, phaseIdx: 2 },
  { x: 417.98, src: '/team/a1.png', flip: false, phaseIdx: 2 },
  // Design specs: Aleks
  { x: 583.98, src: '/team/a1.png', flip: false, phaseIdx: 3 },
  // Engineering: Jui, Aleks
  { x: 679.98, src: '/team/a3.png', flip: true,  phaseIdx: 4 },
  { x: 707.98, src: '/team/a1.png', flip: false, phaseIdx: 4 },
];

// Stagger delay per phase index (seconds). Phase 0 starts immediately, each
// later phase trails by 150ms so the timeline reads left-to-right as it builds.
const TIMELINE_STAGGER = 0.15;

// Convert a #RRGGBB hex to an rgba() string. Used to derive each pill's fill
// from its stroke colour at a low alpha so the fill reads as a tint of the
// border, not a competing surface.
function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function PortfolioTimeline() {
  // Same replay-on-entry pattern as TeamAvatars: revealCount increments each
  // time the timeline enters the viewport; it's baked into every pill and
  // avatar's React key, so they remount and the CSS animations restart from
  // frame 0. IO stays connected so this fires on every re-entry.
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealCount, setRevealCount] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealCount((c) => c + 1); },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Project timeline March through May 2025: Discovery, Lo-Fi study, Hi-Fi study, Design specs, and Engineering support"
      style={{ position: 'relative', width: 935, height: 140 }}
    >
      {/* Per-month light-grey cards behind the avatar + phase-pill band. Widths
          mirror the date columns above so each card sits under its month. Painted
          first so the avatars and pills sit on top. */}
      {TIMELINE_MONTH_BGS.map((b, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: b.x,
            top: 64,
            width: b.width,
            height: 74,
            backgroundColor: '#f5f5f7',
            borderRadius: 8,
          }}
        />
      ))}
      {/* Month labels (top: 0, black). */}
      {TIMELINE_MONTHS.map((m) => (
        <p
          key={m.label}
          style={{
            position: 'absolute',
            left: m.x,
            top: 0,
            margin: 0,
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: 16,
            lineHeight: 'normal',
            color: '#000000',
            whiteSpace: 'nowrap',
          }}
        >
          {m.label}
        </p>
      ))}

      {/* Day numbers — weekly intervals on a single baseline. */}
      {TIMELINE_DAYS.map((d) => (
        <p
          key={`${d.x}-${d.label}`}
          style={{
            position: 'absolute',
            left: d.x,
            top: 30,
            margin: 0,
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: 16,
            lineHeight: 'normal',
            color: '#B2B2B2',
            whiteSpace: 'nowrap',
          }}
        >
          {d.label}
        </p>
      ))}

      {/* Team avatars — 32×32 circles with #ebedf1 base and white border.
          Same drop-in bounce as the Team avatars; staggered per avatar so they
          land left → right in sequence. revealCount in the key remounts them
          on every viewport entry so the keyframe restarts cleanly. */}
      {TIMELINE_AVATARS.map((a, i) => (
        <div
          key={`avatar-${i}-${revealCount}`}
          style={{
            position: 'absolute',
            left: a.x,
            top: 72,
            width: 32,
            height: 32,
            borderRadius: 240,
            backgroundColor: '#f5f5f7',
            border: '1px solid #ffffff',
            overflow: 'hidden',
            boxSizing: 'border-box',
            opacity: revealCount === 0 ? 0 : undefined,
            animation: revealCount === 0 ? 'none' : `oly-timeline-avatar 0.45s ${i * 0.08}s cubic-bezier(0.22, 1, 0.36, 1) both`,
          }}
        >
          <img
            src={a.src}
            alt=""
            width={32}
            height={32}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: a.flip ? 'scaleX(-1)' : undefined,
            }}
          />
        </div>
      ))}

      {/* Phase pills — white #fcfcfc fill, 1px coloured border, 4px radius.
          Left-to-right clip-path reveal via the oly-timeline-line keyframe; the
          text stays unwarped because we're cropping a window, not scaling. Phase
          stagger leads each pill in sequentially. revealCount-keyed remount
          restarts the keyframe on every viewport entry. */}
      {TIMELINE_PHASES.map((p, i) => (
        <div
          key={`pill-${p.label}-${revealCount}`}
          style={{
            position: 'absolute',
            left: p.x,
            top: 107.82,
            width: p.width,
            backgroundColor: hexToRgba(p.color, 0.12),
            borderRadius: 4,
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            opacity: revealCount === 0 ? 0 : undefined,
            animation:
              revealCount === 0
                ? 'none'
                : `oly-timeline-line 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${i * TIMELINE_STAGGER}s both`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: 12,
              lineHeight: 'normal',
              color: '#000000',
              whiteSpace: 'nowrap',
            }}
          >
            {p.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// One dropdown row in the left-side stack. Active state crossfades the description
// in (maxHeight + opacity) so two adjacent rows can overlap during a transition.
function DropdownRow({ dropdown, active, isFirst }: { dropdown: ProcessDropdown; active: boolean; isFirst: boolean }) {
  return (
    <div
      style={{
        borderTop: isFirst ? 'none' : '1px solid #E5E7EB',
        padding: '24px 0',
      }}
    >
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 500,
          fontSize: 24,
          lineHeight: 'normal',
          color: active ? '#000000' : '#A8AFB6',
          transition: 'color 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {dropdown.title}
      </div>
      {/* Smooth accordion using grid-template-rows interpolation. Animating between
          0fr ↔ 1fr lets the browser tween to the actual content height without the
          per-frame layout work that max-height incurs, eliminating the jerkiness from
          two dropdowns reflowing simultaneously when sections switch. The inner div
          must have `min-height: 0` for the grid track to allow shrinking. */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: active ? '1fr' : '0fr',
          marginTop: active ? 12 : 0,
          transition:
            'grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            minHeight: 0,
            paddingRight: 8,
            opacity: active ? 1 : 0,
            transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {dropdown.description.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                marginTop: i === 0 ? 0 : 12,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '24px',
                color: '#000000',
                whiteSpace: 'pre-line',
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

