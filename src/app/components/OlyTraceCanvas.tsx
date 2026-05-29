import { useEffect, useRef } from 'react';

// Background animation for the OlySense square (behind the carousel cards). A hidden
// light-grey grid is revealed by a soft radial spotlight that follows each travelling
// arrow + its trail (blurred edges). Two kinds of arrow heads, each trailing a line
// of random length that fades from its tail, walking with random 90° turns around endo2:
//   • GREEN — enters from the left/bottom edge, heads right/up.
//   • RED   — enters from the top/right edge, heads down/left.

// endo2 video rect within the square (CSS px), per NewPage: left 16, bottom 40, width 160.
const ENDO_LEFT = 16;
const ENDO_BOTTOM = 40;
const ENDO_W = 160;
const ENDO_H = ENDO_W * (1920 / 1080); // ≈ 284.4
const ENDO_RIGHT = ENDO_LEFT + ENDO_W;

const GREEN = '52, 199, 89'; // #34C759
const RED = '255, 56, 60'; // #FF383C

const ARROW_PATH =
  'M2.25105 9.27276C1.91632 8.93802 1.91632 8.39531 2.25105 8.06058L7.39391 2.91772C7.72864 2.58298 8.27136 2.58298 8.60609 2.91772L13.7489 8.06058C14.0837 8.39531 14.0837 8.93802 13.7489 9.27276C13.4142 9.60749 12.8715 9.60749 12.5368 9.27276L8.85714 5.59314V13.8095C8.85714 14.2829 8.47339 14.6667 8 14.6667C7.52661 14.6667 7.14286 14.2829 7.14286 13.8095V5.59314L3.46323 9.27276C3.1285 9.60749 2.58579 9.60749 2.25105 9.27276Z';
const ARROW_SIZE = 14;
const ROT: Record<Dir, number> = { up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 };

const SPEED = 80; // px/s
const MAX_DOTS = 9;
const GRID = 80; // grid cell size (px)
const SURFACE = '#FDFEFF'; // near-white square surface that the grid is cut out of
const GRID_LINE = '#000'; // opaque — used only as a cut mask, the colour is irrelevant
const GRID_REVEAL = 0.82; // <1 keeps some white over the cut so the revealed grid reads lighter
const REVEAL_R = 72; // radius of the radial grid reveal around the arrow
const STAMP = 24; // spacing of reveal stamps along the trail

type Dir = 'right' | 'up' | 'down' | 'left';
type Pt = { x: number; y: number; len: number };
type Dot = {
  points: Pt[];
  hx: number;
  hy: number;
  headLen: number;
  tailLen: number;
  dir: Dir;
  kind: 'green' | 'red';
  belowEndo: boolean;
  segDist: number;
  segLen: number;
  trail: number;
  dead: boolean;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function OlyTraceCanvas({ style, play = true }: { style?: React.CSSProperties; play?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const playRef = useRef(play);
  playRef.current = play;
  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !parent || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const grid = document.createElement('canvas');
    const gctx = grid.getContext('2d')!;
    const mask = document.createElement('canvas');
    const mctx = mask.getContext('2d')!;

    // Soft circular brush (white, alpha fading to the edge) for the reveal mask.
    const brush = document.createElement('canvas');
    const BR = Math.round(REVEAL_R * 2 * dpr);
    brush.width = BR;
    brush.height = BR;
    const bctx = brush.getContext('2d')!;
    const bg = bctx.createRadialGradient(BR / 2, BR / 2, 0, BR / 2, BR / 2, BR / 2);
    bg.addColorStop(0, 'rgba(255,255,255,1)');
    bg.addColorStop(0.55, 'rgba(255,255,255,0.5)');
    bg.addColorStop(1, 'rgba(255,255,255,0)');
    bctx.fillStyle = bg;
    bctx.fillRect(0, 0, BR, BR);

    let W = 0;
    let H = 0;
    // Grid origin offsets — centre the line pattern in the square so the leftover
    // space splits evenly on both sides (left==right, top==bottom) instead of
    // hanging off the top-left edge. snapGX/snapGY snap to these centred lines.
    let offX = 0;
    let offY = 0;
    const snapGX = (v: number) => offX + Math.round((v - offX) / GRID) * GRID;
    const snapGY = (v: number) => offY + Math.round((v - offY) / GRID) * GRID;
    const resize = () => {
      W = parent.clientWidth;
      H = parent.clientHeight;
      offX = (W % GRID) / 2;
      offY = (H % GRID) / 2;
      for (const c of [canvas, grid, mask]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Pre-render the (static) grid.
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.clearRect(0, 0, W, H);
      gctx.strokeStyle = GRID_LINE;
      gctx.lineWidth = 1.5;
      gctx.beginPath();
      for (let x = offX; x < W; x += GRID) {
        gctx.moveTo(Math.round(x) + 0.5, 0);
        gctx.lineTo(Math.round(x) + 0.5, H);
      }
      for (let y = offY; y < H; y += GRID) {
        gctx.moveTo(0, Math.round(y) + 0.5);
        gctx.lineTo(W, Math.round(y) + 0.5);
      }
      gctx.stroke();
      // Resizing clears the canvas; immediately repaint the white surface so it never
      // blinks to transparent (the gradient) for a frame.
      ctx.fillStyle = SURFACE;
      ctx.fillRect(0, 0, W, H);
    };
    resize();
    // Debounce: the frame resizes every frame during the morph; resizing rebuilds + clears
    // the canvas. Defer it until the size settles so it doesn't flicker or rebuild the grid
    // each frame.
    let resizeT: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => { clearTimeout(resizeT); resizeT = setTimeout(resize, 120); });
    ro.observe(parent);

    const arrow = new Path2D(ARROW_PATH);
    const dots: Dot[] = [];
    let spawnIn = 0.3;

    const spawn = () => {
      if (H < 160 || W < 160) return;
      const endoTop = H - ENDO_BOTTOM - ENDO_H;
      const endoBottom = H - ENDO_BOTTOM;
      const canAbove = endoTop > 60;
      // Snap entry points to grid lines so the arrows ride the grid (fixed coord on a
      // line, moving coord entering from a grid-aligned edge). Bottom/right use the
      // last centred line that still fits inside the square.
      const gridBottom = offY + Math.floor((H - offY) / GRID) * GRID;
      const gridRight = offX + Math.floor((W - offX) / GRID) * GRID;
      const green = Math.random() < 0.5;
      const sideways = W > ENDO_RIGHT + 60 && Math.random() < 0.4;
      let x: number;
      let y: number;
      let dir: Dir;
      let belowEndo = false;
      if (green) {
        if (sideways) {
          x = snapGX(rand(ENDO_RIGHT + 10, W - 20));
          y = gridBottom;
          dir = 'up';
        } else {
          belowEndo = !canAbove || Math.random() > 0.75;
          x = 0;
          y = snapGY(belowEndo ? rand(endoBottom + 8, H - 10) : rand(20, endoTop - 12));
          dir = 'right';
        }
      } else {
        if (sideways) {
          x = snapGX(rand(ENDO_RIGHT + 10, W - 20));
          y = 0;
          dir = 'down';
        } else {
          const above = canAbove && Math.random() < 0.55;
          x = gridRight;
          y = snapGY(above ? rand(20, endoTop - 12) : rand(endoBottom + 8, H - 10));
          dir = 'left';
        }
      }
      dots.push({ points: [{ x, y, len: 0 }], hx: x, hy: y, headLen: 0, tailLen: 0, dir, kind: green ? 'green' : 'red', belowEndo, segDist: 0, segLen: GRID * (2 + Math.floor(Math.random() * 4)), trail: rand(130, 300), dead: false });
    };

    const turn = (d: Dot) => {
      const endoTop = H - ENDO_BOTTOM - ENDO_H;
      const endoBottom = H - ENDO_BOTTOM;
      if (d.kind === 'green') {
        const next: Dir = d.dir === 'right' ? 'up' : 'right';
        d.dir = next === 'up' && d.belowEndo && d.hx < ENDO_RIGHT ? 'right' : next;
      } else {
        const next: Dir = d.dir === 'down' ? 'left' : 'down';
        let dir = next;
        if (next === 'left' && d.hy > endoTop && d.hy < endoBottom && d.hx >= ENDO_RIGHT) dir = 'down';
        else if (next === 'down' && d.hx > ENDO_LEFT && d.hx < ENDO_RIGHT && d.hy <= endoTop) dir = 'left';
        d.dir = dir;
      }
      d.segDist = 0;
      d.segLen = GRID * (2 + Math.floor(Math.random() * 4));
    };

    const pointAt = (d: Dot, len: number) => {
      const v = Math.max(0, Math.min(d.headLen, len));
      const pts = d.points;
      for (let i = 0; i < pts.length - 1; i++) {
        if (v <= pts[i + 1].len) {
          const t = (v - pts[i].len) / Math.max(1e-6, pts[i + 1].len - pts[i].len);
          return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t };
        }
      }
      const last = pts[pts.length - 1];
      const t = (v - last.len) / Math.max(1e-6, d.headLen - last.len);
      return { x: last.x + (d.hx - last.x) * t, y: last.y + (d.hy - last.y) * t };
    };

    let prev = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const step = SPEED * dt;

      // While the square is fading in/out (not settled) skip the heavy grid-mask
      // compositing + arrow draw — just paint the plain white surface so the fade
      // stays smooth. The reveal animation runs once OlySense is settled.
      if (!playRef.current) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = SURFACE;
        ctx.fillRect(0, 0, W, H);
        raf = requestAnimationFrame(loop);
        return;
      }

      spawnIn -= dt;
      if (spawnIn <= 0 && dots.length < MAX_DOTS) {
        spawn();
        spawnIn = rand(0.5, 1.3);
      }

      // 1) advance dots
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        if (!d.dead) {
          d.segDist += step;
          d.headLen += step;
          if (d.dir === 'right') d.hx += step;
          else if (d.dir === 'left') d.hx -= step;
          else if (d.dir === 'up') d.hy -= step;
          else d.hy += step;
          if (d.segDist >= d.segLen) {
            // snap the moving coord onto the grid line just crossed (correct the
            // per-frame step overshoot) so every turn lands on the grid
            if (d.dir === 'right' || d.dir === 'left') d.hx = snapGX(d.hx);
            else d.hy = snapGY(d.hy);
            d.points.push({ x: d.hx, y: d.hy, len: d.headLen });
            turn(d);
          }
          if (d.kind === 'green' ? d.hx > W || d.hy < 0 : d.hx < 0 || d.hy > H) d.dead = true;
          d.tailLen = Math.max(d.tailLen, d.headLen - d.trail);
        } else {
          d.tailLen += step;
        }
        if (d.tailLen >= d.headLen) {
          dots.splice(i, 1);
          continue;
        }
        while (d.points.length > 2 && d.points[1].len < d.tailLen) d.points.shift();
      }

      // 2) build the reveal mask: soft stamps along each trail + a bright one at the head
      mctx.clearRect(0, 0, W, H);
      const bw = REVEAL_R * 2;
      for (const d of dots) {
        const span = Math.max(1, d.headLen - d.tailLen);
        for (let l = d.tailLen; l < d.headLen; l += STAMP) {
          const p = pointAt(d, l);
          mctx.globalAlpha = (l - d.tailLen) / span; // fade toward the tail
          mctx.drawImage(brush, p.x - REVEAL_R, p.y - REVEAL_R, bw, bw);
        }
        if (!d.dead) {
          mctx.globalAlpha = 1;
          mctx.drawImage(brush, d.hx - REVEAL_R, d.hy - REVEAL_R, bw, bw);
        }
      }
      mctx.globalAlpha = 1;
      // intersect the reveal with the grid lines → the holes to punch (revealed grid)
      mctx.globalCompositeOperation = 'destination-in';
      mctx.drawImage(grid, 0, 0, W, H);
      mctx.globalCompositeOperation = 'source-over';

      // 3) paint the white square surface, then cut the revealed grid lines out of it
      //    so the animated OlySense bg behind the canvas shows through along the grid.
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = SURFACE;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = GRID_REVEAL; // partial cut → a little white stays, so the grid reads lighter
      ctx.drawImage(mask, 0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // 4) draw the trails + arrow heads on top
      for (const d of dots) {
        const col = d.kind === 'green' ? GREEN : RED;
        const tailP = pointAt(d, d.tailLen);
        const headP = { x: d.hx, y: d.hy };
        if (tailP.x !== headP.x || tailP.y !== headP.y) {
          const grad = ctx.createLinearGradient(tailP.x, tailP.y, headP.x, headP.y);
          grad.addColorStop(0, `rgba(${col}, 0)`);
          grad.addColorStop(0.5, `rgba(${col}, 0.2)`);
          grad.addColorStop(1, `rgba(${col}, 0.85)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(tailP.x, tailP.y);
          for (const p of d.points) {
            if (p.len > d.tailLen && p.len < d.headLen) ctx.lineTo(p.x, p.y);
          }
          ctx.lineTo(headP.x, headP.y);
          ctx.stroke();
        }
        if (!d.dead) {
          const s = ARROW_SIZE / 17.333;
          ctx.save();
          ctx.translate(d.hx, d.hy);
          ctx.rotate(ROT[d.dir]);
          ctx.scale(s, s);
          ctx.translate(-8, -8.667);
          ctx.fillStyle = `rgb(${col})`;
          ctx.fill(arrow);
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeT);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} />;
}
