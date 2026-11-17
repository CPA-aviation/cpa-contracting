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
          <ul className="promoters">
            {pages.leadership.people.map((person) => (
              <li className="promoter" key={person.name} data-rise>
                <Image
                  src={person.image}
                  alt=""
                  width={640}
                  height={800}
                  className="promoter-photo"
                />
                <div className="promoter-copy">
                  <p className="promoter-role">{person.title}</p>
                  <h2 className="promoter-name">{person.name}</h2>
                </div>
              </li>
            ))}
          </ul>
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
