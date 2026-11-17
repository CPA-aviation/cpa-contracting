import type { ReactNode } from "react";
import { PageMotion } from "@/components/motion/PageMotion";
import { Settle } from "@/components/motion/Settle";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="content">
        <Settle>
          <PageMotion>{children}</PageMotion>
        </Settle>
      </main>
      <SiteFooter />
    </>
  );
}
