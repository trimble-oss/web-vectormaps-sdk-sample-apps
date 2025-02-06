import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MapService } from "./map.service";
import * as LocationNA from "../json/jsonPayloadUS.json";
import * as LocationEU from "../json/jsonPayloadEU.json";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { map } from "rxjs";
import { constants } from "../utils/constants";
@Injectable({
  providedIn: "root",
})
export class TimeWindowRoutingService {
  constructor(private http: HttpClient, private mapService: MapService) {}
  getTimeWindowOptimization(
    searchRegion: string,
    routeOptimization: number
  ): any {
    let regionLocation: any, region, optimizeRegion, dwellTime: number;
    const routeDetails: any = [];
    if (searchRegion === TrimbleMaps.Common.Region.NA) {
      regionLocation = LocationNA;
      region = "NA";
      optimizeRegion = TrimbleMaps.Common.Region.NA;
      dwellTime = 40;
    } else {
      regionLocation = LocationEU;
      region = "EU";
      optimizeRegion = TrimbleMaps.Common.Region.EU;
      dwellTime = 10;
    }

    regionLocation["Settings"]["Method"] = routeOptimization;
    const header = new HttpHeaders()
      .set("Authorization", this.mapService.apiKey.getValue())
      .set("Content-Type", "application/json");

    return this.http
      .post(
        ` ${
          constants.SERVICE_ROUTE_URL
        }optimize?region=${searchRegion.toUpperCase()}&dataset=Current`,
        JSON.stringify(regionLocation),
        {
          headers: header,
        }
      )
      .pipe(
        map((timeWindow: any) => {
          const routeStops: any = [];
          const optimizedList: any = [];
          timeWindow.Stops.forEach(
            (stop: {
              [x: string]: { [x: string]: { [x: string]: number } };
            }) => {
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
            }
          );

          for (let z = 0; z < optimizedList.length; z++) {
            let arrived;
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
          return { routeStops: routeStops, routeDetails: routeDetails };
        })
      );
  }
}
