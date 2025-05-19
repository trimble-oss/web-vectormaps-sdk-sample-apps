import { Component, OnDestroy, OnInit } from "@angular/core";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { Subject, combineLatest, takeUntil } from "rxjs";
import { layerSpecificLocation } from "src/app/utils/layerSpecificLocation";
import { MapService } from "src/app/services/map.service";
import { SubscriptionManager } from "src/app/utils/subscription-manager";
import { ModalService } from "../modal.service";
import { LicenseFeature } from "src/app/models/license";

@Component({
  selector: "app-content-layers",
  templateUrl: "./content-layers.component.html",
  styleUrls: ["./content-layers.component.scss"],
})
export class ContentLayersComponent implements OnInit, OnDestroy {
  region!: string;
  isNA!: boolean;
  isEU!: boolean;
  private sm = new SubscriptionManager();
  license!: LicenseFeature;
  activeAccordionIndex: number | null = null;
  constructor(
    private mapService: MapService,
    private modalService: ModalService
  ) {}
  pageloaded = new Subject();
  ngOnInit() {
    this.sm.add(
      combineLatest([
        this.mapService.currentRegion$,
        this.mapService.apiKey,
        this.mapService.isMapStyleLoaded$,
        this.mapService.license$,
      ])
        .pipe(takeUntil(this.pageloaded))
        .subscribe(([region, apiKey, isMapStyleLoaded, license]) => {
          if (apiKey && isMapStyleLoaded && Object.keys(license).length > 0) {
            this.region = region;
            this.isNA = region === TrimbleMaps.Common.Region.NA;
            this.isEU = region === TrimbleMaps.Common.Region.EU;
            this.license = license;
            this.openLayer(0);
            this.pageloaded.next(true);
            this.pageloaded.complete();
          }
        })
    );
    this.sm.add(
      combineLatest([
        this.mapService.apiKey,
        this.mapService.showLoading$,
      ]).subscribe(([apiKey, showLoading]) => {
        if (apiKey) {
          if (showLoading) {
            this.modalService.addLoading("Loading");
          } else {
            this.modalService.hideLoading();
          }
        }
      })
    );
  }
  openLayer(i: number) {
    this.mapService.resetMapLayers();
    if (this.activeAccordionIndex === i) {
      this.activeAccordionIndex = null;
    } else {
      this.activeAccordionIndex = i;
    }

    switch (i) {
      case 0:
        if (this.license?.traffic) {
          this.mapService.changeMapLocation(
            layerSpecificLocation(this.region, "traffic")
          );
          this.mapService.toggleTrafficVisibility();
        }
        break;

      case 1:
        this.mapService.toggleWeatherRadarVisibility();
        break;

      case 2:
        this.mapService.toggleWeatherAlertVisibility();
        break;

      case 3:
        this.mapService.toggleRoadSurfaceVisibility();
        break;

      case 4:
        this.mapService.changeMapLocation(
          layerSpecificLocation(this.region, "places")
        );
        this.mapService.togglePlacesVisibility();
        break;

      case 5:
        this.mapService.changeMapLocation(
          layerSpecificLocation(this.region, "poi")
        );
        this.mapService.togglePOIVisibility();
        break;

      case 6:
        this.mapService.changeMapLocation(
          layerSpecificLocation(this.region, "3dBuilding")
        );
        this.mapService.toggle3dBuildingVisibility(false);

        break;
      case 7:
        this.mapService.changeMapLocation(
          layerSpecificLocation(this.region, "trafficIncident")
        );
        this.mapService.addTrafficIncidentLayer();

        break;
      case 8:
        this.mapService.changeMapLocation(
          layerSpecificLocation(this.region, "truckRestriction")
        );
        this.mapService.addTruckRestrictionLayer();
        break;
      case 9:
        if (this.region === TrimbleMaps.Common.Region.NA) {
          this.mapService.addCustomPlaceLayerNA(
            layerSpecificLocation(this.region, "customPlacesLocation")
          );
        } else {
          this.mapService.addCustomPlaceLayerEU(
            layerSpecificLocation(this.region, "customPlacesLocation")
          );
        }

        break;

      default:
    }
  }

  addLoading() {
    this.modalService.addLoading("Loading...");
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
