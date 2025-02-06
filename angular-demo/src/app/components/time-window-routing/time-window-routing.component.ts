import { Component, OnInit } from "@angular/core";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { Observable, combineLatest, forkJoin, take } from "rxjs";
import { MapRegion } from "src/app/models/trimbleMaps";
import { MapService } from "src/app/services/map.service";
import { TimeWindowRoutingService } from "src/app/services/time-window.service";

import { ModalService } from "../modal.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-time-window-routing",
  templateUrl: "./time-window-routing.component.html",
  styleUrls: ["./time-window-routing.component.scss"],
})
export class TimeWindowRoutingComponent implements OnInit {
  region!: MapRegion;
  titleText!: string;
  displayText!: string;
  routeOptimization = 2;
  routeDetails!: any;
  twBtnText = "Optimize";
  routeDetails$!: Observable<any>;
  optimizeRouteDetails$!: any;
  unOptimizeRouteDetails$!: any;
  optimizeRouteStops!: any;
  UnOptimizeRouteStops!: any;
  loadingModal: any;
  constructor(
    private mapService: MapService,
    private timeWindowService: TimeWindowRoutingService,
    private modalService: ModalService,
    private router: Router
  ) {}
  ngOnInit() {
    combineLatest([
      this.mapService.currentRegion$,
      this.mapService.apiKey,
      this.mapService.isMapStyleLoaded$,
    ]).subscribe(([region, apiKey, styleLoaded]) => {
      if (this.router.url === "/timeWindowRouting") {
        if (apiKey && styleLoaded) {
          this.region = region;
          this.titleText = "Route Optimization";
          this.displayText =
            '<li> Ability to feed in locations with time windows for optimization, will provide the best route path that accomidates as many time windows as possible, while returning locations that do not fit based on their time window information.</li><li>Utilizes the Time Window Routing API (<a href="https://developer.trimblemaps.com/restful-apis/routing/time-window-routing/" target="_blank">Documentation</a>).</li><li>Sample locations optimized assuming 40 minute dwell times at each location.</li>';

          this.addLoading();
          forkJoin(
            this.timeWindowService.getTimeWindowOptimization(this.region, 1),
            this.timeWindowService.getTimeWindowOptimization(this.region, 2)
          )
            .pipe(take(1))
            .subscribe((res: any) => {
              this.optimizeRouteDetails$ = res[0].routeDetails;
              this.optimizeRouteStops = res[0].routeStops;
              this.unOptimizeRouteDetails$ = res[1].routeDetails;
              this.UnOptimizeRouteStops = res[1].routeStops;
              this.mapService.createRoute(
                this.UnOptimizeRouteStops,
                TrimbleMaps.Common.RouteType.PRACTICAL,
                TrimbleMaps.Common.VehicleType.TRUCK,
                false,
                TrimbleMaps.Common.TollRoadsType.USE,
                false,
                TrimbleMaps.Common.HazMatType.NONE,
                false,
                this.region,
                0
              );

              this.hideLoading();
            });
        }
      }
    });
  }
  toggleTimeWindowRouting() {
    this.mapService.removeRoutes();
    if (this.routeOptimization === 2) {
      this.twBtnText = "Revert";
      this.routeOptimization = 1;
      this.mapService.createRoute(
        this.optimizeRouteStops,
        TrimbleMaps.Common.RouteType.PRACTICAL,
        TrimbleMaps.Common.VehicleType.TRUCK,
        false,
        TrimbleMaps.Common.TollRoadsType.USE,
        false,
        TrimbleMaps.Common.HazMatType.NONE,
        false,
        this.region,
        0
      );
    } else {
      this.twBtnText = "Optimize";
      this.routeOptimization = 2;
      this.mapService.createRoute(
        this.UnOptimizeRouteStops,
        TrimbleMaps.Common.RouteType.PRACTICAL,
        TrimbleMaps.Common.VehicleType.TRUCK,
        false,
        TrimbleMaps.Common.TollRoadsType.USE,
        false,
        TrimbleMaps.Common.HazMatType.NONE,
        false,
        this.region,
        0
      );
    }
  }
  addLoading() {
    this.modalService.addLoading("Optimizing Route...");
  }
  hideLoading() {
    this.modalService.hideLoading();
  }
  ngonDestroy() {
    this.mapService.removeRoutes();
  }
}
