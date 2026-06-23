import { FeatureCollection } from "geojson";

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
