import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { ScopeDiagram } from "@/components/site/ScopeDiagram";
import { SheetHeader } from "@/components/site/SheetHeader";
import { copy, pages, phoneDisplay, phoneHref, sheets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("About", pages.about.description);

export default function AboutPage() {
  return (
    <PageShell>
      <header className="band-paper page-head">
        <div className="frame">
          <SheetHeader sheet={sheets.company} />
          <div className="page-head-grid about-head">
            <div>
              <p className="eyebrow" data-page-line>{pages.about.eyebrow}</p>
              <h1 className="display-xl" data-page-line>{pages.about.headline}</h1>
            </div>
            <p className="lead" data-page-line>{pages.about.lead}</p>
          </div>
        </div>
      </header>

      <section className="band band-stone" aria-labelledby="register-heading">
        <div className="frame register">
          <div data-rise>
            <h2 className="eyebrow register-title" id="register-heading">Registration particulars</h2>
            <dl className="facts-table">
              {copy.company.facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div>
                <dt>Telephone</dt>
                <dd><a href={phoneHref}>{phoneDisplay}</a></dd>
              </div>
            </dl>
          </div>
          <div data-rise>
            <p className="eyebrow register-title">Licence scope</p>
            <ScopeDiagram />
          </div>
        </div>
      </section>

      <section className="band band-asphalt" aria-labelledby="independence-heading">
        <div className="frame">
          <SheetHeader sheet="Independence" note="Standalone L.L.C" tone="dark" />
          <div className="independence-grid">
            <h2 className="independence-mark" id="independence-heading" data-rise>
              <strong>{copy.wordmark}</strong> is a standalone company.
            </h2>
            <div className="company-body" data-rise>
              {pages.about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{pages.about.independence}</p>
            </div>
          </div>
        </div>
      </section>

      <nav className="frame related" aria-label="Related">
        <span className="related-label">Continue</span>
        <Link className="arrow-link" href="/building-contracting">Building Contracting</Link>
        <Link className="arrow-link" href="/road-contracting">Road Contracting</Link>
        <Link className="button" href="/contact">{copy.primaryCta}</Link>
      </nav>
    </PageShell>
  );
}
