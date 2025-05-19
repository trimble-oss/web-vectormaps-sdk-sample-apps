import { FeatureCollection } from "@turf/turf";

export interface GeoJSONFeatureCollections {
  type: "geojson";
  data: FeatureCollection;
}
// GeoJSON
export const GJFeatureCollection = (
  featureCollection: FeatureCollection
): GeoJSONFeatureCollections => {
  return {
    type: "geojson",
    data: featureCollection,
  };
};
