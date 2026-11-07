import type { CampsiteWithComposite } from "@/data";
import type { RatingDimension, Region } from "@/types/campsite";

export type SortKey = "composite" | RatingDimension | "name";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "composite", label: "綜合分（高至低）" },
  { value: "scenery", label: "景色（高至低）" },
  { value: "facilities", label: "營地設施（高至低）" },
  { value: "quietness", label: "清靜度（高至低）" },
  { value: "transport", label: "交通便利度（高至低）" },
  { value: "name", label: "名稱（筆劃）" },
];

export interface CatalogFilters {
  region: Region | "all";
  park: string | "all";
  bookingOnly: boolean;
}

export function filterCampsites(
  list: CampsiteWithComposite[],
  f: CatalogFilters,
): CampsiteWithComposite[] {
  return list.filter(
    (c) =>
      (f.region === "all" || c.region === f.region) &&
      (f.park === "all" || c.parkZh === f.park) &&
      (!f.bookingOnly || c.bookingRequired),
  );
}

const collator = new Intl.Collator("zh-HK-u-co-stroke");

export function sortCampsites(
  list: CampsiteWithComposite[],
  key: SortKey,
): CampsiteWithComposite[] {
  const copy = [...list];
  if (key === "name") return copy.sort((a, b) => collator.compare(a.nameZh, b.nameZh));
  const score = (c: CampsiteWithComposite) => (key === "composite" ? c.composite : c.ratings[key]);
  // Ties: composite, then AFCD id for a stable order.
  return copy.sort((a, b) => score(b) - score(a) || b.composite - a.composite || a.id - b.id);
}
