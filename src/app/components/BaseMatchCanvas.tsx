import { Canvas, useFrame } from '@react-three/fiber';
import { ExtrudedSVG, resolveMaterial } from '3dsvg';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Base-view 3×3 grid of spinning 3D glass icons. The icon set is fixed — each
// cell spins + bobs in place and never swaps (so the geometry is built once and
// never rebuilds). Used only in the base scene.

const ANIMATE_SPEED = 1.5;
const CELL_GAP = 5.5;        // scene units between cell centres (3×3)
const ICON_DEPTH = 1;
const ICON_SMOOTHNESS = 0.6;
const ICON_SCALE = 0.65;     // icon size inside its cell
const BOARD_PX = 640;

function IconCell({ svg, color, basePos }: { svg: string; color: string; basePos: [number, number, number] }) {
  const containerRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const materialSettings = useMemo(() => resolveMaterial('glass', { roughness: 0.55 }), []);

  useFrame((_, delta) => {
    const c = containerRef.current;
    if (!c) return;
    elapsedRef.current += delta * ANIMATE_SPEED;
    c.rotation.y += delta * 0.4 * ANIMATE_SPEED;
    c.position.y = basePos[1] + Math.sin(elapsedRef.current * 1.2) * 0.25;
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

export function BaseMatchCanvas({ icons, color }: { icons: string[]; color: string }) {
  return (
    <Canvas style={{ width: BOARD_PX, height: BOARD_PX }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} resize={{ debounce: 0 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
      <Environment preset="lobby" environmentIntensity={1.2} />
      <ambientLight intensity={0.4} />
      {icons.map((svg, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return <IconCell key={i} svg={svg} color={color} basePos={[(col - 1) * CELL_GAP, (1 - row) * CELL_GAP, 0]} />;
      })}
    </Canvas>
  );
}
