# CONTENT ARCHITECTURE — C P A CONTRACTING L.L.C.
## Phase 02 · Measured Structure · English-first

**Status:** Proposed for review — no frontend  
**Locale:** `en` launch; `ar` namespace reserved empty  
**Honesty rule:** No invented projects, clients, awards, certifications, or experience stats

---

## 1. Site map (EN-first)

```
/                         Home
/about                    Company overview
/services                 Services index
/services/building-contracting
/services/road-contracting
/approach                 Our Approach
/leadership               Leadership
/contact                  Contact
/legal/privacy            Privacy (stub until counsel)
/legal/terms              Terms (stub until counsel)
```

**Future (not built):** `/ar/...` or locale prefix; `/projects` route exists in IA but **launch homepage does not depend on project inventory**.

---

## 2. Content model (CMS-ready)

### `SiteSettings`

| Field | Type | Launch value |
|---|---|---|
| legalNameEn | string | C P A CONTRACTING L.L.C |
| legalNameAr | string | سي بيه ايه للمقاولات ش.ذ.م.م |
| licenseNo | string | 1641004 |
| registerNo | string | 2900890 |
| phonePublic | string | **+971 58 6524993** (approved 17 Nov 2026) |
| emailPublic | string \| null | **null** — deferred, do not publish |
| domain | string \| null | **null** — deferred, do not publish |
| addressPublic | boolean | **false** — deferred, do not publish |
| addressLines | string[] | Verified Al Baraha unit — publish only when flagged true |
| showProjectsNav | boolean | false until ≥1 approved project |

### `Project` (scalable; may be empty)

| Field | Type | Notes |
|---|---|---|
| slug | string | |
| title | string | |
| location | string | |
| activity | enum | `building` \| `road` \| `both` |
| role | string | e.g. contractor — requires approval |
| year | string | |
| status | enum | `draft` \| `published` \| `confidential` |
| summary | text | |
| gallery | asset[] | |
| cover | asset | |

**Launch:** zero published projects. Nav omits Projects or shows Approach-led story instead.

### `Leader`

| Field | Type | Launch |
|---|---|---|
| name | string | Karun Arora Arora / Vansh Arora |
| titlePublic | string \| null | **null** until approval |
| bioEn | text \| null | **null** |
| photo | asset \| null | **null** |
| order | number | TBD by management |

### `Page` / block types

`Hero`, `EditorialText`, `SplitActivities`, `ProcessChapters`, `LeadershipRoster`, `ContactForm`, `LegalMeta`, `HonestEmptyState`

---

## 3. Page architecture

### Home — activity & approach storytelling (no fake portfolio)

| Section | Purpose | Content source |
|---|---|---|
| Hero | Brand + one promise + CTA | `WEBSITE-COPY` Home |
| Licensed scope | Two activities as editorial panels | Building / Road |
| Approach preview | 4-stage spine teaser → `/approach` | Approach |
| Leadership cue | Names only + link | Leadership |
| Contact band | Enquire — no phone/email until confirmed | Contact |

**Omitted on launch:** project carousels, stat strips, client logos, award walls.

### About

Legal identity, independence, Dubai base, verified registration meta (license/register as document aesthetic). Address block only if `addressPublic`.

### Services index

Two large panels → detail routes. Not a three-equal-card grid.

### Service detail (Building / Road)

Definition → how we engage → CTA. Scope language stays within licensed activity names unless management expands bullets.

### Approach

Four chapters: Discover → Mobilise → Execute → Handover. Pinned motion later; copy must stay non-claiming of unproven methods.

### Leadership

Two-person roster. Titles/bios/photos pending — UI supports “Name · Partner” interim only if approved; else names + “Leadership details available on request.”

### Contact

Form fields: name, organisation, email, phone, interest (Building / Road / General), message. Public page shows +971 58 6524993 and the form. Email, domain, and address stay hidden. The accepted message renders only when the backend accepts the submission.

---

## 4. Projects strategy

1. Ship IA + `Project` schema now  
2. Keep `/projects` unpublished or behind `showProjectsNav`  
3. Home tells **licensed activities + approach** story  
4. When projects approved: add nav, listing, detail template with Mask/Align motion  
5. Confidential works: `status: confidential` never renders  

---

## 5. i18n architecture (Arabic later)

| Now | Later |
|---|---|
| All strings in `en.json` / MD copy deck | `ar.json` filled after translation approval |
| Routes without locale prefix | Add `/ar` prefix or domain strategy |
| `dir="ltr"` | Switch `dir="rtl"` + mirrored layout via logical props |
| No machine-translated Arabic on site | Human Arabic review required |

---

## 6. SEO / schema (when launching)

- Title pattern: `{Page} · C P A CONTRACTING L.L.C`  
- About: Organization JSON-LD only with **confirmed** NAP  
- Do not mark AggregateRating or made-up `foundingDate` narratives beyond license facts if used  

---

## 7. Acceptance

- [ ] Home without projects approved  
- [ ] Contact placeholders policy approved  
- [ ] Leadership pending state approved  
- [ ] Projects schema accepted empty  
