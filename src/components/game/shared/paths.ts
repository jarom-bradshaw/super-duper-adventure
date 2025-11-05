export type XY = { x: number; y: number };

// Sample the y on a path at a given x by searching along path length.
// Caches by rounded x to avoid repeated work each frame.
export function samplePathYAtX(
  path: SVGPathElement,
  xTarget: number,
  cache: Map<number, number>
): number | null {
  const key = Math.round(xTarget);
  if (cache.has(key)) return cache.get(key)!;
  const len = path.getTotalLength();
  let lo = 0, hi = len;
  let bestY = Infinity;
  for (let i = 0; i < 18; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    const p1 = path.getPointAtLength(m1);
    const p2 = path.getPointAtLength(m2);
    const d1 = Math.abs(p1.x - xTarget);
    const d2 = Math.abs(p2.x - xTarget);
    if (d1 < d2) {
      hi = m2;
      bestY = p1.y;
    } else {
      lo = m1;
      bestY = p2.y;
    }
  }
  cache.set(key, bestY);
  return bestY;
}


