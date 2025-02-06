import { Component, OnInit } from "@angular/core";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { BsModalRef } from "ngx-bootstrap/modal";
import { MapRegion } from "src/app/models/trimbleMaps";
import { MapService } from "src/app/services/map.service";
import {
  DetailReportReportLineView,
  DetailReportResponse,
} from "../../models/detailedReport";
import {
  DirectionsReportReportLineView,
  DirectionsReportResponse,
} from "src/app/models/directionReport";
import {
  StateReportReportLineView,
  StateReportResponse,
} from "src/app/models/stateReport";
import {
  RoadTypeReport,
  RoadTypeReportReportLineView,
} from "src/app/models/roadTypeReport";
import {
  MileageReportReportLineView,
  MileageReportResponse,
} from "src/app/models/mileageReport";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  routeReports!: [
    MileageReportResponse,
    DetailReportResponse,
    DirectionsReportResponse,
    StateReportResponse,
    RoadTypeReport
  ];
  region!: MapRegion;
  mileageType!: string;
  detailedReports!: DetailReportReportLineView[];
  mileageReports!: MileageReportReportLineView[];
  directionReports!: DirectionsReportReportLineView[];
  stateReports!: StateReportReportLineView[];
  roadReports!: RoadTypeReportReportLineView[];
  mileageRawReport!: MileageReportResponse;
  detailRawReport!: DetailReportResponse;
  drivingDirectionsRawReport!: DirectionsReportResponse;
  stateCountryRawReport!: StateReportResponse;
  roadTypeRawReport!: RoadTypeReport;
  constructor(private mapService: MapService, private bsModalRef: BsModalRef) {}
  ngOnInit() {
    this.mileageRawReport = this.mapService.routeReports[0];
    this.detailRawReport = this.mapService.routeReports[1];
    this.drivingDirectionsRawReport = this.mapService.routeReports[2];
    this.roadTypeRawReport = this.mapService.routeReports[3];
    this.stateCountryRawReport = this.mapService.routeReports[4];

    this.createReports();
  }
  close() {
    this.bsModalRef.hide();
  }
  createReports() {
    this.mileageReports = [];
    this.detailedReports = [];
    this.stateReports = [];
    this.directionReports = [];
    this.roadReports = [];

    if (this.region === TrimbleMaps.Common.Region.NA) {
      this.mileageType = "Miles";
    } else {
      this.mileageType = "Kilometres";
    }
    this.createMileageReports();
    this.createDetailedReports();
    this.createDirectionReport();
    this.createStateReport();
    this.createRoadReport();
  }

  createMileageReports() {
    for (let i = 0; i < this.mileageRawReport["ReportLines"].length; i++) {
      let locationName = "";

      locationName =
        this.mileageRawReport["ReportLines"][i]["Stop"]["Address"][
          "StreetAddress"
        ] != ""
          ? this.mileageRawReport["ReportLines"][i]["Stop"]["Address"][
              "StreetAddress"
            ] + ", "
          : "";

      locationName +=
        this.mileageRawReport["ReportLines"][i]["Stop"]["Address"]["City"] != ""
          ? this.mileageRawReport["ReportLines"][i]["Stop"]["Address"]["City"] +
            ", "
          : "";

      locationName +=
        this.mileageRawReport["ReportLines"][i]["Stop"]["Address"]["State"] !=
        ""
          ? this.mileageRawReport["ReportLines"][i]["Stop"]["Address"][
              "State"
            ] + ", "
          : "";

      locationName += this.mileageRawReport["ReportLines"][i]["Stop"][
        "Address"
      ]["Zip"]
        ? this.mileageRawReport["ReportLines"][i]["Stop"]["Address"]["Zip"]
        : "";

      const mileageReport = {
        location: locationName,
        legMiles: this.mileageRawReport["ReportLines"][i]["LMiles"],
        cumulativeMiles: this.mileageRawReport["ReportLines"][i]["TMiles"],
        driveTime: this.mileageRawReport["ReportLines"][i]["LHours"],
        cumulativeDriveTime: this.mileageRawReport["ReportLines"][i]["THours"],
      };
      this.mileageReports.push(mileageReport);
    }
  }

  createDetailedReports() {
    for (let y = 0; y < this.detailRawReport["ReportLegs"].length; y++) {
      for (
        let i = 0;
        i < this.detailRawReport["ReportLegs"][y]["ReportLines"].length;
        i++
      ) {
        let tollPlaza = "";

        const routeStop =
          i === 0 ||
          i === this.detailRawReport["ReportLegs"][y]["ReportLines"].length - 1
            ? this.detailRawReport["ReportLegs"][y]["ReportLines"][i]["Stop"]
            : this.detailRawReport["ReportLegs"][y]["ReportLines"][i]["Route"];

        tollPlaza =
          this.detailRawReport["ReportLegs"][y]["ReportLines"][i][
            "TollPlazaName"
          ] != null
            ? this.detailRawReport["ReportLegs"][y]["ReportLines"][i][
                "TollPlazaName"
              ]
            : "";

        if (
          this.detailRawReport["ReportLegs"][y]["ReportLines"][i]["Route"] !=
          null
        ) {
          const tollAmount = this.detailRawReport["ReportLegs"][y][
            "ReportLines"
          ][i]["LToll"]
            ? this.detailRawReport["ReportLegs"][y]["ReportLines"][i]["LToll"]
            : "0.00";
          const detailedReport = {
            stop: routeStop,
            miles:
              this.detailRawReport["ReportLegs"][y]["ReportLines"][i]["Miles"],
            time: this.detailRawReport["ReportLegs"][y]["ReportLines"][i][
              "Time"
            ],
            interchange:
              this.detailRawReport["ReportLegs"][y]["ReportLines"][i][
                "InterCh"
              ],
            cumulativeMiles:
              this.detailRawReport["ReportLegs"][y]["ReportLines"][i]["TMiles"],
            cumulativeDriveTime:
              this.detailRawReport["ReportLegs"][y]["ReportLines"][i]["TTime"],
            tollPlaza: tollPlaza,
            tollAmount: tollAmount,
          };
          this.detailedReports.push(detailedReport);
        }
      }
    }
  }

  createStateReport() {
    for (
      let i = 0;
      i < this.stateCountryRawReport["StateReportLines"].length;
      i++
    ) {
      const stateReport = {
        state: this.stateCountryRawReport["StateReportLines"][i]["StCntry"],
        total: this.stateCountryRawReport["StateReportLines"][i]["Total"],
        toll: this.stateCountryRawReport["StateReportLines"][i]["Toll"],
        free: this.stateCountryRawReport["StateReportLines"][i]["Free"],
        ferry: this.stateCountryRawReport["StateReportLines"][i]["Ferry"],
        loaded: this.stateCountryRawReport["StateReportLines"][i]["Loaded"],
        empty: this.stateCountryRawReport["StateReportLines"][i]["Empty"],
        tolls: this.stateCountryRawReport["StateReportLines"][i]["Tolls"],
        energy: this.stateCountryRawReport["StateReportLines"][i]["Energy"],
      };

      this.stateReports.push(stateReport);
    }
  }

  createDirectionReport() {
    for (
      let y = 0;
      y < this.drivingDirectionsRawReport["ReportLegs"].length;
      y++
    ) {
      for (
        let i = 0;
        i <
        this.drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"].length;
        i++
      ) {
        if (
          this.drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][i][
            "Begin"
          ] != null
        ) {
          const directionReport = {
            direction:
              this.drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][
                i
              ]["Direction"],
            distance:
              this.drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][
                i
              ]["Dist"] === null
                ? ""
                : this.drivingDirectionsRawReport["ReportLegs"][y][
                    "ReportLines"
                  ][i]["Dist"],
            time:
              this.drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][
                i
              ]["Time"] === null
                ? ""
                : this.drivingDirectionsRawReport["ReportLegs"][y][
                    "ReportLines"
                  ][i]["Time"],
          };
          this.directionReports.push(directionReport);
        }
      }
    }
  }

  createRoadReport() {
    for (let i = 0; i < this.roadTypeRawReport["ReportLines"].length; i++) {
      let location = "";
      try {
        location +=
          this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
            "StreetAddress"
          ] !== ""
            ? this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
                "StreetAddress"
              ] + ", "
            : "";

        location +=
          this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["City"] !=
          ""
            ? this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
                "City"
              ] + " "
            : "";

        location +=
          this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
            "State"
          ] != ""
            ? this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
                "State"
              ] + ", "
            : "";

        location +=
          this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["Zip"] !=
          ""
            ? (location +=
                this.roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
                  "Zip"
                ])
            : "";
      } catch (err) {
        location = "TOTAL";
      }
      const roadReport = {
        location: location,
        miles: this.roadTypeRawReport["ReportLines"][i]["LMiles"],
        interState: this.roadTypeRawReport["ReportLines"][i]["InterSt"],
        dividedHighWay: this.roadTypeRawReport["ReportLines"][i]["Divide"],
        primaryHighway: this.roadTypeRawReport["ReportLines"][i]["Prime"],
        ferry: this.roadTypeRawReport["ReportLines"][i]["Ferry"],
        secondaryHighWay: this.roadTypeRawReport["ReportLines"][i]["Second"],
        ramp: this.roadTypeRawReport["ReportLines"][i]["Ramp"],
        local: this.roadTypeRawReport["ReportLines"][i]["Local"],
        pathway: this.roadTypeRawReport["ReportLines"][i]["Pathway"],
        toll: this.roadTypeRawReport["ReportLines"][i]["Toll"],
        energy: this.roadTypeRawReport["ReportLines"][i]["Energy"],
      };
      this.roadReports.push(roadReport);
    }
  }
}
