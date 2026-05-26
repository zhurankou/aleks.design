// Builds the chart geometry for a stat card from knot points (in the 362.884 ×
// 123.665 chart viewBox): a Catmull-Rom-smoothed line path, the matching gradient
// fill path, and `sampleY` — the curve's y at a given horizontal fraction (used by
// the sliding dot and the rate read-out).

const SMOOTH = 0.18; // Catmull-Rom handle length — rounded but no overshoot/clip

export function chartPaths(knots: [number, number][], height = 123.665) {
  const n = knots.length;
  const c1: [number, number][] = [];
  const c2: [number, number][] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = knots[i - 1] ?? knots[i];
    const p1 = knots[i];
    const p2 = knots[i + 1];
    const p3 = knots[i + 2] ?? knots[i + 1];
    c1.push([p1[0] + (p2[0] - p0[0]) * SMOOTH, p1[1] + (p2[1] - p0[1]) * SMOOTH]);
    c2.push([p2[0] - (p3[0] - p1[0]) * SMOOTH, p2[1] - (p3[1] - p1[1]) * SMOOTH]);
  }

  let linePath = `M${knots[0][0]} ${knots[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    linePath += `C${c1[i][0]} ${c1[i][1]} ${c2[i][0]} ${c2[i][1]} ${knots[i + 1][0]} ${knots[i + 1][1]}`;
  }
  const fillPath = `${linePath}L${knots[n - 1][0]} ${height}L${knots[0][0]} ${height}Z`;

  const evalSeg = (s: number, t: number, a: 0 | 1) => {
    const mt = 1 - t;
    return mt * mt * mt * knots[s][a] + 3 * mt * mt * t * c1[s][a] + 3 * mt * t * t * c2[s][a] + t * t * t * knots[s + 1][a];
  };

  const x0 = knots[0][0];
  const xN = knots[n - 1][0];
  // The curve's y at x = x0 + frac·(xN − x0), frac ∈ [0,1] (x is monotonic).
  const sampleY = (frac: number) => {
    const x = x0 + frac * (xN - x0);
    let seg = 0;
    for (let i = 0; i < n - 1; i++) {
      if (x >= knots[i][0] && x <= knots[i + 1][0]) { seg = i; break; }
    }
    let lo = 0;
    let hi = 1;
    let t = 0.5;
    for (let iter = 0; iter < 24; iter++) {
      t = (lo + hi) / 2;
      if (evalSeg(seg, t, 0) < x) lo = t; else hi = t;
    }
    return evalSeg(seg, t, 1);
  };

  return { linePath, fillPath, sampleY };
}
