import type { ReactElement } from "react";
import { Bounds, iso, pts, type Point } from "./geometry";

/**
 * Original isometric drawing: a generic structural frame beside a generic
 * carriageway, one for each licensed activity. Illustrative only — it does not
 * depict a company project, site, or method.
 */

const BAY_X = 56;
const BAY_Y = 48;
const BAYS_X = 4;
const BAYS_Y = 3;
const STOREY = 30;
const STOREYS = 7; // storeys drawn; the last one is shown as an open frame
const SLAB = 4;
const OVER = 7;
const X = BAY_X * BAYS_X;
const Y = BAY_Y * BAYS_Y;
const LETTERS = ["A", "B", "C", "D", "E"];

type Variant = "site" | "building";

export function SiteAxonometric({ variant = "site", labels = true }: { variant?: Variant; labels?: boolean }) {
  const b = new Bounds();
  const out: ReactElement[] = [];
  let k = 0;
  const key = () => `e${k++}`;

  const poly = (points: Point[], className: string) => {
    b.add(...points);
    out.push(<polygon key={key()} className={className} points={pts(points)} />);
  };
  const line = (a: Point, c: Point, className: string) => {
    b.add(a, c);
    out.push(<line key={key()} className={className} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} />);
  };
  const bubble = (p: Point, text: string) => {
    b.add([p[0] - 10, p[1] - 10], [p[0] + 10, p[1] + 10]);
    out.push(
      <g key={key()} className="dwg-bubble">
        <circle cx={p[0]} cy={p[1]} r={8.5} />
        <text x={p[0]} y={p[1] + 3.4} textAnchor="middle">{text}</text>
      </g>,
    );
  };

  /* ---------- ground: road, footway, setting-out grid ---------- */
  if (variant === "site") {
    const r0 = Y + 34;
    const r1 = Y + 118;
    const xa = -96;
    const xb = X + 120;
    poly([iso(xa, Y + 16), iso(xb, Y + 16), iso(xb, r0), iso(xa, r0)], "dwg-footway");
    poly([iso(xa, r0), iso(xb, r0), iso(xb, r1), iso(xa, r1)], "dwg-road");
    poly([iso(xa, r1), iso(xb, r1), iso(xb, r1 + 16), iso(xa, r1 + 16)], "dwg-footway");
    line(iso(xa, r0), iso(xb, r0), "dwg-kerb");
    line(iso(xa, r1), iso(xb, r1), "dwg-kerb");
    const mid = (r0 + r1) / 2;
    line(iso(xa, mid - 1.5), iso(xb, mid - 1.5), "dwg-centre");
    line(iso(xa, mid + 1.5), iso(xb, mid + 1.5), "dwg-centre");
    for (const lane of [r0 + 21, r1 - 21]) {
      for (let x = xa + 10; x < xb - 20; x += 34) {
        line(iso(x, lane), iso(x + 16, lane), "dwg-lane");
      }
    }
  }

  for (let i = 0; i <= BAYS_X; i += 1) {
    const x = i * BAY_X;
    line(iso(x, -46), iso(x, Y + 12), "dwg-grid");
  }
  for (let j = 0; j <= BAYS_Y; j += 1) {
    const y = j * BAY_Y;
    line(iso(-46, y), iso(X + 12, y), "dwg-grid");
  }

  /* ---------- frame, bottom up (painter's order) ---------- */
  const core = { x0: BAY_X * 1 + 10, x1: BAY_X * 1 + 42, y0: BAY_Y * 1 + 8, y1: BAY_Y * 1 + 38 };

  for (let s = 0; s <= STOREYS; s += 1) {
    const z = s * STOREY;
    const openLevel = s === STOREYS;

    if (openLevel) {
      poly(
        [iso(-OVER, -OVER, z), iso(X + OVER, -OVER, z), iso(X + OVER, Y + OVER, z), iso(-OVER, Y + OVER, z)],
        "dwg-slab-open",
      );
      continue;
    }

    // slab top + two visible edge faces
    poly([iso(-OVER, -OVER, z), iso(X + OVER, -OVER, z), iso(X + OVER, Y + OVER, z), iso(-OVER, Y + OVER, z)], "dwg-slab");
    poly([iso(X + OVER, -OVER, z), iso(X + OVER, Y + OVER, z), iso(X + OVER, Y + OVER, z - SLAB), iso(X + OVER, -OVER, z - SLAB)], "dwg-edge-r");
    poly([iso(-OVER, Y + OVER, z), iso(X + OVER, Y + OVER, z), iso(X + OVER, Y + OVER, z - SLAB), iso(-OVER, Y + OVER, z - SLAB)], "dwg-edge-l");

    // core walls for this storey (two faces toward the viewer)
    const zt = z + STOREY - SLAB;
    poly([iso(core.x1, core.y0, z), iso(core.x1, core.y1, z), iso(core.x1, core.y1, zt), iso(core.x1, core.y0, zt)], "dwg-core-r");
    poly([iso(core.x0, core.y1, z), iso(core.x1, core.y1, z), iso(core.x1, core.y1, zt), iso(core.x0, core.y1, zt)], "dwg-core-l");

    // columns
    const top = s === STOREYS - 1;
    for (let i = 0; i <= BAYS_X; i += 1) {
      for (let j = 0; j <= BAYS_Y; j += 1) {
        const front = i === BAYS_X || j === BAYS_Y;
        if (top && i + j > 4) continue; // upper storey shown partly open
        line(iso(i * BAY_X, j * BAY_Y, z), iso(i * BAY_X, j * BAY_Y, z + STOREY - SLAB), front ? "dwg-col" : "dwg-col-back");
      }
    }
  }

  /* ---------- grid references (annotation sits above the drawing) ---------- */
  const zTop = STOREYS * STOREY;
  for (let i = 0; i <= BAYS_X; i += 1) {
    line(iso(i * BAY_X, -OVER, zTop), iso(i * BAY_X, -30, zTop), "dwg-grid-ref");
    bubble(iso(i * BAY_X, -40, zTop), LETTERS[i]);
  }
  for (let j = 0; j <= BAYS_Y; j += 1) {
    line(iso(-OVER, j * BAY_Y, zTop), iso(-30, j * BAY_Y, zTop), "dwg-grid-ref");
    bubble(iso(-40, j * BAY_Y, zTop), String(j + 1));
  }

  /* ---------- callouts ---------- */
  if (labels) {
    const callout = (from: Point, to: Point, text: string, anchor: "start" | "end") => {
      line(from, to, "dwg-leader");
      const end: Point = [to[0] + (anchor === "start" ? 36 : -36), to[1]];
      line(to, end, "dwg-leader");
      out.push(<circle key={key()} className="dwg-dot" cx={from[0]} cy={from[1]} r={2.6} />);
      const tx = end[0] + (anchor === "start" ? 6 : -6);
      b.add([tx + (anchor === "start" ? 1 : -1) * text.length * 6.4, end[1] - 6], [tx, end[1] + 4]);
      out.push(
        <text key={key()} className="dwg-label" x={tx} y={end[1] + 3.5} textAnchor={anchor}>
          {text}
        </text>,
      );
    };
    callout(iso(X, BAY_Y, STOREY * 5), [iso(X, BAY_Y, STOREY * 5)[0] + 40, iso(X, BAY_Y, STOREY * 5)[1] - 40], "BUILDING CONTRACTING", "start");
    if (variant === "site") {
      const p = iso(-40, Y + 76);
      callout(p, [p[0] - 30, p[1] + 52], "ROAD CONTRACTING", "end");
    } else {
      const p = iso(core.x1 - 6, core.y1, (STOREYS - 1) * STOREY + 12);
      callout(p, [p[0] - 150, p[1] - 30], "CORE", "end");
    }
  }

  return (
    <svg className="dwg dwg-axo" viewBox={b.viewBox(14)} aria-hidden="true" focusable="false">
      {out}
    </svg>
  );
}
