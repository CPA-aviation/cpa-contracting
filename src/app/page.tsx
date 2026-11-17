import { HomeSections } from "@/components/home/HomeSections";
import { HomeMotion } from "@/components/motion/HomeMotion";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader variant="overlay" />
      <HomeMotion>
        <main id="content">
          <HomeSections />
        </main>
      </HomeMotion>
      <SiteFooter />
    </>
  );
}
