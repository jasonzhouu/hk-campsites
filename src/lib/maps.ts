/** 外部地圖連結（免費、無需 API 金鑰） */

const fmt = (n: number) => n.toFixed(5);

export function osmUrl(lat: number, lng: number, zoom = 15): string {
  return `https://www.openstreetmap.org/?mlat=${fmt(lat)}&mlon=${fmt(lng)}#map=${zoom}/${fmt(lat)}/${fmt(lng)}`;
}

export function googleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${fmt(lat)},${fmt(lng)}`;
}
