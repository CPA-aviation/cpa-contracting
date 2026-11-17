/**
 * Original cross-section of a generic two-lane carriageway.
 * Layer names are standard pavement terms; no thicknesses, specifications,
 * or project data are given. Illustrative only.
 */

const W = 1200;
const CL = 470; // centreline
const HALF = 290; // half carriageway width
const TOP = 150; // crown level
const CAMBER = 9;
const FOOT = 112;

const LAYERS = [
  { name: "Wearing course", t: 12, cls: "lyr-wear" },
  { name: "Binder course", t: 16, cls: "lyr-binder" },
  { name: "Base course", t: 30, cls: "lyr-base" },
  { name: "Sub-base", t: 42, cls: "lyr-subbase" },
] as const;

export function RoadSection({ labels = true }: { labels?: boolean }) {
  const xl = CL - HALF;
  const xr = CL + HALF;
  const edge = TOP + CAMBER;

  const tops = LAYERS.map((_, index) => LAYERS.slice(0, index).reduce((sum, item) => sum + item.t, 0));
  const depth = LAYERS.reduce((sum, item) => sum + item.t, 0);
  const shapes = LAYERS.map((layer, index) => {
    const d0 = tops[index];
    const d1 = d0 + layer.t;
    const s0 = d0 * 0.8; // side slope widening with depth
    const s1 = d1 * 0.8;
    const pts = [
      [xl - 10 - s0, edge + d0],
      [CL, TOP + d0],
      [xr + 10 + s0, edge + d0],
      [xr + 10 + s1, edge + d1],
      [CL, TOP + d1],
      [xl - 10 - s1, edge + d1],
    ]
      .map((p) => p.join(","))
      .join(" ");
    const midY = (edge + d0 + edge + d1) / 2 - CAMBER * 0.45;
    return { ...layer, pts, midY, index };
  });
  const bottom = edge + depth;

  const labelX = 1004;

  return (
    <svg className="dwg dwg-road" viewBox={`0 0 ${W} 360`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="rs-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.7" className="pt-fine" />
          <circle cx="4.5" cy="4.2" r="0.6" className="pt-fine" />
        </pattern>
        <pattern id="rs-agg" width="16" height="12" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.2" className="pt-agg" />
          <circle cx="12" cy="8" r="1.6" className="pt-agg" />
          <circle cx="9" cy="2" r="0.9" className="pt-agg" />
        </pattern>
        <pattern id="rs-sub" width="22" height="16" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.2" className="pt-fine" />
          <circle cx="15" cy="11" r="1.6" className="pt-fine" />
        </pattern>
        <pattern id="rs-ground" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="pt-hatch" />
        </pattern>
      </defs>

      {/* natural ground */}
      <rect x="0" y={bottom} width={W} height={360 - bottom} fill="url(#rs-ground)" className="lyr-ground" />
      <line className="dwg-ground-line" x1="0" y1={bottom} x2={W} y2={bottom} />

      {/* pavement layers */}
      {shapes.map((s) => (
        <g key={s.name}>
          <polygon className={`lyr ${s.cls}`} points={s.pts} />
          <polygon
            className="lyr-texture"
            points={s.pts}
            fill={s.index === 0 || s.index === 1 ? "url(#rs-dots)" : s.index === 2 ? "url(#rs-agg)" : "url(#rs-sub)"}
          />
        </g>
      ))}

      {/* footways and kerbs */}
      {[
        { x: xl - 14 - FOOT, k: xl - 14 },
        { x: xr + 14, k: xr + 1 },
      ].map(({ x, k }) => (
        <g key={x}>
          <rect className="lyr-footway" x={x} y={edge - 12} width={FOOT} height={18} />
          <rect className="dwg-kerb-sec" x={k} y={edge - 14} width={13} height={34} />
        </g>
      ))}

      {/* road markings */}
      {[CL, CL - HALF / 2 - 10, CL + HALF / 2 + 10].map((x) => (
        <rect key={x} className="dwg-marking" x={x - 7} y={TOP + (Math.abs(x - CL) / HALF) * CAMBER - 2.5} width="14" height="2.5" />
      ))}

      {/* centreline */}
      <line className="dwg-cl" x1={CL} y1="34" x2={CL} y2="344" />
      <text className="dwg-label dwg-label-strong" x={CL} y="26" textAnchor="middle">CL</text>

      {/* lane extents */}
      <line className="dwg-thin" x1={xl} y1="92" x2={xr} y2="92" />
      {[xl, CL, xr].map((x) => (
        <line key={`t${x}`} className="dwg-tick" x1={x - 5} y1="97" x2={x + 5} y2="87" />
      ))}
      <text className="dwg-label" x={(xl + CL) / 2} y="82" textAnchor="middle">LANE</text>
      <text className="dwg-label" x={(CL + xr) / 2} y="82" textAnchor="middle">LANE</text>
      <text className="dwg-label" x={xl - 14 - FOOT / 2} y="116" textAnchor="middle">FOOTWAY</text>
      <text className="dwg-label" x={xr + 14 + FOOT / 2} y="116" textAnchor="middle">FOOTWAY</text>

      {/* layer callouts */}
      {labels
        ? shapes.map((s, i) => {
            const ly = 168 + i * 34;
            const fromX = xr - 40 - i * 14;
            return (
              <g key={`l${s.name}`}>
                <circle className="dwg-dot" cx={fromX} cy={s.midY + (CAMBER * (fromX - CL)) / HALF} r="2.6" />
                <polyline
                  className="dwg-leader"
                  points={`${fromX},${s.midY + (CAMBER * (fromX - CL)) / HALF} ${labelX - 34},${ly} ${labelX - 8},${ly}`}
                />
                <text className="dwg-label" x={labelX} y={ly + 4}>
                  {`0${i + 1}  ${s.name.toUpperCase()}`}
                </text>
              </g>
            );
          })
        : null}
      {labels ? (
        <g>
          <circle className="dwg-dot" cx={xr - 110} cy={bottom + 22} r="2.6" />
          <polyline className="dwg-leader" points={`${xr - 110},${bottom + 22} ${labelX - 34},${bottom + 60} ${labelX - 8},${bottom + 60}`} />
          <text className="dwg-label" x={labelX} y={bottom + 64}>05  SUBGRADE</text>
        </g>
      ) : null}
    </svg>
  );
}
