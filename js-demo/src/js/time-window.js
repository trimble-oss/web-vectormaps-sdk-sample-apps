class TimeWindowRouting {
  unoptimizedTimeWindowRoute;
  optimizedTimeWindowRoute;
  unOptimizedTimeWindowTableContents;
  optimizedTimeWindowTableContents;
  routeOptimization;
  mapService;
  constructor(mapService) {
    this.mapService = mapService;
  }
  toggleTimeWindowRouting() {
    //Toggle the time window table results and display for the route
    removeRoutes(this.mapService.myRoute);
    this.setTimeWindowRoutingText();
    const timeWindowRoute =
      this.routeOptimization == 2
        ? this.unoptimizedTimeWindowRoute
        : this.optimizedTimeWindowRoute;
    const tableContents =
      this.routeOptimization == 2
        ? this.unOptimizedTimeWindowTableContents
        : this.optimizedTimeWindowTableContents;
    this.routeOptimization = this.routeOptimization == 2 ? 1 : 2;

    document.getElementById("optimizeBtn").innerHTML = "Optimize";

    document.getElementById("optimizeBtn").innerHTML =
      this.routeOptimization == 2 ? "Revert" : "Optimize";

    createRoute(
      this.mapService,
      timeWindowRoute,
      TrimbleMaps.Common.RouteType.PRACTICAL,
      TrimbleMaps.Common.VehicleType.TRUCK,
      false,
      TrimbleMaps.Common.TollRoadsType.USE,
      false,
      TrimbleMaps.Common.HazMatType.NONE,
      false,
      this.mapService.regionName,
      0
    );

    document.getElementById("timeWindowTable").innerHTML = tableContents;
    if (document.activeElement) {
      document.activeElement.blur();
    }
    $("#timeWindowModal").modal("hide");
  }

  async getTimeWindowRequest(x, regionName, apiKey) {
    let regionLocation;

    if (regionName == TrimbleMaps.Common.Region.NA) {
      const jsonPayloadUS = await fetch("src/json/jsonPayloadUS.json");
      regionLocation = await jsonPayloadUS.json();
    } else {
      const jsonPayloadEU = await fetch("src/json/jsonPayloadEU.json");
      regionLocation = await jsonPayloadEU.json();
    }

    let promise = new Promise(async function (resolve, reject) {
      // const response = await fetch(regionLocation);
      let requestBody = regionLocation;

      requestBody["Settings"]["Method"] = x; //Set it for either as-is or to optimize

      let timeWindowRequest = new XMLHttpRequest();
      timeWindowRequest.open(
        "POST",
        `${
          constants.SERVICE_ROUTE_URL
        }optimize?region=${regionName.toUpperCase()}&dataset=Current`,
        false
      );
      timeWindowRequest.setRequestHeader("Content-Type", "application/json");
      timeWindowRequest.setRequestHeader("Authorization", apiKey);

      timeWindowRequest.onload = function () {
        if (timeWindowRequest.status == 200) {
          resolve(JSON.parse(timeWindowRequest.responseText));
        } else {
          reject("There is an Error!");
        }
      };
      timeWindowRequest.send(JSON.stringify(requestBody));
    });
    return promise;
  }
  calculateTimeWindows(regionName, apiKey) {
    //send time window requests for unoptimized and optimized and store the results
    //Need to set the function within an "on show" event for the modal, otherwise the modal doesn't show at the correct time

    Promise.all([
      this.getTimeWindowRequest(1, regionName, apiKey),
      this.getTimeWindowRequest(2, regionName, apiKey),
    ]).then((values) => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      $("#timeWindowModal").modal("hide");

      for (let x = 0; x < values.length; x++) {
        const timeWindowJson = values[x];
        let routeStops = [];
        let optimizedList = [];
        //Create the info for table and route
        for (let y = 0; y < timeWindowJson["Stops"].length; y++) {
          optimizedList.push({
            shortName: timeWindowJson["Stops"][y]["Location"]["Label"],
            arrivalTime: timeWindowJson["Stops"][y]["ETA"],
            timeWindow:
              timeWindowJson["Stops"][y]["TimeWindow"]["StartTime"] +
              "-" +
              timeWindowJson["Stops"][y]["TimeWindow"]["EndTime"],
            timeWindowMet: timeWindowJson["Stops"][y]["TimeWindowMet"],
            lat: timeWindowJson["Stops"][y]["Location"]["Coords"]["Lat"],
            lon: timeWindowJson["Stops"][y]["Location"]["Coords"]["Lon"],
          });

          routeStops.push(
            new TrimbleMaps.LngLat(
              timeWindowJson["Stops"][y]["Location"]["Coords"]["Lon"],
              timeWindowJson["Stops"][y]["Location"]["Coords"]["Lat"]
            )
          );
        }

        if (x == 1) {
          this.unoptimizedTimeWindowRoute = routeStops;
          this.unOptimizedTimeWindowTableContents =
            this.getTableContent(optimizedList);
        } else {
          this.optimizedTimeWindowRoute = routeStops;
          this.optimizedTimeWindowTableContents =
            this.getTableContent(optimizedList);
        }
        this.routeOptimization = 2;
      }
      this.toggleTimeWindowRouting();
      if (document.activeElement) {
        document.activeElement.blur();
      }
      $("#timeWindowModal").modal("hide");
    });
  }
  getTableHeader() {
    return (
      "<tr>" +
      "<th>" +
      "Stop #" +
      "</th>" +
      "<th>" +
      "Location" +
      "</th>" +
      "<th>" +
      "Arrival" +
      "</th>" +
      "<th>" +
      "Departure" +
      "</th>" +
      "<th><center>" +
      "Time Window" +
      "</center></th>" +
      "<th><center>" +
      "Window Met" +
      "</center></th>"
    );
  }
  getTableContent(optimizedList) {
    const dwellTime =
      this.mapService.regionName == TrimbleMaps.Common.Region.NA ? 40 : 10;
    let tableContents = "";
    tableContents = this.getTableHeader();
    for (let z = 0; z < optimizedList.length; z++) {
      let arrived;

      if (optimizedList[z].timeWindowMet == true) {
        arrived =
          '<i class="modus-icons" aria-hidden="true" style="color: green;">check_circle</i>';
      } else {
        arrived =
          '<i class="modus-icons" aria-hidden="true" style="color: red;">warning</i></i>';
      }
      //Create departure time
      let departureHour = parseInt(optimizedList[z].arrivalTime.split(":")[0]);
      let departureMinute = parseInt(
        optimizedList[z].arrivalTime.split(":")[1]
      );

      if (departureMinute + dwellTime >= 60) {
        departureHour++;
        departureMinute = departureMinute + dwellTime - 60;
      } else {
        departureMinute += dwellTime;
      }

      if (departureHour < 10) {
        departureHour = "0" + departureHour;
      }

      if (departureMinute < 10) {
        departureMinute = "0" + departureMinute;
      }

      let departureTime = departureHour + ":" + departureMinute;

      //Account for DC info
      let locationArrival;
      if (z == 0) {
        locationArrival = "N/A";
        departureTime = optimizedList[z].arrivalTime;
      } else if (z == optimizedList.length - 1) {
        locationArrival = optimizedList[z].arrivalTime;
        departureTime = "N/A";
      } else {
        locationArrival = optimizedList[z].arrivalTime;
      }

      let stopNumber;

      if (z == 0) {
        stopNumber = "Origin";
      } else if (z == optimizedList.length - 1) {
        stopNumber = "Destination";
      } else {
        stopNumber = z.toString();
      }
      tableContents +=
        "<tr>" +
        "<td>" +
        stopNumber +
        "</td>" +
        "<td>" +
        optimizedList[z].shortName +
        "</td>" +
        "<td>" +
        locationArrival +
        "</td>" +
        "<td>" +
        departureTime +
        "</td>" +
        "<td><center>" +
        optimizedList[z].timeWindow +
        "</center></td>" +
        "<td><center>" +
        arrived +
        "</center></td>";
    }
    return tableContents;
  }
  setTimeWindowRoutingText() {
    let titleText, displayText;
    titleText = "Route Optimization";
    displayText =
      '<li> Ability to feed in locations with time windows for optimization, will provide the best route path that accommodates as many time windows as possible, while returning locations that do not fit based on their time window information.</li><li>Utilizes the Time Window Routing API (<a href="https://developer.trimblemaps.com/restful-apis/routing/time-window-routing/" target="_blank">Documentation</a>).</li><li>Sample locations optimized assuming 40 minute dwell times at each location.</li>';
    document.getElementById("timeWindowRoutingTitle").innerHTML = titleText;
    document.getElementById("timeWindowRoutingText").innerHTML = displayText;
  }
}
