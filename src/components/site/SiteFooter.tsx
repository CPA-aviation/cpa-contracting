import Link from "next/link";
import { copy, nav, phoneDisplay, phoneHref } from "@/content/site";
import { TitleBlock } from "@/components/site/TitleBlock";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="frame footer-top">
        <div className="footer-brand">
          <Link className="footer-name" href="/">
            {copy.wordmark}
          </Link>
          <p className="footer-activities">Building Contracting<br />Road Contracting</p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-nav">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-call">
          <p className="footer-label">Telephone</p>
          <a className="footer-phone" href={phoneHref}>{phoneDisplay}</a>
        </div>
      </div>
      <div className="frame">
        <TitleBlock tone="dark" withPhone={false} />
      </div>
      <div className="frame footer-bottom">
        <p>{copy.footerLegal}</p>
        <p>{copy.independence}</p>
      </div>
    </footer>
  );
}
