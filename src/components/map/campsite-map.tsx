"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export type MapPoint = {
  id: number;
  slug: string;
  nameZh: string;
  lat: number;
  lng: number;
  score: string;
};

// Serve marker images locally instead of relying on Leaflet's URL detection (broken under bundlers).
const markerIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export default function CampsiteMap({ points }: { points: MapPoint[] }) {
  const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));

  return (
    <MapContainer
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
              <Link href={`/campsites/${p.slug}`} className="font-medium">
                查看營地詳情 →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
