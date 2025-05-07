class RailRouting {
  mapService;
  constructor(mapService) {
    this.mapService = mapService;
  }
  getRailRoute(apiKey) {
    let promise = new Promise(async function (resolve, reject) {
      const railJsonPayload = await fetch("src/json/railJsonPayload.json");
      let requestBody = await railJsonPayload.json();

      let railRequest = new XMLHttpRequest();
      railRequest.open("POST", constants.PCM_RAIL_URL, false);
      railRequest.setRequestHeader("Content-Type", "application/json");
      railRequest.setRequestHeader("Authorization", apiKey);

      railRequest.onload = function () {
        if (railRequest.status == 200) {
          resolve(JSON.parse(railRequest.responseText));
        } else {
          reject("There is an Error!");
        }
      };
      railRequest.send(JSON.stringify(requestBody));
    });
    return promise;
  }
  enableRailRoute(apiKey) {
    this.getRailRoute(apiKey)
      .then((railResponse) => {
        const railGeojson = { type: "geojson", data: railResponse };
        const railOrigin = railResponse["geometry"]["coordinates"][0][0];
        const railDestination =
          railResponse["geometry"]["coordinates"][0][
            railResponse["geometry"]["coordinates"][0].length - 1
          ];

        const railGeojsonFeatures = {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  name: "origin",
                  icon: "poi_origin",
                  "icon-size": 0.5,
                },
                geometry: {
                  type: "Point",
                  coordinates: railOrigin,
                },
              },
              {
                type: "Feature",
                properties: {
                  name: "destination",
                  icon: "poi_destination",
                  "icon-size": 0.5,
                },
                geometry: {
                  type: "Point",
                  coordinates: railDestination,
                },
              },
            ],
          },
        };
        if (
          typeof this.mapService.map.getSource("railRouteSource") ===
          "undefined"
        ) {
          this.mapService.map.addSource("railRouteSource", railGeojson);
        }
        if (typeof this.mapService.map.getSource("railPair") === "undefined") {
          this.mapService.map.addSource("railPair", railGeojsonFeatures);
        }

        this.mapService.map.addLayer({
          id: "railRouteLayer",
          type: "line",
          source: "railRouteSource",
          paint: {
            "line-color": "blue",
            "line-width": 8,
            "line-opacity": 0.5,
          },
        });

        this.mapService.map.addLayer({
          id: "railRouteOriginDestination",
          type: "symbol",
          source: "railPair",
          layout: {
            "icon-image": ["get", "icon"],
            "icon-size": ["get", "icon-size"],
            //'icon-size': ['get', 'icon-size'], //control the icon size
            "icon-allow-overlap": true, //set to true to load all image locations, set to false to cluster images based on zoom level
          },
        });

        this.mapService.map.flyTo({
          center: [-104.892532, 39.111309],
          zoom: 8,
        });

        this.mapService.railPopup
          .setLngLat([-104.829487, 38.832742])
          .setHTML(
            '<p style="font-size:.9em"><b>Location</b>: Colorado Springs, CO<br/><b>SPLC</b>: 746670000</p>'
          )
          .addTo(this.mapService.map);
        if (document.activeElement) {
          document.activeElement.blur();
        }
        $("#railRouteModal").modal("hide");
      })
      .catch((error) => {
        $("#railRouteModal").modal("hide");
      });
  }
}
