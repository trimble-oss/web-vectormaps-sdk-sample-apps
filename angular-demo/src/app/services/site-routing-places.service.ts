import { Injectable } from "@angular/core";
import { Observable, map, switchMap } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MapService } from "./map.service";
import { constants } from "../utils/constants";
import { Feature } from "@turf/turf";

@Injectable({
  providedIn: "root",
})
export class SiteRoutingPlacesService {
  constructor(private http: HttpClient, private mapService: MapService) {}
  createSiteRoutingPlaces(placeID: string): Observable<Feature[]> {
    const siteGateFeatures: Feature[] = [];
    const requestBody = {
      apiKey: this.mapService.apiKey.getValue(),
    };
    const placeUrl = `${
      constants.API_TRIMBLEMAPS_URL
    }place/${placeID.trim()}/details`;
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
        switchMap((token: any) => {
          const placeHeader = new HttpHeaders().set(
            "Authorization",
            "bearer " + token.token
          );
          return this.http.get(placeUrl, { headers: placeHeader });
        }),
        map((response: any) => {
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
                "icon-size": 0.5,
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
  }
}
