# PHASE 06.1 — Visual Design Review & Redesign

> **Revision 06.1b (17 Nov 2026): colour theme and hero.** Applied on request. See section 0. Sections 1–7 below describe the base redesign; the screenshots in `phase-06-1-screenshots/` show the **current** (06.1b) state.

## 0d. Revision 06.1d — palette reverted (current state)

The lime and orange full-section backgrounds from 06.1c were removed on request. The site uses the 06.1b palette again: **cream white base, deep green dark sections (Road, Contact, footer), orange for buttons and accents, lime for highlights.** The 06.1c boomerang video hero is kept unchanged. The screenshots show this state. Checks: build ✓ · tsc 0 · eslint 0 · axe 0 violations on all 7 pages at 1440px and 390px.

## 0c. Revision 06.1c — boomerang video hero, lime / orange / cream

**Hero (home)** is rebuilt to the supplied landing-page spec, adapted to CPA content:
- A full-screen hero, with a transparent fixed navbar over it (wordmark | links | "Request an enquiry" button). The navbar gets a cream background after you scroll past the hero; without one the links would be unreadable over the content below.
- **`BoomerangVideoBg`** (`src/components/home/BoomerangVideoBg.tsx`): the supplied CloudFront video at 1.15× scale from the top. It plays once while every frame is captured to offscreen canvases (`requestVideoFrameCallback`, falling back to `requestAnimationFrame`; maximum width 960px; duplicate frames skipped by `currentTime`). It then plays forward → backward → forward on a canvas at 30 fps. If the host rejects `crossOrigin="anonymous"`, it retries without it. Under reduced motion the video stays on its first frame. The video is shown in greyscale with a cream wash, so its blue tint doesn't clash with the palette.
- A serif headline, one sentence, a dark rounded button, and the "What do we do?" glass panel fixed to the bottom of the screen, with three rows (01 / Building Contracting, 02 / Road Contracting, 03 / Enquiry approach) that change background and nudge their arrow on hover (200 ms).

**Not copied from the spec, deliberately:**
- The Boomerang name, logo and copy: this is CPA's site, so the approved CPA copy is used.
- P22 Mackinac: a commercial font with no licence for this site. IBM Plex Serif is used instead.
- Inter from Google Fonts: Inter is self-hosted instead (same font, SIL OFL licence).
- Tailwind, Vite and lucide-react: the project stays on Next.js, and the Lucide arrow (ISC licence) is inlined.

**Colour split across the homepage (approx. by height):**
- Cream ≈ 42%: hero, Building, Company.
- Lime ≈ 32%: Road, Leadership, footer.
- Orange ≈ 26%: Approach, Contact.

Internal pages use the same surfaces: the Road page is lime with an orange cross-section band, the Contact panel is lime, and About's independence band is lime. Deep green is no longer used as a background. All text on lime and orange is green-black (#1B2318), at 5.7:1 or better.

**Video source and licence:** the video is supplied by the client and hot-linked from CloudFront. It appears to be an AI-generated architectural visualisation, and it is labelled on the page "Background: illustrative visualisation · Not a company project". **Confirm the licence, and preferably host the file yourself before launch:** a link into another account's storage can disappear. The file could not be downloaded from the build machine or your computer (both networks refused the host), so the screenshots use a still frame of that same video as a stand-in.

**Checks after 06.1c:** `next build` ✓ · `tsc` 0 errors · `eslint` 0 · axe WCAG 2.1 AA 0 violations on all 7 pages at 1440px and 390px · boomerang verified in Chrome (video → canvas switch at 960×447 capture, frames changing).

## 0. Revision 06.1b — cream white, orange and lime green

**Palette (tokens in `src/app/globals.css`)**
| Role | Token | Hex |
|---|---|---|
| Cream white (page) | `--color-paper` | #FBF7EF |
| Cream (bands) | `--color-stone` | #F3ECDD |
| Deep green (dark surfaces) | `--color-asphalt` / `--color-graphite` / `--color-asphalt-mist` | #13201A / #1A2A21 / #24362B |
| Green-black (text) | `--color-ink` | #1B2318 |
| Orange (primary action, accent) | `--color-signal` | #EE7A2E |
| Orange, text on cream | `--color-signal-deep` | #A7490C |
| Lime green (highlights on dark) | `--color-lime` | #B9DC45 |
| Lime, text on cream | `--color-lime-deep` | #4F6B0E |

Black and brown are gone; dark sections are now deep green. Buttons are orange pills with green-black text and turn lime on hover. Lime marks highlights: drawing leaders, the centreline, the first sequence step, Manager titles and the telephone underlines.

**Typography:** display headings now use **IBM Plex Serif** (light and italic, SIL OFL 1.1, self-hosted) for a more elegant voice. IBM Plex Sans is kept for body text and Plex Mono for annotations. The Plex Sans Condensed files from the previous version are no longer used.

**New hero:**
- A thin top strip with a lime marker: company · Dubai · Licence No.
- A large serif headline, "Building / *and road* / contracting.", with the middle line in orange italic. The text is unchanged.
- A lime rule, the support text, an orange button and the approach link.
- Two elegant rows linking to Building and Road Contracting.
- On the right, the drawing sits inside an original **setting-out ring** (a surveyor's bearing circle with 0–360° ticks and an orange north point). The ring turns very slowly and stops under reduced motion. A soft lime light sits behind it.
- The title block still overlaps the next section.

New file: `src/components/drawings/SettingOutRing.tsx`. Updated: `globals.css`, `layout.tsx`, `HomeSections.tsx`, `HomeMotion.tsx`. New fonts: `src/app/fonts/ibm-plex-serif-*.woff2` (5 files).

**Checks after 06.1b:** `next build` ✓ · `tsc` 0 errors · `eslint` 0 problems · axe WCAG 2.1 AA 0 violations on all 7 pages at 1440px and 390px · no horizontal overflow · mobile menu ✓. All text colour pairs were checked: the lowest is 5.0:1 (AA).


**Status:** Complete. Stopped for visual review. No further phase started.
**Date:** 17 Nov 2026
**Enquiry form:** Still disabled (no `ENQUIRY_ENDPOINT`). No external services connected. Not deployed.

---

## 1. Visual problems found (pre-redesign audit)

Audited all seven routes at 1440px and 390px before any change.

1. **One idea per screen.** Each section was a heading, one paragraph and a large empty field. The page had no density, so it read as unfinished rather than minimal.
2. **No real visual.** The only imagery was a six-line box drawing (home) and three horizontal lines (road), captioned "Not a photograph. Not a project." The drawings carried no meaning and the caption drew attention to the absence.
3. **Typography had one register.** Display, headings and body were all the same weight and width of IBM Plex Sans. There was no contrast between the wordmark, the headline and the support text.
4. **Abrupt transitions.** Paper sections hit a full-black road bar and a full-black footer with no intermediate tone, hairline or overlap.
5. **Repeated structure.** Number + heading + paragraph was used for services, approach steps, leadership and the "what you can send" lists, on the home page and again on every internal page.
6. **Internal pages were near-copies of home sections**, with the same intro block and the same link row.
7. **The header was unbalanced.** The small wordmark sat at the far left and the navigation was pushed against the phone at the far right, with no hierarchy between them.

## 2. New art direction — "Drawing set"

The site is composed like a set of technical drawings: the native language of building and road contracting. It is visually rich without using any photograph or any claim the licence does not support.

- **Sheets.** Every section opens with a drafting sheet reference ("Sheet 01 — Building Contracting … Scale: NTS"). These are labels, not project data.
- **Title blocks.** The registration facts (company, Licence No. 1641004, registered 2026, telephone) are set as a drawing title block. On the home page it straddles the hero and the next band, which bridges the dark-to-light transition.
- **Original technical drawings, generated in code:**
  - an isometric general arrangement: a generic structural frame beside a generic carriageway, one for each licensed activity (home hero)
  - the same frame with core callout (Building page)
  - a structural grid plan with A–E / 1–4 setting-out, columns, core, section marker and north point (Home and Building)
  - a pavement cross-section with standard layer names: wearing, binder, base, sub-base, subgrade (Home and Road)
  - a dual-carriageway plan with junction, lane markings and chainage (Road page)

  All are captioned "Illustrative drawing · Not to scale · Not a company project". None show dimensions, specifications, methods or locations.
- **Tonal system.** There are four surfaces: paper, stone, graphite and asphalt. Pages move through them in steps instead of jumping from paper to black. Copper is used only as the accent: the "C P A" letters, rules, callouts and the core.
- **Typography.** IBM Plex Sans Condensed (300/500) now carries the display sizes, for an architectural, confident voice. IBM Plex Sans is kept for body text and IBM Plex Mono for annotations. All three are the same OFL family as before.
- **Composition.** The layouts use asymmetric 5/7 and 7/5 splits, outlined index numerals, a scope diagram (licence holder → two activities), a horizontal enquiry sequence, and typographic nameplates with monograms instead of photographs.

### Distinct internal page layouts
| Page | Layout |
|---|---|
| About | Oversized legal name; stone register with a particulars table beside the licence-scope diagram; asphalt independence statement |
| Building Contracting | Stone header with a large isometric frame; editorial copy beside a boxed "What you can send" checklist; framed structural grid sheet |
| Road Contracting | Fully dark page: plan drawing under the title, graphite pavement-section band, dark checklist |
| Approach | Large sticky chapter numerals, three-column chapters with a sequence progress bar, stone closing band |
| Leadership | Full-width nameplate rows: monogram, very large name, designation. The second name is offset |
| Contact | Split screen: graphite panel with a large telephone number; stone panel with the (disabled) form card |

## 3. Screenshots

Folder: `phase-06-1-screenshots/` — full-page captures, 14 files.

| Page | Desktop 1440px | Mobile 390px |
|---|---|---|
| Home | `home-desktop-1440.png` | `home-mobile-390.png` |
| About | `about-desktop-1440.png` | `about-mobile-390.png` |
| Building Contracting | `building-desktop-1440.png` | `building-mobile-390.png` |
| Road Contracting | `road-desktop-1440.png` | `road-mobile-390.png` |
| Approach | `approach-desktop-1440.png` | `approach-mobile-390.png` |
| Leadership | `leadership-desktop-1440.png` | `leadership-mobile-390.png` |
| Contact | `contact-desktop-1440.png` | `contact-mobile-390.png` |

Captured from a production build (`next build` + `next start`) in headless Chrome with reduced motion. Horizontal overflow was 0px on all 14 captures.

## 4. Updated component / file list

**New**
- `src/components/drawings/geometry.ts` — isometric projection + bounds helpers
- `src/components/drawings/SiteAxonometric.tsx` — isometric frame (+ carriageway in the "site" variant)
- `src/components/drawings/StructuralPlan.tsx` — structural grid plan
- `src/components/drawings/RoadSection.tsx` — pavement cross-section
- `src/components/drawings/RoadPlan.tsx` — dual carriageway plan
- `src/components/site/SheetHeader.tsx` — sheet reference label
- `src/components/site/TitleBlock.tsx` — registration title block
- `src/components/site/ScopeDiagram.tsx` — licence scope diagram
- `src/components/site/Sequence.tsx` — four-step sequence diagram
- `src/components/site/Nameplates.tsx` — Managers' nameplates
- `src/app/fonts/` — self-hosted IBM Plex woff2 files + `OFL-LICENSE.txt`

**Rewritten**
- `src/app/globals.css`
- `src/app/layout.tsx` (Google-hosted fonts → `next/font/local`; same Plex family, condensed cut added)
- `src/components/home/HomeSections.tsx`
- `src/components/site/SiteHeader.tsx`, `SiteFooter.tsx`, `PageShell.tsx`
- `src/components/motion/HomeMotion.tsx`, `PageMotion.tsx` (GSAP pinning removed; transform-only scroll reveals; nothing animates under reduced motion)
- `src/app/about`, `building-contracting`, `road-contracting`, `approach`, `leadership`, `contact` → `page.tsx`

**Edited**
- `src/content/site.ts` — "License No." → "Licence No." (per the brief); drawing caption reworded; `sheets` labels added. No new claims.

**Unchanged:** `src/app/actions.ts`, `src/components/contact/EnquiryForm.tsx`, `src/components/motion/Settle.tsx`, `src/lib/metadata.ts`, `src/content/enquiry.ts`, routes, metadata/SEO.

## 5. Build, TypeScript, lint, accessibility

| Check | Result |
|---|---|
| `next build` (Next.js 16.4.6, Turbopack) | ✓ Compiled successfully; all 7 routes + `/_not-found` prerendered static |
| `tsc --noEmit` | 0 errors |
| `eslint .` | 0 errors, 0 warnings |
| axe-core (WCAG 2.0/2.1 A + AA), all 7 routes at 1440 and 390 | 0 violations |
| Mobile menu | Opens; Escape closes and returns focus; `aria-expanded` correct |
| Reduced motion | No GSAP or CSS motion runs under `prefers-reduced-motion: reduce` |

Small label text now uses `--color-steel-strong` (#5d5952) so it passes AA on the new stone surface (5.39:1).

> Run in a Linux build environment. On your Windows machine, run `npm run build` once to confirm locally. The `.next` folder in the project is from the previous build.

## 6. Assets and licensing

| Asset | Source | Licence |
|---|---|---|
| All drawings | Original, generated in code for this site | Owned by the project |
| IBM Plex Sans, Serif, Mono (Sans Condensed in 06.1, now unused) | `@fontsource` packages (IBM Corp.) | SIL Open Font License 1.1, copy in `src/app/fonts/OFL-LICENSE.txt` |
| Photography | **None used** | — |

No stock imagery, no AI-generated imagery, no third-party illustrations. If licensed architectural photography is wanted later, it needs a named source and licence before use. It should not show construction work implied to be the company's own.

## 7. Facts preserved

C P A CONTRACTING · Building Contracting · Road Contracting · Licence No. 1641004 · Registered 2026 · +971 58 6524993 · Karun Arora Arora — Manager · Vansh Arora — Manager.
No email, domain or office address. No projects, clients, certifications, awards, staff, equipment or history added.
