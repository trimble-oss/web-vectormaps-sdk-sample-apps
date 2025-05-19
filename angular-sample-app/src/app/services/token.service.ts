import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Token } from "../models/token";
import { constants } from "../utils/constants";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  constructor(private httpService: HttpClient) {}
  getJwtToken(key: string): Observable<Token> {
    return this.httpService
      .post(constants.AUTH_WS_URL, {
        apiKey: key,
      })
      .pipe(map((response: any) => response.token));
  }
}
