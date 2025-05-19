export const GJFeatureCollection = (featureCollection) => {
  return {
    type: "geojson",
    data: featureCollection,
  };
};
