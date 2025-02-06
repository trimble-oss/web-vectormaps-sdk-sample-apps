import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MapService } from "./map.service";
import { constants } from "../utils/constants";
import { Feature } from "@turf/turf";

@Injectable({
  providedIn: "root",
})
export class SiteRoutingPlacesService {
  constructor(private http: HttpClient, private mapService: MapService) {}
  createSiteRoutingPlaces(placeID: string): any {
    const siteGateFeatures: Feature[] = [];
    const requestBody = {
      apiKey: this.mapService.apiKey.getValue(),
    };

    const header = new HttpHeaders().set("Content-Type", "application/json");

    return this.http
      .post(
        `${constants.API_TRIMBLEMAPS_URL}authenticate`,
        JSON.stringify(requestBody),
        {
          headers: header,
        }
      )
      .pipe(
        map((token) => {
          const placeHeader = new HttpHeaders().set(
            "Authorization",
            "bearer " + token
          );
          return this.http
            .post(
              `${constants.API_TRIMBLEMAPS_URL}place/
                ${placeID}
                /details`,
              false,
              { headers: placeHeader }
            )
            .pipe(
              map((response: any) => {
                //Loop through site gate info to add to the geoJson.
                response.site.gates.forEach((gate: any) => {
                  const gateName =
                    gate["type"] === "Entry"
                      ? "poi_gate_entry"
                      : gate["type"] === "Two Way"
                      ? "poi_gate_both"
                      : "poi_gate_exit";
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
                        gate["gateToSite"]["coordinates"]["coordinates"][0],
                        gate["gateToSite"]["coordinates"]["coordinates"][1],
                      ],
                    },
                  });
                });
                return siteGateFeatures;
              })
            );
        })
      );
  }
}
