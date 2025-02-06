import { Component, OnDestroy, OnInit } from "@angular/core";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import * as _ from "lodash";
import { hazardousTypes } from "src/app/models/hazardousTypes";
import { routeTypes } from "src/app/models/routeType";
import { SingleSearchLocation } from "src/app/models/searchResponse";
import { MapRegion } from "src/app/models/trimbleMaps";
import { vehicleType } from "src/app/models/vehicleType";
import { MapService } from "src/app/services/map.service";
import { SearchService } from "src/app/services/search.service";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SubscriptionManager } from "src/app/utils/subscription-manager";
import { ModalService } from "../modal.service";
import { autoDescription } from "src/app/utils/autoDescription";
import { combineLatest } from "rxjs";
import { MileageReportResponse } from "src/app/models/mileageReport";
import { DetailReportResponse } from "src/app/models/detailedReport";
import { DirectionsReportResponse } from "src/app/models/directionReport";
import { StateReportResponse } from "src/app/models/stateReport";
import { RoadTypeReport } from "src/app/models/roadTypeReport";
import { LicenseFeature } from "src/app/models/license";
import { constants } from "src/app/utils/constants";

@Component({
  selector: "app-routing",
  templateUrl: "./routing.component.html",
  styleUrls: ["./routing.component.scss"],
})
export class RoutingComponent implements OnInit, OnDestroy {
  region!: MapRegion;
  vehicleTypes: any = [];
  routeTypes = routeTypes;
  hazardousTypes = hazardousTypes;
  dataVersion!: MapRegion;
  showReport = false;
  routeReports!: [
    MileageReportResponse,
    DetailReportResponse,
    DirectionsReportResponse,
    StateReportResponse,
    RoadTypeReport
  ];
  showReportsBtn = false;
  showRouteBtn = false;
  showLoading!: boolean;
  hasError!: boolean;
  noData!: boolean;
  private sm = new SubscriptionManager();
  isNA = false;
  vehicleDescription!: string;
  routeSettingForm!: FormGroup;
  license!: LicenseFeature;
  unlicensed_msg = constants.UNLICENSED_MSG;

  constructor(
    private searchService: SearchService,
    private mapService: MapService,
    private modalService: ModalService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.routeLocationInput = new FormControl("", [
      Validators.required,
      Validators.minLength(1),
      Validators.pattern("^[a-zA-Z]+$"),
    ]);

    this.routeSettingForm = this.formBuilder.group({
      vehicleType: "",
      routeType: TrimbleMaps.Common.RouteType.PRACTICAL,
      avoidTolls: false,
      routingHighwayOnly: false,
      bordersOpen: false,
      hazMat: TrimbleMaps.Common.HazMatType.NONE,
    });

    this.sm.add(
      this.mapService.currentRegion$.subscribe((region) => {
        this.region = region;
        this.dataVersion = region;
        this.isNA = region === TrimbleMaps.Common.Region.NA;
      })
    );
    this.sm.add(
      combineLatest([
        this.mapService.currentRegion$,
        this.routeSettingFormControls["vehicleType"].valueChanges,
      ]).subscribe(([region, vehicleType]) => {
        this.vehicleDescription = autoDescription(region, vehicleType);
        if (vehicleType === TrimbleMaps.Common.VehicleType.AUTOMOBILE) {
          this.routeTypes = [
            {
              displayName: "Fastest",
              value: TrimbleMaps.Common.RouteType.FASTEST,
            },
          ];
          this.routeSettingFormControls["routeType"].setValue(
            TrimbleMaps.Common.RouteType.FASTEST
          );
        } else {
          this.routeTypes = [
            {
              displayName: "Practical",
              value: TrimbleMaps.Common.RouteType.PRACTICAL,
            },
            {
              displayName: "Shortest",
              value: TrimbleMaps.Common.RouteType.SHORTEST,
            },
          ];
          this.routeSettingFormControls["routeType"].setValue(
            TrimbleMaps.Common.RouteType.PRACTICAL
          );
        }
      })
    );
    this.sm.add(
      this.routeSettingForm.valueChanges.subscribe(() => {
        this.onChangeEvent();
      })
    );
    this.routeSettingFormControls["vehicleType"].setValue(
      TrimbleMaps.Common.VehicleType.AUTOMOBILE
    );
    this.sm.add(
      this.routeLocationInput.valueChanges.subscribe((val) => {
        if (val) {
          this.showLoading = true;
          this.searchService
            .search(this.routeLocationInput.value, this.region)
            .subscribe({
              next: (location) => {
                this.locationList = location;
                this.showLoading = false;
                if (location && location.length > 0) {
                  this.hasError = false;
                  this.noData = false;
                } else {
                  this.noData = true;
                }
              },
              error: () => {
                this.showLoading = false;
                this.hasError = true;
                this.locationList = [];
              },
            });
        } else {
          this.locationList = [];
        }
      })
    );

    this.sm.add(
      this.mapService.license$.subscribe((license) => {
        this.license = license;
        console.log(this.license);
        this.vehicleTypes = vehicleType;
      })
    );
  }
  locationList: SingleSearchLocation[] | undefined = [];
  routeLocationInput!: FormControl;
  routeLocations: TrimbleMaps.LngLat[] = [];
  locationListContents: string[] = [];
  lan!: TrimbleMaps.LngLat;
  disableInput = false;

  clearLocations() {
    this.routeLocationInput.setValue("");
    this.locationListContents = [];
    this.disableInput = false;
    this.routeLocations = [];
    this.showReportsBtn = false;
    this.showRouteBtn = false;
    this.mapService.removeRoutes();
  }

  locationSelect(location: SingleSearchLocation) {
    if (location.ShortString) {
      this.locationListContents.push(location.ShortString);
    }
    if (!_.isUndefined(location.Coords)) {
      this.routeLocations.push(
        new TrimbleMaps.LngLat(location.Coords.Lon, location.Coords.Lat)
      );
    }
    if (this.routeLocations.length > 2) {
      this.disableInput = true;
    }

    if (this.routeLocations.length > 1) {
      this.showRouteBtn = true;
    }

    this.routeLocationInput.setValue("");
    this.locationList = [];
  }
  get routeSettingFormControls(): { [key: string]: AbstractControl } {
    return this.routeSettingForm.controls;
  }
  addRouteLayer() {
    //Geocodes the origin and destination, and if they are valid will add the route to the map.
    this.mapService.removeRoutes();
    let tolls;
    if (this.routeSettingFormControls["avoidTolls"].value) {
      tolls = TrimbleMaps.Common.TollRoadsType.AVOID_IF_POSSIBLE;
    } else {
      tolls = TrimbleMaps.Common.TollRoadsType.USE;
    }
    this.mapService.createRoute(
      this.routeLocations,
      this.routeSettingFormControls["routeType"].value,
      this.routeSettingFormControls["vehicleType"].value,
      this.routeSettingFormControls["routingHighwayOnly"].value,
      tolls,
      this.routeSettingFormControls["bordersOpen"].value,
      this.routeSettingFormControls["hazMat"].value,
      false,
      this.dataVersion,
      1
    );
    this.showReportsBtn = true;
  }

  onChangeEvent() {
    this.showReportsBtn = false;
    this.mapService.removeRoutes();
  }

  showReports() {
    this.modalService.showReports(this.routeReports, this.dataVersion);
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
