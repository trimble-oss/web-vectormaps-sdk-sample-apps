import { Injectable } from "@angular/core";
import { MapRegion, MapStyle } from "../models/trimbleMaps";
import { mapLocationOption } from "../models/mapLocationOption";
import {
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
  map,
} from "rxjs";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { Locate, mapInfoSelectedRegion } from "../models/region";
import { MapHandlerManager } from "../utils/mapHandlerManager";
import { loadJsons } from "../utils/loadJson";
import { TollRoadTypeEnum } from "../models/tollEnum";
import { layerSpecificLocation } from "../utils/layerSpecificLocation";
import { LicenseFeature } from "../models/license";
import { ToastService } from "./toast.service";
import { constants } from "../utils/constants";
import { RouteLocation } from "../models/routeLocation";
import { Feature } from "@trimblemaps/trimblemaps-js/geojson";
import * as turf from "@turf/turf";
import { GJFeatureCollection } from "../utils/geoJsonFeature";

interface MapStore {
  currentStyle: string | TrimbleMaps.StyleSpecification;
  mapLocation: mapLocationOption;
  region: MapRegion;
}

const INITIAL_STATE: MapStore = {
  currentStyle: TrimbleMaps.Common.Style.TRANSPORTATION,
  mapLocation: { zoom: 0, center: [0, 0] },
  region: TrimbleMaps.Common.Region.NA,
};

@Injectable({
  providedIn: "root",
})
export class MapService {
  constructor(private toastService: ToastService) {}
  map!: TrimbleMaps.Map;
  private store: BehaviorSubject<MapStore> = new BehaviorSubject<MapStore>({
    ...INITIAL_STATE,
  });

  readonly store$: Observable<MapStore> = this.store.asObservable();
  stopMarkers: TrimbleMaps.Marker[] = [];
  mapHandlerManager = new MapHandlerManager();
  popup = new TrimbleMaps.Popup();
  railPopup = new TrimbleMaps.Popup();
  trafficLayer!: TrimbleMaps.Traffic;
  weatherAlertLayer!: TrimbleMaps.WeatherAlert;
  weatherRadarLayer!: TrimbleMaps.WeatherRadar;
  pointsOfInterest!: TrimbleMaps.PointsOfInterest;
  trafficIncidentLayer!: TrimbleMaps.TrafficIncident;
  truckRestrictionLayer!: TrimbleMaps.TruckRestriction;
  roadSurfaceLayer!: TrimbleMaps.RoadSurface;
  customLayers!: any;
  mapRoute!: TrimbleMaps.Route;
  report$!: Observable<unknown>;
  routeReports: any;
  roadSurfaceLegendControl = new TrimbleMaps.RoadSurfaceLegendControl();
  trafficIncidentClickCtrl = new TrimbleMaps.TrafficIncidentClickControl();
  trafficIncidentFilterCtrl = new TrimbleMaps.TrafficIncidentFilterControl();
  truckRestrictionClickCtrl = new TrimbleMaps.TruckRestrictionClickControl();
  truckRestrictionFilterCtrl = new TrimbleMaps.TruckRestrictionFilterControl();
  clickEvent!: TrimbleMaps.MapMouseEvent;

  license = new BehaviorSubject<LicenseFeature>({} as LicenseFeature);
  readonly license$ = this.license.asObservable();

  private mapClick = new Subject<TrimbleMaps.MapMouseEvent>();
  readonly mapClick$ = this.mapClick.asObservable();

  private clickControl = new BehaviorSubject<string>("");
  readonly clickControl$ = this.clickControl.asObservable();

  // shortcut to value
  private get storeValue(): MapStore {
    return this.store.getValue();
  }

  apiKey = new BehaviorSubject<string>("");
  readonly apiKey$ = this.apiKey.asObservable();

  // Observables for managed state
  readonly currentStyle$: Observable<MapStyle> = this.store$.pipe(
    map((s) => s.currentStyle as string),
    distinctUntilChanged()
  );

  readonly currentRegion$: Observable<MapRegion> = this.store$.pipe(
    map((s) => s.region),
    distinctUntilChanged()
  );

  private isLoading = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoading.asObservable();

  private mapLoad = new Subject<TrimbleMaps.Map>();
  readonly mapLoad$ = this.mapLoad.asObservable();

  private isMapStyleLoaded = new BehaviorSubject<boolean>(false);
  readonly isMapStyleLoaded$ = this.isMapStyleLoaded.asObservable();

  private showLoading = new BehaviorSubject<boolean>(true);
  readonly showLoading$ = this.showLoading.asObservable();

  private updateStore(newStore: Partial<MapStore>) {
    this.store.next({
      ...this.storeValue,
      ...newStore,
    });
  }

  initMap(options: TrimbleMaps.MapOptions, apiKey: string): TrimbleMaps.Map {
    // this.isLoading.next(true);
    TrimbleMaps.setAPIKey(apiKey);
    this.customLayers = loadJsons();
    if (options.style) {
      this.updateStore({
        currentStyle: options.style,
        mapLocation: {
          zoom: options.zoom as number,
          center: options.center as TrimbleMaps.LngLatLike,
        },
      });
    }

    this.map = new TrimbleMaps.Map(options);
    this.mapHandlerManager.setMap(this.map);

    this.mapHandlerManager.add({
      eventName: "load",
      listener: (evt: TrimbleMaps.TrimbleMapsEvent) => {
        const license = this.license.getValue();
        if (license.traffic) {
          this.trafficLayer = new TrimbleMaps.Traffic();
          this.trafficLayer.addTo(this.map);
          this.trafficLayer.setVisibility(false);

          this.trafficIncidentLayer = new TrimbleMaps.TrafficIncident({
            layerId: "trafficincidents",
            isVisible: true,
          });
          this.trafficIncidentLayer.addTo(this.map);
          this.trafficIncidentLayer.setVisibility(false);
        }
        if (license.roadSurface) {
          this.roadSurfaceLayer = new TrimbleMaps.RoadSurface();
          this.roadSurfaceLayer.addTo(this.map);
          this.roadSurfaceLayer.setVisibility(false);
        }
        if (license.truckRestriction) {
          //Set truck restriction layer controls.
          this.truckRestrictionLayer = new TrimbleMaps.TruckRestriction({
            layerId: "truckrestrictions",
            isVisible: false,
          });
          this.truckRestrictionLayer.addTo(this.map);
          this.truckRestrictionLayer.setVisibility(false);
        }
        if (license.weatherAlerts) {
          this.weatherAlertLayer = new TrimbleMaps.WeatherAlert();
          this.weatherAlertLayer.setVisibility(false);
          this.weatherAlertLayer.addTo(this.map);
        }
        this.weatherRadarLayer = new TrimbleMaps.WeatherRadar();
        this.weatherRadarLayer.addTo(this.map);
        this.weatherRadarLayer.setVisibility(false);
        this.pointsOfInterest = new TrimbleMaps.PointsOfInterest();
        this.pointsOfInterest.addTo(this.map);
        this.map.addControl(new TrimbleMaps.PlaceClickControl());
        this.map.addControl(new TrimbleMaps.WeatherAlertClickControl());
        this.map.addControl(
          new TrimbleMaps.WeatherAlertFilterControl(),
          "top-right"
        );
        if (typeof this.map.getSource("customFeaturesSource") === "undefined") {
          //Add custom layer sources.
          this.map.addSource("customFeaturesSource", {
            type: "geojson",
            data: this.customLayers.customFeaturesNA,
          });
        }
        this.mapLoad.next(evt.target);
        this.showLoading.next(false);
        this.isMapStyleLoaded.next(true);
      },
    });

    this.mapHandlerManager.add({
      eventName: "style.load",
      listener: (evt: TrimbleMaps.TrimbleMapsEvent) => {},
    });

    this.mapHandlerManager.add({
      eventName: "trafficincident",
      listener: (evt: TrimbleMaps.TrimbleMapsEvent) => {
        this.map.addControl(this.trafficIncidentClickCtrl);
        this.map.addControl(this.trafficIncidentFilterCtrl);
      },
    });

    this.mapHandlerManager.add({
      eventName: "weatheralert",
      listener: () => {
        this.showLoading.next(false);
      },
    });
    this.mapHandlerManager.add({
      eventName: "weatherradar",
      listener: () => {
        this.showLoading.next(false);
      },
    });

    this.mapHandlerManager.add({
      eventName: "roadsurface",
      listener: (evt: TrimbleMaps.TrimbleMapsEvent) => {
        this.map.addControl(this.roadSurfaceLegendControl);
      },
    });
    this.mapHandlerManager.add({
      eventName: "click",
      layerId: "pointofinterest",
      listener: (evt: TrimbleMaps.MapMouseEvent) => {
        this.clickEvent = evt;
        const features = this.map.queryRenderedFeatures(evt.point);

        const map_features = features.find(
          (data): data is TrimbleMaps.MapGeoJSONFeature =>
            data.sourceLayer === "poi"
        );
        if (map_features) {
          const popupContent = `Name: ${map_features.properties["name"]}<br />
                  ID: ${map_features.properties["poi"]}<br />
                    Set: ${map_features.properties["set"]}`;
          this.setMapLayerPopupContent(popupContent);
        }
      },
    });

    return this.map;
  }
  setMapLayerPopupContent(value: string) {
    this.clickControl.next(value);
    const popup = new TrimbleMaps.Popup()
      .setLngLat(this.clickEvent.lngLat)
      .setHTML(value)
      .addTo(this.map);
  }
  getMapLayerPopupContent(): string {
    return this.clickControl.value;
  }

  changeRegion(region: MapRegion) {
    const mapInfo = mapInfoSelectedRegion(region);
    this.map.setRegion(region);
    this.map.setZoom(mapInfo.zoom);
    this.map.setCenter(mapInfo.center);
    this.updateStore({ region: region });
    this.mapHandlerManager.removeAll();
  }
  changeStyle(
    mapStyle: MapStyle,
    satelliteProvider:
      | (typeof TrimbleMaps.Common.SatelliteProvider)[keyof typeof TrimbleMaps.Common.SatelliteProvider]
      | undefined
  ) {
    if (satelliteProvider) {
      this.map.setStyle(mapStyle, { satelliteProvider: satelliteProvider });
    } else {
      this.map.setStyle(mapStyle);
    }

    this.updateStore({ currentStyle: mapStyle });
  }

  toggleTrafficVisibility() {
    this.trafficLayer?.setVisibility(true);
    this.showLoading.next(false);
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
  togglePlacesVisibility() {
    this.map.togglePlacesVisibility();
    this.map.setLayoutProperty("places_gates", "icon-size", 0.7);
    this.showLoading.next(false);
  }
  togglePOIVisibility() {
    this.pointsOfInterest.toggleVisibility();
  }
  toggle3dBuildingVisibility(is3dBuildingVisible: boolean) {
    if (
      this.map.getStyle().name?.toLowerCase() ===
      TrimbleMaps.Common.Style.SATELLITE
    ) {
      this.toastService.warning(constants.SATELLITE_VIEW_WARNING, true);
    } else {
      this.map.toggle3dBuildingVisibility();
      this.setPitch(is3dBuildingVisible ? 0 : 60);
      this.showLoading.next(false);
    }
  }
  setPitch(pitch: number) {
    this.map.setPitch(pitch);
  }
  changeMapLocation(mapLocation: Locate) {
    this.map.setCenter(mapLocation.center);
    this.map.setZoom(mapLocation.zoom);
    if (mapLocation.pitch) {
      this.setPitch(mapLocation?.pitch);
    }
    this.updateStore({ mapLocation: mapLocation });
  }
  resetMapLayers() {
    const license = this.license.getValue();
    this.toastService.clear();
    this.removeRoutes();
    this.popup.remove();
    this.railPopup.remove();
    this.removeStops();
    this.setPitch(0);
    const mapInfo = mapInfoSelectedRegion(this.storeValue?.region);
    if (license.traffic && this.trafficLayer?.isVisible()) {
      this.trafficLayer?.setVisibility(false);
    }

    if (license.weatherRadar && this.weatherRadarLayer?.isVisible()) {
      this.toggleWeatherRadarVisibility();
    }

    if (license.weatherAlerts && this.weatherAlertLayer?.isVisible()) {
      this.toggleWeatherAlertVisibility();
    }
    if (license.roadSurface && this.roadSurfaceLayer?.isVisible()) {
      this.roadSurfaceLayer.setVisibility(false);
    }

    if (
      this.map.getRegion() === TrimbleMaps.Common.Region.NA &&
      this.map.isPlacesVisible()
    ) {
      this.togglePlacesVisibility();
    }

    if (this.pointsOfInterest?.isVisible()) {
      this.togglePOIVisibility();
    }

    if (
      this.map.getStyle().name?.toLowerCase() !==
        TrimbleMaps.Common.Style.SATELLITE &&
      this.map.is3dBuildingVisible()
    ) {
      this.toggle3dBuildingVisibility(this.map.is3dBuildingVisible());
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
    if (typeof this.map.getLayer("customPointsLayer") != "undefined") {
      this.map.removeLayer("customPointsLayer");
    }

    if (typeof this.map.getLayer("customPolygonLayer") != "undefined") {
      this.map.removeLayer("customPolygonLayer");
    }

    if (typeof this.map.getLayer("customLineLayer") != "undefined") {
      this.map.removeLayer("customLineLayer");
    }

    if (typeof this.map.getLayer("customPointsLayerEU") != "undefined") {
      this.map.removeLayer("customPointsLayerEU");
    }

    if (typeof this.map.getLayer("customPolygonLayerEU") != "undefined") {
      this.map.removeLayer("customPolygonLayerEU");
    }

    if (typeof this.map.getLayer("customLineLayerEU") != "undefined") {
      this.map.removeLayer("customLineLayerEU");
    }

    if (typeof this.map.getLayer("siteEULayer") != "undefined") {
      this.map.removeLayer("siteEULayer");
    }

    if (typeof this.map.getLayer("gateLayer") != "undefined") {
      this.map.removeLayer("gateLayer");
    }
    if (typeof this.map.getSource("gateSource") != "undefined") {
      this.map.removeSource("gateSource");
    }
    try {
      if (license.traffic) {
        this.trafficIncidentLayer?.setVisibility(false);
        this.map.removeControl(this.trafficIncidentClickCtrl);
        this.map.removeControl(this.trafficIncidentFilterCtrl);
      }
    } catch {
      /* empty */
    }
    if (license.truckRestriction && this.truckRestrictionLayer?.isVisible()) {
      this.map.removeControl(this.truckRestrictionClickCtrl);
      this.map.removeControl(this.truckRestrictionFilterCtrl);
      this.truckRestrictionLayer.setVisibility(false);
    }
    try {
      if (this.map.getLayer("railRouteOriginDestination")) {
        this.map.removeLayer("railRouteOriginDestination");
      }

      if (this.map.getLayer("railRouteLayer")) {
        this.map.removeLayer("railRouteLayer");
      }
      if (typeof this.map.getSource("railRouteSource") != "undefined") {
        this.map.removeSource("railRouteSource");
      }
      if (typeof this.map.getSource("railPair") != "undefined") {
        this.map.removeSource("railPair");
      }
    } catch (e) {
      /* empty */
    }
    const mapLocation = layerSpecificLocation(this.storeValue?.region);
    this.changeMapLocation(mapLocation);
  }
  addTrafficIncidentLayer() {
    this.trafficIncidentLayer?.setVisibility(true);
    this.map.addControl(this.trafficIncidentClickCtrl);
    this.map.addControl(this.trafficIncidentFilterCtrl);
    this.showLoading.next(false);
  }

  addTruckRestrictionLayer() {
    this.truckRestrictionLayer.setVisibility(true);
    this.map.addControl(this.truckRestrictionClickCtrl);
    this.map.addControl(this.truckRestrictionFilterCtrl);
    this.showLoading.next(false);
  }

  addCustomPlaceLayerNA(loc: Locate) {
    this.map.flyTo({ center: loc.center, zoom: loc.zoom });
    if (typeof this.map.getLayer("customPointsLayer") === "undefined") {
      this.map.addLayer(this.customLayers.polygonLayerNA);
      this.map.addLayer(this.customLayers.pointLayerNA);
      this.map.addLayer(this.customLayers.lineLayerNA);
      this.showLoading.next(false);
    }
  }

  addCustomPlaceLayerEU(loc: Locate) {
    this.map.flyTo({ center: loc.center, zoom: loc.zoom });
    if (typeof this.map.getLayer("customPointsLayerEU") === "undefined") {
      this.map.addLayer(this.customLayers.polygonLayerEU);
      this.map.addLayer(this.customLayers.pointLayerEU);
      this.map.addLayer(this.customLayers.lineLayerEU);
      this.showLoading.next(false);
    }
  }

  addMapRoute(routeOptions: TrimbleMaps.RouteOptions) {
    this.removeRoutes();
    try {
      this.mapRoute = new TrimbleMaps.Route(routeOptions);
      this.mapRoute.on("report", (reports: any) => {
        this.routeReports = reports;
      });
      this.mapRoute.addTo(this.map);
    } catch (e) {
      console.log("Error in creating route", e);
      this.toastService.error("Error in creating route", true);
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
    routeStops: TrimbleMaps.LngLat[],
    rtType: any,
    vehType: any,
    hwyOnly: boolean,
    tolls: TollRoadTypeEnum,
    borders: any,
    hazmat: any,
    sites: boolean,
    routeRegion: MapRegion,
    reportType: number
  ) {
    let distanceUnits;
    let routeOptions;
    if (this.storeValue?.region === TrimbleMaps.Common.Region.NA) {
      distanceUnits = TrimbleMaps.Common.DistanceUnit.MILES;
    } else {
      distanceUnits = TrimbleMaps.Common.DistanceUnit.KILOMETERS;
      hwyOnly = false;
    }

    if (reportType === 1) {
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
        reportType: [
          TrimbleMaps.Common.ReportType.MILEAGE,
          TrimbleMaps.Common.ReportType.DIRECTIONS,
          TrimbleMaps.Common.ReportType.DETAIL,
          TrimbleMaps.Common.ReportType.STATE,
          TrimbleMaps.Common.ReportType.ROAD,
        ],
      };
    } else {
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
      };
    }
    this.addMapRoute(routeOptions);
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

  addSiteLocation(siteGateGeojson: TrimbleMaps.SourceSpecification) {
    if (typeof this.map.getSource("gateSource") == "undefined") {
      this.map.addSource("gateSource", siteGateGeojson);
    }
    if (!this.map.isPlacesVisible()) {
      this.togglePlacesVisibility();
    }
    this.map.addLayer({
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

  updateSite(siteEnabled: boolean) {
    this.mapRoute.update({ useSites: siteEnabled });
  }

  addRailRouting(railGeojson: any, railGeojsonFeatures: any) {
    if (typeof this.map.getSource("railRouteSource") == "undefined") {
      this.map.addSource("railRouteSource", railGeojson);
    }
    if (typeof this.map.getSource("railPair") == "undefined") {
      this.map.addSource("railPair", railGeojsonFeatures);
    }

    this.map.addLayer({
      id: "railRouteLayer",
      type: "line",
      source: "railRouteSource",
      paint: {
        "line-color": "blue",
        "line-width": 8,
        "line-opacity": 0.5,
      },
    });

    this.map.addLayer({
      id: "railRouteOriginDestination",
      type: "symbol",
      source: "railPair",
      layout: {
        "icon-image": ["get", "icon"],
        "icon-size": ["get", "icon-size"],
        "icon-allow-overlap": true, //set to true to load all image locations, set to false to cluster images based on zoom level
      },
    });

    this.map.flyTo({ center: [-104.892532, 39.111309], zoom: 8 });

    this.railPopup
      .setLngLat([-104.829487, 38.832742])
      .setHTML(
        '<p style="font-size:.9em"><b>Location</b>: Colorado Springs, CO<br/><b>SPLC</b>: 746670000</p>'
      )
      .addTo(this.map);
  }

  centerOnMap(coords: TrimbleMaps.LngLatLike) {
    this.map.setCenter(coords);
    this.map.setZoom(15);
  }

  getRegion(): string {
    return this.storeValue.region;
  }

  removeMarker() {
    this.stopMarkers.forEach((stopMarker: TrimbleMaps.Marker) => {
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

  addMarker(locations: RouteLocation[]) {
    this.removeMarker();
    const marker: Feature[] = [];
    locations.forEach((location: any, index: number) => {
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
    const geojson: turf.helpers.FeatureCollection<any, turf.Properties> =
      turf.featureCollection(marker);

    if (typeof this.map.getSource("stopMarker") === "undefined") {
      this.addStopMarkerSource(GJFeatureCollection(geojson));
    } else {
      (this.map.getSource("stopMarker") as TrimbleMaps.GeoJSONSource).setData(
        geojson
      );
    }
  }

  addSource(id: string, data: any) {
    this.map.addSource(id, data);
  }

  addLayer(data: any, beforeId?: string) {
    this.map.addLayer(data, beforeId);
  }

  addStopMarkerSource(data: any) {
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

  removeAllEvent() {
    if (this.map) {
      // Clear all remaining listeners
      this.mapHandlerManager.removeAll();

      this.map.remove();
    }
  }
}
