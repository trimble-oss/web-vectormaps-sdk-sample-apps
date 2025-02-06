import { useEffect, useState } from "react";
import * as LocationNA from "../Jsons/jsonPayloadUS.json";
import * as LocationEU from "../Jsons/jsonPayloadEU.json";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { constants } from "../Utils/constants";

function useTimeWindowService(routeOptimization, searchRegion, apiKey) {
  const [data, setData] = useState(undefined);

  let regionLocation, dwellTime;

  if (searchRegion === TrimbleMaps.Common.Region.NA) {
    regionLocation = LocationNA;

    dwellTime = 40;
  } else {
    regionLocation = LocationEU;

    dwellTime = 10;
  }
  regionLocation["Settings"]["Method"] = routeOptimization;

  useEffect(() => {
    fetch(
      `${
        constants.SERVICE_ROUTE_URL
      }optimize?region=${searchRegion.toUpperCase()}&dataset=Current`,

      {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: apiKey },
        body: JSON.stringify(regionLocation),
      }
    )
      .then((res) => res.json())
      .then((timeWindow) => {
        let routeStops = [],
          optimizedList = [];
        let routeDetails = [];
        timeWindow.Stops.forEach((stop) => {
          optimizedList.push({
            shortName: stop["Location"]["Label"],
            arrivalTime: stop["ETA"],
            timeWindow:
              stop["TimeWindow"]["StartTime"] +
              "-" +
              stop["TimeWindow"]["EndTime"],
            timeWindowMet: stop["TimeWindowMet"],
            lat: stop["Location"]["Coords"]["Lat"],
            lon: stop["Location"]["Coords"]["Lon"],
          });
          routeStops.push(
            new TrimbleMaps.LngLat(
              stop["Location"]["Coords"]["Lon"],
              stop["Location"]["Coords"]["Lat"]
            )
          );
        });

        for (let z = 0; z < optimizedList.length; z++) {
          //Create departure time
          let departureHour = parseInt(
            optimizedList[z].arrivalTime.split(":")[0]
          );
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
            departureHour = 0 + departureHour;
          }

          if (departureMinute < 10) {
            departureMinute = 0 + departureMinute;
          }

          let departureTime = departureHour + ":" + departureMinute;

          //Account for DC info
          let locationArrival;
          if (z === 0) {
            locationArrival = "N/A";
            departureTime = optimizedList[z].arrivalTime;
          } else if (z === optimizedList.length - 1) {
            locationArrival = optimizedList[z].arrivalTime;
            departureTime = "N/A";
          } else {
            locationArrival = optimizedList[z].arrivalTime;
          }

          let stopNumber;

          if (z === 0) {
            stopNumber = "Origin";
          } else if (z === optimizedList.length - 1) {
            stopNumber = "Destination";
          } else {
            stopNumber = z.toString();
          }

          const routeDetail = {
            stopNo: stopNumber,
            location: optimizedList[z].shortName,
            arrival: locationArrival,
            departure: departureTime,
            timeWindow: optimizedList[z].timeWindow,
            windowMet: optimizedList[z].timeWindowMet,
          };

          routeDetails.push(routeDetail);
        }
        setData({ routeStops: routeStops, routeDetails: routeDetails });
      });
  }, [routeOptimization]);
  return data;
}
export default useTimeWindowService;
