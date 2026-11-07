// Shared map types. Keep this file free of Leaflet imports so Server Components
// and the lazy loader can reference them without pulling Leaflet into their graph.
export type MapPoint = {
  id: number;
  slug: string;
  nameZh: string;
  lat: number;
  lng: number;
  score: string;
};
