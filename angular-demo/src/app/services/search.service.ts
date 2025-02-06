import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import {
  SingleSearchLocation,
  SingleSearchResponse,
} from "../models/searchResponse";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MapService } from "./map.service";
import { constants } from "../utils/constants";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private http: HttpClient, private mapService: MapService) {}
  search(
    searchString: string,
    searchRegion: string
  ): Observable<SingleSearchLocation[] | undefined> {
    const queryParam = new HttpParams()
      .set("authToken", this.mapService.apiKey.getValue())
      .set("query", searchString)
      .set("maxResults", 5);
    return this.http
      .get(`${constants.SINGLE_SEARCH_URL}${searchRegion}/api/search`, {
        params: queryParam,
      })
      .pipe(
        map((r: SingleSearchResponse) => {
          return r.Locations;
        })
      );
  }
}
