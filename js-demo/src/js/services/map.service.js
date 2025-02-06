class MapService {
  map;
  apiKey;
  weatherAlertClickCtrl = new TrimbleMaps.WeatherAlertClickControl();
  weatherAlertFilterCtrl = new TrimbleMaps.WeatherAlertFilterControl();
  trafficIncidentLayer = new TrimbleMaps.TrafficIncident();
  trafficIncidentClickCtrl = new TrimbleMaps.TrafficIncidentClickControl();
  trafficIncidentFilterCtrl = new TrimbleMaps.TrafficIncidentFilterControl();
  truckRestrictionLayer = new TrimbleMaps.TruckRestriction();
  truckRestrictionClickCtrl = new TrimbleMaps.TruckRestrictionClickControl();
  roadSurfaceLegendControl = new TrimbleMaps.RoadSurfaceLegendControl();
  roadSurfaceLayer = new TrimbleMaps.RoadSurface();
  siteEnabled = false;
  popup = new TrimbleMaps.Popup();
  railPopup = new TrimbleMaps.Popup();
  regionName = TrimbleMaps.Common.Region.NA;
  routeLocations = [];
  sampleJson;
  myRoute;
  routeReports;
  init() {
    //Load the JSONs for custom content and the EU site perimeter
    loadJsons().then((sample) => {
      this.sampleJson = sample;
    });

    //Grab and set API key.
    this.apiKey = document.getElementById("keyInput").value;
    TrimbleMaps.APIKey = this.apiKey;
    //Hide modal once finished.
    $("#authModal").modal("hide");

    //Initialize thethis.map.
    this.map = new TrimbleMaps.Map({
      container: "map",
      style: TrimbleMaps.Common.Style.TRANSPORTATION,
      center: [-97, 38],
      zoom: 4
    });

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
      if (this.trafficIncidentLayer) this.trafficIncidentLayer.addTo(this.map);
      this.trafficIncidentLayer.setVisibility(false);

      //Set truck restriction layer controls.

      this.truckRestrictionLayer.addTo(this.map);
      this.truckRestrictionLayer.setVisibility(false);

      this.roadSurfaceLayer.addTo(this.map);
      this.roadSurfaceLayer.setVisibility(false);

      this.map.addControl(this.weatherAlertClickCtrl);
      this.map.addControl(this.weatherAlertFilterCtrl);
      this.map.setWeatherAlertVisibility(false);

      //Add custom layer sources.
      if (typeof this.map.getSource("customFeaturesSource") == "undefined") {
        this.map.addSource("customFeaturesSource", {
          type: "geojson",
          data: this.sampleJson.customFeaturesNA
        });
      }
    });

    this.map.on("roadsurface", () => {
      this.map.addControl(this.roadSurfaceLegendControl);
    });
  }
  resetMap() {
    //Reset the map to its default settings. Removes any content layers that were added, resets zoom, pitch and map center.

    this.siteEnabled = false;
    this.railPopup.remove();
    removeRoutes(this.myRoute);
    $("#building_3d_toast").hide();
    this.map.setPitch(0);
    this.popup.remove();
    document.getElementById("toggleSite").innerHTML = "Enable Site Routing";

    if (this.regionName == TrimbleMaps.Common.Region.NA) {
      this.map.setCenter([-97, 38]);
      this.map.setZoom(4);

      if (typeof this.map.getSource("customFeaturesSource") == "undefined") {
        this.map.addSource("customFeaturesSource", {
          type: "geojson",
          data: this.sampleJson.customFeaturesNA
        });
      }
    } else {
      this.map.setCenter([15, 50]);
      this.map.setZoom(4);

      if (typeof this.map.getSource("customFeaturesSourceEU") == "undefined") {
        this.map.addSource("customFeaturesSourceEU", {
          type: "geojson",
          data: this.sampleJson.customFeaturesEU
        });
      }
    }

    //Check and reset the individual layers
    if (this.map.isTrafficVisible()) {
      this.map.toggleTrafficVisibility();
    }

    if (this.map.isWeatherRadarVisible()) {
      this.map.toggleWeatherRadarVisibility();
    }

    if (this.map.isWeatherAlertVisible()) {
      this.map.toggleWeatherAlertVisibility();
    }

    if (this.roadSurfaceLayer?.isVisible()) {
      this.roadSurfaceLayer.setVisibility(false);
      // this.map.removeControl(this.roadSurfaceLegendControl);
    }

    if (
      this.map.getRegion() === TrimbleMaps.Common.Region.NA &&
      this.map.isPlacesVisible()
    ) {
      this.map.togglePlacesVisibility();
    }

    if (this.map.isPOIVisible()) {
      this.map.togglePOIVisibility();
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
      this.trafficIncidentLayer.setVisibility(false);
      this.map.removeControl(this.trafficIncidentClickCtrl);
      this.map.removeControl(this.trafficIncidentFilterCtrl);
    } catch {}

    try {
      if (this.truckRestrictionLayer?.isVisible()) {
        this.truckRestrictionLayer?.toggleVisibility();
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
}
