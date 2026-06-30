import { useEffect, useState } from "react";
import locationNARaw from "../Jsons/jsonPayloadUS.json?raw";
import locationEURaw from "../Jsons/jsonPayloadEU.json?raw";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { constants } from "../Utils/constants";

function buildRoutePayload(searchRegion, routeOptimization) {
  const raw =
    searchRegion === TrimbleMaps.Common.Region.NA ? locationNARaw : locationEURaw;
  const payload = JSON.parse(raw);
  payload.Settings.Method = routeOptimization;
  return payload;
}

function processTimeWindowResponse(timeWindow, dwellTime) {
  const routeStops = [];
  const optimizedList = [];
  const routeDetails = [];

  if (!timeWindow?.Stops?.length) {
    return { routeStops, routeDetails };
  }

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
    let departureHour = parseInt(optimizedList[z].arrivalTime.split(":")[0]);
    let departureMinute = parseInt(optimizedList[z].arrivalTime.split(":")[1]);

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

    routeDetails.push({
      stopNo: stopNumber,
      location: optimizedList[z].shortName,
      arrival: locationArrival,
      departure: departureTime,
      timeWindow: optimizedList[z].timeWindow,
      windowMet: optimizedList[z].timeWindowMet,
    });
  }

  return { routeStops, routeDetails };
}

function fetchTimeWindowOptimization(searchRegion, apiKey, routeOptimization) {
  return fetch(
    `${constants.SERVICE_ROUTE_URL}optimize?region=${searchRegion.toUpperCase()}&dataset=Current`,
    {
      method: "post",
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify(
        buildRoutePayload(searchRegion, routeOptimization)
      ),
    }
  ).then((res) => {
    if (!res.ok) {
      throw new Error(`Time window request failed (${res.status})`);
    }
    return res.json();
  });
}

function useTimeWindowService(searchRegion, apiKey) {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);

  const dwellTime =
    searchRegion === TrimbleMaps.Common.Region.NA ? 40 : 10;

  useEffect(() => {
    if (!apiKey || !searchRegion) {
      return;
    }

    let cancelled = false;

    Promise.all([
      fetchTimeWindowOptimization(searchRegion, apiKey, 1),
      fetchTimeWindowOptimization(searchRegion, apiKey, 2),
    ])
      .then(([optimizedResponse, unoptimizedResponse]) => {
        if (cancelled) {
          return;
        }

        setData({
          optimized: processTimeWindowResponse(optimizedResponse, dwellTime),
          unoptimized: processTimeWindowResponse(
            unoptimizedResponse,
            dwellTime
          ),
        });
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Time window routing error:", err);
          setError(err);
          setData(undefined);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchRegion, apiKey, dwellTime]);

  return { data, error };
}

export default useTimeWindowService;
