import { Canvas, useFrame } from '@react-three/fiber';
import { ExtrudedSVG, resolveMaterial } from '3dsvg';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Single shared canvas containing all 16 base-view icons. Replaces 16 separate
// SVG3D canvases (one per cell) — drops 15 WebGL contexts + 15 shader compiles +
// 15 shadow passes / render loops down to 1.
//
// Each IconCell installs its own useFrame callback that mutates its group's
// transform directly (no React state updates per frame) so the per-frame cost
// is tiny: just 16 sin/cos + a few mul-add per frame, no React reconcile.

const ANIMATE_SPEED = 1.5;          // matches the previous SVG3D animateSpeed
const CELL_GAP = 4;                 // scene units between cell centres
const ICON_DEPTH = 1;
const ICON_SMOOTHNESS = 0.6;
const ICON_SCALE = 0.6;             // shrink each icon inside its cell (1 = original)

function IconCell({
  svg,
  color,
  basePos,
}: {
  svg: string;
  color: string;
  basePos: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);       // ExtrudedSVG passes our ref through here.
  const containerRef = useRef<THREE.Group>(null);   // Outer wrapper we animate ourselves.
  const elapsedRef = useRef(0);

  // resolveMaterial returns the flat MaterialSettings shape ExtrudedSVG expects.
  // Higher roughness widens the specular highlight — the env reflection spreads
  // into a soft band across more of each icon instead of a tight bright spot.
  const materialSettings = useMemo(() => resolveMaterial('glass', { roughness: 0.55 }), []);

  useFrame((_, delta) => {
    const c = containerRef.current;
    if (!c) return;
    elapsedRef.current += delta * ANIMATE_SPEED;
    const t = elapsedRef.current;
    // spinFloat: continuous slow Y rotation + gentle vertical bob (matches
    // 3dsvg's built-in spinFloat math: rotation.y += delta*0.4*speed,
    // position.y = base + sin(t*1.2)*0.25).
    c.rotation.y += delta * 0.4 * ANIMATE_SPEED;
    c.position.y = basePos[1] + Math.sin(t * 1.2) * 0.25;
  });

  return (
    <group ref={containerRef} position={basePos}>
      {/* Inner scale group keeps the spinFloat math (which animates the outer
          group's rotation/position) independent of the icon size. */}
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

export function BaseIconsCanvas({ icons, color }: { icons: string[]; color: string }) {
  return (
    <Canvas
      // Explicit pixel size so the WebGL canvas dimensions are fixed from frame
      // 0 — bypasses ResizeObserver-driven re-sizing that can briefly resize the
      // backbuffer and shift the rendered icon size when the wrapper re-appears.
      style={{ width: 640, height: 640 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      resize={{ debounce: 0 }}
    >
      {/* Explicit camera set as a child with makeDefault — guarantees the
          [0, 0, 18] / fov 50 view is in place from the very first render
          (vs. R3F briefly using its default [0, 0, 5] / fov 75, which would
          show the icons huge for one frame before snapping to size). */}
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
      {/* Lobby HDRI — soft but well-distributed indoor light source with bright
          areas on multiple sides of the cubemap, so reflections land on icons
          across all rows rather than concentrated on one. No blur → shiny. */}
      <Environment preset="lobby" environmentIntensity={1.2} />
      <ambientLight intensity={0.4} />
      {icons.map((svg, i) => {
        // Cell positions 1→16, left-to-right top-to-bottom (matches CSS grid order).
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = (col - 1.5) * CELL_GAP;
        const y = (1.5 - row) * CELL_GAP; // y inverted so row 0 is at top
        return (
          <IconCell
            key={i}
            svg={svg}
            color={color}
            basePos={[x, y, 0]}
          />
        );
      })}
    </Canvas>
  );
}
