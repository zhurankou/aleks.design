import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Decal, Environment, Lightformer } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Convert an SVG markup string into a THREE.CanvasTexture. Renders the SVG to
// an offscreen <canvas> at TEXTURE_SIZE × TEXTURE_SIZE, preserving aspect by
// centring the icon with a small padding. Returns undefined while loading.
const TEXTURE_SIZE = 256;
const TEXTURE_PADDING = 0.12; // 12% margin around the icon

async function svgStringToTexture(svgString: string): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = TEXTURE_SIZE;
      canvas.height = TEXTURE_SIZE;
      const ctx = canvas.getContext('2d')!;
      const pad = TEXTURE_SIZE * TEXTURE_PADDING;
      const inner = TEXTURE_SIZE - pad * 2;
      const aspect = img.naturalWidth / img.naturalHeight;
      const drawW = aspect > 1 ? inner : inner * aspect;
      const drawH = aspect > 1 ? inner / aspect : inner;
      ctx.drawImage(img, (TEXTURE_SIZE - drawW) / 2, (TEXTURE_SIZE - drawH) / 2, drawW, drawH);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      URL.revokeObjectURL(url);
      resolve(texture);
    };
    img.src = url;
  });
}

function useSvgTextures(svgs: (string | undefined)[]): (THREE.Texture | undefined)[] {
  const [textures, setTextures] = useState<(THREE.Texture | undefined)[]>(() => svgs.map(() => undefined));
  useEffect(() => {
    let cancelled = false;
    Promise.all(svgs.map(async (s) => (s ? svgStringToTexture(s) : undefined))).then((loaded) => {
      if (!cancelled) setTextures(loaded);
    });
    return () => { cancelled = true; };
    // svgs array reference stability is the caller's responsibility — wrap with useMemo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgs.length, svgs.join('|').length]);
  return textures;
}

// ============================================================================
// Tunables — dial in the visual feel without touching the structure below.
// ============================================================================
const CUBE_COUNT = 9;
const CUBE_SIZE = 0.96;          // scene units per face (~96px on a 1000px-tall viewport)
const CUBE_DEPTH = 0.1;          // flat tile depth
const CORNER_RADIUS = 0.24;      // face corner radius (kept proportional: 1/4 of face)
const ICON_SIZE = 0.84;          // icon decal size in scene units — fixed (independent of CUBE_SIZE)
const CORNER_SEGMENTS = 16;      // curve smoothness for the rounded corners
const BEVEL_SIZE = 0.045;        // bigger bevel → pillow-soft rounded edges (max ≈ depth/2 = 0.05)
const BEVEL_SEGMENTS = 8;        // smoother curve along the bevel

// Circle layout — tiles equally spaced on a ring whose radius slowly breathes
// in and out (subtle diameter oscillation). The whole ring also rotates.
const CIRCLE_R = 5.5;            // mean ring radius (scene units)
const RING_BREATHE_AMP = 0.25;   // ± scene units around CIRCLE_R (slight in/out)
const RING_BREATHE_FREQ = 0.35;  // rad/s — slow breathe (~18s per cycle)

const GROUP_SPIN_SPEED = 0.06;   // rad/s — slow CCW rotation of the entire ring as a rigid body
const SELF_SPIN_SPEED = 0.25;    // rad/s — slow CCW rotation of each tile around its own Z axis
const WOBBLE_AMP = 0.18;         // rad — peak tilt on X/Y axes (~10°). Bump for more wobble.
const WOBBLE_FREQ = 0.6;         // rad/s — speed of the wobble sine waves

const GLASS_OPACITY = 0.5;       // single static opacity (no per-cube fade now)

// Build a 2D rounded-rectangle Path centred on origin, then extrude to depth.
// Gives us face corners independent of depth (RoundedBox can't — uniform radius
// for all 12 edges clamps face corners to depth/2).
function makeRoundedRectGeometry(w: number, h: number, r: number, d: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  const rad = Math.min(r, hw, hh);
  shape.moveTo(-hw + rad, -hh);
  shape.lineTo(hw - rad, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + rad);
  shape.lineTo(hw, hh - rad);
  shape.quadraticCurveTo(hw, hh, hw - rad, hh);
  shape.lineTo(-hw + rad, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - rad);
  shape.lineTo(-hw, -hh + rad);
  shape.quadraticCurveTo(-hw, -hh, -hw + rad, -hh);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: true,
    bevelThickness: BEVEL_SIZE,
    bevelSize: BEVEL_SIZE,
    bevelSegments: BEVEL_SEGMENTS,
    curveSegments: CORNER_SEGMENTS,
  });
  // ExtrudeGeometry extrudes from z=0 to z=depth — recentre so the tile sits on the origin.
  geom.translate(0, 0, -d / 2);
  return geom;
}

type SpiralCubeProps = {
  /** Angle on the ring (radians); tile position = (R(t)·cosθ, R(t)·sinθ, 0). */
  theta: number;
  iconTexture?: THREE.Texture;
  geometry: THREE.BufferGeometry;
  /** Per-tile phase offset so wobble cycles aren't synchronised across tiles. */
  seed: number;
};

function SpiralCube({ theta, iconTexture, geometry, seed }: SpiralCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Per-frame: breathing radius, self-spin around Z, and X/Y wobble (phase-shifted
  // by seed so the tiles don't tilt in sync).
  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.elapsedTime;

    // Breathing diameter — same R(t) for every tile, sin-driven.
    const r = CIRCLE_R + RING_BREATHE_AMP * Math.sin(t * RING_BREATHE_FREQ);
    m.position.x = r * Math.cos(theta);
    m.position.y = r * Math.sin(theta);
    m.position.z = 0;

    m.rotation.z += delta * SELF_SPIN_SPEED;
    m.rotation.x = WOBBLE_AMP * Math.sin(t * WOBBLE_FREQ + seed);
    m.rotation.y = WOBBLE_AMP * Math.cos(t * WOBBLE_FREQ * 1.13 + seed * 1.7);
  });
  return (
    <mesh ref={meshRef} geometry={geometry}>
      {/* Refractive glass + alpha-transparent blend.
          - `background={GLASS_BG}` (white) gives the transmission sampler a
            colour to refract instead of a black void.
          - `transparent` + `opacity` blends the result with the canvas alpha
            so the page bg shows through (real see-through glass).
          - Thin glass (`thickness 0.3`) + far `attenuationDistance` keeps
            tiles light/airy instead of darkened by interior tint. */}
      {/* Transparent glass with reflections off the procedural Lightformer
          environment. The Lightformer rects show up as bright catches on the
          tile surface (that's the "glass shine" you see at edges). Low
          opacity + low roughness + clearcoat = clear see-through glass. */}
      <meshPhysicalMaterial
        color="#E8F1FA"
        metalness={0}
        roughness={0.04}
        clearcoat={1}
        clearcoatRoughness={0.02}
        iridescence={0.5}
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[100, 800]}
        transparent
        opacity={0.22}
        depthWrite={false}
      />
      {iconTexture && (
        <Decal
          position={[0, 0, CUBE_DEPTH / 2]}
          rotation={[0, 0, 0]}
          scale={ICON_SIZE}
        >
          <meshBasicMaterial map={iconTexture} transparent polygonOffset polygonOffsetFactor={-1} />
        </Decal>
      )}
    </mesh>
  );
}

function SpiralGroup({ iconTextures }: { iconTextures?: (THREE.Texture | undefined)[] }) {
  const groupRef = useRef<THREE.Group>(null);

  // One shared rounded-rectangle geometry for all 12 cubes — one allocation,
  // reused by every mesh. Recreated only if size constants change (they don't).
  const geometry = useMemo(
    () => makeRoundedRectGeometry(CUBE_SIZE, CUBE_SIZE, CORNER_RADIUS, CUBE_DEPTH),
    [],
  );

  // Rotate the whole ring as a rigid body around the scene's Z axis.
  // +Z rotation = counterclockwise viewed from the camera. Individual tiles
  // also breathe in/out (handled inside SpiralCube's own useFrame).
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.z += delta * GROUP_SPIN_SPEED;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: CUBE_COUNT }).map((_, i) => (
        <SpiralCube
          key={i}
          theta={(i / CUBE_COUNT) * Math.PI * 2}
          iconTexture={iconTextures?.[i]}
          geometry={geometry}
          // Stagger wobble phases (~120° apart so x/y/sin/cos land at different
          // points across the tiles).
          seed={i * 2.094}
        />
      ))}
    </group>
  );
}

export type HomeSpiralCanvasProps = {
  /** True while the user is on the home scene. Gates the render loop so the
   *  GPU goes idle when the user scrolls past. */
  active: boolean;
  /** Optional raw SVG markup strings, one per tile. Converted internally to
   *  CanvasTexture and projected onto each tile's +Z face via <Decal>. */
  iconSvgs?: (string | undefined)[];
};

export function HomeSpiralCanvas({ active, iconSvgs }: HomeSpiralCanvasProps) {
  const svgArray = useMemo(
    () => Array.from({ length: CUBE_COUNT }).map((_, i) => iconSvgs?.[i]),
    [iconSvgs],
  );
  const iconTextures = useSvgTextures(svgArray);
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      resize={{ debounce: 0, offsetSize: true }}
      frameloop={active ? 'always' : 'never'}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
      {/* Procedural environment — no HDRI file. The Lightformer rectangles act
          as bright virtual area lights baked into a runtime env map, so the
          glass surface gets visible reflective highlights without needing a
          CDN-hosted HDRI. */}
      <Environment frames={1} resolution={256} background={false}>
        {/* Big soft key — upper-right */}
        <Lightformer
          form="rect"
          intensity={6}
          color="#FFFFFF"
          position={[8, 6, 5]}
          rotation={[0, -Math.PI / 4, 0]}
          scale={[8, 6, 1]}
        />
        {/* Cool fill — upper-left, pale blue */}
        <Lightformer
          form="rect"
          intensity={3}
          color="#CFE2F5"
          position={[-8, 5, 4]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[8, 5, 1]}
        />
        {/* Lower rim — picks out the bottom edges */}
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#FFFFFF"
          position={[0, -7, 4]}
          rotation={[Math.PI / 3, 0, 0]}
          scale={[10, 4, 1]}
        />
        {/* Front catch — adds a centred specular sparkle directly in front */}
        <Lightformer
          form="circle"
          intensity={2}
          color="#FFFFFF"
          position={[0, 0, 10]}
          scale={[3, 3, 1]}
        />
      </Environment>
      <ambientLight intensity={0.4} color="#D6E8FA" />
      <SpiralGroup iconTextures={iconTextures} />
    </Canvas>
  );
}
