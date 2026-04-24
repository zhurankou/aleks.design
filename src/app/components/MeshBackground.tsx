import React, { useRef, useEffect } from 'react';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MeshBackgroundProps {
  /** Overall effect strength (0–1). Scales all opacity. */
  intensity?: number;
  /** CSS blur on the gradient blob layer in px. Higher = softer clouds. */
  blur?: number;
  /** How strongly the mouse repels the blobs (0–1). */
  mouseInfluence?: number;
  /** Time in ms for mouse influence to fully fade after cursor stops. */
  fadeOutTime?: number;
  /** Animation speed multiplier. 1 = default, 0.5 = half speed. */
  animSpeed?: number;
  /** Peak opacity of each color blob (0–1). Keep below 0.12 for subtlety. */
  colorOpacity?: number;
  /** Grid columns for mesh lines. Higher = denser net. */
  meshDensity?: number;
  /** Opacity of the mesh/contour lines (0–1). */
  meshOpacity?: number;
  /** Max ambient drift as a fraction of screen size (0–0.2). */
  bubbleAmount?: number;
  /** Per-blob speed variation scale (0–2). */
  bubbleRandomness?: number;
  /** Set true when the page is in dark mode. */
  isDark?: boolean;
}

// ─── Palette ─────────────────────────────────────────────────────────────────
// Very pale, low-saturation pastels. Tweak RGB values to shift the mood.

const PALETTE: [number, number, number][] = [
  [200, 152, 255], // pale violet
  [255, 162, 200], // pale rose
  [255, 238, 148], // pale amber
  [152, 198, 255], // pale sky
  [152, 240, 212], // pale mint
  [218, 182, 255], // pale lavender
];

// ─── Blob type ────────────────────────────────────────────────────────────────

interface Blob {
  hx: number; hy: number;  // home position, normalized 0–1
  x: number;  y: number;   // current display position in px
  vx: number; vy: number;  // spring velocity in px/frame
  r: number;               // radius as fraction of min(W, H)
  color: [number, number, number];
  phase: number;           // unique time offset for orbit
  speed: number;           // individual orbit speed
  ry: number;              // y-axis frequency ratio (Lissajous shape)
  py: number;              // y-axis phase offset
}

function createBlobs(n: number): Blob[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + Math.random();
    const dist  = 0.12 + Math.random() * 0.44;
    return {
      hx:    Math.max(0.05, Math.min(0.95, 0.5 + Math.cos(angle) * dist)),
      hy:    Math.max(0.05, Math.min(0.95, 0.5 + Math.sin(angle) * dist)),
      x: 0, y: 0,
      vx: 0, vy: 0,
      r:     0.28 + Math.random() * 0.25,
      color: PALETTE[i % PALETTE.length],
      phase: (i / n) * Math.PI * 2 + Math.random(),
      speed: 0.42 + Math.random() * 0.60,
      ry:    0.55 + Math.random() * 0.55,
      py:    Math.random() * Math.PI * 2,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MeshBackground({
  intensity        = 1,
  blur             = 72,
  mouseInfluence   = 0.11,
  fadeOutTime      = 2800,
  animSpeed        = 0.32,
  colorOpacity     = 0.058,
  meshDensity      = 20,
  meshOpacity      = 0.022,
  bubbleAmount     = 0.042,
  bubbleRandomness = 1,
  isDark           = false,
}: MeshBackgroundProps) {
  const blobCvs = useRef<HTMLCanvasElement>(null);
  const meshCvs = useRef<HTMLCanvasElement>(null);

  // All mutable animation state lives here — never causes re-renders.
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

    // Extra canvas area on the blob layer so blur doesn't bleed at edges.
    const PAD  = blur * 2;
    const HALF = PAD / 2;

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      bc.width  = window.innerWidth  + PAD;
      bc.height = window.innerHeight + PAD;
      mc.width  = window.innerWidth;
      mc.height = window.innerHeight;
      s.initialized = false; // re-initialize blob positions on resize
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Mouse ────────────────────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      s.mouse.x     = e.clientX / window.innerWidth;
      s.mouse.y     = e.clientY / window.innerHeight;
      s.mouse.lastT = performance.now();
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Frame loop ───────────────────────────────────────────────────────────
    const frame = (now: number) => {
      const dt = Math.min((now - s.prevT) / 1000, 0.05);
      s.prevT  = now;
      if (!reduced) s.t += dt * animSpeed;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const D = Math.min(W, H); // reference dimension for sizing

      // Snap blobs to home positions on first frame so they don't fly in from (0,0)
      if (!s.initialized) {
        s.blobs.forEach(b => { b.x = b.hx * W; b.y = b.hy * H; });
        s.initialized = true;
      }

      // Mouse influence decays smoothly after cursor stops
      const age  = now - s.mouse.lastT;
      const mStr = Math.max(0, 1 - age / fadeOutTime);
      const mx2  = s.mouse.x * W;
      const my2  = s.mouse.y * H;

      // ── Draw blobs ─────────────────────────────────────────────────────────
      bx.clearRect(0, 0, W + PAD, H + PAD);

      s.blobs.forEach(b => {
        // Lissajous-shaped orbit around home — asymmetric for organic feel
        const amp  = bubbleAmount * D * bubbleRandomness;
        const ambX = b.hx * W + Math.sin(s.t * b.speed        + b.phase)       * amp;
        const ambY = b.hy * H + Math.cos(s.t * b.speed * b.ry + b.phase + b.py) * amp;

        // Mouse repulsion: exponential falloff from cursor position
        let pushX = 0, pushY = 0;
        if (mStr > 0.001) {
          const dx   = b.hx * W - mx2;
          const dy   = b.hy * H - my2;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          const mag  = mouseInfluence * mStr * D * 0.22 * Math.exp(-dist / (D * 0.55));
          pushX = (dx / dist) * mag;
          pushY = (dy / dist) * mag;
        }

        // Spring toward ambient + push target
        const targetX = ambX + pushX;
        const targetY = ambY + pushY;
        b.vx  = (b.vx + (targetX - b.x) * 0.045) * 0.87;
        b.vy  = (b.vy + (targetY - b.y) * 0.045) * 0.87;
        b.x  += b.vx;
        b.y  += b.vy;

        // Slightly breathing ellipse (organic shape variation)
        const yScale = 0.76 + Math.sin(s.t * 0.18 + b.phase) * 0.11;
        const bxc    = b.x + HALF;
        const byc    = b.y + HALF;
        const brad   = b.r * D;
        const alpha  = colorOpacity * intensity * (isDark ? 1.7 : 1.0);
        const [r, g, bl] = b.color;

        bx.save();
        bx.translate(bxc, byc);
        bx.scale(1, yScale);
        const grad = bx.createRadialGradient(0, 0, 0, 0, 0, brad);
        grad.addColorStop(0,    `rgba(${r},${g},${bl},${alpha})`);
        grad.addColorStop(0.48, `rgba(${r},${g},${bl},${(alpha * 0.44).toFixed(4)})`);
        grad.addColorStop(1,    `rgba(${r},${g},${bl},0)`);
        bx.fillStyle = grad;
        bx.beginPath();
        bx.arc(0, 0, brad, 0, Math.PI * 2);
        bx.fill();
        bx.restore();
      });

      // ── Draw mesh ──────────────────────────────────────────────────────────
      const ma = meshOpacity * intensity;
      if (!reduced && ma > 0.001) {
        mx.clearRect(0, 0, W, H);
        mx.strokeStyle = isDark
          ? `rgba(185,175,225,${ma})`
          : `rgba(108,96,148,${ma})`;
        mx.lineWidth = 0.55;

        const cols  = meshDensity;
        const rows  = Math.round(meshDensity * H / W);
        const cw    = W / cols;
        const ch    = H / rows;
        const hSteps = cols * 3; // sub-divisions per line for smooth curves
        const vSteps = rows * 3;

        // Horizontal wavy lines
        for (let row = 0; row <= rows; row++) {
          const y0 = row * ch;
          mx.beginPath();
          for (let si = 0; si <= hSteps; si++) {
            const t2 = si / hSteps;
            const xp = t2 * W;
            // Multi-frequency wave: coarse + fine + very fine
            const dy =
              Math.sin(t2 * Math.PI * 3.8  + s.t * 0.52  + row * 0.46) * ch * 0.30
            + Math.sin(t2 * Math.PI * 9.2  + s.t * 0.28  + row * 0.92) * ch * 0.10
            + Math.sin(t2 * Math.PI * 1.4  + s.t * 0.14  + row * 0.18) * ch * 0.20;
            si === 0 ? mx.moveTo(xp, y0 + dy) : mx.lineTo(xp, y0 + dy);
          }
          mx.stroke();
        }

        // Vertical wavy lines
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
      {/* Blob layer: heavy CSS blur turns the gradients into soft color clouds */}
      <canvas
        ref={blobCvs}
        style={{
          position: 'absolute',
          left: -PAD / 2,
          top:  -PAD / 2,
          filter: `blur(${blur}px)`,
        }}
      />
      {/* Mesh layer: very light blur keeps lines visible but softens hard pixels */}
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
