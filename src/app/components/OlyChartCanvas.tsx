import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, type Mesh } from 'three';

// 3D bar-chart "skyline" — a symmetric cluster of columns peaking in the centre,
// dark navy at the middle fading to pale blue at the edges, lit from above.
// Recreates the OlySense Spline chart with plain extruded boxes + environment
// lighting (same R3F/Three foundation as the base-icon scene).

// Randomised initial height fraction (0–1) per bar, picked once per load.
const BAR_COLOR = '#2563EB';
const BARS: { h: number; c: string }[] = Array.from({ length: 9 }, () => ({
  h: 0.5 + Math.random() * 0.5,
  c: BAR_COLOR,
}));

const MAX_H = 9;     // world height of the tallest bar
const BAR_W = 1.25;  // bar width
const DEPTH = BAR_W; // bar depth = width → square cross-section
const GAP = 1.5;     // x spacing between bar centres
const Y_OFFSET = -7;    // shift the whole cluster down so the bar bottoms clip past the card edge
const X_OFFSET = 0;     // horizontal placement of the cluster
const MIN_FRAC = 0.65;   // reference floor used for the height→colour mapping

// Colour by height: short = medium blue (not pale), tall = dark blue.
// Narrow range so the bars stay close in tone.
const COLOR_SHORT = new Color('#3E78DA');
const COLOR_TALL = new Color('#22448F');

// Subtle, very smooth height wobble around each bar's trajectory value.
const ANIM_AMP = 0.08;       // base wobble, scaled per bar by its height (taller shift more)
const ANIM_SPEED = 0.45;     // base pace; randomised slightly per bar

function Bars() {
  const n = BARS.length;
  const refs = useRef<(Mesh | null)[]>([]);
  const bars = useMemo(
    () =>
      BARS.map((bar, i) => {
        // bar.h ∈ [0.5, 1.0] → 0 (shortest) … 1 (tallest)
        const t = Math.min(1, Math.max(0, (bar.h - 0.5) / 0.5));
        const col = new Color().copy(COLOR_SHORT).lerp(COLOR_TALL, t);
        return {
          height: MAX_H * bar.h,
          amp: ANIM_AMP * bar.h,
          phase: Math.random() * Math.PI * 2,           // random start → desynced
          speed: ANIM_SPEED * (0.6 + Math.random() * 0.8), // random pace per bar
          col,
          x: (i - (n - 1) / 2) * GAP,
        };
      }),
    [n],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < bars.length; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const s = 1 + bars[i].amp * Math.sin(t * bars[i].speed + bars[i].phase);
      m.scale.y = s;
      m.position.y = (bars[i].height * s) / 2; // keep the base fixed
    }
  });

  return (
    <group position={[X_OFFSET, Y_OFFSET, 0]}>
      {bars.map((b, i) => (
        <RoundedBox
          key={i}
          ref={(el: Mesh | null) => { refs.current[i] = el; }}
          args={[BAR_W, b.height, DEPTH]}
          radius={0.08}
          smoothness={4}
          position={[b.x, b.height / 2, 0]}
        >
          <meshStandardMaterial color={b.col} emissive={b.col} emissiveIntensity={0.6} roughness={0.5} metalness={0} />
        </RoundedBox>
      ))}
    </group>
  );
}

// Isometric vantage: orthographic + viewing from a corner (equal-ish x/y/z
// offsets) so front, top and side faces all show with parallel edges.
const ISO_CAM: [number, number, number] = [-5, 4, 20];
const ISO_LOOK: [number, number, number] = [0, 1, 0];

function CameraAim() {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.position.set(...ISO_CAM);
    camera.lookAt(...ISO_LOOK);
  }, [camera]);
  return null;
}

export function OlyChartCanvas() {
  return (
    <Canvas
      orthographic
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      camera={{ position: ISO_CAM, zoom: 52, near: 0.1, far: 200 }}
      resize={{ offsetSize: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <CameraAim />
      <Environment files="/hdri/potsdamer_platz_1k.hdr" environmentIntensity={0.7} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 12, 8]} intensity={1.5} />
      <Bars />
    </Canvas>
  );
}
