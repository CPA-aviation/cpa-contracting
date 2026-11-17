"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

export function Settle({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    scope.querySelectorAll<HTMLElement>("[data-page-line]").forEach((line, index) => {
      line.style.animationDelay = `${index * 0.08}s`;
    });
  }, []);

  return <div ref={root}>{children}</div>;
}
