import type { Metadata } from "next";
import Link from "next/link";
import { campsites, parks } from "@/data";
import { formatComposite } from "@/lib/ratings";
import { googleMapsUrl, osmUrl } from "@/lib/maps";

export const metadata: Metadata = {
  title: "地圖總覽",
  description: `${campsites.length} 個漁護署指定營地的位置總覽，按郊野公園分組，附 OpenStreetMap 及 Google 地圖連結。`,
};

// Simple equirectangular projection of the catalog's bounding box onto an SVG viewBox.
const W = 1000;
const H = 620;
const PAD = 40;
const lats = campsites.map((c) => c.lat);
const lngs = campsites.map((c) => c.lng);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);
const minLng = Math.min(...lngs);
const maxLng = Math.max(...lngs);
// Correct longitude scale for latitude (~22.4°N) so distances look right.
const lngScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
const spanX = (maxLng - minLng) * lngScale;
const spanY = maxLat - minLat;
const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
const offsetX = (W - spanX * scale) / 2;
const offsetY = (H - spanY * scale) / 2;

function project(lat: number, lng: number) {
  return {
    x: offsetX + (lng - minLng) * lngScale * scale,
    y: offsetY + (maxLat - lat) * scale,
  };
}

const external = "font-medium text-primary underline underline-offset-4";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">地圖總覽</h1>
        <p className="leading-relaxed text-muted-foreground">
          以下示意圖按座標標出全部 {campsites.length} 個營地的相對位置（不含海岸線及地形，只供參考）。點選編號可跳至該營地；每個營地均附 OpenStreetMap 及 Google 地圖連結，方便規劃路線。</p>
      </header>

      <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="map-title"
          className="h-auto w-full"
        >
          <title id="map-title">香港漁護署營地位置示意圖</title>
          <rect width={W} height={H} className="fill-muted/40" />
          {campsites.map((c) => {
            const { x, y } = project(c.lat, c.lng);
            return (
              <a key={c.id} href={`#site-${c.id}`} aria-label={`${c.id} 號 ${c.nameZh}`}>
                <circle cx={x} cy={y} r={13} className="fill-primary stroke-card" strokeWidth={2} />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-primary-foreground text-[11px] font-semibold"
                >
                  {c.id}
                </text>
              </a>
            );
          })}
          <text x={W - PAD} y={H - 16} textAnchor="end" className="fill-muted-foreground text-[14px]">
            北 ↑ · 示意圖，非實際比例地圖
          </text>
        </svg>
        <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          座標整理自漁護署營地開放數據。實際路線請參閱{" "}
          <a href="https://www.openstreetmap.org/#map=11/22.35/114.15" className={external} target="_blank" rel="noopener noreferrer">
            OpenStreetMap
            <span className="sr-only">（於新分頁開啟）</span>
          </a>{" "}
          或地政總署{" "}
          <a href="https://www.map.gov.hk/" className={external} target="_blank" rel="noopener noreferrer">
            地圖匯
            <span className="sr-only">（於新分頁開啟）</span>
          </a>
          。</figcaption>
      </figure>

      <div className="mt-10 space-y-10">
        {parks.map((park) => {
          const sites = campsites.filter((c) => c.parkZh === park.zh);
          const headingId = `park-${sites[0].id}`;
          return (
            <section key={park.zh} aria-labelledby={headingId}>
              <h2 id={headingId} className="text-lg font-semibold">
                {park.zh}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {park.region} · {park.count} 個營地
                </span>
              </h2>
              <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
                {sites.map((c) => (
                  <li
                    key={c.id}
                    id={`site-${c.id}`}
                    className="scroll-mt-20 flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <Link href={`/campsites/${c.slug}`} className="font-medium underline-offset-4 hover:underline">
                        <span className="mr-1.5 text-muted-foreground tabular-nums">#{c.id}</span>
                        {c.nameZh}
                      </Link>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {c.lat.toFixed(5)}, {c.lng.toFixed(5)} · 編輯綜合分 {formatComposite(c.composite)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a href={osmUrl(c.lat, c.lng)} target="_blank" rel="noopener noreferrer" className={`${external} inline-flex min-h-10 items-center`}>
                        OpenStreetMap
                        <span className="sr-only">：{c.nameZh}（於新分頁開啟）</span>
                      </a>
                      <a href={googleMapsUrl(c.lat, c.lng)} target="_blank" rel="noopener noreferrer" className={`${external} inline-flex min-h-10 items-center`}>
                        Google 地圖
                        <span className="sr-only">：{c.nameZh}（於新分頁開啟）</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
