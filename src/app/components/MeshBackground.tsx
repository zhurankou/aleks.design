import React, { useRef, useEffect } from 'react';

export interface MeshBackgroundProps {
  intensity?: number;
  blur?: number;
  mouseInfluence?: number;
  fadeOutTime?: number;
  animSpeed?: number;
  colorOpacity?: number;
  meshDensity?: number;
  meshOpacity?: number;
  bubbleAmount?: number;
  bubbleRandomness?: number;
  isDark?: boolean;
}

const PALETTE: [number, number, number][] = [
  [200, 240,  80], // yellow-green
  [120, 220, 160], // mint-green
  [100, 170, 255], // sky-blue
  [180, 130, 255], // lavender
  [255, 220,  60], // warm yellow
  [140, 200, 255], // light blue
];

interface Blob {
  hx: number; hy: number;
  x: number;  y: number;
  vx: number; vy: number;
  r: number;
  color: [number, number, number];
  phase: number;
  speed: number;
  ry: number;
  py: number;
}

function createBlobs(n: number): Blob[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + Math.random();
    const dist  = 0.10 + Math.random() * 0.48;
    return {
      hx:    Math.max(0.05, Math.min(0.95, 0.5 + Math.cos(angle) * dist)),
      hy:    Math.max(0.05, Math.min(0.95, 0.5 + Math.sin(angle) * dist)),
      x: 0, y: 0,
      vx: 0, vy: 0,
      r:     0.32 + Math.random() * 0.28,
      color: PALETTE[i % PALETTE.length],
      phase: (i / n) * Math.PI * 2 + Math.random(),
      speed: 0.40 + Math.random() * 0.55,
      ry:    0.55 + Math.random() * 0.55,
      py:    Math.random() * Math.PI * 2,
    };
  });
}

export function MeshBackground({
  intensity        = 1,
  blur             = 52,
  mouseInfluence   = 0.30,
  fadeOutTime      = 2800,
  animSpeed        = 0.32,
  colorOpacity     = 0.70,
  meshDensity      = 22,
  meshOpacity      = 0.08,
  bubbleAmount     = 0.08,
  bubbleRandomness = 1,
  isDark           = false,
}: MeshBackgroundProps) {
  const blobCvs = useRef<HTMLCanvasElement>(null);
  const meshCvs = useRef<HTMLCanvasElement>(null);

  const st = useRef({
    blobs:       createBlobs(6),
    mouse:       { x: 0.5, y: 0.5, lastT: -1e9 },
    t:           0,
    prevT:       0,
    raf:         0,
    initialized: false,
  });

  useEffect(() => {
    const bc = blobCvs.current;
    const mc = meshCvs.current;
    if (!bc || !mc) return;

    const bx = bc.getContext('2d')!;
    const mx = mc.getContext('2d')!;
    const s  = st.current;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const PAD  = blur * 2;
    const HALF = PAD / 2;

    const resize = () => {
      bc.width  = window.innerWidth  + PAD;
      bc.height = window.innerHeight + PAD;
      mc.width  = window.innerWidth;
      mc.height = window.innerHeight;
      s.initialized = false;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      s.mouse.x     = e.clientX / window.innerWidth;
      s.mouse.y     = e.clientY / window.innerHeight;
      s.mouse.lastT = performance.now();
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const frame = (now: number) => {
      const dt = Math.min((now - s.prevT) / 1000, 0.05);
      s.prevT  = now;
      if (!reduced) s.t += dt * animSpeed;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const D = Math.min(W, H);

      if (!s.initialized) {
        s.blobs.forEach(b => { b.x = b.hx * W; b.y = b.hy * H; });
        s.initialized = true;
      }

      // Mouse attraction: gradient drifts toward cursor position
      const age  = now - s.mouse.lastT;
      const mStr = Math.max(0, 1 - age / fadeOutTime);
      const mx2  = s.mouse.x * W;
      const my2  = s.mouse.y * H;

      // Global offset: shift all blobs toward where the cursor is relative to screen center
      const mOffX = (mx2 - W * 0.5) * mouseInfluence * mStr;
      const mOffY = (my2 - H * 0.5) * mouseInfluence * mStr;

      bx.clearRect(0, 0, W + PAD, H + PAD);

      s.blobs.forEach(b => {
        const amp  = bubbleAmount * D * bubbleRandomness;
        const ambX = b.hx * W + Math.sin(s.t * b.speed        + b.phase)       * amp;
        const ambY = b.hy * H + Math.cos(s.t * b.speed * b.ry + b.phase + b.py) * amp;

        const targetX = ambX + mOffX;
        const targetY = ambY + mOffY;
        b.vx  = (b.vx + (targetX - b.x) * 0.045) * 0.87;
        b.vy  = (b.vy + (targetY - b.y) * 0.045) * 0.87;
        b.x  += b.vx;
        b.y  += b.vy;

        const yScale = 0.76 + Math.sin(s.t * 0.18 + b.phase) * 0.11;
        const bxc    = b.x + HALF;
        const byc    = b.y + HALF;
        const brad   = b.r * D;
        const alpha  = colorOpacity * intensity * (isDark ? 1.5 : 1.0);
        const [r, g, bl] = b.color;

        bx.save();
        bx.translate(bxc, byc);
        bx.scale(1, yScale);
        const grad = bx.createRadialGradient(0, 0, 0, 0, 0, brad);
        grad.addColorStop(0,    `rgba(${r},${g},${bl},${alpha})`);
        grad.addColorStop(0.55, `rgba(${r},${g},${bl},${(alpha * 0.60).toFixed(4)})`);
        grad.addColorStop(1,    `rgba(${r},${g},${bl},0)`);
        bx.fillStyle = grad;
        bx.beginPath();
        bx.arc(0, 0, brad, 0, Math.PI * 2);
        bx.fill();
        bx.restore();
      });

      const ma = meshOpacity * intensity;
      if (!reduced && ma > 0.001) {
        mx.clearRect(0, 0, W, H);
        mx.strokeStyle = isDark
          ? `rgba(185,175,225,${ma})`
          : `rgba(108,96,148,${ma})`;
        mx.lineWidth = 0.55;

        const cols   = meshDensity;
        const rows   = Math.round(meshDensity * H / W);
        const cw     = W / cols;
        const ch     = H / rows;
        const hSteps = cols * 3;
        const vSteps = rows * 3;

        for (let row = 0; row <= rows; row++) {
          const y0 = row * ch;
          mx.beginPath();
          for (let si = 0; si <= hSteps; si++) {
            const t2 = si / hSteps;
            const xp = t2 * W;
            const dy =
              Math.sin(t2 * Math.PI * 3.8  + s.t * 0.52  + row * 0.46) * ch * 0.30
            + Math.sin(t2 * Math.PI * 9.2  + s.t * 0.28  + row * 0.92) * ch * 0.10
            + Math.sin(t2 * Math.PI * 1.4  + s.t * 0.14  + row * 0.18) * ch * 0.20;
            si === 0 ? mx.moveTo(xp, y0 + dy) : mx.lineTo(xp, y0 + dy);
          }
          mx.stroke();
        }

        for (let col = 0; col <= cols; col++) {
          const x0 = col * cw;
          mx.beginPath();
          for (let si = 0; si <= vSteps; si++) {
            const t2 = si / vSteps;
            const yp = t2 * H;
            const dx =
              Math.sin(t2 * Math.PI * 3.8  + s.t * 0.44  + col * 0.42) * cw * 0.30
            + Math.sin(t2 * Math.PI * 8.6  + s.t * 0.24  + col * 0.76) * cw * 0.10
            + Math.sin(t2 * Math.PI * 1.2  + s.t * 0.11  + col * 0.16) * cw * 0.20;
            si === 0 ? mx.moveTo(x0 + dx, yp) : mx.lineTo(x0 + dx, yp);
          }
          mx.stroke();
        }
      }

      s.raf = requestAnimationFrame(frame);
    };

    s.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [
    intensity, blur, mouseInfluence, fadeOutTime, animSpeed,
    colorOpacity, meshDensity, meshOpacity, bubbleAmount, bubbleRandomness, isDark,
  ]);

  const PAD = blur * 2;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={blobCvs}
        style={{
          position: 'absolute',
          left: -PAD / 2,
          top:  -PAD / 2,
          filter: `blur(${blur}px)`,
        }}
      />
      <canvas
        ref={meshCvs}
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'blur(0.5px)',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
