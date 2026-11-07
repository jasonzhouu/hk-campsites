import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Per-page metadata with matching Open Graph / Twitter fields.
 * Metadata is merged shallowly, so each page must restate the full `openGraph` and `twitter` objects.
 * `imagePath` points at an `opengraph-image` route (default: the site-wide one in `src/app`).
 */
export function pageMetadata({
  title,
  description,
  path,
  imagePath = "/opengraph-image",
  imageAlt = site.name,
}: {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  imageAlt?: string;
}): Metadata {
  const fullTitle = `${title}｜${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "zh_HK",
      siteName: site.name,
      title: fullTitle,
      description,
      url: path,
      images: [{ url: imagePath, width: 1200, height: 630, alt: imageAlt, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: imagePath, alt: imageAlt }],
    },
  };
}
