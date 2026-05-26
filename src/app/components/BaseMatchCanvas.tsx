import { Canvas, useFrame } from '@react-three/fiber';
import { ExtrudedSVG, resolveMaterial } from '3dsvg';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Base-view 3×3 grid of spinning 3D glass icons drawn from a larger pool. Cells
// swap one at a time on a "tic" (a random cell ramps to a fast spin and swaps to
// a new icon mid-spin). The board allows duplicates, so random swaps naturally
// build up near-matches (two-in-a-line); occasionally a swap is aimed to COMPLETE
// a line, so a tic-tac-toe match emerges organically from the swapping. A formed
// line swells + holds, then spins out and swaps to new icons. Base scene only.

const ANIMATE_SPEED = 1.5;
const CELL_GAP = 5.5;        // scene units between cell centres (3×3)
const ICON_DEPTH = 1;
const ICON_SMOOTHNESS = 0.85; // rounder edges, but lighter geometry than 1 (cheaper swap rebuilds)
const ICON_SCALE = 0.65;     // icon size inside its cell
const MATCH_SCALE = 1.16;    // size bump on a matched line
const BOARD_PX = 640;

const BURST_DUR = 0.9;       // seconds of the fast spin
const BURST_TURNS = 2;       // whole extra turns per burst → it ends back in phase (stays in sync)
const BASE_SPIN = 0.4 * ANIMATE_SPEED; // shared base angular speed (rad/s) — identical for every cell
const TWO_PI = Math.PI * 2;
const HALF_MS = BURST_DUR * 500; // ms to the peak of a burst (where swaps hide)
const EVENT_MIN_MS = 2600;   // min gap between swaps
const EVENT_MAX_MS = 5200;   // max gap between swaps
const COMPLETE_CHANCE = 0.45; // when a near-match exists, chance this swap completes it
const MATCH_HOLD_MS = 1100;  // how long a formed line is shown before it resolves

// The 8 tic-tac-toe lines, as indices into the 9-cell board (row-major).
const LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
];

// Pick `k` distinct random indices from [0, n).
function pickDistinct(n: number, k: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(k, n));
}

// First fully-matched line (all 3 equal), or null.
function anyMatch(bd: number[]): number[] | null {
  for (const ln of LINES) if (bd[ln[0]] === bd[ln[1]] && bd[ln[1]] === bd[ln[2]]) return ln;
  return null;
}

// Lines with exactly two equal cells → [cellToFill, icon] that would complete them.
function findCompletions(bd: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (const [a, b, c] of LINES) {
    if (bd[a] === bd[b] && bd[a] !== bd[c]) out.push([c, bd[a]]);
    else if (bd[a] === bd[c] && bd[a] !== bd[b]) out.push([b, bd[a]]);
    else if (bd[b] === bd[c] && bd[b] !== bd[a]) out.push([a, bd[b]]);
  }
  return out;
}

// Random board (duplicates allowed) with no line already matched.
function makeBoard(n: number): number[] {
  let b: number[];
  do { b = Array.from({ length: 9 }, () => Math.floor(Math.random() * n)); } while (anyMatch(b));
  return b;
}

// 3 distinct icons for `line` that leave the board with no match.
function resolveIcons(bd: number[], line: number[], n: number): number[] {
  for (let t = 0; t < 12; t++) {
    const trip = pickDistinct(n, 3);
    const test = bd.slice();
    line.forEach((c, k) => (test[c] = trip[k]));
    if (!anyMatch(test)) return trip;
  }
  return pickDistinct(n, 3);
}

function IconCell({ svg, color, basePos, burst, bumped }: { svg: string; color: string; basePos: [number, number, number]; burst: number; bumped: boolean }) {
  const containerRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const burstSeen = useRef(burst);
  const burstStart = useRef(-1);     // shared-clock time this burst began (-1 = none)
  const extraTurns = useRef(0);      // banked whole turns from past bursts — keeps the cell in phase
  const bumpedRef = useRef(bumped);
  bumpedRef.current = bumped;
  // Soften the reflection (preset roughness 0.1 → 0.3) so the specular highlight is a
  // broad band instead of a tight point that strobes/jerks as the icon spins.
  const materialSettings = useMemo(() => resolveMaterial('holographic', { roughness: 0.3 }), []);

  useFrame((state) => {
    const c = containerRef.current;
    if (!c) return;
    const t = state.clock.elapsedTime; // shared across all cells → identical base angle
    if (burst !== burstSeen.current) { burstSeen.current = burst; burstStart.current = t; }
    let extra = extraTurns.current;
    if (burstStart.current >= 0) {
      const p = (t - burstStart.current) / BURST_DUR;
      if (p < 1) {
        extra = extraTurns.current + p * p * (3 - 2 * p) * BURST_TURNS * TWO_PI; // smoothstep ramp of whole turns
      } else {
        extraTurns.current += BURST_TURNS * TWO_PI; // bank the turns → exactly back in phase
        burstStart.current = -1;
        extra = extraTurns.current;
      }
    }
    c.rotation.y = t * BASE_SPIN + extra;
    c.position.y = basePos[1] + Math.sin(t * 1.2 * ANIMATE_SPEED) * 0.25;
    const target = bumpedRef.current ? MATCH_SCALE : 1;
    c.scale.setScalar(THREE.MathUtils.lerp(c.scale.x, target, 0.12));
  });

  return (
    <group ref={containerRef} position={basePos}>
      <group scale={ICON_SCALE}>
        <ExtrudedSVG
          svgString={svg}
          depth={ICON_DEPTH}
          smoothness={ICON_SMOOTHNESS}
          color={color}
          materialSettings={materialSettings}
          rotationX={0}
          rotationY={0}
          groupRef={groupRef}
        />
      </group>
    </group>
  );
}

export function BaseMatchCanvas({ pool, color, playing }: { pool: string[]; color: string; playing: boolean }) {
  const [board, setBoard] = useState<number[]>(() => makeBoard(pool.length));
  const [bursts, setBursts] = useState<number[]>(() => Array(9).fill(0));
  const [bumped, setBumped] = useState<boolean[]>(() => Array(9).fill(false));
  const boardRef = useRef(board);
  boardRef.current = board;

  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const after = (ms: number, fn: () => void) => {
      const id = setTimeout(() => { timers.delete(id); if (!cancelled) fn(); }, ms);
      timers.add(id);
    };
    const burstCells = (cells: number[]) => setBursts((b) => { const c = b.slice(); cells.forEach((i) => (c[i]++)); return c; });
    const setCells = (cells: number[], vals: number[]) => setBoard((bd) => { const nb = bd.slice(); cells.forEach((i, k) => (nb[i] = vals[k])); return nb; });
    const setBumpedCells = (cells: number[], on: boolean) => setBumped((b) => { const c = b.slice(); cells.forEach((i) => (c[i] = on)); return c; });

    // A line just matched → swell + hold, then spin out and swap to new icons.
    const celebrate = (line: number[], done: () => void) => {
      setBumpedCells(line, true);
      after(MATCH_HOLD_MS, () => burstCells(line));            // spin the matched three
      after(MATCH_HOLD_MS + HALF_MS, () => {                   // swap them out mid-spin (breaks the match)
        const cands = resolveIcons(boardRef.current, line, pool.length);
        // stagger the three swaps so only one geometry rebuilds per frame (no triple-hitch)
        line.forEach((cell, k) => after(k * 90, () => setCells([cell], [cands[k]])));
        setBumpedCells(line, false);
      });
      after(MATCH_HOLD_MS + HALF_MS + 700, done);
    };

    // One swap: usually a random cell→random icon; occasionally aimed to complete a
    // near-match. After it lands, if a line is now matched, celebrate it.
    const swapTick = (done: () => void) => {
      const bd = boardRef.current;
      const comps = findCompletions(bd);
      let cell: number;
      let icon: number;
      if (comps.length && Math.random() < COMPLETE_CHANCE) {
        [cell, icon] = comps[Math.floor(Math.random() * comps.length)];
      } else {
        cell = Math.floor(Math.random() * 9);
        const opts: number[] = [];
        for (let i = 0; i < pool.length; i++) if (i !== bd[cell]) opts.push(i);
        icon = opts[Math.floor(Math.random() * opts.length)];
      }
      burstCells([cell]);
      after(HALF_MS, () => setCells([cell], [icon]));          // the icon swaps in (mid-spin)
      after(HALF_MS + 220, () => {
        const line = anyMatch(boardRef.current);
        if (line) celebrate(line, done);                      // a match emerged → celebrate it
        else after(280, done);
      });
    };

    const next = () => after(EVENT_MIN_MS + Math.random() * (EVENT_MAX_MS - EVENT_MIN_MS), () => swapTick(next));
    next();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [playing, pool.length]);

  return (
    <Canvas style={{ width: BOARD_PX, height: BOARD_PX }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.25]} resize={{ debounce: 0 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
      <Environment preset="lobby" environmentIntensity={1.2} />
      <ambientLight intensity={0.4} />
      {board.map((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return <IconCell key={i} svg={pool[p]} color={color} basePos={[(col - 1) * CELL_GAP, (1 - row) * CELL_GAP, 0]} burst={bursts[i]} bumped={bumped[i]} />;
      })}
    </Canvas>
  );
}
