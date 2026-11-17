import Link from "next/link";
import { VexHero } from "@/components/building/VexHero";
import { SiteAxonometric } from "@/components/drawings/SiteAxonometric";
import { StructuralPlan } from "@/components/drawings/StructuralPlan";
import { PageShell } from "@/components/site/PageShell";
import { SheetHeader } from "@/components/site/SheetHeader";
import { copy, pages, sheets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Building Contracting", pages.building.description);

export default function BuildingContractingPage() {
  return (
    <PageShell>
      <VexHero />
      <header className="building-head page-head">
        <div className="frame">
          <SheetHeader sheet={sheets.building} note="Licensed activity 01" />
          <div className="building-head-grid">
            <div className="building-head-copy">
              <p className="activity-index" aria-hidden="true" data-page-line>{pages.building.index}</p>
              <h1 className="display-xl" data-page-line>{pages.building.headline}</h1>
              <p className="lead" data-page-line>{pages.building.lead}</p>
            </div>
            <figure className="building-figure on-light" data-page-line>
              <SiteAxonometric variant="building" />
              <figcaption>{copy.drawingCaption}</figcaption>
            </figure>
          </div>
        </div>
      </header>

      <section className="band band-paper" aria-labelledby="building-send">
        <div className="frame brief-grid">
          <div className="brief-copy" data-rise>
            {pages.building.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="checklist" data-rise>
            <h2 id="building-send">{pages.building.sendTitle}</h2>
            <ol>
              {pages.building.send.map((item, index) => (
                <li key={item}>
                  <span>{`0${index + 1}`}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="band band-stone plan-band" aria-label="Structural grid drawing">
        <div className="frame">
          <figure className="drawing-sheet" data-draw>
            <div className="drawing-sheet-head">
              <span>Structural grid · plan</span>
              <span>Scale: NTS</span>
            </div>
            <StructuralPlan />
            <figcaption>{copy.drawingCaption}</figcaption>
          </figure>
        </div>
      </section>

      <nav className="frame related" aria-label="Related">
        <span className="related-label">Continue</span>
        <Link className="arrow-link" href="/road-contracting">Road Contracting</Link>
        <Link className="arrow-link" href="/approach">Approach</Link>
        <Link className="button" href="/contact">{copy.primaryCta}</Link>
      </nav>
    </PageShell>
  );
}
