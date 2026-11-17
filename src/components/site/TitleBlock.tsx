import { phoneDisplay, phoneHref } from "@/content/site";

/** Registration facts set out like a drawing title block. */
export function TitleBlock({ tone = "light", withPhone = true }: { tone?: "light" | "dark"; withPhone?: boolean }) {
  return (
    <dl className={`title-block title-block-${tone}`}>
      <div>
        <dt>Company</dt>
        <dd>C P A CONTRACTING L.L.C</dd>
      </div>
      <div>
        <dt>Licence No.</dt>
        <dd>1641004</dd>
      </div>
      <div>
        <dt>Registered</dt>
        <dd>2026 · Dubai</dd>
      </div>
      {withPhone ? (
        <div>
          <dt>Telephone</dt>
          <dd>
            <a href={phoneHref}>{phoneDisplay}</a>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
