# Phase 05 — Quality audit

Date: 17 November 2026  
Scope: SEO, performance, accessibility, responsive layout, and factual integrity of the existing site.  
Status: ready for review. Phase 06 has not been started.

This was an audit and a set of corrections. The page layouts, copy, and motion language were kept.

## Methodology

Sources read before any change: `PHASE-01-MASTER-BLUEPRINT.md`, the Phase 02 documents, `PHASE-02-FINAL-REVIEW.md`, `PENDING-APPROVALS.md`, `PHASE-03-IMPLEMENTATION-REPORT.md`, `PHASE-04-IMPLEMENTATION-REPORT.md`, and the current `src` tree.

Live checks used the dev server at `http://localhost:3000` in headless Chrome:

- All seven routes, direct load.
- Viewport widths 360, 390, 768, 1024, 1440, and 1920, then a closer pass from 1040 to 1360 for the header.
- Document title, meta description, robots, canonical, and Open Graph tags from the rendered HTML.
- Heading list, image list, link list, form state, horizontal overflow, header row count.
- Console exceptions on each route.
- `/approach` at 1440×900 with `prefers-reduced-motion: reduce` and with no preference.

Production numbers come from `npx next build` (Next.js 16.4.6, Turbopack) and the emitted client-reference manifests. Contrast ratios use the WCAG relative-luminance formula against the locked palette.

No production domain was invented. No canonical URL, sitemap, or structured data was added.

## SEO

| Route | Title | Meta description |
| --- | --- | --- |
| `/` | C P A CONTRACTING L.L.C | C P A CONTRACTING L.L.C is an independent Dubai company, licensed for Building Contracting and Road Contracting. It was registered in 2026. |
| `/about` | About · C P A CONTRACTING L.L.C | An independent limited liability company in Dubai, licensed for Building Contracting and Road Contracting, and registered in 2026. |
| `/building-contracting` | Building Contracting · C P A CONTRACTING L.L.C | Building Contracting is a licensed activity of C P A CONTRACTING L.L.C in Dubai. This page does not add projects, methods, plant, or staff numbers. |
| `/road-contracting` | Road Contracting · C P A CONTRACTING L.L.C | Road Contracting is a licensed activity of C P A CONTRACTING L.L.C in Dubai. This page does not add projects, clients, or operational claims. |
| `/approach` | Approach · C P A CONTRACTING L.L.C | Four steps for an enquiry. These steps are not a construction method and they are not a promise of appointment. |
| `/leadership` | Leadership · C P A CONTRACTING L.L.C | Karun Arora Arora and Vansh Arora are the Managers of C P A CONTRACTING L.L.C. Biographies and photographs are not published. |
| `/contact` | Contact · C P A CONTRACTING L.L.C | Call +971 58 6524993. The enquiry form confirms receipt only after the server accepts it. |

Each title and description is unique. `robots` is `index, follow` on every route. There is no `noindex`. There is no canonical link and no `og:url`, because no domain is approved. Open Graph title, description, site name, type (`website`), and locale are present. There is no Open Graph image, because no image is approved.

Internal links collected from the seven pages are only in-site routes, in-page hashes that exist (`#content`, `#top`, `#contact`, `#leadership`, `#after-approach`), and `tel:+971586524993`. No external web links. Drawings are inline SVG with `aria-hidden="true"` and a visible caption. There are no `<img>` elements.

Heading structure is one `h1` per page. Internal pages step from `h1` to `h2`. The homepage approach list was the exception, fixed below.

## Issues found and fixed

### 1. Header wraps between 900px and 1080px — medium

The horizontal navigation started at 900px. At 1024×900 and at 1080×900 the seven labels wrapped onto a second row. Header height was 93px. At 1120px it fitted on one row at 73px. No horizontal page overflow.

**Fix:** the menu button stays until 1120px. From 1120px up, the row is horizontal.

**After:** at 1024×900 the header is 73px, one row, and the menu button is shown. At 1120×900 the menu button is hidden and the row is still one line. Checked on `/`, `/about`, `/contact`, `/approach`, and `/road-contracting`.

### 2. Homepage approach headings were flat — medium

“Our Approach” and Discover, Mobilise, Execute, and Handover were all `h3`, while the steps are visually subordinate.

**Fix:** the four steps are `h4`. The size stays 1.5rem. Rendered homepage HTML now has four `h4` elements and no `h3` named Discover.

### 3. Form hints and errors were not tied to their fields — medium

Labels were connected with `htmlFor`. The email hint and the field error text were not referenced with `aria-describedby`. The interest field had no error text of its own.

**Fix:** each hint and error has an id and `aria-describedby`. The status paragraph is `#enquiry-status`, and the form and the submit button point at it. Confirmed in the rendered `/contact` HTML. The form is still disabled while `ENQUIRY_ENDPOINT` is unset, and the status still says it cannot confirm receipt.

### 4. Escape could leave focus inside the closed menu — medium

Closing the mobile menu with Escape hid the navigation while focus could remain on a link inside it.

**Fix:** Escape closes the menu and moves focus back to the menu button.

### 5. Focus could sit under the sticky header — medium

WCAG 2.2 AA 2.4.11. Sections used `scroll-margin-top`. Other focused controls did not, so the 73px sticky header could cover them.

**Fix:** `scroll-padding-top` on `html` is the header height plus 1rem. The old section `scroll-margin-top` was removed so in-page links are not offset twice.

### 6. Road list rules failed non-text contrast — low

`asphalt-mist` on `asphalt` is 1.24:1. The locked palette allows `steel` as a hairline on asphalt, at 3.39:1.

**Fix:** the road “What you can send” rules use `steel`.

### 7. Open Graph locale was `en` — low

`og:locale` expects a language and territory, such as `en_US`. The value `en` is not that form.

**Fix:** `en_AE` in the root metadata and in `pageMetadata`. Rendered HTML on all seven routes now has `og:locale` `en_AE`. This is not a canonical URL and not a domain.

### 8. GSAP loaded on pages that only settle 16px — medium

Before this pass, `PageShell` imported `PageMotion` on every internal page. The production GSAP chunk was `2ahr4r3acb1oc.js`, 128,458 bytes raw, and it was part of that shared shell.

**Fix:** the 16px settle is a CSS animation. A small client helper sets an 0.08s stagger. `PageMotion` is imported only by `/approach`, for the rail pin and the short chapter move below 1024px. The homepage keeps `HomeMotion`.

**After**, from the production client-reference manifests:

| Route | References the GSAP chunk |
| --- | --- |
| `/` | Yes |
| `/approach` | Yes |
| `/about`, `/building-contracting`, `/road-contracting`, `/leadership`, `/contact` | No |

The current GSAP chunk is `2_r3gkswvpmzi.js`: 114,835 bytes raw, 44,413 bytes gzip (level 9). Those five routes no longer download it. On `/approach` at 1440×900 after the change: motion allowed leaves 1 pin and the third line’s delay is `0.16s`; reduced motion leaves 0 pins, heading opacity 1, and no delay.

## Checks that passed without a change

- Text contrast for the locked pairs in use: ink, ink-soft, and steel on paper; paper, dust, and concrete on asphalt; paper and `signal-deep` both ways at 5.63:1; alert and permit on paper. The focus ring, `signal` on paper, is 3.66:1, which clears the 3:1 non-text bar.
- One `main`, a banner header, a footer, and named navigation on every page. Skip link targets `#content`.
- Menu button and primary links are at least 2.75rem tall. Below 1120px the closed menu is `display: none`, so those links are not in the tab order until the button opens them.
- Reduced motion turns off smooth scrolling, the settle animation, and the pin.
- No horizontal overflow at 360, 390, 768, 1024, 1440, or 1920 on the seven routes in the first pass. After the header fix, 360 and 1024 were checked again on the pages most likely to overflow. None overflowed.
- Headless Chrome recorded no console exceptions on the seven routes in that first pass.
- Direct requests for all seven routes return the right document. Refresh is a normal static document load.
- Public facts on the pages remain the wordmark `C P A CONTRACTING`, telephone `+971 58 6524993`, Karun Arora Arora — Manager, Vansh Arora — Manager, License No. 1641004, and registration year 2026. The rendered homepage does not contain the unpublished email, the other telephone numbers, or a street address.
- The enquiry control stays disabled. Acceptance still requires `response.ok` and `accepted: true` in `src/app/actions.ts`.
- Dependencies in `package.json` are Next, React, GSAP, and `@gsap/react`, plus the TypeScript and ESLint tooling. Nothing unused was removed, because nothing unused is declared.
- Fonts are IBM Plex Sans and IBM Plex Mono through `next/font` (`display: swap`), self-hosted. On the homepage in headless Chrome the browser requested three woff2 files, 40,240, 10,016, and 10,056 bytes encoded. There are no raster images and no extra image requests.
- The homepage hero, sections, and `HomeMotion` sequence were not redesigned.

## Files changed

- `src/app/globals.css` — scroll padding, header breakpoint, step heading size, road rule colour, settle animation
- `src/app/layout.tsx` — Open Graph locale
- `src/lib/metadata.ts` — Open Graph locale
- `src/app/approach/page.tsx` — GSAP wrapper only on this route
- `src/components/site/PageShell.tsx` — settle helper instead of GSAP on every page
- `src/components/motion/PageMotion.tsx` — pin and chapter move only
- `src/components/motion/Settle.tsx` — stagger delays, new
- `src/components/motion/HomeMotion.tsx` — unchanged
- `src/components/home/HomeSections.tsx` — step headings `h4`; decorative rule hidden from assistive tech
- `src/components/site/SiteHeader.tsx` — Escape returns focus to the menu button
- `src/components/contact/EnquiryForm.tsx` — described-by links for the hint, errors, and status

## Commands

Run from the project root on 17 November 2026, after the corrections.

`npx next build` — exit 0. Next.js 16.4.6. Compiled in 3.4s. TypeScript finished in 6.8s. Nine static pages: `/`, `/_not-found`, `/about`, `/approach`, `/building-contracting`, `/contact`, `/leadership`, `/road-contracting`.

`npx tsc --noEmit` — exit 0.

`npx eslint src` — exit 0.

## Remaining production blockers

- `ENQUIRY_ENDPOINT` is unset. The form cannot be submitted and cannot show a success state.
- No official domain is approved, so there is still no canonical URL, no `og:url`, and no sitemap.
- No approved image, so there is no Open Graph image.
- Arabic, a portfolio, biographies, and the office address stay unpublished.

Phase 06 has not been started.
