import { Component, OnDestroy, OnInit } from "@angular/core";
import { MapService } from "src/app/services/map.service";
import { RailRoutingService } from "src/app/services/rail-routing.service";
import { ModalService } from "../modal.service";
import { combineLatest } from "rxjs";

import { SubscriptionManager } from "src/app/utils/subscription-manager";

@Component({
  selector: "app-railrouting",
  templateUrl: "./railrouting.component.html",
  styleUrls: ["./railrouting.component.scss"],
})
export class RailroutingComponent implements OnInit, OnDestroy {
  private sm = new SubscriptionManager();
  constructor(
    private railRoutingService: RailRoutingService,
    private mapService: MapService,
    private modalService: ModalService
  ) {}
  ngOnInit() {
    this.sm.add(
      combineLatest([
        this.mapService.apiKey,
        this.mapService.isMapStyleLoaded$,
      ]).subscribe(([apiKey, isMapStyleLoaded]) => {
        if (apiKey && isMapStyleLoaded) {
          this.addLoading();
          this.enableRailRoting();
        }
      })
    );
  }

  enableRailRoting() {
    this.railRoutingService.getRailRouting().subscribe((railRouting: any) => {
      const railGeojson = railRouting.railGeojson;
      const railOrigin = railRouting.railOrigin;
      const railDestination = railRouting.railDestination;

      const railGeojsonFeatures = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                name: "origin",
                icon: "poi_origin",
                "icon-size": 0.5,
              },
              geometry: {
                type: "Point",
                coordinates: railOrigin,
              },
            },
            {
              type: "Feature",
              properties: {
                name: "destination",
                icon: "poi_destination",
                "icon-size": 0.5,
              },
              geometry: {
                type: "Point",
                coordinates: railDestination,
              },
            },
          ],
        },
      };
      this.mapService.addRailRouting(railGeojson, railGeojsonFeatures);
      this.hideLoading();
    });
  }
  addLoading() {
    this.modalService.addLoading("Loading Route...");
  }
  hideLoading() {
    this.modalService.hideLoading();
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
