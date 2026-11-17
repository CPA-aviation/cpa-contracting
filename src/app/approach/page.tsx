import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { SheetHeader } from "@/components/site/SheetHeader";
import { copy, pages, sheets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Approach", pages.approach.description);

export default function ApproachPage() {
  const total = pages.approach.steps.length;
  return (
    <PageShell>
      <header className="band-paper page-head">
        <div className="frame">
          <SheetHeader sheet={sheets.approach} />
          <a className="text-link skip-inline" href="#after-approach">Skip approach</a>
          <div className="page-head-grid">
            <div>
              <p className="eyebrow" data-page-line>{pages.approach.eyebrow}</p>
              <h1 className="display-xl" data-page-line>{pages.approach.headline}</h1>
            </div>
            <p className="lead" data-page-line>{pages.approach.lead}</p>
          </div>
        </div>
      </header>

      <section className="frame" aria-label="Enquiry steps">
        <ol className="chapters">
          {pages.approach.steps.map((step, index) => (
            <li className="chapter" key={step.title} data-rise>
              <p className="chapter-no" aria-hidden="true">{`0${index + 1}`}</p>
              <div>
                <p className="chapter-label">{`Step ${index + 1} of ${total}`}</p>
                <h2>{step.title}</h2>
              </div>
              <div className="chapter-body">
                <p>{step.body}</p>
                <div className="chapter-progress" aria-hidden="true">
                  <span style={{ width: `${((index + 1) / total) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="after-approach" className="band band-stone" aria-label="After the approach">
        <div className="frame">
          <p className="statement" data-rise>{pages.approach.closing}</p>
          <nav className="related" aria-label="Related" style={{ marginTop: "3rem" }}>
            <span className="related-label">Continue</span>
            <Link className="arrow-link" href="/building-contracting">Building Contracting</Link>
            <Link className="arrow-link" href="/road-contracting">Road Contracting</Link>
            <Link className="button" href="/contact">{copy.primaryCta}</Link>
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
