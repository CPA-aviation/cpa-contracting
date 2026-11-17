"use client";

import Link from "next/link";
import { copy, pages, phoneDisplay, phoneHref } from "@/content/site";
import { FadeIn } from "./FadeIn";
import "./vex-hero.css";

const VEX_HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

export function VexHero() {
  return (
    <section className="vex-hero" aria-labelledby="building-hero-title">
      <video
        className="vex-hero-video"
        src={VEX_HERO_VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="vex-hero-inner">
        <div className="vex-hero-content">
          <div className="vex-hero-grid">
            <div>
              <p className="vex-kicker">Licensed activity 01</p>
              <p id="building-hero-title" className="vex-heading">
                {pages.building.headline}
              </p>

              <FadeIn delay={200} duration={700}>
                <p className="vex-subheading">{pages.building.lead}</p>
              </FadeIn>

              <FadeIn delay={400} duration={700}>
                <div className="vex-buttons">
                  <Link href="/contact" className="vex-btn-primary">
                    {copy.primaryCta}
                  </Link>
                  <a href={phoneHref} className="liquid-glass vex-btn-secondary">
                    {phoneDisplay}
                  </a>
                </div>
              </FadeIn>
            </div>

            <div className="vex-tag-col">
              <FadeIn delay={500} duration={700}>
                <div className="liquid-glass vex-tag-card">
                  <p className="vex-tag-text">{pages.building.body[0]}</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
