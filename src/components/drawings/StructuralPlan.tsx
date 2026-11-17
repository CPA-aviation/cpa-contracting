/**
 * Original plan-view drawing of a generic structural grid.
 * Illustrative only: no dimensions, no project, no method.
 */

const LETTERS = ["A", "B", "C", "D", "E"];
const OX = 92;
const OY = 84;
const SX = 118;
const SY = 104;
const NX = 4;
const NY = 3;

export function StructuralPlan() {
  const W = OX + SX * NX;
  const H = OY + SY * NY;
  const xs = Array.from({ length: NX + 1 }, (_, i) => OX + i * SX);
  const ys = Array.from({ length: NY + 1 }, (_, j) => OY + j * SY);
  const core = { x: OX + SX + 22, y: OY + SY + 18, w: 74, h: 68 };

  return (
    <svg className="dwg dwg-plan" viewBox={`0 0 ${W + 70} ${H + 92}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="plan-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" className="dwg-hatch-line" />
        </pattern>
      </defs>

      {/* slab edge */}
      <rect className="dwg-slab-plan" x={OX - 22} y={OY - 22} width={SX * NX + 44} height={SY * NY + 44} />

      {/* grid lines + bubbles */}
      {xs.map((x, i) => (
        <g key={`gx${x}`}>
          <line className="dwg-grid" x1={x} y1={OY - 52} x2={x} y2={H + 30} />
          <circle className="dwg-bubble-c" cx={x} cy={OY - 62} r={11} />
          <text className="dwg-bubble-t" x={x} y={OY - 58} textAnchor="middle">{LETTERS[i]}</text>
        </g>
      ))}
      {ys.map((y, j) => (
        <g key={`gy${y}`}>
          <line className="dwg-grid" x1={OX - 52} y1={y} x2={W + 30} y2={y} />
          <circle className="dwg-bubble-c" cx={OX - 62} cy={y} r={11} />
          <text className="dwg-bubble-t" x={OX - 62} y={y + 4} textAnchor="middle">{j + 1}</text>
        </g>
      ))}

      {/* core with stair */}
      <rect x={core.x} y={core.y} width={core.w} height={core.h} fill="url(#plan-hatch)" className="dwg-core-plan" />
      {Array.from({ length: 7 }, (_, s) => (
        <line key={`st${s}`} className="dwg-thin" x1={core.x + 10 + s * 8} y1={core.y + 10} x2={core.x + 10 + s * 8} y2={core.y + core.h - 10} />
      ))}

      {/* columns */}
      {xs.flatMap((x) =>
        ys.map((y) => <rect key={`c${x}-${y}`} className="dwg-column" x={x - 6} y={y - 6} width={12} height={12} />),
      )}

      {/* dimension chain (ticks only, unscaled) */}
      <line className="dwg-thin" x1={OX} y1={H + 52} x2={W} y2={H + 52} />
      {xs.map((x) => (
        <line key={`d${x}`} className="dwg-tick" x1={x - 5} y1={H + 57} x2={x + 5} y2={H + 47} />
      ))}

      {/* section marker A–A */}
      <line className="dwg-section" x1={OX - 40} y1={OY + SY * 1.5} x2={W + 40} y2={OY + SY * 1.5} />
      <polygon className="dwg-accent-fill" points={`${OX - 40},${OY + SY * 1.5 - 12} ${OX - 28},${OY + SY * 1.5 - 12} ${OX - 40},${OY + SY * 1.5 - 24}`} />
      <polygon className="dwg-accent-fill" points={`${W + 40},${OY + SY * 1.5 - 12} ${W + 28},${OY + SY * 1.5 - 12} ${W + 40},${OY + SY * 1.5 - 24}`} />

      {/* north point */}
      <g transform={`translate(${W + 46} ${H + 56})`}>
        <circle className="dwg-thin" r={14} fill="none" />
        <polygon className="dwg-accent-fill" points="0,-14 6,6 0,2 -6,6" />
        <text className="dwg-bubble-t" y={-20} textAnchor="middle">N</text>
      </g>
    </svg>
  );
}
