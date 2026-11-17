import Link from "next/link";
import { RoadPlan } from "@/components/drawings/RoadPlan";
import { RoadSection } from "@/components/drawings/RoadSection";
import { PageShell } from "@/components/site/PageShell";
import { SheetHeader } from "@/components/site/SheetHeader";
import { copy, pages, phoneDisplay, phoneHref, sheets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Road Contracting", pages.road.description);

export default function RoadContractingPage() {
  return (
    <PageShell>
      <div className="road-page">
        <header className="road-hero">
          <div className="frame">
            <SheetHeader sheet={sheets.road} note="Licensed activity 02" tone="dark" />
            <div className="road-hero-grid">
              <p className="activity-index activity-index-light" aria-hidden="true" data-page-line>{pages.road.index}</p>
              <h1 className="display-xl" data-page-line>{pages.road.headline}</h1>
              <p className="lead" data-page-line>{pages.road.lead}</p>
            </div>
          </div>
          <figure className="frame road-plan-figure crop-road" data-page-line>
            <RoadPlan />
            <figcaption className="fig-caption-dark">Plan · {copy.drawingCaption}</figcaption>
          </figure>
        </header>

        <section className="band road-section-band" aria-labelledby="road-section-heading">
          <div className="frame">
            <div className="split-intro" data-rise>
              <div>
                <p className="eyebrow">Typical cross-section</p>
                <h2 className="display-m" id="road-section-heading">Pavement build-up</h2>
              </div>
              <p className="lead">A generic illustration of standard pavement layers. It is not a specification and not a company project.</p>
            </div>
            <figure className="crop-road" data-draw>
              <RoadSection />
              <figcaption className="fig-caption-dark">Section · {copy.drawingCaption}</figcaption>
            </figure>
          </div>
        </section>

        <section className="band" aria-labelledby="road-send">
          <div className="frame road-columns">
            <div className="brief-copy" data-rise>
              {pages.road.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a className="road-phone" href={phoneHref}>{phoneDisplay}</a>
            </div>
            <div className="checklist checklist-dark" data-rise>
              <h2 id="road-send">{pages.road.sendTitle}</h2>
              <ol>
                {pages.road.send.map((item, index) => (
                  <li key={item}>
                    <span>{`0${index + 1}`}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <nav className="frame related related-dark" aria-label="Related">
            <span className="related-label">Continue</span>
            <Link className="arrow-link arrow-link-light" href="/building-contracting">Building Contracting</Link>
            <Link className="arrow-link arrow-link-light" href="/approach">Approach</Link>
            <Link className="button" href="/contact">{copy.primaryCta}</Link>
          </nav>
        </section>
      </div>
    </PageShell>
  );
}
