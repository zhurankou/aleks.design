import { useState, useEffect, useRef, memo } from 'react';
import imgProfile from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";
import { PrivatHomeView } from './privat/PrivatHomeView';
import FigmaLogo from '../../assets/tool-figma.svg?react';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(hex1: string, hex2: string, t: number) {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const [r, g, b] = [0, 1, 2].map(i => Math.round(lerp(p(hex1, i), p(hex2, i), t)));
  return `rgb(${r},${g},${b})`;
}

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

const homeLoadAnim = `
  @keyframes home-load {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes panel-load {
    from { opacity: 0; transform: translateY(-50%) scale(0.9); }
    to   { opacity: 1; transform: translateY(-50%) scale(1); }
  }
  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes arrow-nudge-diag {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(2px, -2px); }
  }
  @keyframes arrow-nudge-right {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(3px); }
  }
`;

const NAME = 'Aleks Zhurankou';
// avatar1: plays while the name types in. avatar2: plays while the name deletes.
const AVATAR_VIDEOS = ['/avatar1.mp4', '/avatar2.mp4'];
const PAUSE_MS = 1000; // beat held after each full type / delete pass
const TEXT_SPAN_MS = 900; // the name types / deletes over this window at the start of each video, then holds

function HomeContent({ active }: { active: boolean }) {
  // Loop: pausedFull -> deleting (avatar2) -> pausedEmpty -> typing (avatar1) -> ...
  // The name shows on load (pausedFull); the loop runs while home is on screen.
  const [displayed, setDisplayed] = useState(NAME);
  const [phase, setPhase] = useState<'pausedFull' | 'deleting' | 'pausedEmpty' | 'typing'>('pausedFull');
  const [avatarReady, setAvatarReady] = useState(false);
  // Which video is on screen: 0 = avatar1 (typing pass), 1 = avatar2 (deleting pass).
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  // Play the phase's video from frame 0. The pause phases leave both videos parked.
  useEffect(() => {
    if (!active) return;
    const which = phase === 'deleting' ? 1 : phase === 'typing' ? 0 : -1;
    const vid = which >= 0 ? videoRefs.current[which] : null;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  }, [active, phase]);

  // 1s beat after each full pass, then start the next phase + crossfade to its video.
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 'pausedFull') {
      timer = setTimeout(() => { setActiveVideo(1); setPhase('deleting'); }, PAUSE_MS);
    } else if (phase === 'pausedEmpty') {
      timer = setTimeout(() => { setActiveVideo(0); setPhase('typing'); }, PAUSE_MS);
    }
    return () => clearTimeout(timer);
  }, [active, phase]);

  // When home scrolls off screen, reset the loop: pause + rewind both videos and
  // return to the name-shown state. It restarts fresh when home is back.
  useEffect(() => {
    if (active) return;
    videoRefs.current.forEach(v => {
      if (v) { v.pause(); v.currentTime = 0; }
    });
    setDisplayed(NAME);
    setPhase('pausedFull');
    setActiveVideo(0);
  }, [active]);

  // Type / delete the name over TEXT_SPAN_MS with a rAF loop — smooth, wall-clock paced,
  // independent of the video's coarse timeupdate events. Starts with the phase (and so
  // with its video), then stops once complete and the name just holds.
  useEffect(() => {
    if (!active || (phase !== 'typing' && phase !== 'deleting')) return;
    const typing = phase === 'typing';
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / TEXT_SPAN_MS);
      const shown = typing ? progress : 1 - progress;
      setDisplayed(NAME.slice(0, Math.round(shown * NAME.length)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [active, phase]);

  // avatar1 ends -> name fully typed, hold. avatar2 ends -> name cleared, hold.
  const handleVideoEnded = (which: number) => {
    if (!active) return;
    if (which === 0 && phase === 'typing') {
      setDisplayed(NAME);
      setPhase('pausedFull');
    } else if (which === 1 && phase === 'deleting') {
      setDisplayed('');
      setPhase('pausedEmpty');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, animation: 'home-load 0.45s ease-out both' }}>
      <div style={{
        position: 'relative',
        width: 180,
        height: 180,
        flexShrink: 0,
        borderRadius: '50%',
        overflow: 'hidden',
        opacity: avatarReady ? 1 : 0,
        transition: 'opacity 450ms ease-out',
      }}>
        {[0, 1].map((i) => (
          <video
            key={i}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={AVATAR_VIDEOS[i]}
            muted
            playsInline
            preload="auto"
            onLoadedData={i === 0 ? () => setAvatarReady(true) : undefined}
            onEnded={() => handleVideoEnded(i)}
            style={{
              position: 'absolute',
              inset: 0,
              width: 180,
              height: 180,
              objectFit: 'cover',
              // avatar1 (i=0) sits ~7.5% further left than avatar2.
              objectPosition: i === 0 ? '37% center' : '29.5% center',
              // avatar2 (i=1) is zoomed in ~5%.
              transform: i === 1 ? 'scale(1.05)' : undefined,
              opacity: i === activeVideo ? 1 : 0,
              transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.15)' }} />
      </div>
      <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontSize: 72, fontWeight: 400, lineHeight: 'normal', letterSpacing: '-1.92px', color: '#000000', textAlign: 'center', whiteSpace: 'nowrap', margin: 0 }}>
        {displayed}
        <span style={{ display: 'inline-block', width: 3, height: '0.72em', backgroundColor: '#000000', marginLeft: 4, verticalAlign: 'middle', animation: 'cursor-blink 0.75s ease-in-out infinite' }} />
      </p>
      <p style={{ fontFamily: "'Stack Sans Text', sans-serif", fontSize: 20, fontWeight: 300, lineHeight: '34px', color: '#000000', textAlign: 'center', width: 440, margin: 0 }}>
        I'm a product designer based in Seattle, WA, but living in code. I care deeply about craft, the details, and products with taste.
      </p>
    </div>
  );
}

const FRAME_H = 664;
const FRAME_W = 320;
const PEEK = 40;
const LIGHT_BLUE = '#BAE6FD'; // stage 2 frame fill + stroke
// Screen-x offset (from viewport center) of the Olysense label/description. The base title and
// description reuse it so they land at the same on-screen spot — now inside the grown 1200px square.
const BASE_LABEL_OFFSET = (FRAME_H / 2 + 48) * 1.15;

// Olysense fill: a soft, slowly drifting gradient — white base with a light-blue
// and a very-light-reddish radial blob, each easing around on its own slow loop.
const olyGlowAnim = `
  @keyframes oly-glow-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16%,13%)} }
  @keyframes oly-glow-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-14%,11%)} }
  @keyframes oly-glow-c { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12%,-15%)} }
  @keyframes oly-col-a {
    0%,100% { background: radial-gradient(circle at 30% 28%, rgba(170,205,244,0.72) 0%, rgba(170,205,244,0) 60%); }
    30%     { background: radial-gradient(circle at 30% 28%, rgba(182,200,240,0.72) 0%, rgba(182,200,240,0) 60%); }
    65%     { background: radial-gradient(circle at 30% 28%, rgba(162,208,246,0.72) 0%, rgba(162,208,246,0) 60%); }
  }
  @keyframes oly-col-b {
    0%,100% { background: radial-gradient(circle at 72% 34%, rgba(248,205,200,0.66) 0%, rgba(248,205,200,0) 62%); }
    38%     { background: radial-gradient(circle at 72% 34%, rgba(244,202,212,0.66) 0%, rgba(244,202,212,0) 62%); }
    70%     { background: radial-gradient(circle at 72% 34%, rgba(250,210,198,0.66) 0%, rgba(250,210,198,0) 62%); }
  }
  @keyframes oly-col-c {
    0%,100% { background: radial-gradient(circle at 50% 84%, rgba(206,190,236,0.72) 0%, rgba(206,190,236,0) 60%); }
    33%     { background: radial-gradient(circle at 50% 84%, rgba(218,192,230,0.72) 0%, rgba(218,192,230,0) 60%); }
    68%     { background: radial-gradient(circle at 50% 84%, rgba(198,196,240,0.72) 0%, rgba(198,196,240,0) 60%); }
  }
`;

// Base fill: lighter dots drift across the #262626 grid in soft waves. Each masked layer
// animates its mask-position on its own slow, non-harmonic loop so the waves never sync up.
const baseDotsAnim = `
  @keyframes base-dots-a {
    0%,100% { -webkit-mask-position: 6% 16%; mask-position: 6% 16%; }
    50%     { -webkit-mask-position: 92% 78%; mask-position: 92% 78%; }
  }
  @keyframes base-dots-b {
    0%,100% { -webkit-mask-position: 90% 12%; mask-position: 90% 12%; }
    50%     { -webkit-mask-position: 18% 88%; mask-position: 18% 88%; }
  }
  @keyframes base-dots-c {
    0%,100% { -webkit-mask-position: 42% 94%; mask-position: 42% 94%; }
    50%     { -webkit-mask-position: 68% 8%; mask-position: 68% 8%; }
  }
`;

// Metallic-silver shine: a diagonal highlight sweeps across the frame surface, looped slowly.
const frameShineAnim = `
  @keyframes frame-shine {
    0%   { background-position: 200% 0; }
    100% { background-position: -100% 0; }
  }
`;

const SquareGlow = memo(function SquareGlow() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', overflow: 'hidden' }}>
      <style>{olyGlowAnim}</style>
      <div style={{ position: 'absolute', inset: '-30%', background: 'radial-gradient(circle at 30% 28%, rgba(170,205,244,0.72) 0%, rgba(170,205,244,0) 60%)', animation: 'oly-glow-a 15s ease-in-out infinite, oly-col-a 19s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: '-30%', background: 'radial-gradient(circle at 72% 34%, rgba(248,205,200,0.66) 0%, rgba(248,205,200,0) 62%)', animation: 'oly-glow-b 18s ease-in-out infinite, oly-col-b 13s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: '-30%', background: 'radial-gradient(circle at 50% 84%, rgba(206,190,236,0.72) 0%, rgba(206,190,236,0) 60%)', animation: 'oly-glow-c 16s ease-in-out infinite, oly-col-c 23s ease-in-out infinite' }} />
    </div>
  );
});

export function NewPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sharedCircleRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [vh, setVh] = useState(() => window.innerHeight);
  const [visitHovered, setVisitHovered] = useState(false);
  const [olyVisitHovered, setOlyVisitHovered] = useState(false);
  const [baseVisitHovered, setBaseVisitHovered] = useState(false);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Three-stage scroll: 0→⅓ home → Privat, ⅓→⅔ Privat → Olysense, ⅔→1 Olysense → base.
  const pStage1 = smoothstep(Math.min(1, progress * 3));
  const pStage2 = smoothstep(Math.min(1, Math.max(0, (progress - 1 / 3) * 3)));
  const pStage3 = smoothstep(Math.min(1, Math.max(0, (progress - 2 / 3) * 3)));

  // Stage 2 sub-phases.
  const pPanelFade = Math.min(1, pStage2 / 0.2);
  const pBgWhite = Math.min(1, Math.max(0, (pStage2 - 0.1) / 0.25));
  // Frame morph: spread across most of stage 2 with smoothstep for a slow, gentle morph.
  const pFrameMorph = smoothstep(Math.min(1, Math.max(0, (pStage2 - 0.30) / 0.70)));
  // Inner content fade-out: completes quicker than the frame morph so the PWA contents
  // clear out before the frame finishes expanding to a square.
  const pContentFade = smoothstep(Math.min(1, Math.max(0, (pStage2 - 0.30) / 0.30)));

  // Stage 3 sub-phases — Olysense → base.
  const pOlyFadeOut = Math.min(1, pStage3 / 0.25); // Olysense name + description clear out first
  const baseVisible = pStage3 >= 0.85;             // base title + description appear once the square is essentially grown

  // Stage 2 morphs the PWA rectangle into a 664² square; stage 3 widens it to a 1496px-wide
  // rectangle that keeps the Olysense square's on-screen height (FRAME_H × 1.15).
  const frameWidth = lerp(lerp(FRAME_W, FRAME_H, pFrameMorph), 1528, pStage3);
  const frameHeight = lerp(FRAME_H, FRAME_H * 1.15, pStage3);
  // Stage 2 fades the border out; stage 3 keeps it at 0 (base view has no stroke).
  const frameBorderWidth = lerp(5, 0, pFrameMorph);
  const frameTop = lerp(vh - PEEK, (vh - frameHeight) / 2, pStage1);
  // Stage 1 scales the frame to 1.15; stage 3 eases it back to 1 so the 1200px square renders 1:1.
  const frameScale = lerp(lerp(1, 1.15, pStage1), 1, pStage3);
  // Panels fade in like the home-load intro (opacity 0→1, scale 0.9→1, 700ms)
  // when the showcase is reached, and fade back out when scrolling away or into stage 2.
  const panelsVisible = pStage1 >= 0.9 && pPanelFade === 0;
  const panelOpacity = panelsVisible ? 1 : 0;
  const panelScale = panelsVisible ? 1 : 0.9;
  // Avoid chaining lerpColor — it returns rgb() format and would re-parse as hex (NaN).
  // Stage 2 ramps the page bg black → white; stage 3 ramps it white → black.
  const bg = pStage3 > 0
    ? lerpColor('#ffffff', '#000000', pStage3)
    : pBgWhite > 0
    ? lerpColor('#000000', '#ffffff', pBgWhite)
    : lerpColor('#ffffff', '#000000', pStage1);
  // Border: stage 1 ends at silver #A8AFB6 so the overlay shine pops; stage 2 → light blue; stage 3 → dark grey.
  const borderColor = pStage3 > 0
    ? lerpColor(LIGHT_BLUE, '#333333', pStage3)
    : pFrameMorph > 0
    ? lerpColor('#A8AFB6', LIGHT_BLUE, pFrameMorph)
    : lerpColor('#000000', '#A8AFB6', pStage1);
  const contentOpacity = 1 - pStage1;
  // OlySense label appears once the square is essentially formed.
  const olySenseVisible = pFrameMorph >= 0.9;
  const frameContentOpacity = 1 - pContentFade;
  const pwaActive = pStage1 >= 0.95 && pStage2 < 0.05;
  // Home is "active" only at the top snap point — gates the avatar video loop.
  const homeActive = pStage1 < 0.05;

  return (
    <div
      ref={scrollRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'none',
        scrollSnapType: 'y mandatory',
      }}
    >
      {/* Scroll track — 400vh: stage 1 home→Privat, stage 2 Privat→Olysense, stage 3 Olysense→base */}
      <div style={{ height: '400vh', position: 'relative' }}>
        {/* Native CSS scroll-snap targets at 0vh, 100vh, 200vh, 300vh.
            `scroll-snap-stop: always` forces a stop at each — momentum can't skip mid. */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${i * 100}vh`,
              left: 0,
              width: 1,
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              pointerEvents: 'none',
            }}
          />
        ))}
        {/* Sticky visual layer */}
        <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: bg }}>
          <style>{homeLoadAnim}</style>
          {/* Home content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: contentOpacity, pointerEvents: contentOpacity < 0.01 ? 'none' : 'auto' }}>
            <HomeContent active={homeActive} />
          </div>
          {/* Selected work label */}
          <div style={{ position: 'absolute', bottom: PEEK + 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: contentOpacity, pointerEvents: 'none' }}>
            {/* Tag: 18px. Sits outside the scale(1.15) frame, so source size == final size. */}
            <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize: 18, lineHeight: '34px', color: '#000000', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, animation: 'home-load 0.45s 0.08s ease-out both' }}>
              SELECTED WORK
            </p>
          </div>
          {/* PWA frame + label */}
          <div style={{
            position: 'absolute',
            top: frameTop,
            left: '50%',
            transform: `translateX(-50%) scale(${frameScale})`,
            transformOrigin: 'center center',
            width: frameWidth,
            height: frameHeight,
            willChange: 'transform, top, width',
          }}>
            {/* Privat label — project name, styled like the Olysense label */}
            <div style={{
              position: 'absolute',
              right: 'calc(100% + 52px)',
              top: '50%',
              transform: `translateY(-50%) scale(${panelScale})`,
              transformOrigin: 'center center',
              opacity: panelOpacity,
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
              pointerEvents: 'none',
            }}>
              <p style={{
                fontFamily: "'Stack Sans Notch', sans-serif",
                fontWeight: 300,
                fontSize: 34.78, // project name: 40px final ÷ 1.15 frame scale
                lineHeight: 'normal',
                color: '#fcfcfc',
                textAlign: 'center',
                margin: 0,
                whiteSpace: 'nowrap',
              }}>
                Privat
              </p>
            </div>
            {/* OlySense label — appears on the left of the final blue square */}
            <div style={{
              position: 'absolute',
              right: 'calc(100% + 48px)',
              top: '50%',
              transform: `translateY(-50%) scale(${olySenseVisible ? 1 : 0.9})`,
              transformOrigin: 'center center',
              opacity: olySenseVisible ? 1 - pOlyFadeOut : 0,
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
              pointerEvents: 'none',
            }}>
              <p style={{
                fontFamily: "'Stack Sans Notch', sans-serif",
                fontWeight: 300,
                fontSize: 34.78, // project name: 40px final ÷ 1.15 frame scale
                lineHeight: 'normal',
                color: '#000000',
                textAlign: 'center',
                margin: 0,
                whiteSpace: 'nowrap',
              }}>
                OlySense
              </p>
            </div>
            {/* Right panel — 80px to the right, vertically centered */}
            <div style={{
              position: 'absolute',
              left: 'calc(100% + 52px)',
              top: '50%',
              transform: `translateY(-50%) scale(${panelScale})`,
              transformOrigin: 'center center',
              width: 264,
              display: 'flex',
              flexDirection: 'column',
              opacity: panelOpacity,
              gap: 24,
              pointerEvents: panelsVisible ? 'auto' : 'none',
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            }}>
              {/* Tag: 18px final ÷ 1.15 frame scale. */}
              <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 400, fontSize: 15.65, lineHeight: 'normal', color: '#FCFCFC', whiteSpace: 'nowrap', margin: 0 }}>
                PERSONAL PROJECT
              </p>
              <p style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 300, fontSize: 17.39, lineHeight: '29.57px', color: '#959595', margin: 0 }}>
                Designing and building <span style={{ color: '#FCFCFC' }}>Privat</span>, an application for instant 1:1 video sessions.
              </p>
              <a
                href="https://goprivat.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setVisitHovered(true)}
                onMouseLeave={() => setVisitHovered(false)}
                style={{
                  border: '1.74px solid #FCFCFC', // renders 2px at the 1.15 frame scale
                  borderRadius: 27.83, // 32 ÷ 1.15 frame scale
                  padding: '10.43px 17.39px', // 12px 20px ÷ 1.15 frame scale
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: 'fit-content',
                  textDecoration: 'none',
                  backgroundImage: 'linear-gradient(to right, #FCFCFC, #FCFCFC)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 0',
                  backgroundSize: visitHovered ? '100% 100%' : '0% 100%',
                  transition: 'background-size 0.4s ease-out',
                }}>
                <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 13.91, letterSpacing: '0.14px', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, flexShrink: 0, paddingLeft: 3.48 }}>
                  {'Visit goprivat.com'.split('').map((char, i) => {
                    const total = 'Visit goprivat.com'.length;
                    const delay = visitHovered ? i * 22 : (total - 1 - i) * 22;
                    return (
                      <span
                        key={i}
                        style={{
                          color: visitHovered ? '#000000' : '#FFFFFF',
                          fontSize: 13.91, // CTA: 16px final ÷ 1.15 frame scale
                          lineHeight: '29.57px', // 34px ÷ 1.15 frame scale
                          transition: `color 80ms linear ${delay}ms`,
                        }}
                      >
                        {char === ' ' ? ' ' : char}
                      </span>
                    );
                  })}
                </p>
                <div style={{ position: 'relative', flexShrink: 0, width: 20.87, height: 20.87, animation: visitHovered ? 'arrow-nudge-diag 0.7s ease-in-out infinite' : 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.75736 7.75737C6.75736 7.20508 7.20507 6.75737 7.75736 6.75737L16.2426 6.75737C16.7949 6.75737 17.2426 7.20508 17.2426 7.75737V16.2427C17.2426 16.7949 16.7949 17.2427 16.2426 17.2427C15.6904 17.2427 15.2426 16.7949 15.2426 16.2427V10.1716L8.46447 16.9498C8.07394 17.3403 7.44078 17.3403 7.05025 16.9498C6.65973 16.5592 6.65973 15.9261 7.05025 15.5355L13.8284 8.75737L7.75736 8.75737C7.20507 8.75737 6.75736 8.30965 6.75736 7.75737Z" style={{ fill: visitHovered ? '#000000' : '#FFFFFF' }} />
                  </svg>
                </div>
              </a>
            </div>
            {/* OlySense description + Visit button — right of the blue square (reversed colors) */}
            <div style={{
              position: 'absolute',
              left: 'calc(100% + 48px)',
              top: '50%',
              transform: `translateY(-50%) scale(${olySenseVisible ? 1 : 0.9})`,
              transformOrigin: 'center center',
              width: 264,
              display: 'flex',
              flexDirection: 'column',
              opacity: olySenseVisible ? 1 - pOlyFadeOut : 0,
              gap: 24,
              pointerEvents: olySenseVisible && pOlyFadeOut < 1 ? 'auto' : 'none',
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            }}>
              {/* Tag: 18px final ÷ 1.15 frame scale. */}
              <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize: 15.65, lineHeight: 'normal', color: '#000000', whiteSpace: 'nowrap', margin: 0 }}>
                CASE STUDY
              </p>
              <p style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 300, fontSize: 17.39, lineHeight: '29.57px', color: '#000000', margin: 0 }}>
                Led research and design for <span style={{ color: '#000000', fontWeight: 700 }}>OlySense Insights</span>, an endoscopy KPI dashboard.
              </p>
              <a
                href="https://olysense.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setOlyVisitHovered(true)}
                onMouseLeave={() => setOlyVisitHovered(false)}
                style={{
                  border: '1.74px solid #000000', // renders 2px at the 1.15 frame scale
                  borderRadius: 27.83, // 32 ÷ 1.15 frame scale
                  padding: '10.43px 17.39px', // 12px 20px ÷ 1.15 frame scale
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: 'fit-content',
                  textDecoration: 'none',
                  backgroundImage: 'linear-gradient(to right, #000000, #000000)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 0',
                  backgroundSize: olyVisitHovered ? '100% 100%' : '0% 100%',
                  transition: 'background-size 0.4s ease-out',
                }}>
                <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 13.91, letterSpacing: '0.14px', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, flexShrink: 0, paddingLeft: 3.48 }}>
                  {'Read case study'.split('').map((char, i) => (
                    <span
                      key={i}
                      style={{
                        color: olyVisitHovered ? '#FFFFFF' : '#000000',
                        fontSize: 13.91, // CTA: 16px final ÷ 1.15 frame scale
                        lineHeight: '29.57px', // 34px ÷ 1.15 frame scale
                        transition: `color 0.35s ease-out ${i * 22}ms`,
                      }}
                    >
                      {char === ' ' ? ' ' : char}
                    </span>
                  ))}
                </p>
                <div style={{ position: 'relative', flexShrink: 0, width: 20.87, height: 20.87, animation: olyVisitHovered ? 'arrow-nudge-right 0.7s ease-in-out infinite' : 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 4.58579L19.4142 12L12 19.4142L10.5858 18L15.5858 13H5V11H15.5858L10.5858 6L12 4.58579Z" style={{ fill: olyVisitHovered ? '#FFFFFF' : '#000000' }} />
                  </svg>
                </div>
              </a>
            </div>
            {/* Frame */}
            <div style={{
              width: '100%',
              height: '100%',
              border: `${frameBorderWidth}px solid ${borderColor}`,
              borderRadius: 40,
              overflow: 'hidden',
              boxSizing: 'border-box',
              position: 'relative',
            }}>
              <div style={{ width: '100%', height: '100%', opacity: frameContentOpacity }}>
                <PrivatHomeView active={pwaActive} circleRef={sharedCircleRef} />
              </div>
              {/* Silver shine — a diagonal highlight sweeps the frame, fades in only while the silver border is visible. */}
              {pFrameMorph > 0 && pStage3 < 1 && (
                <>
                  <style>{frameShineAnim}</style>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: pFrameMorph * (1 - pStage3),
                    background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.25) 44%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.25) 56%, transparent 70%)',
                    backgroundSize: '280% 100%',
                    animation: 'frame-shine 4s ease-in-out infinite',
                    mixBlendMode: 'overlay',
                  }} />
                </>
              )}
              {/* Stage 2 — soft animated gradient fill (fades back out during stage 3) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: pFrameMorph * (1 - pStage3),
                pointerEvents: 'none',
              }}>
                {pFrameMorph > 0.01 && pStage3 < 1 && <SquareGlow />}
              </div>
              {/* Stage 3 — base fill: very dark gray + a #262626 dot grid, with lighter dots
                  drifting across it in soft, random-feeling waves (3 masked layers) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: pStage3,
                backgroundColor: '#141414',
                backgroundImage: 'radial-gradient(#262626 2px, transparent 2px)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none',
              }}>
                {pStage3 > 0.01 && (
                  <>
                    <style>{baseDotsAnim}</style>
                    {[
                      'base-dots-a 13s ease-in-out infinite',
                      'base-dots-b 17s ease-in-out infinite',
                      'base-dots-c 21s ease-in-out infinite',
                    ].map((anim, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        inset: 0,
                        // Lighter dots on the same 20px grid, so they sit exactly on the base dots.
                        backgroundImage: 'radial-gradient(#4D4D4D 2px, transparent 2px)',
                        backgroundSize: '20px 20px',
                        // Soft drifting blob reveals a patch of lighter dots; edges blend the greys.
                        WebkitMaskImage: 'radial-gradient(circle, #000 0%, #000 12%, transparent 58%)',
                        maskImage: 'radial-gradient(circle, #000 0%, #000 12%, transparent 58%)',
                        WebkitMaskSize: '65% 65%',
                        maskSize: '65% 65%',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        animation: anim,
                      }} />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          {/* base title — fades in at the Olysense title's old screen spot, now inside the 1200px square */}
          <div style={{
            position: 'absolute',
            right: `calc(50% + ${BASE_LABEL_OFFSET}px)`,
            top: '50%',
            transform: `translateY(-50%) scale(${baseVisible ? 1 : 0.9})`,
            transformOrigin: 'center center',
            opacity: baseVisible ? 1 : 0,
            transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            pointerEvents: 'none',
          }}>
            <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 40, lineHeight: 'normal', color: '#8A8A8A', textAlign: 'center', margin: 0, whiteSpace: 'nowrap' }}>
              <span style={{ color: '#FFFFFF' }}>base</span>.24
            </p>
          </div>
          {/* base tag + description + CTA — fades in at the Olysense panel's old screen spot, now inside the rectangle */}
          <div style={{
            position: 'absolute',
            left: `calc(50% + ${BASE_LABEL_OFFSET}px)`,
            top: '50%',
            transform: `translateY(-50%) scale(${baseVisible ? 1 : 0.9})`,
            transformOrigin: 'center center',
            width: 264,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            opacity: baseVisible ? 1 : 0,
            transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            pointerEvents: baseVisible ? 'auto' : 'none',
          }}>
            {/* Tag */}
            <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize: 18, lineHeight: 'normal', color: '#FFFFFF', whiteSpace: 'nowrap', margin: 0 }}>
              RESOURCE
            </p>
            <p style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 300, fontSize: 20, lineHeight: '34px', color: '#8A8A8A', margin: 0 }}>
              Created <span style={{ color: '#FFFFFF' }}>base.24</span>, an open source icon set for Figma Design Community
            </p>
            <a
              href="#"
              onMouseEnter={() => setBaseVisitHovered(true)}
              onMouseLeave={() => setBaseVisitHovered(false)}
              style={{
                border: '2px solid #FCFCFC',
                borderRadius: 32,
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                width: 'fit-content',
                textDecoration: 'none',
                backgroundImage: 'linear-gradient(to right, #FCFCFC, #FCFCFC)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0 0',
                backgroundSize: baseVisitHovered ? '100% 100%' : '0% 100%',
                transition: 'background-size 0.4s ease-out',
              }}>
              <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 16, letterSpacing: '0.16px', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, flexShrink: 0, paddingLeft: 4 }}>
                {'View on '.split('').map((char, i) => (
                  <span
                    key={i}
                    style={{
                      color: baseVisitHovered ? '#000000' : '#FFFFFF',
                      fontSize: 16,
                      lineHeight: '34px',
                      transition: `color 0.35s ease-out ${i * 22}ms`,
                    }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
                {/* Figma logo — sized to the 16px text height, sits before "Community" */}
                <FigmaLogo style={{ width: 13.79, height: 20.66, display: 'inline-block', verticalAlign: 'middle', position: 'relative', top: -2, marginLeft: 3, marginRight: 5 }} />
                {'Community'.split('').map((char, i) => (
                  <span
                    key={`community-${i}`}
                    style={{
                      color: baseVisitHovered ? '#000000' : '#FFFFFF',
                      fontSize: 16,
                      lineHeight: '34px',
                      transition: `color 0.35s ease-out ${(i + 8) * 22}ms`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </p>
              <div style={{ position: 'relative', flexShrink: 0, width: 24, height: 24, animation: baseVisitHovered ? 'arrow-nudge-diag 0.7s ease-in-out infinite' : 'none' }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.75736 7.75737C6.75736 7.20508 7.20507 6.75737 7.75736 6.75737L16.2426 6.75737C16.7949 6.75737 17.2426 7.20508 17.2426 7.75737V16.2427C17.2426 16.7949 16.7949 17.2427 16.2426 17.2427C15.6904 17.2427 15.2426 16.7949 15.2426 16.2427V10.1716L8.46447 16.9498C8.07394 17.3403 7.44078 17.3403 7.05025 16.9498C6.65973 16.5592 6.65973 15.9261 7.05025 15.5355L13.8284 8.75737L7.75736 8.75737C7.20507 8.75737 6.75736 8.30965 6.75736 7.75737Z" style={{ fill: baseVisitHovered ? '#000000' : '#FFFFFF' }} />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
