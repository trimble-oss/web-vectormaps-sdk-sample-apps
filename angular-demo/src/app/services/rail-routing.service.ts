import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MapService } from "./map.service";
import * as railJson from "../json/railJsonPayload.json";
import {
  GeoJson,
  RailRouting,
  RailRoutingResponse,
} from "../models/railRouting";
import { constants } from "../utils/constants";

@Injectable({
  providedIn: "root",
})
export class RailRoutingService {
  constructor(private http: HttpClient, private mapService: MapService) {}

  getRailRouting(): Observable<RailRouting> {
    const requestBody = railJson;
    const header = new HttpHeaders()
      .set("Authorization", this.mapService.apiKey.getValue())
      .set("Content-Type", "application/json");

    return this.http
      .post<RailRoutingResponse>(
        constants.PCM_RAIL_URL,
        JSON.stringify(requestBody),
        {
          headers: header,
        }
      )
      .pipe(
        map((railResponse: RailRoutingResponse) => {
          const railGeojson: GeoJson = { type: "geojson", data: railResponse };
          const railOrigin: [number, number] =
            railResponse["geometry"]["coordinates"][0][0];
          const railDestination: [number, number] =
            railResponse["geometry"]["coordinates"][0][
              railResponse["geometry"]["coordinates"][0].length - 1
            ];
          return {
            railGeojson: railGeojson,
            railOrigin: railOrigin,
            railDestination: railDestination,
          };
        })
      );
  }
}
