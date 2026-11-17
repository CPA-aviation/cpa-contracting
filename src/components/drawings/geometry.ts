/**
 * Small geometry helpers for the original technical drawings.
 * All drawings on the site are generated here in code: no photographs,
 * no third-party illustrations, no company project data.
 */

export type Point = readonly [number, number];

const COS30 = Math.cos(Math.PI / 6);

/** Isometric projection: x runs right-down, y runs left-down, z runs up. */
export function iso(x: number, y: number, z = 0): Point {
  return [(x - y) * COS30, (x + y) * 0.5 - z];
}

export function pts(points: readonly Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export class Bounds {
  minX = Infinity;
  minY = Infinity;
  maxX = -Infinity;
  maxY = -Infinity;

  add(...points: readonly Point[]) {
    for (const [x, y] of points) {
      if (x < this.minX) this.minX = x;
      if (y < this.minY) this.minY = y;
      if (x > this.maxX) this.maxX = x;
      if (y > this.maxY) this.maxY = y;
    }
  }

  viewBox(pad: number): string {
    const x = Math.floor(this.minX - pad);
    const y = Math.floor(this.minY - pad);
    const w = Math.ceil(this.maxX - this.minX + pad * 2);
    const h = Math.ceil(this.maxY - this.minY + pad * 2);
    return `${x} ${y} ${w} ${h}`;
  }
}
