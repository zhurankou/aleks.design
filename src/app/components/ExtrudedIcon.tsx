import { useMemo, type ReactNode, type Ref } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Direct SVG → extruded-mesh pipeline that replaces 3dsvg's <ExtrudedSVG>, so the
// glyph geometry and material are fully ours to tune. Two changes vs 3dsvg:
//   1. Geometry is built synchronously and CACHED per (svg, depth, smoothness) —
//      the base grid draws from a tiny fixed pool, so each glyph extrudes exactly
//      once and a cell swap just re-points a mesh at existing geometry (the swap
//      hitch 3dsvg's async re-extrude caused is gone).
//   2. The mesh material is passed as children, so the caller owns it completely.
// The extrusion math below is ported from 3dsvg so the silhouette/scale match.

export type IconGeometry = { geometry: THREE.BufferGeometry; center: THREE.Vector3; baseScale: number };

const geoCache = new Map<string, IconGeometry>();
const EMPTY: IconGeometry = { geometry: new THREE.BufferGeometry(), center: new THREE.Vector3(), baseScale: 1 };

// A shape that traces the SVG's viewBox rectangle is a background frame, not a glyph — drop it.
function isViewBoxRect(shape: THREE.Shape, vbW: number, vbH: number): boolean {
  const pts = shape.getPoints(4);
  if (pts.length !== 4 && pts.length !== 5) return false;
  const bb = new THREE.Box2();
  for (const p of pts) bb.expandByPoint(p);
  const size = new THREE.Vector2();
  bb.getSize(size);
  const tol = 0.01;
  return Math.abs(size.x - vbW) / vbW < tol && Math.abs(size.y - vbH) / vbH < tol;
}

function parseShapesFromSVG(svgString: string): THREE.Shape[] {
  const loader = new SVGLoader();
  const svgData = loader.parse(svgString);
  const allShapes: THREE.Shape[] = [];
  const vbMatch = svgString.match(/viewBox\s*=\s*["']\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)/);
  const vbW = vbMatch ? parseFloat(vbMatch[3]) : null;
  const vbH = vbMatch ? parseFloat(vbMatch[4]) : null;
  svgData.paths.forEach((path) => {
    const style = (path.userData as { style?: { fill?: string; stroke?: string; strokeWidth?: string } } | undefined)?.style;
    const hasFill = !!style?.fill && style.fill !== 'none' && style.fill !== 'transparent';
    const hasStroke = !!style?.stroke && style.stroke !== 'none' && style.stroke !== 'transparent';
    if (hasFill) {
      const shapes = SVGLoader.createShapes(path);
      for (const shape of shapes) {
        if (vbW && vbH && isViewBoxRect(shape, vbW, vbH)) continue;
        allShapes.push(shape);
      }
    }
    if (hasStroke) {
      const strokeWidth = parseFloat(style?.strokeWidth ?? '2');
      const divisions = 12;
      path.subPaths.forEach((subPath) => {
        const points = subPath.getPoints(divisions);
        if (points.length < 2) return;
        const shape = new THREE.Shape();
        const halfWidth = strokeWidth / 2;
        const leftSide: THREE.Vector2[] = [];
        const rightSide: THREE.Vector2[] = [];
        for (let i = 0; i < points.length; i++) {
          const curr = points[i];
          const prev = points[Math.max(0, i - 1)];
          const next = points[Math.min(points.length - 1, i + 1)];
          const dx = next.x - prev.x;
          const dy = next.y - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          leftSide.push(new THREE.Vector2(curr.x + nx * halfWidth, curr.y + ny * halfWidth));
          rightSide.push(new THREE.Vector2(curr.x - nx * halfWidth, curr.y - ny * halfWidth));
        }
        shape.moveTo(leftSide[0].x, leftSide[0].y);
        for (let i = 1; i < leftSide.length; i++) shape.lineTo(leftSide[i].x, leftSide[i].y);
        for (let i = rightSide.length - 1; i >= 0; i--) shape.lineTo(rightSide[i].x, rightSide[i].y);
        shape.closePath();
        allShapes.push(shape);
      });
    }
    if (!hasFill && !hasStroke) {
      allShapes.push(...SVGLoader.createShapes(path));
    }
  });
  return allShapes;
}

// Triplanar UVs so any reflection/texture maps cleanly across face and bevel walls.
function recomputeTriplanarUVs(geo: THREE.BufferGeometry, bb: THREE.Box3) {
  const bbSize = new THREE.Vector3();
  bb.getSize(bbSize);
  const uvAttr = geo.attributes.uv;
  const posAttr = geo.attributes.position;
  const normalAttr = geo.attributes.normal;
  const maxDimUv = Math.max(bbSize.x, bbSize.y, bbSize.z) || 1;
  for (let j = 0; j < uvAttr.count; j++) {
    const px = posAttr.getX(j);
    const py = posAttr.getY(j);
    const pz = posAttr.getZ(j);
    const nx = Math.abs(normalAttr.getX(j));
    const ny = Math.abs(normalAttr.getY(j));
    const nz = Math.abs(normalAttr.getZ(j));
    let u: number, v: number;
    if (nz >= nx && nz >= ny) {
      u = (px - bb.min.x) / maxDimUv;
      v = 1 - (py - bb.min.y) / maxDimUv;
    } else if (nx >= ny) {
      u = (pz - bb.min.z) / maxDimUv;
      v = 1 - (py - bb.min.y) / maxDimUv;
    } else {
      u = (px - bb.min.x) / maxDimUv;
      v = (pz - bb.min.z) / maxDimUv;
    }
    uvAttr.setXY(j, u, v);
  }
  uvAttr.needsUpdate = true;
}

// Build (or fetch from cache) the merged, centred, 4-unit-normalised glyph geometry.
// Cached geometry is shared across cells and intentionally never disposed — the pool
// is tiny and immutable, so one build per glyph is the whole point.
export function getIconGeometry(svgString: string, depth: number, smoothness: number, roundness = 1): IconGeometry {
  const key = `${svgString}|${depth}|${smoothness}|${roundness}`;
  const cached = geoCache.get(key);
  if (cached) return cached;

  const allShapes = parseShapesFromSVG(svgString);
  if (allShapes.length === 0) {
    geoCache.set(key, EMPTY);
    return EMPTY;
  }

  // Scale the extrude depth/bevel relative to the glyph's flat size (matches 3dsvg).
  const tempGeo = new THREE.ShapeGeometry(allShapes);
  tempGeo.computeBoundingBox();
  const flatSize = new THREE.Vector3();
  tempGeo.boundingBox!.getSize(flatSize);
  const maxFlatDim = Math.max(flatSize.x, flatSize.y, 1);
  tempGeo.dispose();

  const complexity = allShapes.length;
  const qualityScale = complexity > 200 ? 0.3 : complexity > 50 ? 0.6 : 1;
  const scaledDepth = (depth / 10) * maxFlatDim;
  const bevelScale = Math.min(maxFlatDim * 0.02, 1);
  const bevelSegments = Math.round((3 + smoothness * 20) * qualityScale);
  const curveSegments = Math.round((24 + smoothness * 176) * qualityScale);
  const bevel = bevelScale * (0.15 + smoothness * 0.2) * roundness; // roundness scales the edge chamfer
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: scaledDepth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments,
    curveSegments,
  };

  const individualGeos = allShapes.map((s) => new THREE.ExtrudeGeometry(s, extrudeSettings));
  const merged = BufferGeometryUtils.mergeGeometries(individualGeos, false);
  individualGeos.forEach((g) => g.dispose());
  if (!merged) {
    geoCache.set(key, EMPTY);
    return EMPTY;
  }

  merged.computeBoundingBox();
  merged.computeVertexNormals();
  recomputeTriplanarUVs(merged, merged.boundingBox!);
  const bb = merged.boundingBox!;
  const center = new THREE.Vector3();
  bb.getCenter(center);
  const size = new THREE.Vector3();
  bb.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const baseScale = maxDim > 0 ? 4 / maxDim : 1;

  const result: IconGeometry = { geometry: merged, center, baseScale };
  geoCache.set(key, result);
  return result;
}

export function ExtrudedIcon({
  svgString,
  depth,
  smoothness,
  roundness = 1,
  groupRef,
  rotationX = 0,
  rotationY = 0,
  children,
}: {
  svgString: string;
  depth: number;
  smoothness: number;
  roundness?: number; // scales the edge bevel (1 = original)
  groupRef?: Ref<THREE.Group>;
  rotationX?: number;
  rotationY?: number;
  children?: ReactNode; // the mesh material — caller owns it
}) {
  const { geometry, center, baseScale } = useMemo(
    () => getIconGeometry(svgString, depth, smoothness, roundness),
    [svgString, depth, smoothness, roundness],
  );
  // Y is flipped (SVG y-down → scene y-up); same transform 3dsvg applied.
  return (
    <group ref={groupRef} rotation={[rotationX, rotationY, 0]} scale={[baseScale, -baseScale, baseScale]}>
      <mesh geometry={geometry} position={[-center.x, -center.y, -center.z]}>
        {children}
      </mesh>
    </group>
  );
}
