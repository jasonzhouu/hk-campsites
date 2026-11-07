/** 地區分組（本站自訂，用於篩選） */
export const REGIONS = [
  "北區／大埔",
  "西貢",
  "沙田／馬鞍山",
  "東龍洲",
  "荃灣／元朗",
  "大嶼山",
] as const;
export type Region = (typeof REGIONS)[number];

/** 漁護署 CSV「Source of water」欄位 */
export type WaterSource = "tap" | "stream" | "toilet";

/** 漁護署 CSV「Tent space」欄位 */
export type TentCapacity = "lt20" | "20to50" | "gt50";

/** 前往方式：road = 有公共交通或車路至附近；hike = 需徒步；boat = 需乘船 */
export type AccessMode = "road" | "hike" | "boat";

export type Score = 1 | 2 | 3 | 4 | 5;

/** 編輯評分（非用戶評價）。所有維度均「越高越好」。 */
export interface RatingScores {
  /** 營地設施 */
  facilities: Score;
  /** 景色 */
  scenery: Score;
  /** 清靜度：越高代表越清靜、越少人（由「擁擠程度」反轉而來） */
  quietness: Score;
  /** 交通便利度 */
  transport: Score;
}

export type RatingDimension = keyof RatingScores;

export interface Campsite {
  /** 漁護署營地編號 */
  id: number;
  slug: string;
  nameZh: string;
  nameEn: string;
  parkZh: string;
  parkEn: string;
  region: Region;
  water: WaterSource;
  /** 漁護署原文 */
  waterZh: string;
  waterEn: string;
  tentCapacity: TentCapacity;
  lat: number;
  lng: number;
  afcdUrlZh: string;
  afcdUrlEn: string;
  bookingRequired: boolean;
  bookingNoteZh: string | null;
  introZh: string;
  transportZh: string;
  access: AccessMode[];
  facilitiesNotesZh: string | null;
  /** null → 介面顯示「待補充」 */
  sceneryNotesZh: string | null;
  ratings: RatingScores;
}
