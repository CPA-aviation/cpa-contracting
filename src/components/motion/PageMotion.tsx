"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll reveal for blocks marked [data-rise]. Transform only, so content is
 * never hidden if scripts fail. Disabled entirely under prefers-reduced-motion.
 */
export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((block) => {
          gsap.from(block, {
            y: 28,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: block, start: "top 88%", toggleActions: "play none none none" },
          });
        });
        gsap.utils.toArray<SVGElement>("[data-draw] .dwg").forEach((svg) => {
          gsap.from(svg, {
            scale: 0.985,
            transformOrigin: "50% 60%",
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: svg, start: "top 90%", toggleActions: "play none none none" },
          });
        });
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
