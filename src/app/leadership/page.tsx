import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { SheetHeader } from "@/components/site/SheetHeader";
import { copy, pages, sheets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Leadership", pages.leadership.description);

export default function LeadershipPage() {
  return (
    <PageShell>
      <header className="band-paper page-head">
        <div className="frame">
          <SheetHeader sheet={sheets.leadership} />
          <div className="page-head-grid">
            <h1 className="display-xl" data-page-line>{pages.leadership.headline}</h1>
            <p className="lead" data-page-line>{pages.leadership.lead}</p>
          </div>
        </div>
      </header>

      <section className="band band-stone" aria-label="Promoters">
        <div className="frame">
          <ul className="promoters-classical">
            {pages.leadership.people.map((person) => (
              <li className="promoter-card" key={person.name} data-rise>
                <div className="promoter-avatar-gold-frame">
                  <div className="promoter-avatar-inner">
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={1200}
                      height={1200}
                      priority
                      className="promoter-avatar-img"
                      sizes="160px"
                    />
                  </div>
                </div>
                <div className="promoter-details">
                  <p className="promoter-eyebrow">{person.title}</p>
                  <h2 className="promoter-title">{person.name}</h2>
                  <div className="promoter-gold-rule" aria-hidden="true" />
                  <div className="promoter-bio-text">
                    {person.bio.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="leader-note-wrap" data-rise>
            <p className="leader-note">
              <span className="leader-note-text">{pages.leadership.publicLine}</span>
              <span className="leader-note-underline" aria-hidden="true" />
            </p>
          </div>
        </div>
      </section>

      <nav className="frame related" aria-label="Related">
        <span className="related-label">Continue</span>
        <Link className="arrow-link" href="/about">About</Link>
        <Link className="button" href="/contact">{copy.primaryCta}</Link>
      </nav>
    </PageShell>
  );
}
