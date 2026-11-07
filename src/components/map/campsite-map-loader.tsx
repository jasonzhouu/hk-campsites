"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "./types";

// Leaflet touches `window` on import, so the map only renders in the browser.
const CampsiteMap = dynamic(() => import("./campsite-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/40 text-sm text-muted-foreground">
      地圖載入中…
    </div>
  ),
});

export function CampsiteMapLoader({ points }: { points: MapPoint[] }) {
  return <CampsiteMap points={points} />;
}
