import type { RatingDimension, RatingScores } from "@/types/campsite";

/** 綜合分權重（總和 = 1） */
export const RATING_WEIGHTS: Record<RatingDimension, number> = {
  facilities: 0.25,
  scenery: 0.3,
  quietness: 0.2,
  transport: 0.25,
};

export const RATING_DIMENSIONS: RatingDimension[] = [
  "facilities",
  "scenery",
  "quietness",
  "transport",
];

export const RATING_LABELS: Record<RatingDimension, { zh: string; en: string; hintZh: string }> = {
  facilities: { zh: "營地設施", en: "Facilities", hintZh: "水源、洗手間及營位數目" },
  scenery: { zh: "景色", en: "Scenery", hintZh: "海景、山景及地質景觀" },
  quietness: {
    zh: "清靜度",
    en: "Quietness",
    hintZh: "越高越清靜、越少人（由擁擠程度反轉計算）",
  },
  transport: { zh: "交通便利度", en: "Transport", hintZh: "車路可達程度、步程及是否需乘船" },
};

export const RATING_MAX = 5;

/**
 * 綜合分 = round(設施×0.25 + 景色×0.30 + 清靜度×0.20 + 交通×0.25, 2)
 * 全站唯一的綜合分計算函數。
 */
export function computeComposite(r: RatingScores): number {
  const raw =
    r.facilities * RATING_WEIGHTS.facilities +
    r.scenery * RATING_WEIGHTS.scenery +
    r.quietness * RATING_WEIGHTS.quietness +
    r.transport * RATING_WEIGHTS.transport;
  // Number.EPSILON guards against binary rounding (e.g. 3.445 → 3.45)
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

/** 擁擠程度（1 = 冷清，5 = 非常擁擠）→ 清靜度 */
export function crowdingToQuietness(crowding: number): number {
  return RATING_MAX + 1 - crowding;
}

export function formatComposite(n: number): string {
  return n.toFixed(2);
}
