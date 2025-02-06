import * as jsonCustomFeaturesNA from "../Jsons/jsonCustomFeaturesNA.json";
import * as jsonCustomFeaturesEU from "../Jsons/jsonCustomFeaturesEU.json";
import * as jsonCustomSiteEU from "../Jsons/jsonCustomSiteEU.json";

export function loadJsons() {
  let json;
  // North America

  const customFeaturesNA = jsonCustomFeaturesNA;

  const polygonLayerNA = {
    id: "customPolygonLayer",
    source: "customFeaturesSource",
    type: "fill",
    paint: {
      "fill-color": "#0024d9",
      "fill-opacity": 0.5,
    },
    filter: ["==", "$type", "Polygon"],
  };

  const pointLayerNA = {
    id: "customPointsLayer",
    source: "customFeaturesSource",
    type: "symbol",
    layout: {
      "icon-image": ["get", "icon"],
      "icon-size": ["get", "icon-size"],
    },
    filter: ["==", "$type", "Point"],
  };

  const lineLayerNA = {
    id: "customLineLayer",
    source: "customFeaturesSource",
    type: "line",
    paint: {
      "line-color": "#000000",
      "line-width": 5,
    },
    filter: ["==", "$type", "Polygon"],
  };

  //Europe

  const customFeaturesEU = jsonCustomFeaturesEU;

  const pointLayerEU = {
    id: "customPointsLayerEU",
    source: "customFeaturesSourceEU",
    type: "symbol",
    layout: {
      "icon-image": ["get", "icon"],
      "icon-size": ["get", "icon-size"],
    },
    filter: ["==", "$type", "Point"],
  };

  const polygonLayerEU = {
    id: "customPolygonLayerEU",
    source: "customFeaturesSourceEU",
    type: "fill",
    paint: {
      "fill-color": "#0024d9",
      "fill-opacity": 0.5,
    },
    filter: ["==", "$type", "Polygon"],
  };

  const lineLayerEU = {
    id: "customLineLayerEU",
    source: "customFeaturesSourceEU",
    type: "line",
    paint: {
      "line-color": "#000000",
      "line-width": 5,
    },
    filter: ["==", "$type", "Polygon"],
  };

  //EU Site

  const siteEUPolygon = jsonCustomSiteEU;

  const siteEULayer = {
    id: "siteEULayer",
    source: "siteEUPolygon",
    type: "fill",
    paint: {
      "fill-color": "purple",
      "fill-opacity": 0.25,
    },
  };

  json = {
    customFeaturesNA: customFeaturesNA,
    polygonLayerNA: polygonLayerNA,
    pointLayerNA: pointLayerNA,
    lineLayerNA: lineLayerNA,
    customFeaturesEU: customFeaturesEU,
    polygonLayerEU: polygonLayerEU,
    pointLayerEU: pointLayerEU,
    lineLayerEU: lineLayerEU,
    siteEUPolygon: siteEUPolygon,
    siteEULayer: siteEULayer,
  };
  return json;
}
