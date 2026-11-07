import type { Metadata } from "next";
import Link from "next/link";
import { campsites, parks } from "@/data";
import { formatComposite } from "@/lib/ratings";
import { googleMapsUrl, osmUrl } from "@/lib/maps";
import { pageMetadata } from "@/lib/metadata";
import { CampsiteMapLoader } from "@/components/map/campsite-map-loader";
import type { MapPoint } from "@/components/map/campsite-map";

export const metadata: Metadata = pageMetadata({
  title: "地圖總覽",
  description: `${campsites.length} 個漁護署指定營地的 OpenStreetMap 互動地圖，可縮放查看各營地位置及綜合分，並按郊野公園分組，附 OpenStreetMap 及 Google 地圖連結。`,
  path: "/map",
});

const mapPoints: MapPoint[] = campsites.map((c) => ({
  id: c.id,
  slug: c.slug,
  nameZh: c.nameZh,
  lat: c.lat,
  lng: c.lng,
  score: formatComposite(c.composite),
}));

const external = "font-medium text-primary underline underline-offset-4";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          地圖總覽
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          以下 OpenStreetMap 互動地圖標出全部 {campsites.length}{" "}
          個營地的位置，可拖曳及縮放；點選標記可查看綜合分並前往營地詳情。地圖下方按郊野公園列出各營地，並附
          OpenStreetMap 及 Google 地圖連結，方便規劃路線。
        </p>
      </header>

      <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {/* `isolate` keeps Leaflet's internal z-indexes below the sticky site header. */}
        <div
          role="region"
          aria-label="營地位置互動地圖"
          className="relative isolate z-0 h-[60vh] min-h-80 w-full"
        >
          <CampsiteMapLoader points={mapPoints} />
        </div>
        <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          座標整理自漁護署營地開放數據。實際路線請參閱{" "}
          <a
            href="https://www.openstreetmap.org/#map=11/22.35/114.15"
            className={external}
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
            <span className="sr-only">（於新分頁開啟）</span>
          </a>{" "}
          或地政總署{" "}
          <a
            href="https://www.map.gov.hk/"
            className={external}
            target="_blank"
            rel="noopener noreferrer"
          >
            地圖匯
            <span className="sr-only">（於新分頁開啟）</span>
          </a>
          。
        </figcaption>
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
                      <Link
                        href={`/campsites/${c.slug}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        <span className="mr-1.5 text-muted-foreground tabular-nums">
                          #{c.id}
                        </span>
                        {c.nameZh}
                      </Link>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {c.lat.toFixed(5)}, {c.lng.toFixed(5)} · 編輯綜合分{" "}
                        {formatComposite(c.composite)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a
                        href={osmUrl(c.lat, c.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${external} inline-flex min-h-10 items-center`}
                      >
                        OpenStreetMap
                        <span className="sr-only">
                          ：{c.nameZh}（於新分頁開啟）
                        </span>
                      </a>
                      <a
                        href={googleMapsUrl(c.lat, c.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${external} inline-flex min-h-10 items-center`}
                      >
                        Google 地圖
                        <span className="sr-only">
                          ：{c.nameZh}（於新分頁開啟）
                        </span>
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
