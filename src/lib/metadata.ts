import type { Metadata } from "next";
import { copy } from "@/content/site";

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} · ${copy.legalName}`,
      description,
      siteName: copy.legalName,
      locale: "en_AE",
      type: "website",
    },
  };
}
