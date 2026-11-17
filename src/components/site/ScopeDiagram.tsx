import Link from "next/link";

/** Licence scope as a simple structure diagram: one company, two licensed activities. */
export function ScopeDiagram({ links = true }: { links?: boolean }) {
  return (
    <figure className="scope" aria-label="Licence scope: C P A CONTRACTING L.L.C holds two licensed activities, Building Contracting and Road Contracting.">
      <div className="scope-root">
        <span className="scope-kicker">Licence holder</span>
        <span className="scope-name">C P A CONTRACTING L.L.C</span>
        <span className="scope-kicker">Licence No. 1641004</span>
      </div>
      <div className="scope-stem" aria-hidden="true" />
      <div className="scope-branches">
        <div className="scope-node">
          <span className="scope-kicker">Activity 01</span>
          {links ? <Link href="/building-contracting">Building Contracting</Link> : <span>Building Contracting</span>}
        </div>
        <div className="scope-node scope-node-dark">
          <span className="scope-kicker">Activity 02</span>
          {links ? <Link href="/road-contracting">Road Contracting</Link> : <span>Road Contracting</span>}
        </div>
      </div>
      <figcaption className="scope-caption">Dubai commercial licence · two licensed activities</figcaption>
    </figure>
  );
}
