class Routing {
  searchRegion;
  dataVersion;
  singlesearchLocationList = {};
  routeLocations = [];
  regionName;
  apiKey;
  myRoute;
  mapService;
  locationListContents = [];
  stopsList = [];
  constructor(mapService) {
    this.regionName = mapService.regionName;
    this.myRoute = mapService.myRoute;
    this.mapService = mapService;
    this.routeLocations = mapService.routeLocations;
  }
  singlesearchLookup(apiKey, regionName, input) {
    this.regionName = regionName;
    let timeout;

    document
      .getElementById("routeLocationInput")
      .classList.remove("is-invalid");

    if (input.trim() != "") {
      document.getElementById("singleSearchLoading").removeAttribute("hidden");

      clearTimeout(timeout);
      document.getElementById("locationSelection").innerHTML = "";

      //Fires off the single search request .5 seconds after done typing
      timeout = setTimeout(() => {
        if (this.regionName == TrimbleMaps.Common.Region.NA) {
          this.searchRegion = "NA";
          this.dataVersion = TrimbleMaps.Common.Region.NA;
        } else {
          this.searchRegion = "EU";
          this.dataVersion = TrimbleMaps.Common.Region.EU;
        }

        //Create singlesearch geocode queries.
        const geocodeURL =
          constants.SINGLE_SEARCH_URL +
          this.searchRegion +
          "/api/search?authToken=" +
          apiKey +
          "&query=" +
          input +
          "&maxResults=5";

        //Geocode the location.
        const geocodeHTTP = new XMLHttpRequest();
        geocodeHTTP.open("GET", geocodeURL, false);
        // geocodeHTTP.setRequestHeader("Authorization", mapService.apiKey);
        geocodeHTTP.send();

        const geocodeStatus = geocodeHTTP.status;

        if (geocodeStatus == 200) {
          this.singlesearchLocationList = JSON.parse(geocodeHTTP.responseText);

          if (this.singlesearchLocationList["Locations"].length > 0) {
            let listContents = "";

            for (
              let x = 0;
              x < this.singlesearchLocationList["Locations"].length;
              x++
            ) {
              listContents +=
                '<li class="list-group-item" role="button">' +
                this.singlesearchLocationList["Locations"][x]["ShortString"] +
                "</li>";
            }

            document
              .getElementById("locationSelectionDiv")
              .removeAttribute("hidden");
            document.getElementById("locationSelection").innerHTML =
              listContents;
          } else {
            document
              .getElementById("routeLocationInput")
              .classList.add("is-invalid");
            document.getElementById("singleSearchErrorText").innerHTML =
              "No results found.";
            document
              .getElementById("locationSelectionDiv")
              .setAttribute("hidden", null);
          }

          document
            .getElementById("singleSearchLoading")
            .setAttribute("hidden", null);
        } else {
          document
            .getElementById("routeLocationInput")
            .classList.add("is-invalid");
          document.getElementById("singleSearchErrorText").innerHTML =
            "Single search API error. Please try again";
          document
            .getElementById("singleSearchLoading")
            .setAttribute("hidden", null);
        }
      }, 500);
    } else {
      document.getElementById("singleSearchErrorText").innerHTML =
        "Please enter a location.";
      document
        .getElementById("singleSearchLoading")
        .setAttribute("hidden", null);
    }
  }

  addTableRow() {
    const container = document.getElementById("locationListTable");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "w-100";

    // Header row
    const headerRow = document.createElement("tr");
    headerRow.className = "route-stop-row";

    const th1 = document.createElement("th");
    th1.colSpan = 2;

    const th2 = document.createElement("th");
    th2.className = "route-stop-detail-cell";

    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
    table.appendChild(headerRow);

    // Data rows
    this.locationListContents.forEach((stop, index) => {
      const row = document.createElement("tr");
      row.className = "route-stop-row";

      const iconCell = document.createElement("td");
      iconCell.className = "route-stop-icon-cell";

      if (this.stopsList.length > 0) {
        const line = document.createElement("span");
        line.className = "route-stop-line";

        if (this.stopsList.length > 1 && index === 0) {
          line.classList.add("top");
        } else if (
          index === this.locationListContents.length - 1 &&
          index !== 0
        ) {
          line.classList.add("bottom");
        } else if (
          index !== 0 &&
          index !== this.locationListContents.length - 1
        ) {
          line.classList.add("middle");
        }

        iconCell.appendChild(line);
      }

      if (stop.stopType === "O" || stop.stopType === "D") {
        const circle = document.createElement("span");
        circle.className = "route-stop-circle";
        if (stop.stopType === "O") circle.classList.add("origin");
        if (stop.stopType === "D") circle.classList.add("destination");
        iconCell.appendChild(circle);
      }

      if (stop.stopType === "S") {
        const number = document.createElement("span");
        number.className = "route-stop-number routeColor";
        number.textContent = index;
        iconCell.appendChild(number);
      }

      const addressCell = document.createElement("td");
      addressCell.className = "route-stop-address";
      const addressDiv = document.createElement("div");
      addressDiv.className = "font-weight-bolder";
      addressDiv.textContent = stop.shortAddress;
      addressCell.appendChild(addressDiv);

      row.appendChild(iconCell);
      row.appendChild(addressCell);

      table.appendChild(row);
    });

    container.appendChild(table);
  }
  locationSelect(event) {
    this.locationListContents = [];
    document.getElementById("locationList").removeAttribute("hidden");
    document.getElementById("routeLocationInput").value = "";
    document
      .getElementById("locationSelectionDiv")
      .setAttribute("hidden", null);

    for (
      let i = 0;
      i < this.singlesearchLocationList["Locations"].length;
      i++
    ) {
      if (
        event.target.innerText ==
        this.singlesearchLocationList["Locations"][i]["ShortString"]
      ) {
        this.routeLocations.push({
          coord: new TrimbleMaps.LngLat(
            this.singlesearchLocationList["Locations"][i]["Coords"]["Lon"],
            this.singlesearchLocationList["Locations"][i]["Coords"]["Lat"]
          ),
          address: this.singlesearchLocationList["Locations"][i]["ShortString"],
        });
        this.stopsList = this.routeLocations.map((s) => s.address);
        this.mapService.centerOnMap([
          this.singlesearchLocationList["Locations"][i]["Coords"]["Lon"],
          this.singlesearchLocationList["Locations"][i]["Coords"]["Lat"],
        ]);
        this.mapService.addMarker(this.routeLocations);
      }
    }

    if (this.routeLocations.length > 2) {
      document
        .getElementById("routeLocationInput")
        .setAttribute("disabled", null);
      document.getElementById("routeLocationInput").placeholder =
        "This sample app is limited to a max of three stops";
    }
    if (this.routeLocations.length > 1) {
      document.getElementById("routeBtn").disabled = false;
    }
    this.locationListContents = this.stopsList.map((s, index) =>
      this.transformStops(s, index, this.stopsList)
    );
    this.addTableRow();
  }

  transformStops(shortAddress, index, stopState) {
    let stopType = "S";
    if (index === 0) {
      stopType = "O";
    } else if (index === stopState.length - 1) {
      stopType = "D";
    }
    return {
      stopType,
      shortAddress,
    };
  }

  addRouteLayer(enableReportBtn) {
    //Geocodes the origin and destination, and if they are valid will add the route to the map.
    removeRoutes(this.mapService.myRoute);

    let rtType, vehType, hazmat, tolls;

    if (document.getElementById("vehicleType").value == "Truck") {
      vehType = TrimbleMaps.Common.VehicleType.TRUCK;
    } else if (document.getElementById("vehicleType").value == "Light Truck") {
      vehType = TrimbleMaps.Common.VehicleType.LIGHT_TRUCK;
    } else {
      vehType = TrimbleMaps.Common.VehicleType.AUTOMOBILE;
    }

    if (document.getElementById("routeType").value == "Practical") {
      rtType = TrimbleMaps.Common.RouteType.PRACTICAL;
    } else if (document.getElementById("routeType").value == "Shortest") {
      rtType = TrimbleMaps.Common.RouteType.SHORTEST;
    } else {
      rtType = TrimbleMaps.Common.RouteType.FASTEST;
    }

    switch (document.getElementById("hazMat").value) {
      case "None":
        hazmat = TrimbleMaps.Common.HazMatType.NONE;
        break;

      case "General":
        hazmat = TrimbleMaps.Common.HazMatType.GENERAL;
        break;

      case "Caustic":
        hazmat = TrimbleMaps.Common.HazMatType.CAUSTIC;
        break;

      case "Explosives":
        hazmat = TrimbleMaps.Common.HazMatType.EXPLOSIVES;
        break;

      case "Flammable":
        hazmat = TrimbleMaps.Common.HazMatType.FLAMMABLE;
        break;

      case "Inhalants":
        hazmat = TrimbleMaps.Common.HazMatType.INHALANTS;
        break;

      case "Radioactive":
        hazmat = TrimbleMaps.Common.HazMatType.RADIOACTIVE;
        break;
    }

    if (document.getElementById("avoidTolls").checked) {
      tolls = TrimbleMaps.Common.TollRoadsType.AVOID_IF_POSSIBLE;
    } else {
      tolls = TrimbleMaps.Common.TollRoadsType.USE;
    }
    const stops = this.routeLocations.map((location) => location.coord);
    createRoute(
      this.mapService,
      stops,
      rtType,
      vehType,
      document.getElementById("routingHighwayOnly").checked,
      tolls,
      document.getElementById("bordersOpen").checked,
      hazmat,
      false,
      this.dataVersion,
      1,
      enableReportBtn
    );
  }

  createReports() {
    let mileageType;
    let routeReports = this.mapService.routeReports;
    if (this.regionName == TrimbleMaps.Common.Region.NA) {
      mileageType = "Miles";
    } else {
      mileageType = "Kilometres";
    }

    for (let x = 0; x < Object.keys(routeReports).length; x++) {
      if (typeof routeReports[x] != "undefined") {
        let tableContents = "";

        if (
          routeReports[x]["__type"] ==
          "MileageReport:http://pcmiler.alk.com/APIs/v1.0"
        ) {
          document.getElementById("mileageTableHeader").innerHTML =
            '<tr><th scope="col">Location</th>' +
            '<th scope="col">Leg ' +
            mileageType +
            "</th>" +
            '<th scope="col">Cumulative ' +
            mileageType +
            "</th>" +
            '<th scope="col">Leg Drive Time</th>' +
            '<th scope="col">Cumulative Drive Time</th></tr>';

          for (let i = 0; i < routeReports[x]["ReportLines"].length; i++) {
            let locationName = "";

            if (
              routeReports[x]["ReportLines"][i]["Stop"]["Address"][
                "StreetAddress"
              ] != ""
            ) {
              locationName +=
                routeReports[x]["ReportLines"][i]["Stop"]["Address"][
                  "StreetAddress"
                ] + ", ";
            }

            if (
              routeReports[x]["ReportLines"][i]["Stop"]["Address"]["City"] != ""
            ) {
              locationName +=
                routeReports[x]["ReportLines"][i]["Stop"]["Address"]["City"] +
                ", ";
            }

            if (
              routeReports[x]["ReportLines"][i]["Stop"]["Address"]["State"] !=
              ""
            ) {
              locationName +=
                routeReports[x]["ReportLines"][i]["Stop"]["Address"]["State"] +
                ", ";
            }

            if (routeReports[x]["ReportLines"][i]["Stop"]["Address"]["Zip"]) {
              locationName +=
                routeReports[x]["ReportLines"][i]["Stop"]["Address"]["Zip"];
            }

            tableContents +=
              "<tr>" +
              "<td>" +
              locationName +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["LMiles"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["TMiles"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["LHours"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["THours"] +
              "</td></tr>";
          }

          document.getElementById("mileageTableBody").innerHTML = tableContents;
        } else if (
          routeReports[x]["__type"] ==
          "DetailReport:http://pcmiler.alk.com/APIs/v1.0"
        ) {
          document.getElementById("detailTableHeader").innerHTML =
            '<tr><th scope="col">Stop</th>' +
            '<th scope="col">' +
            mileageType +
            "</th>" +
            '<th scope="col">Time</th>' +
            '<th scope="col">Interchange</th>' +
            '<th scope="col">Cumulative ' +
            mileageType +
            "</th>" +
            '<th scope="col">Cumulative Drive Time</th>' +
            '<th scope="col">Toll Plaza</th>' +
            '<th scope="col">Toll Cost</th></tr>';

          for (let y = 0; y < routeReports[x]["ReportLegs"].length; y++) {
            for (
              let i = 0;
              i < routeReports[x]["ReportLegs"][y]["ReportLines"].length;
              i++
            ) {
              let routeStop;
              let tollPlaza = "";

              if (
                i == 0 ||
                i == routeReports[x]["ReportLegs"][y]["ReportLines"].length - 1
              ) {
                routeStop =
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Stop"];
              } else {
                routeStop =
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Route"];
              }

              if (
                routeReports[x]["ReportLegs"][y]["ReportLines"][i][
                  "TollPlazaName"
                ] != null
              ) {
                tollPlaza =
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i][
                    "TollPlazaName"
                  ];
              }

              if (
                routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Route"] !=
                null
              ) {
                let tollAmount;

                if (
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["LToll"] !=
                  null
                ) {
                  tollAmount =
                    routeReports[x]["ReportLegs"][y]["ReportLines"][i]["LToll"];
                } else {
                  tollAmount = "0.00";
                }

                tableContents +=
                  "<tr>" +
                  "<td>" +
                  routeStop +
                  "</td>" +
                  "<td>" +
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Miles"] +
                  "</td>" +
                  "<td>" +
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Time"] +
                  "</td>" +
                  "<td>" +
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i][
                    "InterCh"
                  ] +
                  "</td>" +
                  "<td>" +
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["TMiles"] +
                  "<td>" +
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["TTime"] +
                  "</td>" +
                  "<td>" +
                  tollPlaza +
                  "</td>" +
                  "<td>" +
                  tollAmount +
                  "</td></tr>";
              }
            }
          }

          document.getElementById("detailTableBody").innerHTML = tableContents;
        } else if (
          routeReports[x]["__type"] ==
          "StateReport:http://pcmiler.alk.com/APIs/v1.0"
        ) {
          for (let i = 0; i < routeReports[x]["StateReportLines"].length; i++) {
            tableContents +=
              "<tr>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["StCntry"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Total"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Toll"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Free"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Ferry"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Loaded"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Empty"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Tolls"] +
              "</td>" +
              "<td>" +
              routeReports[x]["StateReportLines"][i]["Energy"] +
              "</td></tr>";
          }
          document.getElementById("stateTableBody").innerHTML = tableContents;
        } else if (
          routeReports[x]["__type"] ==
          "DirectionsReport:http://pcmiler.alk.com/APIs/v1.0"
        ) {
          for (let y = 0; y < routeReports[x]["ReportLegs"].length; y++) {
            for (
              let i = 0;
              i < routeReports[x]["ReportLegs"][y]["ReportLines"].length;
              i++
            ) {
              let mileage, time;
              if (
                routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Dist"] ==
                null
              ) {
                mileage = "";
              } else {
                mileage =
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Dist"];
              }

              if (
                routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Time"] ==
                null
              ) {
                time = "";
              } else {
                time =
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Time"];
              }

              if (
                routeReports[x]["ReportLegs"][y]["ReportLines"][i]["Begin"] !=
                null
              ) {
                tableContents +=
                  "<tr>" +
                  "<td>" +
                  routeReports[x]["ReportLegs"][y]["ReportLines"][i][
                    "Direction"
                  ] +
                  "</td>" +
                  "<td>" +
                  mileage +
                  "</td>" +
                  "<td>" +
                  time +
                  "</td></tr>";
              }
            }
          }

          document.getElementById("directionsTableBody").innerHTML =
            tableContents;
        } else if (
          routeReports[x]["__type"] ==
          "RoadReport:http://pcmiler.alk.com/APIs/v1.0"
        ) {
          for (let i = 0; i < routeReports[x]["ReportLines"].length; i++) {
            let location = "";
            try {
              if (
                routeReports[x]["ReportLines"][i]["Stop"]["Address"][
                  "StreetAddress"
                ] != ""
              ) {
                location +=
                  routeReports[x]["ReportLines"][i]["Stop"]["Address"][
                    "StreetAddress"
                  ] + ", ";
              }

              if (
                routeReports[x]["ReportLines"][i]["Stop"]["Address"]["City"] !=
                ""
              ) {
                location +=
                  routeReports[x]["ReportLines"][i]["Stop"]["Address"]["City"] +
                  " ";
              }

              if (
                routeReports[x]["ReportLines"][i]["Stop"]["Address"]["State"] !=
                ""
              ) {
                location +=
                  routeReports[x]["ReportLines"][i]["Stop"]["Address"][
                    "State"
                  ] + ", ";
              }

              if (
                routeReports[x]["ReportLines"][i]["Stop"]["Address"]["Zip"] !=
                ""
              ) {
                location +=
                  routeReports[x]["ReportLines"][i]["Stop"]["Address"]["Zip"];
              }
            } catch (err) {
              location = "TOTAL";
            }

            tableContents +=
              "<tr>" +
              "<td>" +
              location +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["LMiles"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["InterSt"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Divide"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Prime"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Ferry"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Second"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Ramp"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Local"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Pathway"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Toll"] +
              "</td>" +
              "<td>" +
              routeReports[x]["ReportLines"][i]["Energy"] +
              "</td></tr>";
          }
          document.getElementById("roadTableBody").innerHTML = tableContents;
        }
      }
    }

    $("#reportsModal").modal("show");
  }
}
