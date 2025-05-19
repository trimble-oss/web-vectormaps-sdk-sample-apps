class MapService {
  map;
  apiKey;
  trafficLayer = new TrimbleMaps.Traffic();
  weatherAlertLayer = new TrimbleMaps.WeatherAlert();
  weatherRadarLayer = new TrimbleMaps.WeatherRadar();
  pointsOfInterest = new TrimbleMaps.PointsOfInterest();
  trafficIncidentLayer = new TrimbleMaps.TrafficIncident({
    layerId: "trafficincidents",
    isVisible: false,
  });
  weatherAlertClickCtrl = new TrimbleMaps.WeatherAlertClickControl();
  weatherAlertFilterCtrl = new TrimbleMaps.WeatherAlertFilterControl();
  trafficIncidentClickCtrl = new TrimbleMaps.TrafficIncidentClickControl();
  trafficIncidentFilterCtrl = new TrimbleMaps.TrafficIncidentFilterControl();
  truckRestrictionClickCtrl = new TrimbleMaps.TruckRestrictionClickControl();
  truckRestrictionFilterCtrl = new TrimbleMaps.TruckRestrictionFilterControl();
  truckRestrictionLayer = new TrimbleMaps.TruckRestriction({
    layerId: "truckrestrictions",
    isVisible: false,
  });

  roadSurfaceLegendControl = new TrimbleMaps.RoadSurfaceLegendControl();
  roadSurfaceLayer = new TrimbleMaps.RoadSurface();
  siteEnabled = false;
  popup = new TrimbleMaps.Popup();
  railPopup = new TrimbleMaps.Popup();
  placesPopup = new TrimbleMaps.Popup();
  regionName = TrimbleMaps.Common.Region.NA;
  routeLocations = [];
  sampleJson;
  myRoute;
  routeReports;
  minzoom = 9;
  scale;
  init(licensedFeatures) {
    //Load the JSONs for custom content and the EU site perimeter
    loadJsons().then((sample) => {
      this.sampleJson = sample;
    });

    //Grab and set API key.
    this.apiKey = document.getElementById("keyInput").value;
    TrimbleMaps.setAPIKey(this.apiKey);
    //Hide modal once finished.
    if (document.activeElement) {
      document.activeElement.blur();
    }
    $("#authModal").modal("hide");
    $("#loadingModal").modal("show");
    //Initialize thethis.map.
    this.map = new TrimbleMaps.Map({
      container: "map",
      style: TrimbleMaps.Common.Style.TRANSPORTATION,
      center: [-97, 38],
      zoom: 4,
    });
    TrimbleMaps.setUnit(TrimbleMaps.Common.Unit.ENGLISH); // Set the default unit to imperial
    //Set due to page refreshing not defaulting the value back to North America, might be a bandaid for now.
    document.getElementById("mapRegionSelector").value = "North America";
    document.getElementById("mapStyle").value = "Transportation";

    //Check for div resizes.
    //For now leaving this in, even though by default the map shouldn't show any resize behavior unless the
    const resizeMap = new ResizeObserver(function () {
      //map.resize();
    });

    resizeMap.observe(document.querySelector("#map"));

    this.map.on("load", () => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      $("#loadingModal").modal("hide");
      if (licensedFeatures.includes("weather alerts")) {
        this.weatherAlertLayer.addTo(this.map);
        this.weatherAlertLayer.setVisibility(false);
      }

      this.weatherRadarLayer.addTo(this.map);
      this.weatherRadarLayer.setVisibility(false);

      this.pointsOfInterest.addTo(this.map);
      this.map.addControl(this.weatherAlertClickCtrl);
      this.map.addControl(this.weatherAlertFilterCtrl);
      this.map.addControl(new TrimbleMaps.PlaceClickControl());
      if (this.trafficIncidentLayer && licensedFeatures.includes("traffic")) {
        this.trafficIncidentLayer = new TrimbleMaps.TrafficIncident({
          layerId: "trafficincidents",
          isVisible: false,
        });
        this.trafficLayer.addTo(this.map);
        this.trafficIncidentLayer.addTo(this.map);
        this.trafficIncidentLayer.setVisibility(false);
      }

      //Set truck restriction layer controls.
      if (licensedFeatures.includes("truck restrictions on map")) {
        this.truckRestrictionLayer.addTo(this.map);
        this.truckRestrictionLayer.setVisibility(false);
      }
      if (licensedFeatures.includes("road surface")) {
        this.roadSurfaceLayer.addTo(this.map);
        this.roadSurfaceLayer.setVisibility(false);
      }

      //Add custom layer sources.
      if (typeof this.map.getSource("customFeaturesSource") == "undefined") {
        this.map.addSource("customFeaturesSource", {
          type: "geojson",
          data: this.sampleJson.customFeaturesNA,
        });
      }
    });

    this.map.on("roadsurface", () => {
      this.map.addControl(this.roadSurfaceLegendControl);
    });
    this.map.on("weatheralert", () => {});
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
  }
  resetMap() {
    //Reset the map to its default settings. Removes any content layers that were added, resets zoom, pitch and map center.
    const licensedFeatures = localStorage.getItem("licensedFeatures");
    this.siteEnabled = false;
    this.railPopup.remove();
    removeRoutes(this.myRoute);
    $("#building_3d_toast").hide();
    this.map.setPitch(0);
    this.popup.remove();
    this.removeStops();
    document.getElementById("toggleSite").innerHTML = "Enable Site Routing";

    if (this.regionName == TrimbleMaps.Common.Region.NA) {
      this.map.setCenter([-97, 38]);
      this.map.setZoom(4);

      if (typeof this.map.getSource("customFeaturesSource") == "undefined") {
        this.map.addSource("customFeaturesSource", {
          type: "geojson",
          data: this.sampleJson.customFeaturesNA,
        });
      }
    } else {
      this.map.setCenter([15, 50]);
      this.map.setZoom(4);

      if (typeof this.map.getSource("customFeaturesSourceEU") == "undefined") {
        this.map.addSource("customFeaturesSourceEU", {
          type: "geojson",
          data: this.sampleJson.customFeaturesEU,
        });
      }
    }

    //Check and reset the individual layers
    if (licensedFeatures.includes("traffic") && this.trafficLayer.isVisible()) {
      this.trafficLayer.toggleVisibility();
    }
    if (
      licensedFeatures.includes("weather") &&
      this.weatherRadarLayer.isVisible()
    ) {
      this.weatherRadarLayer.toggleVisibility();
    }
    if (
      licensedFeatures.includes("weather alerts") &&
      this.weatherAlertLayer.isVisible()
    ) {
      this.weatherAlertLayer.toggleVisibility();
    }
    if (
      licensedFeatures.includes("road surface") &&
      this.roadSurfaceLayer.isVisible()
    ) {
      this.roadSurfaceLayer.setVisibility(false);
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

    //Traffic incident layer is setup different than the others
    try {
      if (licensedFeatures.includes("traffic")) {
        this.trafficIncidentLayer.setVisibility(false);
        this.map.removeControl(this.trafficIncidentClickCtrl);
        this.map.removeControl(this.trafficIncidentFilterCtrl);
      }
    } catch {}

    try {
      if (licensedFeatures.includes("truck restrictions on map")) {
        if (this.truckRestrictionLayer?.isVisible()) {
          this.map.removeControl(this.truckRestrictionClickCtrl);
          this.map.removeControl(this.truckRestrictionFilterCtrl);
          this.truckRestrictionLayer.setVisibility(false);
        }
      }
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
    } catch (e) {}
  }
  clearRouteLocation() {
    this.routeLocations.length = 0;
  }
  updateSite(siteEnabled) {
    this.myRoute.update({ useSites: siteEnabled });
  }
  toggleRoadSurfaceVisibility() {
    this.roadSurfaceLayer.setVisibility(true);
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
  togglePOIVisibility() {
    this.pointsOfInterest.toggleVisibility();
  }

  centerOnMap(coords) {
    this.map.setCenter(coords);
    this.map.setZoom(15);
  }

  getRegion() {
    return this.map.getRegion();
  }

  removeStops() {
    if (this.map.getLayer("stopMarker")) {
      this.map.removeLayer("stopMarker");
      this.map.removeLayer("stopMarkerLabel");
      this.map.removeSource("stopMarker");
    }
  }

  addMarker(locations) {
    // this.removeMarker();
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
      this.addStopMarkerSource(this.geojsonFeatureCollection(geojson));
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

  geojsonFeatureCollection(featureCollection) {
    return {
      type: "geojson",
      data: featureCollection,
    };
  }
}
