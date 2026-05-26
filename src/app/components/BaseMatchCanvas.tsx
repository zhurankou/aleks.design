import { Canvas, useFrame } from '@react-three/fiber';
import { ExtrudedSVG, resolveMaterial } from '3dsvg';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Base-view 3×3 grid of spinning 3D glass icons drawn from a larger pool. Cells swap
// one at a time on a tic (fast spin hides the swap). The board allows duplicates so
// random swaps build up near-matches; occasionally a swap completes a line, so a
// tic-tac-toe match emerges organically — the matched three swell + hold, then spin
// out and swap to new icons. The icons also float buoyantly (phase-offset per cell).
// Base scene only.

const ANIMATE_SPEED = 1.5;
const CELL_GAP = 5.5;        // scene units between cell centres (3×3)
const ICON_DEPTH = 1;        // SVG-unit extrude depth — thin glyph (original thickness)
const ICON_SMOOTHNESS = 0.5; // fewer curve/bevel segments → cheaper re-extrude on swap (smaller frame hitch)
const MATCH_SCALE = 1.16;    // size bump on a matched line
const BOARD_PX = 640;
// App-icon tile: a rounded liquid-glass square the glyph is extruded from.
const TILE_SIZE = 5.6;       // tile side (the glyph is normalised to ~4 units)
const TILE_DEPTH = 0.7;
const TILE_RADIUS = 1.4;     // rounded corners (in-plane, independent of thickness)
const CELL_FIT = 0.65;       // overall scale of the tile+glyph unit
const ICON_IN_TILE = 1.0;    // glyph size relative to the tile (leaves padding)
const GLYPH_GLOW = 1.15;     // emissive self-glow layered on the metallic glyph → vivid colour (beats the metalness wash)
const TILE_GLOW = 0.6;       // emissive glow on the glass tile
// Holographic shimmer: thin-film iridescence + stronger reflections (3dsvg's holographic
// preset omits iridescence, so the rainbow sheen is added on the mesh directly).
const HOLO_IRIDESCENCE = 1.0;
const HOLO_IRID_IOR = 1.9;
const HOLO_ENV_INTENSITY = 2.6;                       // punchier environment reflections
const HOLO_THICKNESS: [number, number] = [60, 2000]; // film thickness (nm) → very broad rainbow spread (many bands)
const RIM_POWER = 2.8;       // fresnel edge sharpness (higher = thinner rim)
const RIM_INTENSITY = 1.8;   // brightness of the glowing neon-outline edge
const PULSE_PERIOD = 2.0;    // seconds per glow breathe
const PULSE_AMP = 0.3;       // ± fraction the glow swings each cycle (neon buzz)

// Tile geometry: a rounded-rectangle extruded thin with a small edge bevel, so the
// corners round freely (unlike RoundedBox, whose radius is capped by the thickness).
// Identical for every cell, so build it once and share.
const TILE_GEO: THREE.BufferGeometry = (() => {
  const w = TILE_SIZE / 2;
  const r = TILE_RADIUS;
  const sh = new THREE.Shape();
  sh.moveTo(-w + r, -w);
  sh.lineTo(w - r, -w);
  sh.quadraticCurveTo(w, -w, w, -w + r);
  sh.lineTo(w, w - r);
  sh.quadraticCurveTo(w, w, w - r, w);
  sh.lineTo(-w + r, w);
  sh.quadraticCurveTo(-w, w, -w, w - r);
  sh.lineTo(-w, -w + r);
  sh.quadraticCurveTo(-w, -w, -w + r, -w);
  const bevel = 0.12;
  const g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.01, TILE_DEPTH - bevel * 2), bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 14 });
  g.computeBoundingBox();
  const bb = g.boundingBox!;
  g.translate(0, 0, -(bb.min.z + bb.max.z) / 2); // centre in z
  g.computeVertexNormals();
  return g;
})();

const BURST_DUR = 1.1;       // seconds of the spin (slower = gentler, less strobe, more time to re-extrude)
const BURST_TURNS = 2;       // whole extra turns per burst → it ends back in phase (stays in sync)
const BASE_SPIN = 0.4 * ANIMATE_SPEED; // glyph spin speed (the tile stays fixed, so gaps stay even)
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

function pickDistinct(n: number, k: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(k, n));
}

function anyMatch(bd: number[]): number[] | null {
  for (const ln of LINES) if (bd[ln[0]] === bd[ln[1]] && bd[ln[1]] === bd[ln[2]]) return ln;
  return null;
}

function findCompletions(bd: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (const [a, b, c] of LINES) {
    if (bd[a] === bd[b] && bd[a] !== bd[c]) out.push([c, bd[a]]);
    else if (bd[a] === bd[c] && bd[a] !== bd[b]) out.push([b, bd[a]]);
    else if (bd[b] === bd[c] && bd[b] !== bd[a]) out.push([a, bd[b]]);
  }
  return out;
}

function makeBoard(n: number): number[] {
  let b: number[];
  do { b = Array.from({ length: 9 }, () => Math.floor(Math.random() * n)); } while (anyMatch(b));
  return b;
}

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
  // The raised glyph: holographic (metallic), softened reflection, mostly opaque so it
  // reads clearly against the glass tile.
  const iconMat = useMemo(() => resolveMaterial('holographic', { roughness: 0.12, opacity: 1, metalness: 0.85 }), []);
  const emissiveColor = useMemo(() => new THREE.Color(color), [color]);

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
    c.rotation.y = t * BASE_SPIN + extra; // the whole tile (icon included) spins as one unit
    const target = bumpedRef.current ? MATCH_SCALE : 1;
    c.scale.setScalar(THREE.MathUtils.lerp(c.scale.x, target, 0.12)); // matched cell swells
    // 3dsvg drops emissive for the holographic preset — layer the glow on here so the
    // colour self-illuminates (vivid) while keeping the metallic reflection.
    const pulse = 1 + PULSE_AMP * Math.sin(t * (TWO_PI / PULSE_PERIOD)); // rhythmic neon "buzz", shared across all cells
    const g = groupRef.current;
    if (g) g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial | undefined;
      if (!m || !m.emissive) return;
      m.emissive.copy(emissiveColor);
      m.emissiveIntensity = GLYPH_GLOW * pulse;
      if (m.userData.shader) {
        m.userData.shader.uniforms.uRimColor.value.copy(emissiveColor); // keep rim hue in sync
        m.userData.shader.uniforms.uRimIntensity.value = RIM_INTENSITY * pulse; // buzz the rim too
      }
      if (!m.userData.holo) { // set once — iridescence + the rim shader need a recompile
        m.iridescence = HOLO_IRIDESCENCE;
        m.iridescenceIOR = HOLO_IRID_IOR;
        m.iridescenceThicknessRange = HOLO_THICKNESS;
        m.envMapIntensity = HOLO_ENV_INTENSITY;
        // Fresnel rim-glow: add a view-angle term to the emissive so the glyph's edges glow
        // like a neon outline (brightest at the silhouette, fading toward the face).
        m.onBeforeCompile = (shader) => {
          shader.uniforms.uRimColor = { value: emissiveColor.clone() };
          shader.uniforms.uRimPower = { value: RIM_POWER };
          shader.uniforms.uRimIntensity = { value: RIM_INTENSITY };
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uRimColor; uniform float uRimPower; uniform float uRimIntensity;')
            .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nfloat rimDot = 1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);\ntotalEmissiveRadiance += uRimColor * pow(rimDot, uRimPower) * uRimIntensity;');
          m.userData.shader = shader;
        };
        m.needsUpdate = true;
        m.userData.holo = true;
      }
    });
  });

  return (
    <group ref={containerRef} position={basePos}>
      <group scale={CELL_FIT}>
        {/* Liquid-glass tile: translucent, clearcoated, reflective rounded square. */}
        <mesh geometry={TILE_GEO}>
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={TILE_GLOW} metalness={0} roughness={0.12} transparent opacity={0.4} clearcoat={1} clearcoatRoughness={0.12} ior={1.45} reflectivity={0.6} iridescence={0.6} iridescenceIOR={1.3} iridescenceThicknessRange={[100, 500]} />
        </mesh>
        {/* Glyph extruded from the tile's front face. */}
        <group position={[0, 0, TILE_DEPTH / 2]} scale={ICON_IN_TILE}>
          <ExtrudedSVG
            svgString={svg}
            depth={ICON_DEPTH}
            smoothness={ICON_SMOOTHNESS}
            color={color}
            materialSettings={iconMat}
            rotationX={0}
            rotationY={0}
            groupRef={groupRef}
          />
        </group>
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
    const freeIcons = (excludeCells: number[]) => {
      const used = new Set(boardRef.current.filter((_, i) => !excludeCells.includes(i)));
      const out: number[] = [];
      for (let i = 0; i < pool.length; i++) if (!used.has(i)) out.push(i);
      return out;
    };

    const celebrate = (line: number[], done: () => void) => {
      setBumpedCells(line, true);
      after(MATCH_HOLD_MS, () => burstCells(line));            // spin the matched three
      after(MATCH_HOLD_MS + HALF_MS, () => {                   // swap them out mid-spin (breaks the match)
        const cands = resolveIcons(boardRef.current, line, pool.length);
        line.forEach((cell, k) => after(k * 90, () => setCells([cell], [cands[k]]))); // stagger → no triple-hitch
        setBumpedCells(line, false);
      });
      after(MATCH_HOLD_MS + HALF_MS + 700, done);
    };

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
      <PerspectiveCamera makeDefault position={[0, 0, 40]} fov={24} />
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
