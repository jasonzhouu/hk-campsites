import { computeComposite } from "@/lib/ratings";
import { assertValidCampsites } from "@/lib/validate";
import type { Campsite } from "@/types/campsite";
import { campsites as rawCampsites } from "./campsites";

// Build-time assertion: `next build` fails if the catalog is malformed.
assertValidCampsites(rawCampsites);

export type CampsiteWithComposite = Campsite & { composite: number };

export const campsites: CampsiteWithComposite[] = rawCampsites.map((c) => ({
  ...c,
  composite: computeComposite(c.ratings),
}));

export function getCampsiteBySlug(slug: string): CampsiteWithComposite | undefined {
  return campsites.find((c) => c.slug === slug);
}

/** 郊野公園列表（按首次出現的營地編號排序） */
export const parks: { zh: string; en: string; region: Campsite["region"]; count: number }[] =
  Array.from(
    campsites
      .reduce((map, c) => {
        const existing = map.get(c.parkZh);
        if (existing) existing.count += 1;
        else map.set(c.parkZh, { zh: c.parkZh, en: c.parkEn, region: c.region, count: 1 });
        return map;
      }, new Map<string, { zh: string; en: string; region: Campsite["region"]; count: number }>())
      .values(),
  );
