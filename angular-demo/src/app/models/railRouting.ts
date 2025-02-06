export interface GeoJson {
  type: string;
  data: RailRoutingResponse;
}

export interface RailRouting {
  railGeojson: GeoJson;
  railOrigin: [number, number];
  railDestination: [number, number];
}

export interface RailRoutingResponse {
  geometry: RailRoutingGeometry;
  type: string;
}
export interface RailRoutingGeometry {
  type: string;
  coordinates: [number, number][][];
}
