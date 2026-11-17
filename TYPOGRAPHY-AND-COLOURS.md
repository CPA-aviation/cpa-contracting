# TYPOGRAPHY AND COLOURS — C P A CONTRACTING L.L.C.
## Phase 02.1 · Measured Structure

**Status:** Contrast-corrected and locked for the initial build. Hex values were not separately signed before this test.  
**Checked:** 17 Nov 2026, WCAG 2.2 contrast (relative luminance). AA normal text is 4.5:1. Large text and UI components are 3:1.

---

## 1. Colour palette

| Token | Hex | Role |
|---|---|---|
| `ink` | `#1C1A17` | Primary text on paper and dust |
| `ink-soft` | `#3F3B36` | Secondary text on paper and dust |
| `paper` | `#F3F1EC` | Page ground; text on asphalt |
| `paper-elevated` | `#FAF9F6` | Surface only. Not a text colour against paper. |
| `dust` | `#D4D0C8` | Secondary ground; secondary text on asphalt |
| `concrete` | `#9A958C` | Non-text, or secondary text **on asphalt only** |
| `steel` | `#6E6A63` | Hairlines; small meta text **on paper only** |
| `asphalt` | `#161513` | Dark sections |
| `asphalt-mist` | `#2A2825` | Dark hover surface |
| `signal` | `#B56A3A` | Focus ring and large colour only. Not small text. |
| `signal-deep` | `#8E4F2A` | Primary button fill; small links on paper |
| `permit` | `#4F6B58` | Rare success text on paper |
| `alert` | `#8F3D32` | Error text on paper |

### 1.1 Pairs that pass AA for normal text

| Text | Surface | Ratio | Use |
|---|---|---|---|
| ink | paper | 15.38:1 | Body |
| ink-soft | paper | 9.84:1 | Secondary |
| steel | paper | 4.76:1 | Meta, licence numbers |
| ink | dust | 11.29:1 | Body on dust |
| ink-soft | dust | 7.22:1 | Secondary on dust |
| paper | asphalt | 16.17:1 | Text on dark |
| dust | asphalt | 11.87:1 | Secondary on dark |
| concrete | asphalt | 6.13:1 | Meta on dark |
| paper | asphalt-mist | 13.02:1 | Text on dark hover |
| paper | signal-deep | 5.63:1 | Button label |
| signal-deep | paper | 5.63:1 | Links, small copper text |
| permit | paper | 5.20:1 | Success text |
| alert | paper | 6.46:1 | Error text |

### 1.2 Pairs that do not pass AA for normal text

| Text | Surface | Ratio | Rule |
|---|---|---|---|
| paper | signal | 3.66:1 | Do not put button labels on `signal`. Use `signal-deep`. |
| ink | signal | 4.21:1 | Do not put ink text on `signal`. |
| signal | paper | 3.66:1 | Large text or non-text only. |
| signal | asphalt | 4.42:1 | Not small text. Focus ring passes 3:1. |
| concrete | paper | 2.64:1 | Do not use concrete for text on paper. |
| steel | asphalt | 3.39:1 | Hairline only on asphalt, not small text. |
| steel | dust | 3.50:1 | Not small text on dust. Use ink-soft. |
| ink | signal-deep | 2.73:1 | Button label stays paper, not ink. |

`paper` on `paper-elevated` is 1.07:1. That pair is a surface step, not text.

### 1.3 CSS

```css
:root {
  --color-ink: #1c1a17;
  --color-ink-soft: #3f3b36;
  --color-paper: #f3f1ec;
  --color-paper-elevated: #faf9f6;
  --color-dust: #d4d0c8;
  --color-concrete: #9a958c;
  --color-steel: #6e6a63;
  --color-asphalt: #161513;
  --color-asphalt-mist: #2a2825;
  --color-signal: #b56a3a;
  --color-signal-deep: #8e4f2a;
  --color-permit: #4f6b58;
  --color-alert: #8f3d32;
}
```

---

## 2. Typography licensing

### 2.1 Not licensed — do not ship

| Face | Licence fact | Status |
|---|---|---|
| PP Neue Montreal | Commercial web licence from Pangram Pangram. Not in this project. | Do not ship |
| ABC Diatype | Commercial web licence from Dinamo. Not in this project. | Do not ship |
| Söhne | Commercial web licence from Klim Type Foundry. Not in this project. | Do not ship |

A trial file is not a production licence.

### 2.2 Locked for the initial build

| Role | Face | Licence |
|---|---|---|
| Display and body | **IBM Plex Sans** | SIL Open Font License 1.1. Self-host the woff2 files. |
| Meta and licence numbers | **IBM Plex Mono** | SIL Open Font License 1.1. |
| Arabic (later) | **IBM Plex Sans Arabic** | SIL OFL 1.1. Not loaded in the English-first build. |

These are not Inter, Roboto, Open Sans, Montserrat, or Poppins.

### 2.3 Other OFL alternatives (not selected)

If Plex is rejected later, **Instrument Sans** or **Schibsted Grotesk** (both SIL OFL) can replace the sans without a purchase. They do not include a matching Arabic family. Do not switch during Phase 03 unless the register changes.

---

## 3. Hierarchy

IBM Plex Sans has 400, 500, and 600. Use those weights only.

| Style | Desktop | Mobile | Weight | Line | Tracking | Use |
|---|---|---|---|---|---|---|
| Display XL | 72–96px | 40–48px | 500 | 1.05 | -0.02em | Wordmark |
| Display L | 48–64px | 32–36px | 500 | 1.05 | -0.015em | Page title |
| Display M | 32–40px | 28px | 500 | 1.15 | -0.01em | Section |
| Title S | 24px | 22px | 500 | 1.25 | 0 | Subhead |
| Body L | 20px | 18px | 400 | 1.5 | 0 | Lead |
| Body | 17px | 16px | 400 | 1.6 | 0 | Default |
| Label | 14px | 14px | 500 | 1.3 | 0.04em | Nav, buttons |
| Meta | 13px | 13px | 400 | 1.4 | 0.04em | IBM Plex Mono |

---

## 4. Approved pairings

- Wordmark: ink on paper, or paper on asphalt  
- Lead: ink-soft on paper  
- Licence meta: IBM Plex Mono in steel on paper, or concrete on asphalt  
- Primary button: paper on signal-deep  
- Link: signal-deep on paper  
- Focus ring: signal, 2px, 2px offset (3.66:1 against paper; 4.42:1 against asphalt)  
- Error: alert on paper  
- Accepted form text: permit on paper, and only after backend acceptance  

---

## 5. Arabic

Do not load an Arabic font in the initial build. Keep copy keys under `en`. Reserve `ar` empty.
