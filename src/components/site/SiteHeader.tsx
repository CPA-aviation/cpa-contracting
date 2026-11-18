"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { copy, nav, phoneDisplay, phoneHref } from "@/content/site";

export function SiteHeader({ variant = "solid" }: { variant?: "solid" | "overlay" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const overlay = variant === "overlay";

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={[
        "site-header",
        overlay ? "site-header-overlay" : "",
        overlay && scrolled ? "is-scrolled" : "",
        open ? "is-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className="top-banner" role="region" aria-label="Announcement">
        <div className="frame top-banner-inner">
          <span className="top-banner-tag">COMING SOON</span>
          <span className="top-banner-text">
            C P A CONTRACTING L.L.C is launching shortly. Building and road contracting in Dubai.
          </span>
        </div>
      </aside>
      <div className="frame header-bar">
        <Link className="wordmark-link" href="/" aria-label={`${copy.wordmark}, home`} onClick={() => setOpen(false)}>
          <Image
            src="/images/cpa-logo.png"
            alt={`${copy.wordmark} — Restoring the past. Building the future`}
            width={321}
            height={176}
            priority
            className="header-logo-img"
          />
        </Link>
        <button
          ref={menuRef}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? copy.closeMenu : copy.openMenu}</span>
          <span className="menu-glyph" aria-hidden="true" />
        </button>
        <nav id="site-nav" aria-label="Primary">
          <ul className={open ? "nav-list is-open" : "nav-list"}>
            {nav.map((item) => {
              const isExternal = "external" in item && item.external;
              return (
                <li key={item.href}>
                  {isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link-external"
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                      <span className="nav-ext-arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {overlay ? (
          <Link className="bbtn header-cta" href="/contact" onClick={() => setOpen(false)}>
            {copy.primaryCta}
          </Link>
        ) : null}
        <a className="header-phone" href={phoneHref}>
          <span className="header-phone-label">Telephone</span>
          <span className="header-phone-number">{phoneDisplay}</span>
        </a>
      </div>
    </header>
  );
}
