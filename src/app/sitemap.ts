import type { MetadataRoute } from "next";
import { campsites } from "@/data";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/map", "/about"].map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.6,
  }));
  const sites = campsites.map((c) => ({
    url: new URL(`/campsites/${c.slug}`, site.url).toString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...pages, ...sites];
}
