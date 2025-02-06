class SiteRouting {
  mapService;
  constructor(mapService) {
    this.mapService = mapService;
  }

  createSiteRoute(apiKey) {
    //Add the initial route to the place location for site routing visualization
    document.getElementById("siteRouteInfo").innerHTML =
      this.getHtmlContents().htmlContents;

    let requestBody = {
      apiKey: apiKey,
    };

    //Generate bearer token for Places API.
    const placesAuthHTTP = new XMLHttpRequest();
    placesAuthHTTP.open(
      "POST",
      `${constants.API_TRIMBLEMAPS_URL}authenticate`,
      false
    );
    placesAuthHTTP.setRequestHeader("Content-Type", "application/json");
    placesAuthHTTP.send(JSON.stringify(requestBody));

    if (placesAuthHTTP.status == 200) {
      let routeCoords;
      let region;

      if (this.mapService.regionName == TrimbleMaps.Common.Region.NA) {
        routeCoords = [
          new TrimbleMaps.LngLat(-86.36886400987191, 39.6898819321506),
          new TrimbleMaps.LngLat(-86.360461, 39.689087),
          new TrimbleMaps.LngLat(-86.3559358076075, 39.68285029257417),
        ];

        region = TrimbleMaps.Common.Region.NA;
      } else {
        routeCoords = [
          new TrimbleMaps.LngLat(-0.1924264491031632, 51.41189897106568),
          new TrimbleMaps.LngLat(-0.18925654227312752, 51.41231142666759),
          new TrimbleMaps.LngLat(-0.18711562388321706, 51.413262867635),
        ];

        region = TrimbleMaps.Common.Region.EU;
      }

      createRoute(
        this.mapService,
        routeCoords,
        TrimbleMaps.Common.RouteType.PRACTICAL,
        TrimbleMaps.Common.VehicleType.TRUCK,
        false,
        TrimbleMaps.Common.TollRoadsType.USE,
        true,
        TrimbleMaps.Common.HazMatType.NONE,
        this.mapService.siteEnabled,
        region,
        0
      );

      //Create places request.
      const placesResponse = JSON.parse(placesAuthHTTP.responseText);

      const placesToken = placesResponse["token"];

      const placesInfoHTTP = new XMLHttpRequest();
      placesInfoHTTP.open(
        "GET",
        `${constants.API_TRIMBLEMAPS_URL}place/` +
          `${this.getHtmlContents().placeID}` +
          `/details`,
        false
      );
      placesInfoHTTP.setRequestHeader("Authorization", "bearer " + placesToken);
      placesInfoHTTP.send();

      const placesJSON = JSON.parse(placesInfoHTTP.responseText);

      let siteGateFeatures = [];
      let gateName;

      //Loop through site gate info to add to the geoJson.
      for (let x = 0; x < placesJSON["site"]["gates"].length; x++) {
        if (placesJSON["site"]["gates"][x]["type"] == "Entry") {
          gateName = "poi_gate_entry";
        } else if (placesJSON["site"]["gates"][x]["type"] == "Two Way") {
          gateName = "poi_gate_both";
        } else {
          gateName = "poi_gate_exit";
        }

        siteGateFeatures.push({
          type: "Feature",
          properties: {
            name: gateName + "_name",
            icon: gateName,
            "icon-size": 1,
          },
          geometry: {
            type: "Point",
            coordinates: [
              placesJSON["site"]["gates"][x]["gateToSite"]["coordinates"][
                "coordinates"
              ][0],
              placesJSON["site"]["gates"][x]["gateToSite"]["coordinates"][
                "coordinates"
              ][1],
            ],
          },
        });
      }

      const siteGateGeojson = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: siteGateFeatures,
        },
      };
      if (typeof this.mapService.map.getSource("gateSource") === "undefined") {
        this.mapService.map.addSource("gateSource", siteGateGeojson);
      }

      this.mapService.map.addLayer({
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
    $("#railRouteModal").modal("hide");
  }

  toggleSiteRoute() {
    if (this.mapService.siteEnabled) {
      document.getElementById("toggleSite").innerHTML = "Enable Site Routing";
    } else {
      document.getElementById("toggleSite").innerHTML = "Disable Site Routing";
    }

    this.mapService.siteEnabled = !this.mapService.siteEnabled;

    this.mapService.updateSite(this.mapService.siteEnabled);
  }
  getHtmlContents() {
    let htmlContents, placeID;
    if (this.mapService.regionName == TrimbleMaps.Common.Region.NA) {
      placeID = "0xZqVCm3sA0k--1OtaidIcpQ";
      this.mapService.map.togglePlacesVisibility();

      htmlContents =
        "<li>Verified Trimble Maps Places are publicly available locations that contain site information such as place name," +
        "address, operating hours, amenities and entry/exit gates.</li>" +
        "<li>Over 5 million locations with unique site geofence data (as of October 2023).</li>" +
        "<li>Site gates used in routing can increase routing accuracy for final mile stretches and alleviate driver frustration when arriving at new locations.</li>" +
        "<li>Demonstration uses geojson layer to place Trimble Maps gate icons onto the map.</li>";
    } else {
      placeID = "AmazonWarehouseDemo";
      htmlContents =
        "<li>Through the use of Content Tools, customized sites and entrance/exit gates can be created for more personalized routing.</li>" +
        "<li>Site gates used in routing can increase routing accuracy for final mile stretches and alleviate driver frustration when arriving at new locations.</li>" +
        "<li>Demonstration uses geojson layers to place Trimble Maps gate icons onto the map and fill site perimeter.</li>";

      if (
        typeof this.mapService.map.getSource("siteEUPolygon") == "undefined"
      ) {
        this.mapService.map.addSource("siteEUPolygon", {
          type: "geojson",
          data: this.mapService.sampleJson.siteEUPolygon,
        });
      }

      this.mapService.map.addLayer(this.mapService.sampleJson.siteEULayer);
    }
    return { htmlContents: htmlContents, placeID: placeID };
  }
}
