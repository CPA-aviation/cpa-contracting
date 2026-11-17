# BRAND SYSTEM — C P A CONTRACTING L.L.C.
## Phase 02.1 · Measured Structure

**Status:** Locked for the initial build on the decisions in `PENDING-APPROVALS.md`. Not implemented.  
**Entity:** Independent Dubai LLC. No CPA Group or sister-brand association.  
**Motion:** Load → Align → Settle  
**Wordmark:** C P A CONTRACTING (typographic). A custom symbol is not required.  
**Companions:** `TYPOGRAPHY-AND-COLOURS.md` · `MOTION-DESIGN-SPECIFICATION.md` · `WEBSITE-COPY.md`

---

## 1. Brand essence

### Positioning (public)

C P A CONTRACTING L.L.C is an independent Dubai company licensed for Building Contracting and Road Contracting. It was registered in 2026. The site does not claim a project record, a workforce, or a delivery method beyond that licence.

### Tone

Precise, quiet, and limited to what is documented. “Clarity of scope” is tone. It is not a contractual guarantee.

### Personality

| Trait | Expression |
|---|---|
| Precise | Licence facts, aligned type, no invented numbers |
| Disciplined | Few sections |
| Material | Concrete, asphalt, steel, dust — as colour and photography rules, not as a capability claim |
| Confident | One wordmark, one telephone, no badge clutter |
| Honest | No portfolio at launch |

### Antithesis

Hard-hat stock, safety-orange kits, glassmorphism, purple gradients, invented metrics, group branding, a custom logo invented for launch.

---

## 2. Naming and lockup

| Element | Rule |
|---|---|
| Wordmark | **C P A CONTRACTING** — keep the spaces. Approved for the initial build. |
| Legal suffix | **L.L.C** — smaller; required in the footer and legal lines |
| Arabic | Legal name exists. Do not translate the site in the initial build. |
| “C P A” | Do not expand. No meaning has been approved. |
| Independence | Never imply another CPA company |

No symbol, monogram, or hard-hat mark in the initial build. Favicon may be the letters “CPA” set in IBM Plex Sans, not a drawn icon.

---

## 3. Colour and type

Tokens, contrast pairs, and the OFL font lock: **`TYPOGRAPHY-AND-COLOURS.md`**.

- Surfaces: ink, paper, dust, asphalt  
- Primary button: **paper text on `signal-deep`** (the lighter `signal` fails WCAG AA for normal text)  
- Type: **IBM Plex Sans** and **IBM Plex Mono**. Commercial display faces are not licensed.

---

## 4. Grid and spacing

**Base:** 4px → `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`

| Viewport | Columns | Gutter | Margin |
|---|---|---|---|
| ≥1440 | 12 | 24 | 64–96 |
| 1024–1439 | 12 | 20 | 48 |
| 768–1023 | 8 | 16 | 32 |
| <768 | 4 | 16 | 20 |

- One job per section  
- First viewport: wordmark, one headline, one sentence, one CTA group. No statistics.  
- Cards only for the enquiry form  
- Below 1024px, Approach chapters stack. They are not pinned. See the motion spec.

---

## 5. Graphic language

| Element | Use |
|---|---|
| 1px steel hairline | Baselines, form underlines |
| 2–3px ink or asphalt rule | Chapter starts |
| Alignment ticks | Sparse |
| Progress spine | Desktop Approach only, and only when motion is allowed |

**Forbidden:** floating badges, decorative icon rows, glass, stacked shadows, confetti, blueprint wallpaper.

---

## 6. Iconography

Stroke icons, 24×24, label first. None in the hero.

**Initial set:** menu, close, arrow, phone, check, error.  
Mail, map pin, download, and pictorial building/road icons wait until those targets exist. The published telephone may use the phone icon.

---

## 7. Image treatment

Until the company supplies photographs, use type on `paper` or `asphalt`. Do not use stock hard-hat images, generated logos, or unrelated skylines.

---

## 8. Buttons and interaction

**Primary:** 0–2px radius; fill `signal-deep`; label `paper`; hover `signal-deep` darkened 8%; focus ring 2px `signal` with 2px offset.  
**Secondary:** 1px `ink` rule on paper, 1px `paper` rule on asphalt.  
**Links:** `signal-deep` on paper (this pair passes AA). Do not use `signal` for small link text.  
**Forms:** underline fields. Error text uses `alert` on `paper`. Disabled controls are inactive and are not the only cue.

---

## 9. Responsive

1. Wordmark, headline, and telephone or CTA stay in the first mobile viewport.  
2. Type scales; hierarchy stays.  
3. Approach is a normal stacked document below 1024px.  
4. Touch targets are at least 44px.  
5. English, left to right. Use logical CSS properties so a later Arabic phase does not require a new grid.  
6. `prefers-reduced-motion`: no pin, no scrub. Content stays in document order.

---

## 10. Voice

Use `WEBSITE-COPY.md`. Do not write “world-class”, client names, years of experience, or a method statement.

**Published telephone:** +971 58 6524993  
**Hidden:** email, domain, office address.

---

## 11. Initial-build acceptance

- [x] Wordmark approved; symbol not required  
- [x] Independence and 2026 registration approved  
- [x] Palette contrast-corrected (B2)  
- [x] OFL fonts locked (B3)  
- [ ] Partner signature on the register — not obtained  
