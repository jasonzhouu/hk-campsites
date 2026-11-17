"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useLayoutEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { MapPoint } from "./types";

const placeholderClass =
  "flex h-full w-full items-center justify-center bg-muted/40 text-sm text-muted-foreground";

export default function CampsiteMap({ points }: { points: MapPoint[] }) {
  // Only mount Leaflet after the client has committed and laid out the container,
  // so it never initialises against a detached or zero-size node during soft navigation.
  const [mounted, setMounted] = useState(false);

  // With Cache Components, Next.js hides visited routes in <Activity> instead of
  // unmounting them. Hiding runs react-leaflet's cleanup (map.remove()) but keeps its
  // state and DOM node, so revealing would reuse a destroyed map. Resetting the gate in
  // a layout-effect cleanup tears MapContainer down on hide and remounts it fresh on reveal.
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(frame);
      setMounted(false);
    };
  }, []);

  // Signboard pins: a dark green plate with the AFCD campsite number in trail-blaze amber.
  // Built as divIcons (styled in globals.css), so no marker image files are needed and
  // Leaflet's bundler-hostile icon URL detection is never involved.
  const icons = useMemo(
    () =>
      mounted
        ? new Map(
            points.map((p) => [
              p.id,
              L.divIcon({
                className: "hk-pin",
                html: `<span class="hk-pin__plate">${p.id}</span>`,
                iconSize: [34, 34],
                iconAnchor: [17, 34],
                popupAnchor: [0, -30],
              }),
            ]),
          )
        : null,
    [mounted, points],
  );

  const bounds = useMemo(
    () => (mounted ? L.latLngBounds(points.map((p) => [p.lat, p.lng])) : null),
    [mounted, points],
  );

  if (!mounted || !icons || !bounds) {
    return <div className={placeholderClass}>地圖載入中…</div>;
  }

  return (
    <MapContainer
      key="campsites-overview"
      bounds={bounds}
      boundsOptions={{ padding: [32, 32] }}
      zoomSnap={0.5}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={icons.get(p.id)}
          title={`${p.id} 號 ${p.nameZh}`}
          alt={`${p.id} 號 ${p.nameZh}`}
          riseOnHover
        >
          <Popup>
            <div className="min-w-44 space-y-2">
              <p className="font-heading text-base font-bold leading-snug">
                <span className="mr-1.5 font-sans text-sm font-normal text-muted-foreground tabular-nums">
                  #{p.id}
                </span>
                {p.nameZh}
              </p>
              <p className="text-sm">
                編輯綜合分{" "}
                <span className="inline-block rounded-sm bg-signboard px-1.5 font-heading font-bold text-blaze tabular-nums">
                  {p.score}
                </span>{" "}
                <span className="text-muted-foreground">/ 5</span>
              </p>
              {/* Plain anchor: Leaflet renders popup content outside the Next.js router context. */}
              <a
                href={`/campsites/${p.slug}`}
                className="hk-popup-link inline-flex min-h-10 items-center font-bold underline underline-offset-4"
              >
                查看營地詳情 →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
