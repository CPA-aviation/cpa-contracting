# PHASE 02.1 — FINAL REVIEW AND READINESS
## C P A CONTRACTING L.L.C

**Date:** 17 Nov 2026  
**Result:** Corrected and ready for Phase 03 when instructed. Frontend was not started.  
**Decision source:** The Phase 02.1 brief. This is not a signed partner certificate. See `PENDING-APPROVALS.md`.

---

## 1. What was locked

| Decision | Record |
|---|---|
| Creative direction | Measured Structure |
| Motion | Load → Align → Settle |
| Entity | Independent. No CPA Group or sister brand. |
| Language | English-first. Arabic deferred. |
| Services | Building Contracting and Road Contracting only |
| Projects | None at launch |
| Wordmark | C P A CONTRACTING. No custom symbol. |
| Telephone | +971 58 6524993 |
| Managers | Karun Arora Arora and Vansh Arora. Designation: Manager. |
| Registration year | 2026 may be stated as a fact |
| Email, domain, address | Hidden. Deferred — not required for the initial build. |
| Biographies and photographs | Deferred — not required for the initial build. |

---

## 2. Fixes applied

| # | Fix | Result |
|---|---|---|
| 1 | Public phone placeholders | Website copy, brand system, content model, and the register now publish +971 58 6524993 only. The other document numbers stay unpublished. |
| 2 | Company claims | Public copy is limited to the licence, the 2026 registration, the two Managers, and the telephone. |
| 3 | Operational promises | Removed claims about programme, site method, plant, stakeholders, and “we respond.” Approach stages are an enquiry sequence. |
| 4 | Font licensing | PP Neue Montreal, ABC Diatype, and Söhne are commercial and are not licensed here. Initial build is IBM Plex Sans and IBM Plex Mono (SIL OFL 1.1). |
| 5 | WCAG AA | Pairs measured. Button labels use paper on `signal-deep` (5.63:1). `signal` is not used for small text. Concrete is not text on paper. |
| 6 | GSAP samples | Rewritten as complete components. `tsc --strict` passed against current `gsap` and `@gsap/react` types. |
| 7 | Reduced motion and cleanup | `gsap.matchMedia` branches set the final state. `useGSAP` reverts the context on unmount. The non-hook path calls `ctx.revert()`. |
| 8 | Mobile pin alternative | Pin and scrub exist only at `min-width: 1024px` without reduced motion. Smaller screens stack chapters in source order, with a skip link and no scroll trap. |
| 9 | Form success | “Accepted” renders only when `response.ok` and `body.accepted === true`. Any other result says the enquiry was not accepted. |
| 10 | Hidden fields | Email, domain, and office address are absent from the public copy. |

---

## 3. Contrast failures that changed the system

| Pair | Ratio | Change |
|---|---|---|
| paper on signal | 3.66:1 | Primary button fill is `signal-deep` |
| concrete on paper | 2.64:1 | Concrete is not a text colour on paper |
| steel on asphalt | 3.39:1 | Small meta on dark uses concrete or dust |
| signal on paper | 3.66:1 | Small links use `signal-deep` (5.63:1) |

Body ink on paper is 15.38:1. Paper on asphalt is 16.17:1.

---

## 4. What is not approval

- No partner signature is on `PENDING-APPROVALS.md`.  
- T1–T8 were revised for accuracy. They were not approved line by line.  
- B2 locks the corrected palette for the build. The brief did not approve the hex values before the test.  
- B3 does not approve buying a commercial display face.  
- B6 does not ratify the earlier brand-promise slogan as a guarantee.  
- P2 (CMS) and P4 (where the form is delivered) are still open. The success rule does not depend on that choice.  
- Phase 01 still records the earlier unresolved questions. It is the discovery record. Phase 02.1 supersedes it for public contact.

---

## 5. Phase 03 readiness

**Ready, on instruction.** Do not treat this report as a start command.

Phase 03 can build:

- English pages in `WEBSITE-COPY.md`  
- Wordmark in IBM Plex Sans, meta in IBM Plex Mono  
- Tokens in `TYPOGRAPHY-AND-COLOURS.md`  
- Motion in `MOTION-DESIGN-SPECIFICATION.md`  
- Telephone +971 58 6524993  
- An enquiry form whose accepted state depends on the server  

Phase 03 must not build:

- A project portfolio  
- Arabic translations  
- A custom logo symbol  
- Published email, domain, map, or office address  
- Biographies or photographs  
- Group or sister-brand links  

**Open before production, not before a first build:** form destination (P4), privacy copy, and a real domain when one is approved.
