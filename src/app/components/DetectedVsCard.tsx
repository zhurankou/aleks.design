import { useEffect, useState } from 'react';
import { useFocusPlay } from './useFocusPlay';
import { Odometer } from './CountUp';

// "Detected vs retrieved polyps" donut card (Figma 15771:1062). Donut drawn as two
// rounded-corner arc segments (corner radius ~4px, matching the Figma's thick ring:
// outer ~70, inner ~19), each with a radial gradient (full at the rim → faded toward
// the hole) over an #ECF2FF backing (same as the bars/area). A small angular gap
// separates them. On focus the split animates — blue grows, red shrinks. Legend in
// Manrope with calculated %. No external libraries.

const FONT = "'Manrope', sans-serif";

const DETECTED_PCT = 52; // final detected share; retrieved is the rest (48)
const RETRIEVED_PCT = 100 - DETECTED_PCT;

// Donut geometry (143×143 viewBox, matching the Figma export).
const CX = 71.5;
const CY = 71.5;
const OUTER = 70;
const INNER = 19;
const CR = 3; // corner radius of the segments
const GAP = 4; // even gap WIDTH (px) between the two segments
const HG = GAP / 2; // half gap — each edge is offset perpendicular by this
const LEFT = 270; // blue centred on the left (9 o'clock); both edges move as it grows

const F_END = DETECTED_PCT / 100; // final detected share
const F_START = 0.4; // detected starts here and grows to F_END
const DURATION = 1900;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const RAD = Math.PI / 180;

type Pt = [number, number];
function polar(r: number, deg: number): Pt {
  const a = (deg - 90) * RAD;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}
const sub = (p: Pt, q: Pt): Pt => [p[0] - q[0], p[1] - q[1]];
const along = (p: Pt, q: Pt, d: number): Pt => {
  const v = sub(q, p);
  const m = Math.hypot(v[0], v[1]);
  return [p[0] + (v[0] / m) * d, p[1] + (v[1] / m) * d];
};

// Donut wedge owning angles a0→a1 (deg, clockwise). Edges are offset perpendicular
// by HG so the gap to the neighbour has an even WIDTH at every radius (angular offset
// = asin(HG/r), larger near the hole). Corners are rounded with radius CR.
function rseg(a0: number, a1: number): string {
  const ro = OUTER;
  const ri = INNER;
  const boO = Math.asin(HG / ro) / RAD; // gap angular offset at outer radius
  const boI = Math.asin(HG / ri) / RAD; // gap angular offset at inner radius
  const dO = (CR / ro) / RAD; // corner inset along the outer arc
  const dI = (CR / ri) / RAD; // corner inset along the inner arc
  // Offset-edge endpoints (the straight radial edges, shifted in by HG).
  const Pout1 = polar(ro, a1 - boO);
  const Pin1 = polar(ri, a1 - boI);
  const Pout0 = polar(ro, a0 + boO);
  const Pin0 = polar(ri, a0 + boI);
  // Corner points: inset CR along each offset edge.
  const Eo1 = along(Pout1, Pin1, CR);
  const Ei1 = along(Pin1, Pout1, CR);
  const Ei0 = along(Pin0, Pout0, CR);
  const Eo0 = along(Pout0, Pin0, CR);
  // Arc endpoints: inset by the corner angle from the offset edges.
  const oStart = polar(ro, a0 + boO + dO);
  const oEnd = polar(ro, a1 - boO - dO);
  const iEnd = polar(ri, a1 - boI - dI);
  const iStart = polar(ri, a0 + boI + dI);
  const largeO = a1 - boO - dO - (a0 + boO + dO) > 180 ? 1 : 0;
  const largeI = a1 - boI - dI - (a0 + boI + dI) > 180 ? 1 : 0;
  return [
    `M${oStart[0]} ${oStart[1]}`,
    `A${ro} ${ro} 0 ${largeO} 1 ${oEnd[0]} ${oEnd[1]}`, // outer arc
    `A${CR} ${CR} 0 0 1 ${Eo1[0]} ${Eo1[1]}`, // round outer-end
    `L${Ei1[0]} ${Ei1[1]}`, // offset radial edge (a1 side)
    `A${CR} ${CR} 0 0 1 ${iEnd[0]} ${iEnd[1]}`, // round inner-end
    `A${ri} ${ri} 0 ${largeI} 0 ${iStart[0]} ${iStart[1]}`, // inner arc (reverse)
    `A${CR} ${CR} 0 0 1 ${Ei0[0]} ${Ei0[1]}`, // round inner-start
    `L${Eo0[0]} ${Eo0[1]}`, // offset radial edge (a0 side)
    `A${CR} ${CR} 0 0 1 ${oStart[0]} ${oStart[1]}`, // round outer-start
    'Z',
  ].join('');
}

function LegendItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.4, color: '#6E6E73', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1, color: '#000000', whiteSpace: 'nowrap' }}>
        <Odometer value={value} places={2} suffix="%" />
      </span>
    </div>
  );
}

export function DetectedVsCard({ focused }: { focused: boolean }) {
  const play = useFocusPlay(focused);
  const [frac, setFrac] = useState(F_END);

  useEffect(() => {
    if (!play) {
      setFrac(F_END);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const e = t >= 1 ? 1 : easeOutCubic(t);
      setFrac(F_START + (F_END - F_START) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  // Blue centred on the left; both edges move symmetrically as the share grows.
  const bs = LEFT - frac * 180;
  const be = LEFT + frac * 180;
  const blueD = rseg(bs, be);
  const redD = rseg(be, bs + 360);

  // Both legend labels count UP together (same roll direction); retrieved rises from
  // below 40% up to 48% as detected rises to 52%.
  const pctDetected = frac * 100;
  const pctRetrieved = RETRIEVED_PCT - (F_END - frac) * 100;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 20 }}>
      <span style={{ position: 'absolute', left: 24, top: 24, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: 1.4, color: '#6E6E73', whiteSpace: 'nowrap' }}>
        Detected vs Retrieved polyps
      </span>
      <div style={{ position: 'absolute', left: '50%', top: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg width="144" height="144" viewBox="0 0 143 143" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
          <defs>
            <radialGradient id="vsBlue" cx="71.5" cy="71.5" r="72" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#007AFF" stopOpacity="0.2" />
              <stop offset="1" stopColor="#007AFF" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="vsRed" cx="71.5" cy="71.5" r="72" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ED6780" stopOpacity="0.2" />
              <stop offset="1" stopColor="#ED6780" stopOpacity="1" />
            </radialGradient>
          </defs>
          {/* #ECF2FF backing behind each gradient segment (same as bars/area). */}
          <path d={blueD} fill="#ECF2FF" />
          <path d={redD} fill="#ECF2FF" />
          <path d={blueD} fill="url(#vsBlue)" />
          <path d={redD} fill="url(#vsRed)" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          <LegendItem color="#007AFF" label="Detected" value={pctDetected} />
          <LegendItem color="#FF2D55" label="Retrieved" value={pctRetrieved} />
        </div>
      </div>
    </div>
  );
}
