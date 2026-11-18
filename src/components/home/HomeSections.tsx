import Link from "next/link";
import { RoadSection } from "@/components/drawings/RoadSection";
import { BoomerangVideoBg } from "@/components/home/BoomerangVideoBg";
import { StructuralPlan } from "@/components/drawings/StructuralPlan";
import { ScopeDiagram } from "@/components/site/ScopeDiagram";
import { Sequence } from "@/components/site/Sequence";
import { SheetHeader } from "@/components/site/SheetHeader";
import { copy, sheets } from "@/content/site";

export function HomeSections() {
  return (
    <>
      <Hero />
      <Activities />
      <Road />
      <Company />
      <Approach />
    </>
  );
}

const heroRows = [
  { no: "01", label: "Building Contracting", href: "/building-contracting" },
  { no: "02", label: "Road Contracting", href: "/road-contracting" },
  { no: "03", label: "Enquiry approach", href: "/approach" },
] as const;

function ArrowRight() {
  /* Lucide "arrow-right" (ISC licence), inlined so no icon package is needed. */
  return (
    <svg className="brow-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="bhero" id="top" aria-labelledby="hero-heading">
      <BoomerangVideoBg />
      <div className="bhero-copy">
        <div className="hero-coming-soon-wrap" data-rise>
          <div className="hero-coming-soon-pill" role="status" aria-label="Website coming soon">
            <span className="hero-pill-dot" aria-hidden="true" />
            <span>Website Coming Soon</span>
          </div>
        </div>
        <h1 className="bhero-title" id="hero-heading">
          Building and road
          <br />
          contracting.
        </h1>
        <p className="bhero-sub">{copy.hero.support}</p>
      </div>
      <div className="bpanel-wrap">
        <div className="bpanel">
          <div className="bpanel-row1">
            <div className="bpanel-body">
              <p>{copy.services.support}</p>
              <p className="bpanel-note">Background: illustrative visualisation · Not a company project</p>
            </div>
          </div>
          <div className="bpanel-divider" aria-hidden="true" />
          <ul className="bpanel-rows">
            {heroRows.map((row) => (
              <li key={row.no}>
                <Link className="brow" href={row.href}>
                  <span>
                    <span className="brow-no">{row.no}</span>
                    <span className="brow-slash" aria-hidden="true" />
                    <span className="brow-label">{row.label}</span>
                  </span>
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Activities() {
  return (
    <section className="band band-stone" id="services" aria-labelledby="building-heading">
      <div className="frame">
        <SheetHeader sheet={sheets.building} />
        <article className="activity-building" id="building" aria-labelledby="building-heading">
          <div className="activity-text" data-rise>
            <p className="activity-index" aria-hidden="true">01</p>
            <h3 className="display-l" id="building-heading">
              {copy.services.building.title}
            </h3>
            <p>{copy.services.building.body}</p>
            <Link className="arrow-link" href="/building-contracting">
              Building Contracting
            </Link>
          </div>
          <figure className="drawing-sheet" data-draw>
            <div className="drawing-sheet-head">
              <span>Structural grid · plan</span>
              <span>A–E / 1–4</span>
            </div>
            <StructuralPlan />
            <figcaption>{copy.drawingCaption}</figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}

function Road() {
  return (
    <section className="band band-asphalt road-band" id="road" aria-labelledby="road-heading">
      <div className="frame">
        <SheetHeader sheet={sheets.road} tone="dark" />
        <div className="road-intro" data-rise>
          <p className="activity-index activity-index-light" aria-hidden="true">02</p>
          <h2 className="display-l" id="road-heading">
            {copy.services.road.title}
          </h2>
          <div className="road-intro-body">
            <p>{copy.services.road.body}</p>
            <Link className="arrow-link arrow-link-light" href="/road-contracting">
              Road Contracting
            </Link>
          </div>
        </div>
      </div>
      <figure className="frame road-figure crop-road" data-draw>
        <RoadSection />
        <figcaption>{copy.drawingCaption}</figcaption>
      </figure>
    </section>
  );
}

function Company() {
  return (
    <section className="band band-paper" id="company" aria-labelledby="company-heading">
      <div className="frame">
        <SheetHeader sheet={sheets.company} />
        <div className="company-grid">
          <div className="company-statement" data-rise>
            <h2 className="eyebrow" id="company-heading">
              {copy.company.headline}
            </h2>
            <p className="statement">{copy.company.lead}</p>
            <div className="company-body">
              {copy.company.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link className="arrow-link" href="/about">
              About the company
            </Link>
          </div>
          <div data-rise>
            <ScopeDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="band band-stone" id="approach" aria-labelledby="approach-heading">
      <div className="frame">
        <SheetHeader sheet={sheets.approach} />
        <div className="split-intro" data-rise>
          <div>
            <p className="eyebrow">{copy.approach.eyebrow}</p>
            <h2 className="display-m" id="approach-heading">
              {copy.approach.headline}
            </h2>
          </div>
          <p className="lead">{copy.approach.lead}</p>
        </div>
        <Sequence steps={copy.approach.steps} />
        <div className="band-foot">
          <p className="meta">{copy.approach.closing}</p>
          <Link className="arrow-link" href="/approach">
            {copy.approach.read}
          </Link>
        </div>
      </div>
    </section>
  );
}
