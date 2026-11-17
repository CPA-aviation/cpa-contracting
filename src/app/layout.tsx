import type { Metadata } from "next";
import localFont from "next/font/local";
import { copy } from "@/content/site";
import "./globals.css";

/* IBM Plex (SIL Open Font License 1.1), self-hosted from @fontsource. See src/app/fonts/OFL-LICENSE.txt. */
/* Inter (SIL OFL 1.1), self-hosted from @fontsource. See src/app/fonts/OFL-LICENSE-Inter.txt. */
const inter = localFont({
  src: [
    { path: "./fonts/inter-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const plexSerif = localFont({
  src: [
    { path: "./fonts/ibm-plex-serif-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/ibm-plex-serif-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/ibm-plex-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/ibm-plex-serif-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: copy.legalName,
    template: `%s · ${copy.legalName}`,
  },
  description: copy.hero.support,
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    siteName: copy.legalName,
    locale: "en_AE",
    type: "website",
    title: copy.legalName,
    description: copy.hero.support,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${plexSerif.variable} ${plexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip" href="#content">
          {copy.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
