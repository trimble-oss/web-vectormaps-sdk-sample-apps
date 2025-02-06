import { Component, OnInit } from "@angular/core";
import { MapService } from "./services/map.service";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { Observable, combineLatest, map } from "rxjs";

import { ModalService } from "./components/modal.service";
import { TokenService } from "./services/token.service";
import { SubscriptionManager } from "./utils/subscription-manager";
import { jwtDecode } from "jwt-decode";
import { processLicense } from "./utils/processLicense";
import { LicenseFeature } from "./models/license";
import { constants } from "./utils/constants";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "angular-vector-sdk-sample-project";
  currentYear = new Date().getFullYear();
  isSidebarOpen = false;
  isNA!: Observable<boolean>;
  private sm = new SubscriptionManager();
  timeWindowOptimizationLicense = false;
  license!: LicenseFeature;
  unlicensed_msg = constants.UNLICENSED_MSG;
  constructor(
    private mapService: MapService,
    private modalService: ModalService,
    private tokenService: TokenService
  ) {}
  isLoading$ = this.mapService.isLoading$;
  ngOnInit() {
    this.isNA = this.mapService.currentRegion$.pipe(
      map((region) => region === TrimbleMaps.Common.Region.NA)
    );
    this.modalService.openAPIKeyModal();
    this.sm.add(
      this.mapService.apiKey$.subscribe((key) => {
        if (key) {
          this.tokenService.getJwtToken(key).subscribe((token: any) => {
            this.checkLicense(token);
          });
        }
      })
    );
    this.sm.add(
      this.mapService.license$.subscribe((license) => {
        this.license = license;
      })
    );
  }
  onActivate() {
    combineLatest([
      this.mapService.apiKey,
      this.mapService.isMapStyleLoaded$,
    ]).subscribe(([key, isMapStyleLoaded]) => {
      if (key && isMapStyleLoaded) {
        this.mapService.resetMapLayers();
      }
    });
  }
  checkLicense(token: string) {
    const decoded: any = jwtDecode(token);
    this.mapService.license.next(processLicense(decoded.features));
  }
}
