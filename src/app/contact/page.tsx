import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { PageShell } from "@/components/site/PageShell";
import { SheetHeader } from "@/components/site/SheetHeader";
import { emailDisplay, emailHref, officeAddress, pages, phoneDisplay, phoneHref, sheets } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Contact", pages.contact.description);

export default function ContactPage() {
  const configured = Boolean(process.env.ENQUIRY_ENDPOINT);

  return (
    <PageShell>
      <div className="contact-split">
        <header className="contact-panel">
          <div className="contact-panel-inner">
            <SheetHeader sheet={sheets.contact} tone="dark" />
            <h1 className="display-xl" data-page-line>{pages.contact.headline}</h1>
            <p className="contact-lead" data-page-line>{pages.contact.lead}</p>
            <p className="contact-phone-label" data-page-line>Telephone</p>
            <p data-page-line style={{ marginTop: "0.75rem" }}>
              <a className="contact-phone" href={phoneHref}>{phoneDisplay}</a>
            </p>
            <p className="contact-phone-label" data-page-line>Email</p>
            <p data-page-line>
              <a className="contact-mail" href={emailHref}>{emailDisplay}</a>
            </p>
            <p className="contact-phone-label" data-page-line>Office</p>
            <p className="contact-address" data-page-line>{officeAddress}</p>
          </div>
        </header>
        <section className="contact-form-side" aria-label="Enquiry form">
          <div className="contact-form-side-inner">
            <div className="form-card">
              <EnquiryForm configured={configured} />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
