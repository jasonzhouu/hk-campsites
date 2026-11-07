import type { AccessMode, TentCapacity, WaterSource } from "@/types/campsite";

export const MISSING = "待補充";

export const WATER_LABELS: Record<WaterSource, string> = {
  tap: "水喉",
  stream: "溪澗（季節性）",
  toilet: "洗手間",
};

export const CAPACITY_LABELS: Record<TentCapacity, string> = {
  lt20: "少於 20 個營位",
  "20to50": "20–50 個營位",
  gt50: "多於 50 個營位",
};

export const ACCESS_LABELS: Record<AccessMode, string> = {
  road: "公共交通可達附近",
  hike: "需徒步",
  boat: "需乘船",
};
