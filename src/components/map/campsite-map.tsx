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

  // Serve marker images locally instead of relying on Leaflet's URL detection (broken under bundlers).
  const markerIcon = useMemo(
    () =>
      mounted
        ? L.icon({
            iconUrl: "/leaflet/marker-icon.png",
            iconRetinaUrl: "/leaflet/marker-icon-2x.png",
            shadowUrl: "/leaflet/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
          })
        : null,
    [mounted],
  );

  const bounds = useMemo(
    () => (mounted ? L.latLngBounds(points.map((p) => [p.lat, p.lng])) : null),
    [mounted, points],
  );

  if (!mounted || !markerIcon || !bounds) {
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
          icon={markerIcon}
          title={`${p.id} 號 ${p.nameZh}`}
          alt={`${p.id} 號 ${p.nameZh}`}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">
                <span className="mr-1 text-muted-foreground tabular-nums">#{p.id}</span>
                {p.nameZh}
              </p>
              <p className="text-muted-foreground">編輯綜合分 {p.score}</p>
              {/* Plain anchor: Leaflet renders popup content outside the Next.js router context. */}
              <a href={`/campsites/${p.slug}`} className="font-medium">
                查看營地詳情 →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
