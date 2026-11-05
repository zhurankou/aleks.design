import { useEffect, useRef } from 'react';
import sheet from './chalk-sheet.json';

// The chalk drawing behind the Assembly section, exported from the app's
// ChalkDrawing as one white sprite per letter or doodle. It stays still: elements
// rest dimly in their own colour, and each sparkles now and then.
// Sprites keep this cheap: 205 live SVG paths would repaint heavily on phones.

// White for the sparkle's peak, then the four speaker colours.
const COLORS = ['#FFFFFF', '#40DBE0', '#C4A3FF', '#FFB866', '#FF8FB3'];
const REST_ALPHA = 0.34;
const LIT_ALPHA = 0.5;
const WHITE_ALPHA = 0.12;
// Each element is drawn at this size around its own centre, keeping the layout.
const ELEMENT_SCALE = 0.45;
// The drawing is laid over itself at these offsets (fractions of its size),
// wrapping; PLACED keeps only the elements that touch nothing already kept.
const COPIES = [[0, 0], [0.37, 0.53], [0.71, 0.19], [0.19, 0.79], [0.53, 0.31], [0.83, 0.67], [0.61, 0.89], [0.29, 0.13]];
// Minimum space between elements, in the drawing's units.
const GAP = 10;

const PLACED = (() => {
  const [drawingW, drawingH] = sheet.drawing;
  const kept: { midX: number; midY: number; halfW: number; halfH: number; index: number; sx: number; sy: number; sw: number; sh: number }[] = [];
  COPIES.forEach(([offsetX, offsetY], copy) => {
    sheet.items.forEach(([bx, by, bw, bh, sx, sy, sw, sh], item) => {
      const midX = (bx + bw / 2 + offsetX * drawingW) % drawingW;
      const midY = (by + bh / 2 + offsetY * drawingH) % drawingH;
      const halfW = bw / 2 * ELEMENT_SCALE;
      const halfH = bh / 2 * ELEMENT_SCALE;
      const clear = kept.every(other =>
        Math.abs(midX - other.midX) >= halfW + other.halfW + GAP
        || Math.abs(midY - other.midY) >= halfH + other.halfH + GAP);
      if (clear) kept.push({ midX, midY, halfW, halfH, index: item + copy * sheet.items.length, sx, sy, sw, sh });
    });
  });
  return kept;
})();
const BACKING_SCALE = 2;
const FRAME_MS = 33;
// Seconds a sparkle takes to rise to its peak, then to fade back.
const RISE_S = 0.3;
const FADE_S = 1.2;

const ease = (t: number) => t * t * (3 - 2 * t);

function draw(canvas: HTMLCanvasElement, tints: HTMLCanvasElement[], seconds: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // offset* are layout pixels, so they're unaffected by the page's scale(k).
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  if (canvas.width !== w * BACKING_SCALE || canvas.height !== h * BACKING_SCALE) {
    canvas.width = w * BACKING_SCALE;
    canvas.height = h * BACKING_SCALE;
  }
  const [drawingW, drawingH] = sheet.drawing;
  const scale = Math.max(w / drawingW, h / drawingH);
  const originX = (w - drawingW * scale) / 2;
  const originY = (h - drawingH * scale) / 2;

  ctx.setTransform(BACKING_SCALE, 0, 0, BACKING_SCALE, 0, 0);
  ctx.clearRect(0, 0, w, h);
  // Additive, so two colours mid-change sum to a full-strength blend.
  ctx.globalCompositeOperation = 'lighter';

  PLACED.forEach(({ midX, midY, index, sx, sy, sw, sh }) => {
    // Elements fade toward the rim of an oval filling the area, as in the app.
    const dx = (midX - drawingW / 2) * scale / (w / 2);
    const dy = (midY - drawingH / 2) * scale / (h / 2) * 1.2;
    const blend = Math.min(1, Math.max(0, (1.2 - Math.hypot(dx, dy)) / 0.45));
    if (blend === 0) return;

    // Position-stable seeds, as in the app: each sparkles once per its own period.
    const period = 9 + ((index * 0.618) % 1) * 9;
    const sinceLit = (seconds + ((index * 0.381) % 1) * period) % period;
    const lit = sinceLit < RISE_S ? ease(sinceLit / RISE_S) : 1 - ease(Math.min(1, (sinceLit - RISE_S) / FADE_S));
    const color = 1 + Math.floor(((index * 0.7548) % 1) * (COLORS.length - 1));
    const visibility = ease(blend);
    const dw = sw / sheet.sheetScale * scale * ELEMENT_SCALE;
    const dh = sh / sheet.sheetScale * scale * ELEMENT_SCALE;
    const x = originX + midX * scale - dw / 2;
    const y = originY + midY * scale - dh / 2;

    ctx.globalAlpha = (REST_ALPHA + (LIT_ALPHA - REST_ALPHA) * lit) * visibility;
    ctx.drawImage(tints[color], sx, sy, sw, sh, x, y, dw, dh);
    if (lit > 0) {
      ctx.globalAlpha = WHITE_ALPHA * lit * lit * visibility;
      ctx.drawImage(tints[0], sx, sy, sw, sh, x, y, dw, dh);
    }
  });
}

export function ChalkCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tintsRef = useRef<HTMLCanvasElement[] | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      const canvas = canvasRef.current;
      const tints = tintsRef.current;
      if (cancelled || !canvas || !tints) return;
      if (now - last >= FRAME_MS) {
        last = now;
        draw(canvas, tints, now / 1000);
      }
      if (activeRef.current) frame = requestAnimationFrame(tick);
    };

    if (tintsRef.current) {
      frame = requestAnimationFrame(tick);
    } else {
      const image = new Image();
      image.onload = () => {
        if (cancelled) return;
        // One tinted copy of the sheet per colour, made once.
        tintsRef.current = COLORS.map(color => {
          const tint = document.createElement('canvas');
          tint.width = image.width;
          tint.height = image.height;
          const ctx = tint.getContext('2d');
          if (ctx) {
            ctx.drawImage(image, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, tint.width, tint.height);
          }
          return tint;
        });
        frame = requestAnimationFrame(tick);
      };
      image.src = '/assembly/chalk-sheet.png';
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}
