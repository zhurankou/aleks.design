import { useState, useEffect } from 'react';
import { BaseMatchCanvas } from './BaseMatchCanvas';
import { BASE_ICON_POOL, hslToHex, paletteFromColor, baseDotsAnim } from './NewPage';
import FigmaLogo from '../../assets/tool-figma.svg?react';

// Standalone recreation of the /new base view for iterating on it in isolation at /base-test:
// the rainbow-cycling 3×3 glass-tile + holographic-metal icon grid (with the swap/match game),
// the dotted animated background, and the base.24 / RESOURCE labels. Reuses BaseMatchCanvas and
// the exported pieces from NewPage so nothing is duplicated.

const RAINBOW_CYCLE_MS = 4000; // one full 360° hue rotation (matches /new)
const RAINBOW_SAT = 1;
const RAINBOW_LIGHT = 0.5;
const BASE_LABEL_OFFSET = 640 / 2 + 16;

const ARROW = 'M6.75736 7.75737C6.75736 7.20508 7.20507 6.75737 7.75736 6.75737L16.2426 6.75737C16.7949 6.75737 17.2426 7.20508 17.2426 7.75737V16.2427C17.2426 16.7949 16.7949 17.2427 16.2426 17.2427C15.6904 17.2427 15.2426 16.7949 15.2426 16.2427V10.1716L8.46447 16.9498C8.07394 17.3403 7.44078 17.3403 7.05025 16.9498C6.65973 16.5592 6.65973 15.9261 7.05025 15.5355L13.8284 8.75737L7.75736 8.75737C7.20507 8.75737 6.75736 8.30965 6.75736 7.75737Z';

export function BaseTest() {
  const [hover, setHover] = useState(false);
  const [displayedColor, setDisplayedColor] = useState(() => hslToHex(0, RAINBOW_SAT, RAINBOW_LIGHT));

  // Continuous rainbow hue rotation (same as /new's base scene).
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last >= 60) {
        last = now;
        const hue = (((now - start) / RAINBOW_CYCLE_MS) * 360) % 360;
        setDisplayedColor(hslToHex(hue, RAINBOW_SAT, RAINBOW_LIGHT));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const palette = paletteFromColor(displayedColor);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', backgroundColor: palette.pageBg }}>
      {/* Base rectangle — dotted animated grid background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'calc(100vw - 240px)', height: 'calc(100vh - 80px)', borderRadius: 40, overflow: 'hidden',
        backgroundColor: palette.gridBg,
        backgroundImage: `radial-gradient(${palette.dotMid} 2px, transparent 2px)`,
        backgroundSize: '20px 20px',
      }}>
        <style>{baseDotsAnim}</style>
        {[
          'base-dots-a 13s ease-in-out infinite',
          'base-dots-b 17s ease-in-out infinite',
          'base-dots-c 21s ease-in-out infinite',
        ].map((anim, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(${palette.dotLight} 2px, transparent 2px)`,
            backgroundSize: '20px 20px',
            WebkitMaskImage: 'radial-gradient(circle, #000 0%, #000 12%, transparent 58%)',
            maskImage: 'radial-gradient(circle, #000 0%, #000 12%, transparent 58%)',
            WebkitMaskSize: '65% 65%', maskSize: '65% 65%',
            WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
            animation: anim,
          }} />
        ))}
      </div>

      {/* 3×3 spinning-icon grid, centred */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: 640, height: 640, pointerEvents: 'auto' }}>
          <BaseMatchCanvas pool={BASE_ICON_POOL} color={palette.icon} playing />
        </div>
      </div>

      {/* base.24 title — left of the grid */}
      <div style={{ position: 'absolute', right: `calc(50% + ${BASE_LABEL_OFFSET}px)`, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 48, lineHeight: 'normal', color: '#A8A8A8', textAlign: 'right', margin: 0, whiteSpace: 'nowrap' }}>
          <span style={{ color: '#FFFFFF' }}>base</span>.24
        </p>
      </div>

      {/* RESOURCE panel — right of the grid */}
      <div style={{ position: 'absolute', left: `calc(50% + ${BASE_LABEL_OFFSET}px)`, top: '50%', transform: 'translateY(-50%)', width: 264, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize: 18, lineHeight: 'normal', color: '#FFFFFF', whiteSpace: 'nowrap', margin: 0 }}>RESOURCE</p>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 20, lineHeight: '34px', color: '#A8A8A8', margin: 0 }}>
          Created <span style={{ color: '#A8A8A8' }}>base.24</span>, an open source icon set for Figma Design Community
        </p>
        <a href="https://www.figma.com/community/file/1641498563291641806" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          style={{
            border: '2px solid #FCFCFC', borderRadius: 32, padding: '12px 20px', display: 'flex', alignItems: 'center',
            boxSizing: 'border-box', width: 'fit-content', textDecoration: 'none',
            backgroundImage: 'linear-gradient(to right, #FCFCFC, #FCFCFC)', backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0', backgroundSize: hover ? '100% 100%' : '0% 100%', transition: 'background-size 0.4s ease-out',
          }}>
          <span style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 16, letterSpacing: '0.16px', lineHeight: '34px', whiteSpace: 'nowrap', color: hover ? '#000000' : '#FFFFFF', transition: 'color 0.35s ease-out', paddingLeft: 4, display: 'inline-flex', alignItems: 'center' }}>
            View on
            <FigmaLogo style={{ width: 13.79, height: 20.66, display: 'inline-block', verticalAlign: 'middle', position: 'relative', top: -2, marginLeft: 5, marginRight: 5 }} />
            Community
          </span>
          <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 4, flexShrink: 0 }}>
            <path fillRule="evenodd" clipRule="evenodd" d={ARROW} fill={hover ? '#000000' : '#FFFFFF'} />
          </svg>
        </a>
      </div>
    </div>
  );
}
