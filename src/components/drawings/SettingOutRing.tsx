/**
 * Original setting-out ring (a surveyor's bearing circle) used to frame the
 * hero drawing. Pure drafting ornament: bearings only, no site or project data.
 */

const C = 300;
const R = 280;

export function SettingOutRing() {
  const ticks = Array.from({ length: 120 }, (_, i) => i * 3);
  return (
    <svg className="ring" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <circle className="ring-outer" cx={C} cy={C} r={R} />
      <circle className="ring-inner" cx={C} cy={C} r={R - 28} />
      <circle className="ring-core" cx={C} cy={C} r={R - 120} />
      {ticks.map((deg) => {
        const major = deg % 30 === 0;
        const mid = deg % 15 === 0;
        const len = major ? 16 : mid ? 10 : 5;
        const a = ((deg - 90) * Math.PI) / 180;
        const x1 = C + Math.cos(a) * R;
        const y1 = C + Math.sin(a) * R;
        const x2 = C + Math.cos(a) * (R - len);
        const y2 = C + Math.sin(a) * (R - len);
        return <line key={deg} className={major ? "ring-tick ring-tick-major" : "ring-tick"} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {ticks
        .filter((deg) => deg % 30 === 0)
        .map((deg) => {
          const a = ((deg - 90) * Math.PI) / 180;
          const x = C + Math.cos(a) * (R - 32);
          const y = C + Math.sin(a) * (R - 32);
          return (
            <text key={`t${deg}`} className="ring-label" x={x} y={y + 3} textAnchor="middle">
              {String(deg).padStart(3, "0")}
            </text>
          );
        })}
      <line className="ring-axis" x1={C} y1={C - R - 12} x2={C} y2={C + R + 12} />
      <line className="ring-axis" x1={C - R - 12} y1={C} x2={C + R + 12} y2={C} />
      <polygon className="ring-north" points={`${C},${C - R - 22} ${C + 7},${C - R - 6} ${C - 7},${C - R - 6}`} />
    </svg>
  );
}
