import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { SheetHeader } from "@/components/site/SheetHeader";
import { copy, pages, sheets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Leadership", pages.leadership.description);

function initials(name: string) {
  const parts = name.split(" ");
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

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

      <section className="band band-stone" aria-label="Managers">
        <div className="frame">
          <ol className="leaders">
            {pages.leadership.people.map((person, index) => (
              <li className="leader-row" key={person.name} data-rise>
                <span className="leader-mono" aria-hidden="true">{initials(person.name)}</span>
                <h2 className="leader-name">{person.name}</h2>
                <div className="leader-meta">
                  <span className="nameplate-index">{`0${index + 1}`}</span>
                  <p className="nameplate-title">{person.title}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="leader-note">{pages.leadership.publicLine}</p>
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
