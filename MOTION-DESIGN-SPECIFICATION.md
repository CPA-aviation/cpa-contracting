# MOTION DESIGN SPECIFICATION — C P A CONTRACTING L.L.C.
## Phase 02.1 · Load → Align → Settle

**Status:** Spec only. Do not implement in this phase.  
**Stack when Phase 03 starts:** `gsap`, `@gsap/react`, `ScrollTrigger`.  
**Client only:** GSAP runs in the browser. Do not call it during server render.

---

## 1. Motion language

| Step | Meaning | Properties |
|---|---|---|
| Load | Enters with weight | `autoAlpha` 0 to 1, `y` 24 to 0 (16 on small screens) |
| Align | Meets the axis | `scaleX` 0 to 1, `transformOrigin: "left center"` |
| Settle | Stops | `power2.out`. No idle loop. |

Use `autoAlpha` (opacity plus visibility), not a separate layout property. Do not animate `width`, `height`, `top`, or `left`.

---

## 2. Defaults

```ts
import gsap from "gsap";

gsap.defaults({
  ease: "power2.out",
  duration: 0.8,
});
```

| Token | Value |
|---|---|
| Fast | 0.35 |
| Base | 0.8 |
| Slow | 1.2 |
| Stagger tight | 0.06 |
| Stagger base | 0.12 |

---

## 3. React setup and cleanup

`useGSAP` creates a `gsap.context` and reverts it on unmount. That revert kills tweens and ScrollTriggers created in the callback, including a `matchMedia` created there. Selectors stay inside `scope`.

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MeasuredSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set("[data-reveal]", { autoAlpha: 1, y: 0, scaleX: 1 });
      return;
    }

    gsap.from("[data-reveal]", {
      autoAlpha: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.12,
    });
  }, { scope: root });

  return (
    <section ref={root}>
      <h1 data-reveal>C P A CONTRACTING</h1>
    </section>
  );
}
```

If `@gsap/react` is not used, revert the context by hand:

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function FallbackSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", { autoAlpha: 0, y: 24, duration: 0.8 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root}>
      <p data-reveal>Licensed for Building Contracting and Road Contracting.</p>
    </section>
  );
}
```

Event handlers created after setup must use `contextSafe`, and the listener must be removed in the returned cleanup. Do not leave a tween outside the context.

---

## 4. Reduced motion

Reduced motion is a real media-query branch, not a comment. Final states are set immediately. Pins and scrubs are not created.

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set("[data-reveal]", { autoAlpha: 1, y: 0, scaleX: 1 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.from("[data-wordmark]", { autoAlpha: 0, y: 24, duration: 1.2 })
      .from(
        "[data-rule]",
        { scaleX: 0, transformOrigin: "left center", duration: 0.6 },
        "-=0.4",
      )
      .from(
        "[data-line]",
        { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.12 },
        "-=0.2",
      );
  });
  }, { scope: root });

  return (
    <section ref={root}>
      <p data-wordmark>C P A CONTRACTING</p>
      <span data-rule />
      <p data-line>Licensed for Building Contracting and Road Contracting.</p>
    </section>
  );
}
```

`matchMedia` created inside `useGSAP` is reverted with the context. Do not also call `ScrollTrigger.killAll()` on unmount; that would kill triggers outside this component.

---

## 5. Approach: pin on large screens, stack on small screens

Pinned scroll is desktop-only, and only when the user has not asked for reduced motion. Below 1024px the chapters are normal headings and paragraphs in source order. They are not `display: none`, not `aria-hidden`, and not inside a scroll trap.

A skip link before the section targets the next section id. Keyboard focus moves through the chapters in document order on every viewport. The pin does not set `overflow: hidden` on `body`.

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set("[data-chapter]", { autoAlpha: 1, y: 0 });
  });

  mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((chapter) => {
      gsap.from(chapter, {
        autoAlpha: 0,
        y: 16,
        duration: 0.8,
        scrollTrigger: {
          trigger: chapter,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  });

  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.from("[data-chapter]", {
      autoAlpha: 0,
      y: 24,
      stagger: 0.12,
      scrollTrigger: {
        trigger: "[data-approach]",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    gsap.fromTo(
      "[data-spine]",
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-approach]",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: "[data-rail]",
          anticipatePin: 1,
        },
      },
    );
  });
  }, { scope: root });

  return (
    <section ref={root} id="approach" data-approach>
      <a href="#after-approach">Skip approach</a>
      <div data-rail>
        <span data-spine />
      </div>
      <article data-chapter>
        <h2>Discover</h2>
      </article>
    </section>
  );
}
```

The mobile branch has no `pin` and no `scrub`. If a chapter tween is missed, the CSS default is `autoAlpha: 1` so the text is readable before JavaScript.

---

## 6. Page notes

| Surface | Motion |
|---|---|
| Home hero | Timeline in section 4. No counters, no particles. |
| Activity panels | `from` with stagger 0.12. No 3D tilt. |
| Services | One rule `scaleX`, then the body. |
| Leadership | Names only. No photo motion. |
| Contact | No entrance timeline. The accepted message runs only after `accepted === true`. |
| Page change | Optional later. Not part of the initial build. |

Contact acceptance:

```tsx
type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "accepted" }
  | { status: "rejected" };

function applyResponse(response: Response, body: { accepted?: boolean }): FormState {
  if (response.ok && body.accepted === true) return { status: "accepted" };
  return { status: "rejected" };
}
```

Render “Your enquiry was accepted.” only for `status === "accepted"`. A network throw is `rejected`.

---

## 7. Plugins

Register `ScrollTrigger` and `useGSAP` once. Do not load ScrollSmoother, SplitText, or Three.js for the initial build.

---

## 8. Checks for Phase 03

- [x] The samples above typecheck with `strict` TypeScript (checked 17 Nov 2026 against `gsap` and `@gsap/react` types)  
- [ ] Reduced motion creates no ScrollTrigger  
- [ ] Viewports under 1024px create no pin  
- [ ] Unmount reverts the context  
- [ ] Chapters stay in the accessibility tree  
- [ ] The accepted sentence cannot appear on a failed response  
