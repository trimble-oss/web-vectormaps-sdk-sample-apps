import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { combineLatest } from "rxjs";
import { MapRegion } from "src/app/models/trimbleMaps";
import { MapService } from "src/app/services/map.service";
import { SiteRoutingPlacesService } from "src/app/services/site-routing-places.service";
import { siteLocation } from "src/app/utils/site-location";
import { SubscriptionManager } from "src/app/utils/subscription-manager";
import { GeoJSONSourceSpecification } from "@trimblemaps/trimblemaps-js";

@Component({
  selector: "app-site-location-routing",
  templateUrl: "./site-location-routing.component.html",
})
export class SiteLocationRoutingComponent implements OnInit {
  isNA!: boolean;
  isEU!: boolean;
  region!: MapRegion;
  siteEnabled = false;
  private sm = new SubscriptionManager();
  constructor(
    private mapService: MapService,
    private siteRoutingPlacesService: SiteRoutingPlacesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sm.add(
      combineLatest([
        this.mapService.currentRegion$,
        this.mapService.apiKey,
        this.mapService.isMapStyleLoaded$,
      ]).subscribe(([region, apiKey, isMapStyleLoaded]) => {
        if (this.router.url === "/siteLocationRouting") {
          if (apiKey && isMapStyleLoaded) {
            this.region = region;
            this.isNA = region === TrimbleMaps.Common.Region.NA;
            this.isEU = region === TrimbleMaps.Common.Region.EU;
            this.createSiteRoute();
          }
        }
      })
    );
  }

  createSiteRoute() {
    let placeID;
    if (this.region === TrimbleMaps.Common.Region.NA) {
      placeID = "0xZqVCm3sA0k--1OtaidIcpQ";
    } else {
      placeID = "AmazonWarehouseDemo";
      this.mapService.addSiteEULayer();
    }

    const routeCoords = siteLocation(this.region);
    this.mapService.createRoute(
      routeCoords,
      TrimbleMaps.Common.RouteType.PRACTICAL,
      TrimbleMaps.Common.VehicleType.TRUCK,
      false,
      TrimbleMaps.Common.TollRoadsType.USE,
      true,
      TrimbleMaps.Common.HazMatType.NONE,
      this.siteEnabled,
      this.region,
      0
    );

    this.siteRoutingPlacesService
      .createSiteRoutingPlaces(placeID)
      .subscribe((siteGateFeatures: any) => {
        const siteGateGeojson: GeoJSONSourceSpecification = {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: siteGateFeatures,
          },
        };

        this.mapService.addSiteLocation(siteGateGeojson);
      });
  }

  toggleSiteLocationRouting() {
    this.siteEnabled = !this.siteEnabled;
    this.mapService.updateSite(this.siteEnabled);
  }
}
