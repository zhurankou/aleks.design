import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Line } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Renders the PDR chart curve as a 3D red pipe (TubeGeometry swept along the same
// CHART_POINTS) plus a sphere marker that travels along the pipe, viewed with an
// isometric orthographic camera. Overlays the OlySense square; replaces the 2D
// SVG curve+dot. The marker ping-pongs between two points and drags the (DOM)
// dashed vertical line with it (lineRef) while driving the rate number (rateRef):
// the rate falls as the ball dips and rises as it climbs.

const SQUARE = 792; // chart coordinate space (matches the old 2D viewBox)
const PIPE_RADIUS = 8;
const DOT_RADIUS = 15; // diameter ↑ 2px
// Pitch-only vantage: orthographic camera tilted down from above (no sideways
// yaw). A yaw would mix each point's Y into its screen-X under ortho projection,
// warping the even horizontal spacing and shrinking the span; pitch-only keeps
// screen-X ∝ world-X, so the curve covers the full width in even increments and
// the sphere stays aligned with the dashed line, while the tube still reads 3D.
const ISO_CAM: [number, number, number] = [0, 240, 560];
const DWELL_SECONDS = 1.1; // pause at each dot
const MOVE_SECONDS = 0.7; // glide between adjacent dots
// Displayed rate maps to the ball's height: lowest point of the path → RATE_LOW,
// highest → RATE_HIGH.
const RATE_LOW = 44;
const RATE_HIGH = 66;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function CameraAim() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    camera.position.set(...ISO_CAM);
    camera.lookAt(0, 0, 0);
    // Zoom so the SQUARE-wide chart space maps exactly to the canvas width,
    // regardless of the canvas's actual pixel size (it widens during the morph).
    // worldX ∈ [-SQUARE/2, SQUARE/2] then fills the square edge-to-edge.
    (camera as THREE.OrthographicCamera).zoom = size.width / SQUARE;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// Marker ball: rides the curve between tFrom and tTo (ping-pong), writes the
// matching screen-x to the DOM dashed line, and writes a height-derived percentage
// to the DOM rate number so both stay locked to the ball.
function Marker({
  curve,
  stopsT,
  yLow,
  yHigh,
  color,
  lineRef,
  onRate,
}: {
  curve: THREE.CatmullRomCurve3;
  stopsT: number[];
  yLow: number;
  yHigh: number;
  color: string;
  lineRef?: React.RefObject<HTMLDivElement | null>;
  onRate?: (rate: number) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const lastStop = useRef<number>(-1);
  useFrame((state) => {
    // Step through the dots: dwell at each, then glide to the next (ping-pong loop).
    const seg = DWELL_SECONDS + MOVE_SECONDS;
    const cycle = stopsT.length * seg;
    const tt = state.clock.elapsedTime % cycle;
    const si = Math.floor(tt / seg);
    const local = tt - si * seg;
    const uCur = stopsT[si];
    const uNext = stopsT[(si + 1) % stopsT.length];
    const u =
      local < DWELL_SECONDS
        ? uCur // dwell on the dot
        : uCur + (uNext - uCur) * easeInOutCubic((local - DWELL_SECONDS) / MOVE_SECONDS);
    const p = curve.getPoint(u);
    if (ref.current) ref.current.position.copy(p);
    // p.x ∈ [-SQUARE/2, SQUARE/2] → 0–100% of the square width.
    if (lineRef?.current) lineRef.current.style.left = `${((p.x + SQUARE / 2) / SQUARE) * 100}%`;
    // Rate updates only when the ball arrives + pauses at a new dot: snap to that
    // dot's height-mapped value (the odometer then rolls to it during the dwell).
    if (si !== lastStop.current) {
      lastStop.current = si;
      const frac = (curve.getPoint(uCur).y - yLow) / (yHigh - yLow);
      onRate?.(Math.round(RATE_LOW + frac * (RATE_HIGH - RATE_LOW)));
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[DOT_RADIUS, 32, 32]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function PdrPipeCanvas({
  points,
  fromIndex,
  toIndex,
  lineRef,
  onRate,
  color = '#E83C5C',
}: {
  points: [number, number][];
  fromIndex: number;
  toIndex: number;
  lineRef?: React.RefObject<HTMLDivElement | null>;
  onRate?: (rate: number) => void;
  color?: string;
}) {
  const { curve, linePoints, stopsT, yLow, yHigh } = useMemo(() => {
    // Map the 792×792 chart space (y-down, origin top-left) to centred, y-up world
    // coords so the curve keeps its shape + placement within the square.
    const v = points.map(([x, y]) => new THREE.Vector3(x - SQUARE / 2, -(y - SQUARE / 2), 0));
    const n = v.length;
    const curve = new THREE.CatmullRomCurve3(v, false, 'catmullrom', 0.5);
    const tFrom = fromIndex / (n - 1);
    const tTo = toIndex / (n - 1);
    // Dwell stops: each dot from fromIndex→toIndex then back (ping-pong, ends once).
    const idx: number[] = [];
    for (let i = fromIndex; i <= toIndex; i++) idx.push(i);
    for (let i = toIndex - 1; i > fromIndex; i--) idx.push(i);
    const stopsT = idx.map((i) => i / (n - 1));
    // Sample the travelled span to get its true min/max height for the rate map.
    let yLow = Infinity;
    let yHigh = -Infinity;
    const STEPS = 120;
    for (let s = 0; s <= STEPS; s++) {
      const y = curve.getPoint(tFrom + (tTo - tFrom) * (s / STEPS)).y;
      if (y < yLow) yLow = y;
      if (y > yHigh) yHigh = y;
    }
    return { curve, linePoints: curve.getPoints(200), stopsT, yLow, yHigh };
  }, [points, fromIndex, toIndex]);

  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, near: 0.1, far: 5000 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      resize={{ offsetSize: true }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <CameraAim />
      <Environment files="/hdri/potsdamer_platz_1k.hdr" environmentIntensity={0.9} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[300, 400, 600]} intensity={1.3} />
      {/* Flat constant-width line (screen-space px) instead of a 3D pipe. */}
      <Line points={linePoints} color={color} lineWidth={8} />
      <Marker curve={curve} stopsT={stopsT} yLow={yLow} yHigh={yHigh} color={color} lineRef={lineRef} onRate={onRate} />
    </Canvas>
  );
}
