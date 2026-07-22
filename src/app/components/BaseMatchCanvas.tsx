import { Canvas, useFrame } from '@react-three/fiber';
import { ExtrudedIcon } from './ExtrudedIcon';
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
const ICON_SMOOTHNESS = 0.7; // curve/bevel segment count (cached now, so cost is one-off) — higher = smoother bevel
const ICON_ROUNDNESS = 3.5;  // scales the edge bevel → rounder glyph edges (1 = near-sharp original)
const MATCH_SCALE = 1.16;    // size bump on a matched line
const BOARD_PX = 640;
// App-icon tile: a rounded liquid-glass square the glyph is extruded from.
const TILE_SIZE = 5.6;       // tile side (the glyph is normalised to ~4 units)
const TILE_DEPTH = 0.7;
const TILE_RADIUS = 1.4;     // rounded corners (in-plane, independent of thickness)
const CELL_FIT = 0.65;       // overall scale of the tile+glyph unit
const ICON_IN_TILE = 1.0;    // glyph size relative to the tile (leaves padding)
const GLYPH_GLOW = 0.55;     // emissive self-glow — kept low so the glass stays see-through and deep (high glow floods it solid + washes pale)
const TILE_GLOW = 0.6;       // emissive glow on the glass tile
// Reflections + a fresnel rim glow. Iridescence is off (0) — the glass look is a single
// pure hue, not a rainbow sheen; the constant stays so it's a one-flip toggle.
const HOLO_IRIDESCENCE = 0;
const HOLO_IRID_IOR = 1.9;
const HOLO_ENV_INTENSITY = 0.4;                       // low reflections — high values make the glass read mirror/chrome
const HOLO_THICKNESS: [number, number] = [60, 2000]; // film thickness (nm) → very broad rainbow spread (many bands)
const RIM_POWER = 2.8;       // fresnel edge sharpness (higher = thinner rim)
const RIM_INTENSITY = 1.8;   // brightness of the glowing neon-outline edge
const PULSE_PERIOD = 2.0;    // seconds per glow breathe
const PULSE_AMP = 0.3;       // ± fraction the glow swings each cycle (neon buzz)
// Glyph PBR — translucent coloured glass: light transmits through it (glassy depth),
// the volume tints toward the icon colour by thickness (Beer–Lambert), and it self-glows.
const GLYPH_METALNESS = 0;            // dielectric — metals can't be coloured/translucent glass
const GLYPH_ROUGHNESS = 0.06;         // smooth, glossy surface streaks
const GLYPH_IOR = 1.5;                // glass-ish refraction
const GLYPH_TRANSMISSION = 1.0;       // light passes through → see depth/the back of the glyph
const GLYPH_THICKNESS = 1.6;          // volume thickness driving the colour absorption
const GLYPH_ATTEN_DISTANCE = 1.4;     // how far light travels before fully absorbed (higher = clearer/more see-through)
const GLYPH_CLEARCOAT = 0.25;         // low — clearcoat adds a glossy mirror coat that reads metallic
const GLYPH_CLEARCOAT_ROUGHNESS = 0.05;

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
const WOBBLE_AMP = 0.6;    // max wobble swing on each axis (radians, ~34°)
const WOBBLE_SPEED = 0.8;  // base wobble rate (rad/s) — per-cell randomised around this
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

function IconCell({ svg, color, basePos, burst, bumped, spin, wobble, depth, showTile, cellFit, roundness, cheapMaterial }: { svg: string; color: string; basePos: [number, number, number]; burst: number; bumped: boolean; spin: boolean; wobble: boolean; depth: number; showTile: boolean; cellFit: number; roundness: number; cheapMaterial: boolean }) {
  const containerRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const burstSeen = useRef(burst);
  const burstStart = useRef(-1);     // shared-clock time this burst began (-1 = none)
  const extraTurns = useRef(0);      // banked whole turns from past bursts — keeps the cell in phase
  const bumpedRef = useRef(bumped);
  bumpedRef.current = bumped;
  // The raised glyph: holographic (metallic), softened reflection, opaque so it
  // reads clearly against the glass tile.
  const emissiveColor = useMemo(() => new THREE.Color(color), [color]);
  // Per-cell random wobble params (stable for the cell's life) → each sways out of sync.
  const wob = useMemo(() => ({
    ax: WOBBLE_AMP * (0.6 + Math.random() * 0.4), ay: WOBBLE_AMP * (0.6 + Math.random() * 0.4),
    fx: WOBBLE_SPEED * (0.7 + Math.random() * 0.6), fy: WOBBLE_SPEED * (0.7 + Math.random() * 0.6),
    px: Math.random() * TWO_PI, py: Math.random() * TWO_PI,
  }), []);

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
    // Spin (continuous) + an independent random wobble on each axis.
    c.rotation.y = (spin ? t * BASE_SPIN + extra : 0) + (wobble ? wob.ay * Math.sin(t * wob.fy + wob.py) : 0);
    c.rotation.x = wobble ? wob.ax * Math.sin(t * wob.fx + wob.px) : 0;
    const target = bumpedRef.current ? MATCH_SCALE : 1;
    c.scale.setScalar(THREE.MathUtils.lerp(c.scale.x, target, 0.12)); // matched cell swells
    // Layer the glow on here so the colour self-illuminates (vivid) while keeping
    // the metallic reflection.
    const pulse = 1 + PULSE_AMP * Math.sin(t * (TWO_PI / PULSE_PERIOD)); // rhythmic neon "buzz", shared across all cells
    const g = groupRef.current;
    if (g) g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial | undefined;
      if (!m || !m.emissive) return;
      m.emissive.copy(emissiveColor);
      m.emissiveIntensity = GLYPH_GLOW * pulse;
      m.attenuationColor.copy(emissiveColor); // glass volume tints toward the current icon hue
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
      <group scale={cellFit}>
        {/* Liquid-glass tile: translucent, clearcoated, reflective rounded square. */}
        {showTile && (
        <mesh geometry={TILE_GEO}>
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={TILE_GLOW} metalness={0} roughness={0.12} transparent opacity={0.4} clearcoat={1} clearcoatRoughness={0.12} ior={1.45} reflectivity={0.6} iridescence={0.6} iridescenceIOR={1.3} iridescenceThicknessRange={[100, 500]} />
        </mesh>
        )}
        {/* Glyph extruded from the tile's front face. Material is ours — the per-frame
            loop above layers iridescence, envMap, emissive glow + the rim shader on top. */}
        <group position={[0, 0, showTile ? TILE_DEPTH / 2 : 0]} scale={ICON_IN_TILE}>
          <ExtrudedIcon svgString={svg} depth={depth} smoothness={ICON_SMOOTHNESS} roundness={roundness} groupRef={groupRef}>
            {/* transmission (glass see-through) forces a per-frame render-to-texture pass —
                the single most expensive PBR feature here. Off on mobile: opaque glyph instead. */}
            <meshPhysicalMaterial
              color={color}
              metalness={GLYPH_METALNESS}
              roughness={GLYPH_ROUGHNESS}
              ior={GLYPH_IOR}
              transmission={cheapMaterial ? 0 : GLYPH_TRANSMISSION}
              thickness={GLYPH_THICKNESS}
              attenuationDistance={GLYPH_ATTEN_DISTANCE}
              clearcoat={cheapMaterial ? 0 : GLYPH_CLEARCOAT}
              clearcoatRoughness={GLYPH_CLEARCOAT_ROUGHNESS}
              side={THREE.DoubleSide}
            />
          </ExtrudedIcon>
        </group>
      </group>
    </group>
  );
}

// renderActive=false parks the frameloop on 'demand' (one initial frame, then no
// per-frame work) — the mobile page uses it to stop the WebGL loop off-screen.
export function BaseMatchCanvas({ pool, color, colors, playing, matching = true, spin = true, wobble = false, depth = ICON_DEPTH, showTile = true, cellFit = CELL_FIT, roundness = ICON_ROUNDNESS, shuffleKey = 0, renderActive = true, cheapMaterial = false }: { pool: string[]; color: string; colors?: string[]; playing: boolean; matching?: boolean; spin?: boolean; wobble?: boolean; depth?: number; showTile?: boolean; cellFit?: number; roundness?: number; shuffleKey?: number; renderActive?: boolean; cheapMaterial?: boolean }) {
  // Static board (no swaps) shows 9 distinct icons so none ever match; the live game
  // uses makeBoard (duplicates allowed, no winning line) so matches can emerge.
  const [board, setBoard] = useState<number[]>(() =>
    !playing && pool.length >= 9 ? pickDistinct(pool.length, 9) : makeBoard(pool.length),
  );
  const [bursts, setBursts] = useState<number[]>(() => Array(9).fill(0));
  const [bumped, setBumped] = useState<boolean[]>(() => Array(9).fill(false));
  const boardRef = useRef(board);
  boardRef.current = board;

  // Reshuffle the static set to a fresh 9 distinct icons whenever shuffleKey changes
  // (e.g. each time the base view scrolls into view). Skips the initial mount — the
  // initializer already set a distinct board.
  const shuffleMounted = useRef(false);
  useEffect(() => {
    if (!shuffleMounted.current) { shuffleMounted.current = true; return; }
    if (playing || pool.length < 9) return;
    setBoard(pickDistinct(pool.length, 9));
  }, [shuffleKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const comps = matching ? findCompletions(bd) : []; // no deliberate match-completions when matching is off
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
        const line = matching ? anyMatch(boardRef.current) : null;
        if (line) celebrate(line, done);                      // a match emerged → celebrate it
        else after(280, done);
      });
    };

    const next = () => after(EVENT_MIN_MS + Math.random() * (EVENT_MAX_MS - EVENT_MIN_MS), () => swapTick(next));
    next();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [playing, pool.length, matching]);

  // resize.offsetSize: measure layout px, not the transform-scaled visual rect —
  // Safari reports the latter and would size/clip the board wrongly under the
  // page's scale(k) transform.
  return (
    <Canvas style={{ width: BOARD_PX, height: BOARD_PX }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.25]} resize={{ debounce: 0, offsetSize: true }} frameloop={renderActive ? 'always' : 'demand'}>
      <PerspectiveCamera makeDefault position={[0, 0, 40]} fov={24} />
      <Environment files="/hdri/st_fagans_interior_1k.hdr" environmentIntensity={0.7} />
      <ambientLight intensity={0.25} />
      {board.map((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return <IconCell key={i} svg={pool[p]} color={colors ? colors[i % colors.length] : color} basePos={[(col - 1) * CELL_GAP, (1 - row) * CELL_GAP, 0]} burst={bursts[i]} bumped={bumped[i]} spin={spin} wobble={wobble} depth={depth} showTile={showTile} cellFit={cellFit} roundness={roundness} cheapMaterial={cheapMaterial} />;
      })}
    </Canvas>
  );
}
