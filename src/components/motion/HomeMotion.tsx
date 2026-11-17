"use client";

import { type ReactNode } from "react";
import { PageMotion } from "./PageMotion";

/**
 * Home motion. The hero's only motion is the boomerang video (see BoomerangVideoBg)
 * plus 200 ms colour transitions; sections below the fold keep the shared scroll reveal.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  return <PageMotion>{children}</PageMotion>;
}
