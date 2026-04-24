import React, { useRef, useEffect } from 'react';

export interface MeshBackgroundProps {
  isDark?: boolean;
}

// Blobs positioned along the diagonal band from bottom-left → top-right
const BLOBS: { x: number; y: number; r: number; color: [number, number, number] }[] = [
  { x: 0.05, y: 0.92, r: 0.54, color: [100, 208, 145] }, // teal,         bottom-left
  { x: 0.22, y: 0.74, r: 0.52, color: [178, 228,  80] }, // yellow-green
  { x: 0.40, y: 0.56, r: 0.50, color: [222, 240,  88] }, // warm yellow,  center
  { x: 0.60, y: 0.38, r: 0.50, color: [128, 192, 255] }, // sky-blue
  { x: 0.85, y: 0.16, r: 0.46, color: [172, 152, 255] }, // lavender,     top-right
];

// Diagonal from bottom-left to top-right, matching Figma's -57° rotation
const DIAG_ANGLE = -55 * Math.PI / 180;
const cosA = Math.cos(DIAG_ANGLE); //  ≈  0.574
const sinA = Math.sin(DIAG_ANGLE); //  ≈ -0.819

// Sample a gradient color + opacity weight from the blob field at a screen point
function sampleBlobs(
  screenX: number,
  screenY: number,
  W: number,
  H: number,
): { r: number; g: number; b: number; weight: number } {
  let tr = 0, tg = 0, tb = 0, tw = 0;
  for (const blob of BLOBS) {
    const dx = screenX / W - blob.x;
    const dy = screenY / H - blob.y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    const w  = Math.max(0, 1 - d / (blob.r * 1.4)) ** 2;
    tr += blob.color[0] * w;
    tg += blob.color[1] * w;
    tb += blob.color[2] * w;
    tw += w;
  }
  if (tw < 0.001) return { r: 180, g: 210, b: 255, weight: 0 };
  return { r: tr / tw, g: tg / tw, b: tb / tw, weight: Math.min(1, tw) };
}

export function MeshBackground({ isDark = false }: MeshBackgroundProps) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ t: 0, prevT: 0, raf: 0, mx: 0.5, my: 0.5, lastT: -1e9 });

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const s   = st.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      s.mx    = e.clientX / window.innerWidth;
      s.my    = e.clientY / window.innerHeight;
      s.lastT = performance.now();
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const NUM_LINES = 80;
    const STEPS     = 280;

    const frame = (now: number) => {
      const dt = Math.min((now - s.prevT) / 1000, 0.05);
      s.prevT  = now;
      if (!reduced) s.t += dt * 0.28;

      const W  = canvas.width;
      const H  = canvas.height;
      const D  = Math.min(W, H);
      const cx = W * 0.5;
      const cy = H * 0.5;
      const diagLen     = Math.sqrt(W * W + H * H);
      const lineSpacing = diagLen / NUM_LINES;

      ctx.clearRect(0, 0, W, H);

      // Mouse: shift the whole gradient gently toward cursor
      const age  = now - s.lastT;
      const mStr = Math.max(0, 1 - age / 3000) * 0.18;
      const mOffX = (s.mx * W - cx) * mStr;
      const mOffY = (s.my * H - cy) * mStr;

      // ── Gradient blobs ─────────────────────────────────────────────────────
      for (let i = 0; i < BLOBS.length; i++) {
        const b = BLOBS[i];
        const driftX = Math.sin(s.t * 0.42 + i * 1.1) * D * 0.028;
        const driftY = Math.cos(s.t * 0.36 + i * 0.9) * D * 0.028;
        const bx   = b.x * W + mOffX + driftX;
        const by   = b.y * H + mOffY + driftY;
        const brad = b.r * D;
        const [r, g, bl] = b.color;
        const alpha = isDark ? 0.60 : 0.54;

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, brad);
        grad.addColorStop(0,    `rgba(${r},${g},${bl},${alpha})`);
        grad.addColorStop(0.55, `rgba(${r},${g},${bl},${(alpha * 0.58).toFixed(3)})`);
        grad.addColorStop(1,    `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, brad, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Flow lines ─────────────────────────────────────────────────────────
      if (reduced) { s.raf = requestAnimationFrame(frame); return; }

      for (let li = 0; li < NUM_LINES; li++) {
        const offset = (li - NUM_LINES * 0.5) * lineSpacing;

        // Line midpoint in screen space (at u = 0 along the diagonal)
        // rotation: px = cx + u*cosA - v*sinA, py = cy + u*sinA + v*cosA
        const midX = cx - offset * sinA; // sinA < 0, so this goes right for positive offset
        const midY = cy + offset * cosA;

        const { r: lr, g: lg, b: lb, weight } = sampleBlobs(midX, midY, W, H);
        if (weight < 0.02) continue; // skip lines with no gradient coverage

        const la = 0.24 * Math.min(1, weight * 2.5) * (isDark ? 1.3 : 1.0);
        ctx.strokeStyle = `rgba(${Math.round(lr)},${Math.round(lg)},${Math.round(lb)},${la.toFixed(3)})`;
        ctx.lineWidth   = 0.7;
        ctx.beginPath();

        for (let si = 0; si <= STEPS; si++) {
          const u = (si / STEPS) * diagLen - diagLen * 0.5;

          // Multi-frequency wave perpendicular to the diagonal
          const wave =
            lineSpacing * 2.4 * Math.sin(u / diagLen * Math.PI * 3.5 + s.t * 0.90 + li * 0.20)
          + lineSpacing * 0.8 * Math.sin(u / diagLen * Math.PI * 8.2 + s.t * 0.44 + li * 0.38);

          const v  = offset + wave;
          const px = cx + u * cosA - v * sinA;
          const py = cy + u * sinA + v * cosA;

          if (si === 0) ctx.moveTo(px, py);
          else          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      s.raf = requestAnimationFrame(frame);
    };

    s.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [isDark]);

  return (
    <canvas
      ref={cvs}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
