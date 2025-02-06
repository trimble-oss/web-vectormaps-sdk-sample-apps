import { Injectable } from "@angular/core";
import { MapRegion, MapStyle } from "../models/trimbleMaps";
import { mapLocationOption } from "../models/mapLocationOption";
import {
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
  map
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

interface MapStore {
  currentStyle: MapStyle;
  mapLocation: mapLocationOption;
  region: MapRegion;
}

const INITIAL_STATE: MapStore = {
  currentStyle: TrimbleMaps.Common.Style.TRANSPORTATION,
  mapLocation: { zoom: 0, center: [0, 0] },
  region: TrimbleMaps.Common.Region.NA
};

@Injectable({
  providedIn: "root"
})
export class MapService {
  constructor(private toastService: ToastService) {}
  map!: TrimbleMaps.Map;
  private store: BehaviorSubject<MapStore> = new BehaviorSubject<MapStore>({
    ...INITIAL_STATE
  });

  readonly store$: Observable<MapStore> = this.store.asObservable();
  mapHandlerManager = new MapHandlerManager();
  popup = new TrimbleMaps.Popup();
  railPopup = new TrimbleMaps.Popup();
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

  license = new BehaviorSubject<LicenseFeature>({} as LicenseFeature);
  readonly license$ = this.license.asObservable();

  // shortcut to value
  private get storeValue(): MapStore {
    return this.store.getValue();
  }

  apiKey = new BehaviorSubject<string>("");
  readonly apiKey$ = this.apiKey.asObservable();

  // Observables for managed state
  readonly currentStyle$: Observable<MapStyle> = this.store$.pipe(
    map((s) => s.currentStyle),
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
      ...newStore
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
          center: options.center as TrimbleMaps.LngLatLike
        }
      });
    }

    this.map = new TrimbleMaps.Map(options);
    this.mapHandlerManager.setMap(this.map);

    this.mapHandlerManager.add({
      eventName: "load",
      listener: (evt: TrimbleMaps.MapEvent) => {
        this.trafficIncidentLayer = new TrimbleMaps.TrafficIncident();
        this.trafficIncidentLayer.addTo(this.map);
        this.trafficIncidentLayer.setVisibility(false);

        this.roadSurfaceLayer = new TrimbleMaps.RoadSurface();
        this.roadSurfaceLayer.addTo(this.map);
        this.roadSurfaceLayer.setVisibility(false);

        //Set truck restriction layer controls.
        this.truckRestrictionLayer = new TrimbleMaps.TruckRestriction();
        this.truckRestrictionLayer.addTo(this.map);
        this.truckRestrictionLayer.setVisibility(false);
        const ctrlClick = new TrimbleMaps.WeatherAlertClickControl();
        this.map.addControl(ctrlClick);

        const ctrlFilter = new TrimbleMaps.WeatherAlertFilterControl();
        this.map.addControl(ctrlFilter, "top-right");
        this.map.setWeatherAlertVisibility(false);

        if (typeof this.map.getSource("customFeaturesSource") === "undefined") {
          //Add custom layer sources.
          this.map.addSource("customFeaturesSource", {
            type: "geojson",
            data: this.customLayers.customFeaturesNA
          });
        }
        this.mapLoad.next(evt.target);
        this.showLoading.next(false);
      }
    });

    this.mapHandlerManager.add({
      eventName: "style.load",
      listener: (evt: TrimbleMaps.MapEvent) => {
        this.isMapStyleLoaded.next(true);
      }
    });

    this.mapHandlerManager.add({
      eventName: "truckrestriction",
      listener: (evt: TrimbleMaps.MapEvent) => {
        this.map.addControl(new TrimbleMaps.TruckRestrictionClickControl());
        this.showLoading.next(false);
      }
    });

    this.mapHandlerManager.add({
      eventName: "trafficincident",
      listener: (evt: TrimbleMaps.MapEvent) => {
        this.map.addControl(this.trafficIncidentClickCtrl);
        this.map.addControl(this.trafficIncidentFilterCtrl);
      }
    });

    this.mapHandlerManager.add({
      eventName: "weatherradar",
      listener: () => {
        this.showLoading.next(false);
      }
    });

    this.mapHandlerManager.add({
      eventName: "roadsurface",
      listener: (evt: TrimbleMaps.MapEvent) => {
        this.map.addControl(this.roadSurfaceLegendControl);
      }
    });

    return this.map;
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
    this.map.toggleTrafficVisibility();
    this.showLoading.next(false);
  }
  toggleWeatherRadarVisibility() {
    this.map.toggleWeatherRadarVisibility();
  }
  toggleWeatherAlertVisibility() {
    this.map.toggleWeatherAlertVisibility();
  }
  toggleRoadSurfaceVisibility() {
    this.roadSurfaceLayer?.setVisibility(true);
  }
  togglePlacesVisibility() {
    this.map.togglePlacesVisibility();
    this.map.setLayoutProperty("places_gates", "icon-size", 0.7);
    this.showLoading.next(false);
  }
  togglePOIVisibility() {
    this.map.togglePOIVisibility();
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
    this.toastService.clear();
    this.removeRoutes();
    this.popup.remove();
    this.railPopup.remove();
    this.setPitch(0);
    const mapInfo = mapInfoSelectedRegion(this.storeValue?.region);
    if (this.map.isTrafficVisible()) {
      this.toggleTrafficVisibility();
    }

    if (this.map.isWeatherRadarVisible()) {
      this.toggleWeatherRadarVisibility();
    }

    if (this.map.isWeatherAlertVisible()) {
      this.toggleWeatherAlertVisibility();
    }
    if (this.roadSurfaceLayer?.isVisible()) {
      this.roadSurfaceLayer.setVisibility(false);
    }

    if (
      this.map.getRegion() === TrimbleMaps.Common.Region.NA &&
      this.map.isPlacesVisible()
    ) {
      this.togglePlacesVisibility();
    }

    if (this.map.isPOIVisible()) {
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
      this.trafficIncidentLayer?.setVisibility(false);
      this.map.removeControl(this.trafficIncidentClickCtrl);
      this.map.removeControl(this.trafficIncidentFilterCtrl);
    } catch {
      /* empty */
    }
    if (this.truckRestrictionLayer?.isVisible()) {
      this.map.addControl(new TrimbleMaps.TruckRestrictionClickControl());
      this.truckRestrictionLayer.toggleVisibility();
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
    this.truckRestrictionLayer.toggleVisibility();
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
    this.mapRoute = new TrimbleMaps.Route(routeOptions);
    this.mapRoute.on("report", (reports: any) => {
      this.routeReports = reports;
    });
    this.mapRoute.addTo(this.map);
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
          TrimbleMaps.Common.ReportType.ROAD
        ]
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
        distanceUnits: distanceUnits
      };
    }
    this.addMapRoute(routeOptions);
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

  addSiteLocation(siteGateGeojson: any) {
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
        "icon-allow-overlap": true //set to true to load all image locations, set to false to cluster images based on zoom level
      }
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
        "line-opacity": 0.5
      }
    });

    this.map.addLayer({
      id: "railRouteOriginDestination",
      type: "symbol",
      source: "railPair",
      layout: {
        "icon-image": ["get", "icon"],
        "icon-allow-overlap": true //set to true to load all image locations, set to false to cluster images based on zoom level
      }
    });

    this.map.flyTo({ center: [-104.892532, 39.111309], zoom: 8 });

    this.railPopup
      .setLngLat([-104.829487, 38.832742])
      .setHTML(
        '<p style="font-size:.9em"><b>Location</b>: Colorado Springs, CO<br/><b>SPLC</b>: 746670000</p>'
      )
      .addTo(this.map);
  }

  removeAllEvent() {
    if (this.map) {
      // Clear all remaining listeners
      this.mapHandlerManager.removeAll();

      this.map.remove();
    }
  }
}
