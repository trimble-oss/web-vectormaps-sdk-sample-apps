import { PureComponent } from "react";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { mapInfoSelectedRegion } from "../Utils/mapInfo";
import { loadJsons } from "../Utils/loadJson";
import { layerSpecificLocation } from "../Utils/layerSpecificlocation";

class MapService extends PureComponent {
  constructor(props) {
    super(props);
    this.customLayers = loadJsons();
    this.roadSurfaceLegendControl;
  }
  trafficIncidentLayer = new TrimbleMaps.TrafficIncident();
  roadSurfaceLayer = new TrimbleMaps.RoadSurface();
  truckRestrictionLayer;
  roadSurfaceLegendControl = new TrimbleMaps.RoadSurfaceLegendControl();
  railPopup = new TrimbleMaps.Popup();
  popup = new TrimbleMaps.Popup();
  map;
  mapRoute;
  routeReports;
  customLayers;
  trafficIncidentClickCtrl = new TrimbleMaps.TrafficIncidentClickControl();
  trafficIncidentFilterCtrl = new TrimbleMaps.TrafficIncidentFilterControl();

  initMap(options, apiKey) {
    TrimbleMaps.setAPIKey(apiKey);
    this.map = new TrimbleMaps.Map(options);

    this.map.on("load", () => {
      this.map.addControl(new TrimbleMaps.WeatherAlertFilterControl());
      this.map.addControl(new TrimbleMaps.WeatherAlertClickControl());
      this.map.setWeatherAlertVisibility(false);

      //Add custom layer sources.
      if (typeof this.map.getSource("customFeaturesSource") == "undefined") {
        this.map.addSource("customFeaturesSource", {
          type: "geojson",
          data: this.customLayers.customFeaturesNA
        });
      }
    });

    this.map.on("truckrestriction", () => {
      this.map.addControl(new TrimbleMaps.TruckRestrictionClickControl());
      this.showLoading.next(false);
    });

    this.map.on("style.load", () => {
      console.log("map style loaded");
    });
    this.map.on("weatherradar", () => {
      this.showLoading.next(false);
    });

    this.map.on("roadsurface", () => {
      this.map.addControl(new TrimbleMaps.RoadSurfaceLegendControl());
      this.showLoading.next(false);
    });
    this.map.on("trafficincident", function () {
      this.trafficIncidentLayer.setVisibility(true);
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
              TrimbleMaps.Common.ReportType.ROAD
            ]
          : undefined
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
        data: this.customLayers.siteEUPolygon
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
        "icon-allow-overlap": true //set to true to load all image locations, set to false to cluster images based on zoom level
      }
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
          "line-opacity": 0.5
        }
      });
    }
    if (typeof map.getLayer("railRouteOriginDestination") === "undefined") {
      map.addLayer({
        id: "railRouteOriginDestination",
        type: "symbol",
        source: "railPair",
        layout: {
          "icon-image": ["get", "icon"],
          "icon-allow-overlap": true //set to true to load all image locations, set to false to cluster images based on zoom level
        }
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

  resetMapLayers(map) {
    this.removeRoutes();
    this.popup.remove();
    this.railPopup.remove();
    map.setPitch(0);
    const mapInfo = mapInfoSelectedRegion(map.getRegion());
    if (map.isTrafficVisible()) {
      map.toggleTrafficVisibility();
    }

    if (map.isWeatherRadarVisible()) {
      map.toggleWeatherRadarVisibility();
    }

    if (map.isWeatherAlertVisible()) {
      map.toggleWeatherAlertVisibility();
    }

    if (map.isRoadSurfaceVisible()) {
      map.toggleRoadSurfaceVisibility();
    }

    if (
      map.getRegion() === TrimbleMaps.Common.Region.NA &&
      map.isPlacesVisible()
    ) {
      map.togglePlacesVisibility();
    }

    if (map.isPOIVisible()) {
      map.togglePOIVisibility();
    }

    if (
      map.getStyle().name.toLowerCase() !==
        TrimbleMaps.Common.Style.SATELLITE &&
      map.is3dBuildingVisible()
    ) {
      map.toggle3dBuildingVisibility();
    }
    if (
      typeof map.getSource(mapInfo.customDataSource.sourceName) === "undefined"
    ) {
      map.addSource(
        mapInfo.customDataSource.sourceName,
        mapInfo.customDataSource.geoJson
      );
    }
    if (typeof map.getLayer("customPointsLayer") !== "undefined") {
      map.removeLayer("customPointsLayer");
    }

    if (typeof map.getLayer("customPolygonLayer") !== "undefined") {
      map.removeLayer("customPolygonLayer");
    }

    if (typeof map.getLayer("customLineLayer") !== "undefined") {
      map.removeLayer("customLineLayer");
    }

    if (typeof map.getLayer("customPointsLayerEU") !== "undefined") {
      map.removeLayer("customPointsLayerEU");
    }

    if (typeof map.getLayer("customPolygonLayerEU") !== "undefined") {
      map.removeLayer("customPolygonLayerEU");
    }

    if (typeof map.getLayer("customLineLayerEU") !== "undefined") {
      map.removeLayer("customLineLayerEU");
    }

    if (typeof map.getLayer("siteEULayer") !== "undefined") {
      map.removeLayer("siteEULayer");
    }

    if (typeof map.getLayer("gateLayer") !== "undefined") {
      map.removeLayer("gateLayer");
    }
    if (typeof map.getSource("gateSource") !== "undefined") {
      map.removeSource("gateSource");
    }

    try {
      this.trafficIncidentLayer?.setVisibility(false);
      map.removeControl(this.trafficIncidentClickCtrl);
      map.removeControl(this.trafficIncidentFilterCtrl);
    } catch {
      /* empty */
    }
    if (this.truckRestrictionLayer?.isVisible()) {
      this.truckRestrictionLayer.toggleVisibility();
    }
    try {
      if (map.getLayer("railRouteOriginDestination")) {
        map.removeLayer("railRouteOriginDestination");
      }

      if (map.getLayer("railRouteLayer")) {
        map.removeLayer("railRouteLayer");
      }
      if (typeof map.getSource("railRouteSource") !== "undefined") {
        map.removeSource("railRouteSource");
      }
      if (typeof map.getSource("railPair") !== "undefined") {
        map.removeSource("railPair");
      }
    } catch (e) {
      /* empty */
    }
    const mapLocation = layerSpecificLocation(map.getRegion());
    this.changeMapLocation(map, mapLocation);
  }

  changeMapLocation(map, mapLocation) {
    map.setCenter(mapLocation.center);
    map.setZoom(mapLocation.zoom);
    if (mapLocation.pitch) {
      map.setPitch(mapLocation?.pitch);
    }
  }
  addTrafficIncidentLayer(map) {
    if (
      typeof map.getLayer("trafficincidents-traffic_incidents") === "undefined"
    ) {
      this.trafficIncidentLayer = new TrimbleMaps.TrafficIncident();
      this.trafficIncidentLayer.addTo(map);
    }

    this.trafficIncidentLayer?.setVisibility(true);
    map.addControl(this.trafficIncidentClickCtrl);
    map.addControl(this.trafficIncidentFilterCtrl);
  }

  addTruckRestrictionLayer(map) {
    //Set truck restriction layer controls.
    if (typeof map.getLayer("truckrestrictions") === "undefined") {
      this.truckRestrictionLayer = new TrimbleMaps.TruckRestriction();
      this.truckRestrictionLayer.addTo(map);
    }
    this.truckRestrictionLayer.setVisibility(true);
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
  toggleRoadSurfaceVisibility(map) {
    map.toggleRoadSurfaceVisibility();
  }
}
export default MapService;
