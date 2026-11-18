"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable native browser history scroll restoration so old scroll positions are not restored
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force viewport to the top of the page on route load / navigation
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Clear GSAP ScrollTrigger cached metrics
    try {
      ScrollTrigger.clearScrollMemory();
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
