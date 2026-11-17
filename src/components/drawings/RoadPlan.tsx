/**
 * Original plan view of a generic dual carriageway with a side-road junction.
 * Chainage marks are drafting convention only. Illustrative; not a project.
 */

const W = 1200;
const H = 340;

export function RoadPlan() {
  const top = 50;
  const med0 = 142;
  const med1 = 160;
  const bot = 252;
  const jx = 812; // junction centre
  const jw = 70;
  const dashes = (y: number, from: number, to: number, skip?: [number, number]) => {
    const out: number[] = [];
    for (let x = from; x < to; x += 46) {
      if (skip && x + 24 > skip[0] && x < skip[1]) continue;
      out.push(x);
    }
    return out.map((x) => <rect key={`${y}-${x}`} className="dwg-marking" x={x} y={y - 1.5} width="24" height="3" />);
  };
  const chev = (x: number, y: number, dir: 1 | -1) => (
    <polyline
      key={`a${x}-${y}`}
      className="dwg-arrow"
      points={`${x - 16 * dir},${y - 7} ${x},${y} ${x - 16 * dir},${y + 7}`}
    />
  );

  return (
    <svg className="dwg dwg-roadplan" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      {/* carriageways */}
      <rect className="pl-road" x="0" y={top} width={W} height={med0 - top} />
      <rect className="pl-median" x="0" y={med0} width={W} height={med1 - med0} />
      <rect className="pl-road" x="0" y={med1} width={W} height={bot - med1} />
      <rect className="pl-road" x={jx - jw / 2} y={bot - 2} width={jw} height={H - bot + 2} />
      <rect className="pl-median-gap" x={jx - jw / 2 - 10} y={med0} width={jw + 20} height={med1 - med0} />

      {/* kerb lines with junction radii */}
      <line className="dwg-kerb-pl" x1="0" y1={top} x2={W} y2={top} />
      <path className="dwg-kerb-pl" d={`M0 ${bot} H${jx - jw / 2 - 26} Q${jx - jw / 2} ${bot} ${jx - jw / 2} ${bot + 26} V${H}`} />
      <path className="dwg-kerb-pl" d={`M${W} ${bot} H${jx + jw / 2 + 26} Q${jx + jw / 2} ${bot} ${jx + jw / 2} ${bot + 26} V${H}`} />
      <line className="dwg-kerb-pl" x1="0" y1={med0} x2={jx - jw / 2 - 10} y2={med0} />
      <line className="dwg-kerb-pl" x1={jx + jw / 2 + 10} y1={med0} x2={W} y2={med0} />
      <line className="dwg-kerb-pl" x1="0" y1={med1} x2={jx - jw / 2 - 10} y2={med1} />
      <line className="dwg-kerb-pl" x1={jx + jw / 2 + 10} y1={med1} x2={W} y2={med1} />

      {/* lane markings */}
      {dashes((top + med0) / 2, 12, W)}
      {dashes((med1 + bot) / 2, 12, W, [jx - jw / 2 - 20, jx + jw / 2 + 20])}
      <line className="dwg-giveway" x1={jx - jw / 2 + 4} y1={bot + 14} x2={jx + jw / 2 - 4} y2={bot + 14} />

      {/* direction arrows */}
      {[180, 520, 1040].map((x) => chev(x, (top + (top + med0) / 2) / 2 + 4, -1))}
      {[260, 600, 1100].map((x) => chev(x, (med0 + (top + med0) / 2) / 2 - 2, -1))}
      {[140, 470, 1000].map((x) => chev(x, (med1 + (med1 + bot) / 2) / 2 + 2, 1))}
      {[320, 640, 1080].map((x) => chev(x, (bot + (med1 + bot) / 2) / 2 - 2, 1))}

      {/* chainage */}
      <line className="dwg-thin" x1="40" y1="24" x2={W - 40} y2="24" />
      {[40, 320, 600, 880, 1160].map((x, i) => (
        <g key={`ch${x}`}>
          <line className="dwg-tick" x1={x} y1="18" x2={x} y2="30" />
          <text className="dwg-label" x={x} y="13" textAnchor="middle">{`CH 0+${String(i * 100).padStart(3, "0")}`}</text>
        </g>
      ))}

      {/* centreline of side road */}
      <line className="dwg-cl" x1={jx} y1={bot + 30} x2={jx} y2={H} />
    </svg>
  );
}
