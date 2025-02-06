async function loadJsons() {
  //North America
  const customFeaturesNABody = await fetch(
    "src/json/jsonCustomFeaturesNA.json"
  );
  customFeaturesNA = await customFeaturesNABody.json();

  polygonLayerNA = {
    id: "customPolygonLayer",
    source: "customFeaturesSource",
    type: "fill",
    paint: {
      "fill-color": "#0024d9",
      "fill-opacity": 0.5,
    },
    filter: ["==", "$type", "Polygon"],
  };

  pointLayerNA = {
    id: "customPointsLayer",
    source: "customFeaturesSource",
    type: "symbol",
    layout: {
      "icon-image": ["get", "icon"],
      "icon-size": ["get", "icon-size"],
    },
    filter: ["==", "$type", "Point"],
  };

  lineLayerNA = {
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
  const customFeaturesEUBody = await fetch(
    "src/json/jsonCustomFeaturesEU.json"
  );
  customFeaturesEU = await customFeaturesEUBody.json();

  pointLayerEU = {
    id: "customPointsLayerEU",
    source: "customFeaturesSourceEU",
    type: "symbol",
    layout: {
      "icon-image": ["get", "icon"],
      "icon-size": ["get", "icon-size"],
    },
    filter: ["==", "$type", "Point"],
  };

  polygonLayerEU = {
    id: "customPolygonLayerEU",
    source: "customFeaturesSourceEU",
    type: "fill",
    paint: {
      "fill-color": "#0024d9",
      "fill-opacity": 0.5,
    },
    filter: ["==", "$type", "Polygon"],
  };

  lineLayerEU = {
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
  const siteEUPolygonBody = await fetch("src/json/jsonCustomSiteEU.json");
  siteEUPolygon = await siteEUPolygonBody.json();

  siteEULayer = {
    id: "siteEULayer",
    source: "siteEUPolygon",
    type: "fill",
    paint: {
      "fill-color": "purple",
      "fill-opacity": 0.25,
    },
  };
  const json = {
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
