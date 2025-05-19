import { PureComponent } from "react";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { mapInfoSelectedRegion } from "../Utils/mapInfo";
import { loadJsons } from "../Utils/loadJson";
import { layerSpecificLocation } from "../Utils/layerSpecificlocation";
import * as turf from "@turf/turf";
import { GJFeatureCollection } from "../Utils/geojsonFeatureCollections";

class MapService extends PureComponent {
  constructor(props) {
    super(props);
    this.customLayers = loadJsons();
  }
  trafficLayer = new TrimbleMaps.Traffic();
  weatherRadarLayer = new TrimbleMaps.WeatherRadar();
  weatherAlertLayer = new TrimbleMaps.WeatherAlert();
  pointsOfInterest = new TrimbleMaps.PointsOfInterest();
  trafficIncidentLayer = new TrimbleMaps.TrafficIncident({
    layerId: "trafficincidents",
    isVisible: false,
  });
  roadSurfaceLayer = new TrimbleMaps.RoadSurface();
  truckRestrictionLayer;
  roadSurfaceLegendControl = new TrimbleMaps.RoadSurfaceLegendControl();
  railPopup = new TrimbleMaps.Popup();
  popup = new TrimbleMaps.Popup();
  placesPopup = new TrimbleMaps.Popup();
  stopMarkers = [];
  minzoom = 9;

  map;
  mapRoute;
  routeReports;
  customLayers;
  trafficIncidentClickCtrl = new TrimbleMaps.TrafficIncidentClickControl();
  trafficIncidentFilterCtrl = new TrimbleMaps.TrafficIncidentFilterControl();
  weatherAlertClickControl = new TrimbleMaps.WeatherAlertClickControl();
  weatherAlertFilterControl = new TrimbleMaps.WeatherAlertFilterControl();
  truckRestrictionClickCtrl = new TrimbleMaps.TruckRestrictionClickControl();
  truckRestrictionFilterCtrl = new TrimbleMaps.TruckRestrictionFilterControl();
  license = null;

  initMap(options, apiKey, licensedFeatures) {
    this.license = licensedFeatures;
    TrimbleMaps.setAPIKey(apiKey);
    TrimbleMaps.setUnit(TrimbleMaps.Common.Unit.ENGLISH);
    this.map = new TrimbleMaps.Map(options);
    this.map.on("load", () => {
      if (this.license.traffic) {
        this.trafficLayer.addTo(this.map);
        this.trafficIncidentLayer.addTo(this.map);
      }
      if (this.license.truckRestriction) {
        this.truckRestrictionLayer = new TrimbleMaps.TruckRestriction();
        this.truckRestrictionLayer.addTo(this.map);
        this.truckRestrictionLayer.setVisibility(false);
      }
      if (this.license.roadSurface) {
        this.roadSurfaceLayer.addTo(this.map);
        this.roadSurfaceLayer.setVisibility(false);
      }
      this.weatherRadarLayer.addTo(this.map);
      this.weatherRadarLayer.setVisibility(false);
      this.pointsOfInterest.addTo(this.map);
      this.map.addControl(new TrimbleMaps.PlaceClickControl());
      if (this.license.weatherAlerts) {
        this.weatherAlertLayer.setVisibility(false);
        this.weatherAlertLayer.addTo(this.map);
      }
      //Add custom layer sources.
      if (typeof this.map.getSource("customFeaturesSource") == "undefined") {
        this.map.addSource("customFeaturesSource", {
          type: "geojson",
          data: this.customLayers.customFeaturesNA,
        });
      }
    });

    this.map.on("truckrestriction", () => {
      this.map.addControl(new TrimbleMaps.TruckRestrictionClickControl());
    });

    this.map.on("style.load", () => {
      console.log("map style loaded");
    });

    this.map.once("weatheralert", () => {
      this.map.addControl(this.weatherAlertFilterControl);
      this.map.addControl(this.weatherAlertClickControl);
    });
    this.map.on("roadsurface", () => {
      this.map.addControl(this.roadSurfaceLegendControl);
    });
    this.map.on("trafficincident", function () {});
    this.map.on("click", "pointsofinterest-poi_all", (e) => {
      this.placesPopup?.remove();
      const features = this.map.queryRenderedFeatures(e.point);

      const map_features = features.find((data) => data.sourceLayer === "poi");
      if (map_features) {
        const popupContent = `Name: ${map_features.properties.name}<br />
          ID: ${map_features.properties.poi}<br />
          Set: ${map_features.properties.set}`;
        setTimeout(() => {
          this.placesPopup
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(this.map);
        });
      }
    });

    this.map.on("zoomend", () => {
      let zoom = this.map.getZoom();
      if (
        zoom <= this.minzoom &&
        this.placesPopup &&
        this.placesPopup.isOpen()
      ) {
        this.placesPopup.remove(); // Remove popup from the map.
      }
    });
    return this.map;
  }

  getRegion() {
    this.map.getRegion();
  }

  changeRegion(map, region) {
    const mapInfo = mapInfoSelectedRegion(region);
    map.setRegion(region);
    map.setZoom(mapInfo.zoom);
    map.setCenter(mapInfo.center);
    TrimbleMaps.setUnit(mapInfo.unit);
  }

  changeStyle(map, mapStyle, satelliteProvider) {
    if (satelliteProvider) {
      map.setStyle(mapStyle, { satelliteProvider: satelliteProvider });
    } else {
      map.setStyle(mapStyle);
    }
  }

  removeRoutes() {
    try {
      if (this.mapRoute) {
        this.mapRoute.remove();
      }
    } catch {
      /* empty */
    }
  }
  createRoute(
    map,
    routeStops,
    rtType,
    vehType,
    hwyOnly,
    tolls,
    borders,
    hazmat,
    sites,
    routeRegion,
    reportType
  ) {
    let distanceUnits;
    let routeOptions;
    if (map.getRegion() === TrimbleMaps.Common.Region.NA) {
      distanceUnits = TrimbleMaps.Common.DistanceUnit.MILES;
    } else {
      distanceUnits = TrimbleMaps.Common.DistanceUnit.KILOMETERS;
      hwyOnly = false;
    }

    routeOptions = {
      stops: routeStops,
      routeColor: "blue",
      routeType: rtType,
      vehicleType: vehType,
      highwayOnly: hwyOnly,
      tollRoads: tolls,
      bordersOpen: borders,
      hazMatType: hazmat,
      useSites: sites,
      region: routeRegion,
      distanceUnits: distanceUnits,
      reportType:
        reportType === 1
          ? [
              TrimbleMaps.Common.ReportType.MILEAGE,
              TrimbleMaps.Common.ReportType.DIRECTIONS,
              TrimbleMaps.Common.ReportType.DETAIL,
              TrimbleMaps.Common.ReportType.STATE,
              TrimbleMaps.Common.ReportType.ROAD,
            ]
          : undefined,
    };
    return this.addMapRoute(routeOptions, map);
  }
  addMapRoute(routeOptions, map) {
    this.removeRoutes();
    this.mapRoute = new TrimbleMaps.Route(routeOptions);
    this.mapRoute.on("report", (reports) => {
      this.routeReports = reports;
    });
    this.mapRoute.addTo(map);
    return this.mapRoute;
  }

  addSiteEULayer() {
    if (typeof this.map.getSource("siteEUPolygon") == "undefined") {
      this.map.addSource("siteEUPolygon", {
        type: "geojson",
        data: this.customLayers.siteEUPolygon,
      });
    }

    this.map.addLayer(this.customLayers.siteEULayer);
  }

  updateSite(siteEnabled) {
    this.mapRoute.update({ useSites: siteEnabled });
  }

  addSiteLocation(map, siteGateGeojson) {
    if (typeof map.getLayer("gateLayer") !== "undefined") {
      map.removeLayer("gateLayer");
    }
    if (typeof map.getSource("gateSource") !== "undefined") {
      map.removeSource("gateSource");
    }
    if (typeof map.getSource("gateSource") == "undefined") {
      map.addSource("gateSource", siteGateGeojson);
    }
    map.togglePlacesVisibility();
    map.addLayer({
      id: "gateLayer",
      type: "symbol",
      source: "gateSource",
      layout: {
        "icon-image": ["get", "icon"],
        "icon-size": ["get", "icon-size"], //control the icon size
        "icon-allow-overlap": true, //set to true to load all image locations, set to false to cluster images based on zoom level
      },
    });
  }

  addRailRouting(map, railGeojson, railGeojsonFeatures) {
    if (typeof map.getSource("railRouteSource") === "undefined") {
      map.addSource("railRouteSource", railGeojson);
    }
    if (typeof map.getSource("railPair") === "undefined") {
      map.addSource("railPair", railGeojsonFeatures);
    }
    if (typeof map.getLayer("railRouteLayer") === "undefined") {
      map.addLayer({
        id: "railRouteLayer",
        type: "line",
        source: "railRouteSource",
        paint: {
          "line-color": "blue",
          "line-width": 8,
          "line-opacity": 0.5,
        },
      });
    }
    if (typeof map.getLayer("railRouteOriginDestination") === "undefined") {
      map.addLayer({
        id: "railRouteOriginDestination",
        type: "symbol",
        source: "railPair",
        layout: {
          "icon-image": ["get", "icon"],
          "icon-size": ["get", "icon-size"],
          "icon-allow-overlap": true, //set to true to load all image locations, set to false to cluster images based on zoom level
        },
      });
    }
    map.flyTo({ center: [-104.892532, 39.111309], zoom: 8 });

    this.railPopup
      .setLngLat([-104.829487, 38.832742])
      .setHTML(
        '<p style="font-size:.9em"><b>Location</b>: Colorado Springs, CO<br/><b>SPLC</b>: 746670000</p>'
      )
      .addTo(map);
  }

  resetMapLayers() {
    this.removeRoutes();
    this.popup.remove();
    this.railPopup.remove();
    this.removeStops();
    this.map.setPitch(0);
    const mapInfo = mapInfoSelectedRegion(this.map.getRegion());
    if (this.license.traffic && this.trafficLayer.isVisible()) {
      this.toggleTrafficVisibility();
    }

    if (this.license.weatherRadar && this.weatherRadarLayer.isVisible()) {
      this.toggleWeatherRadarVisibility();
    }

    if (this.license.weatherAlerts && this.weatherAlertLayer.isVisible()) {
      this.toggleWeatherAlertVisibility();
    }

    if (this.license.roadSurface && this.roadSurfaceLayer?.isVisible()) {
      this.toggleRoadSurfaceVisibility();
    }

    if (
      this.map.getRegion() === TrimbleMaps.Common.Region.NA &&
      this.map.isPlacesVisible()
    ) {
      this.map.togglePlacesVisibility();
    }

    if (this.pointsOfInterest.isVisible()) {
      this.pointsOfInterest.toggleVisibility();
    }

    if (
      this.map.getStyle().name.toLowerCase() !==
        TrimbleMaps.Common.Style.SATELLITE &&
      this.map.is3dBuildingVisible()
    ) {
      this.map.toggle3dBuildingVisibility();
    }
    if (
      typeof this.map.getSource(mapInfo.customDataSource.sourceName) ===
      "undefined"
    ) {
      this.map.addSource(
        mapInfo.customDataSource.sourceName,
        mapInfo.customDataSource.geoJson
      );
    }
    if (typeof this.map.getLayer("customPointsLayer") !== "undefined") {
      this.map.removeLayer("customPointsLayer");
    }

    if (typeof this.map.getLayer("customPolygonLayer") !== "undefined") {
      this.map.removeLayer("customPolygonLayer");
    }

    if (typeof this.map.getLayer("customLineLayer") !== "undefined") {
      this.map.removeLayer("customLineLayer");
    }

    if (typeof this.map.getLayer("customPointsLayerEU") !== "undefined") {
      this.map.removeLayer("customPointsLayerEU");
    }

    if (typeof this.map.getLayer("customPolygonLayerEU") !== "undefined") {
      this.map.removeLayer("customPolygonLayerEU");
    }

    if (typeof this.map.getLayer("customLineLayerEU") !== "undefined") {
      this.map.removeLayer("customLineLayerEU");
    }

    if (typeof this.map.getLayer("siteEULayer") !== "undefined") {
      this.map.removeLayer("siteEULayer");
    }

    if (typeof this.map.getLayer("gateLayer") !== "undefined") {
      this.map.removeLayer("gateLayer");
    }
    if (typeof this.map.getSource("gateSource") !== "undefined") {
      this.map.removeSource("gateSource");
    }

    try {
      if (this.license.traffic) {
        this.trafficIncidentLayer?.setVisibility(false);
        this.map.removeControl(this.trafficIncidentClickCtrl);
        this.map.removeControl(this.trafficIncidentFilterCtrl);
      }
    } catch {
      /* empty */
    }
    if (
      this.license.truckRestriction &&
      this.truckRestrictionLayer?.isVisible()
    ) {
      this.map.removeControl(this.truckRestrictionClickCtrl);
      this.map.removeControl(this.truckRestrictionFilterCtrl);
      this.truckRestrictionLayer.toggleVisibility();
    }
    try {
      if (this.map.getLayer("railRouteOriginDestination")) {
        this.map.removeLayer("railRouteOriginDestination");
      }

      if (this.map.getLayer("railRouteLayer")) {
        this.map.removeLayer("railRouteLayer");
      }
      if (typeof this.map.getSource("railRouteSource") !== "undefined") {
        this.map.removeSource("railRouteSource");
      }
      if (typeof this.map.getSource("railPair") !== "undefined") {
        this.map.removeSource("railPair");
      }
    } catch (e) {
      /* empty */
    }
    const mapLocation = layerSpecificLocation(this.map.getRegion());
    this.changeMapLocation(mapLocation);
  }

  changeMapLocation(mapLocation) {
    this.map.setCenter(mapLocation.center);
    this.map.setZoom(mapLocation.zoom);
    if (mapLocation.pitch) {
      this.map.setPitch(mapLocation?.pitch);
    }
  }
  addTrafficIncidentLayer(map) {
    this.trafficIncidentLayer?.setVisibility(true);
    map.addControl(this.trafficIncidentClickCtrl);
    map.addControl(this.trafficIncidentFilterCtrl);
  }

  addTruckRestrictionLayer() {
    //Set truck restriction layer controls.
    this.truckRestrictionLayer?.setVisibility(true);
    this.map.addControl(this.truckRestrictionClickCtrl);
    this.map.addControl(this.truckRestrictionFilterCtrl);
  }

  addCustomPlaceLayerNA(map, loc) {
    map.flyTo({ center: loc.center, zoom: loc.zoom });
    if (typeof map.getLayer("customPointsLayer") === "undefined") {
      map.addLayer(this.customLayers.polygonLayerNA);
      map.addLayer(this.customLayers.pointLayerNA);
      map.addLayer(this.customLayers.lineLayerNA);
    }
  }

  addCustomPlaceLayerEU(map, loc) {
    map.flyTo({ center: loc.center, zoom: loc.zoom });
    if (typeof map.getLayer("customPointsLayerEU") === "undefined") {
      map.addLayer(this.customLayers.polygonLayerEU);
      map.addLayer(this.customLayers.pointLayerEU);
      map.addLayer(this.customLayers.lineLayerEU);
    }
  }
  toggleTrafficVisibility() {
    this.trafficLayer?.toggleVisibility();
  }
  toggleWeatherRadarVisibility() {
    this.weatherRadarLayer?.toggleVisibility();
  }
  toggleWeatherAlertVisibility() {
    this.weatherAlertLayer?.toggleVisibility();
  }
  toggleRoadSurfaceVisibility() {
    this.roadSurfaceLayer?.toggleVisibility();
  }

  togglePOIVisibility() {
    this.pointsOfInterest.toggleVisibility();
  }

  centerOnMap(coords) {
    this.map.setCenter(coords);
    this.map.setZoom(15);
  }

  removeMarker() {
    this.stopMarkers.forEach((stopMarker) => {
      stopMarker.remove();
    });
  }

  removeStops() {
    if (this.map.getLayer("stopMarker")) {
      this.map.removeLayer("stopMarker");
      this.map.removeLayer("stopMarkerLabel");
      this.map.removeSource("stopMarker");
    }
  }

  addMarker(locations) {
    this.removeMarker();
    const marker = [];
    locations.forEach((location, index) => {
      let stopType = "route-stop-number";
      let name = index.toString();
      if (index === 0) {
        stopType = "origin";
        name = "";
      } else if (index === locations.length - 1) {
        stopType = "destination";
        name = "";
      }

      marker.push(
        turf.feature(
          {
            type: "Point",
            coordinates: [location.coord.lng, location.coord.lat],
          },
          { stopType: stopType, name: name }
        )
      );
    });
    const geojson = turf.featureCollection(marker);

    if (typeof this.map.getSource("stopMarker") === "undefined") {
      this.addStopMarkerSource(GJFeatureCollection(geojson));
    } else {
      this.map.getSource("stopMarker").setData(geojson);
    }
  }

  addSource(id, data) {
    this.map.addSource(id, data);
  }

  addLayer(data, beforeId) {
    this.map.addLayer(data, beforeId);
  }

  addStopMarkerSource(data) {
    this.addSource("stopMarker", data);

    // Use filter to show clustered points
    this.addLayer({
      id: "stopMarker",
      type: "circle",
      source: "stopMarker",
      paint: {
        "circle-radius": 8,
        "circle-color": "#FFF",
        "circle-stroke-color": [
          "match",
          ["get", "stopType"],
          "origin",
          "#00a65a",
          "destination",
          "#dd4b39",
          "#7bd0f7",
        ],
        "circle-stroke-width": 5,
      },
    });
    this.addLayer({
      id: "stopMarkerLabel",
      type: "symbol",
      source: "stopMarker",
      layout: {
        "text-field": ["get", "name"],
        "text-anchor": "center",
        "text-size": 12,
      },
    });
  }
}
export default MapService;
