import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Per-page metadata with matching Open Graph fields.
 * Metadata is merged shallowly, so each page must restate the full `openGraph` object.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "zh_HK",
      siteName: site.name,
      title: `${title}｜${site.name}`,
      description,
      url: path,
    },
  };
}
