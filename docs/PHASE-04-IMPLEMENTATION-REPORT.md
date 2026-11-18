# Phase 04 — Implementation report

Date: 17 November 2026  
Scope: Six English internal pages for C P A CONTRACTING L.L.C.  
Status: ready for review. Phase 05 has not been started.

Checked in the running dev server at `http://localhost:3000`.

## What was built

The homepage stays at `/`. Six routes were added on the existing Measured Structure system:

| Route | Title |
| --- | --- |
| `/about` | About · C P A CONTRACTING L.L.C |
| `/building-contracting` | Building Contracting · C P A CONTRACTING L.L.C |
| `/road-contracting` | Road Contracting · C P A CONTRACTING L.L.C |
| `/approach` | Approach · C P A CONTRACTING L.L.C |
| `/leadership` | Leadership · C P A CONTRACTING L.L.C |
| `/contact` | Contact · C P A CONTRACTING L.L.C |

Public facts match the Phase 02.1 lock. Copy is taken from `WEBSITE-COPY.md` through `src/content/site.ts`. No history, projects, clients, plant, workforce, certifications, testimonials, awards, biographies, or photographs were added.

Published contact is the telephone `+971 58 6524993` only. Email, domain, and office address are not published. There is no canonical URL and no `metadataBase`.

## Files created

- `src/app/about/page.tsx`
- `src/app/building-contracting/page.tsx`
- `src/app/road-contracting/page.tsx`
- `src/app/approach/page.tsx`
- `src/app/leadership/page.tsx`
- `src/app/contact/page.tsx`
- `src/components/site/PageShell.tsx`
- `src/components/motion/PageMotion.tsx`
- `src/components/contact/EnquiryForm.tsx`
- `src/lib/metadata.ts`
- `phase-04-screenshots/` (12 frames, listed below)
- this report

## Files modified

- `src/content/site.ts` — header and footer navigation now points at the seven routes. A `pages` object holds the internal-page copy.
- `src/app/layout.tsx` — Open Graph `siteName`, `locale`, `type`, title, and description. No URL.
- `src/components/site/SiteHeader.tsx` — `next/link`, `aria-current="page"` on the matching route, Escape closes the mobile menu.
- `src/components/site/SiteFooter.tsx` — wordmark and footer links use `next/link`.
- `src/components/home/HomeSections.tsx` — activity links go to the activity pages. “View our approach” goes to `/approach`. The enquiry form is the shared `EnquiryForm`. Homepage section order and copy are unchanged.
- `src/app/globals.css` — page layouts, active nav rule, `--color-asphalt-mist`.

`src/app/page.tsx`, `src/components/motion/HomeMotion.tsx`, the favicon, and the server action were left in place.

## Shared pieces

| Piece | Role |
| --- | --- |
| `PageShell` | Header, main, footer. Used by the six pages. The homepage does not use it. |
| `PageMotion` | Load shift of 16px on `[data-page-line]`. Opacity stays 1. Pins `[data-rail]` only at 1024px and above, and only when motion is allowed, and only on the approach page. |
| `EnquiryForm` | Same fields as the homepage form. Disabled while `ENQUIRY_ENDPOINT` is unset. Shows the accepted state only when `submitEnquiry` returns `accepted`. |
| `pageMetadata` | Title, description, and Open Graph title, description, site name, locale, and type. No canonical. |

The root title template remains `%s · C P A CONTRACTING L.L.C`.

## Page-specific layout

Each page uses the same type, colour, frame, header, and footer. The composition is different on each route.

**About.** One prose column and a single-column fact ledger: legal form, licence, commercial register, registration year, and telephone. Related links go to both activities and contact.

**Building Contracting.** Index `01`, headline, and a plan-like line drawing on paper. The caption is “Line drawing. Not a photograph. Not a project.” Below that, two paragraphs and a numbered “What you can send” list. The drawing is not a project.

**Road Contracting.** A full asphalt sheet, index `02`, a large headline, and three horizontal lines. Body copy and the telephone are paper on asphalt. The send list is the road version of the same four steps. Links on the sheet are paper.

**Approach.** Four enquiry chapters — Discover, Mobilise, Execute, Handover — with a spine that pins on a wide screen when motion is allowed. A “Skip approach” link jumps to the close. The close states there is no project portfolio. The page does not promise a programme, a site method, a response time, or an appointment.

**Leadership.** Two name bands. The second is indented from 800px. Each band is a name, the title Manager, and the line “Biographies and photographs are not published.” There are no photo frames.

**Contact.** A large telephone, the sentence that email, domain, and office address are not published, then the full-width disabled form. The status reads: “The enquiry form is not connected yet. It cannot confirm receipt. Call +971 58 6524993.”

## Navigation

Primary navigation, in order: Home, About, Building Contracting, Road Contracting, Approach, Leadership, Contact. The current route sets `aria-current="page"`.

The wordmark links to `/` from the header and the footer. Each internal page has related links to the pages a reader would open next. At 899px and below the links sit behind “Open menu” / “Close menu”. Escape closes that menu. A successful navigation mounts a new header, so the menu starts closed on the next page.

At 1440×900 the seven labels stay on one row. Header height measured 73px. No horizontal overflow on the pages checked.

## Motion

Load → Align → Settle is unchanged. Internal pages shift lines in by 16px and do not fade them out. The approach rail is the only new pin, and it is skipped under `prefers-reduced-motion: reduce` and below 1024px. There is no scroll hijacking and no ScrollSmoother.

Measured on `/approach` at 1440×900:

- Motion allowed: 1 pin spacer. Heading opacity 1.
- Reduced motion: 0 pin spacers. Heading opacity 1. Transform `none`.

## Test commands

Run from the project root on 17 November 2026, after the final header edit.

`npx next build` — exit 0, 49.3s. Next.js 16.4.6. Compiled in 5.9s. TypeScript finished in 8.0s. Nine static pages: `/`, `/_not-found`, `/about`, `/approach`, `/building-contracting`, `/contact`, `/leadership`, `/road-contracting`.

`npx tsc --noEmit` — exit 0.

`npx eslint src` — exit 0.

## Browser checks

Dev server: `http://localhost:3000`.

- All six routes opened. Each document title matches the table above. Homepage title remains `C P A CONTRACTING L.L.C`.
- Homepage heading is still “Building and road contracting.” Home is `aria-current="page"` on `/`. Contact is current on `/contact`. About is current on `/about`. Approach is current on `/approach`.
- Desktop frames are 1440×900. Mobile frames are 390×844.
- At 390px the menu opens, lists Home through Contact plus the telephone, and Escape returns `aria-expanded` to false.
- Keyboard Enter on the open-menu Contact link moved from `/about` to `/contact`. The next page’s menu was closed.
- Tab from the top of `/contact` landed on “Skip to content”. The focus rule is `outline: 2px solid var(--color-signal)` with `outline-offset: 2px` on `:focus-visible`.
- Every enquiry field and “Send enquiry” is disabled. None of them are in the tab order. The status does not claim the form was accepted.
- Page text on the routes checked does not contain an email address, a domain, or a street address.
- No entries were recorded in the page error hook on the routes checked.
- No horizontal overflow on `/` or `/contact` at the widths measured.

## Screenshots

Desktop, 1440×900:

- `phase-04-screenshots/about-desktop.png`
- `phase-04-screenshots/building-desktop.png`
- `phase-04-screenshots/road-desktop.png`
- `phase-04-screenshots/approach-desktop.png`
- `phase-04-screenshots/leadership-desktop.png`
- `phase-04-screenshots/contact-desktop.png`

Mobile, 390×844:

- `phase-04-screenshots/about-mobile.png`
- `phase-04-screenshots/building-mobile.png`
- `phase-04-screenshots/road-mobile.png`
- `phase-04-screenshots/approach-mobile.png`
- `phase-04-screenshots/leadership-mobile.png`
- `phase-04-screenshots/contact-mobile.png`

Frames were taken against `pnpm dev`, so the Next.js dev indicator can appear in the corner. It is not part of the page.

## Known limitations

- `ENQUIRY_ENDPOINT` is unset. The form cannot be submitted and cannot show a success state.
- No official domain is approved, so metadata has no canonical URL.
- Arabic is not built. `/services`, `/projects`, and `/legal/*` from the earlier content architecture are not built. Phase 04 uses the six routes in the brief.
- The content architecture document still names the older service paths. The live navigation does not.

## Blockers

None for review. Connecting the enquiry form still needs an approved backend destination. Publishing a canonical URL still needs an approved domain.
