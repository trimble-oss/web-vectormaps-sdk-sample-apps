// https://developer.trimblemaps.com/restful-apis/routing/route-reports/mileage/
// Response from both the web service and TrimbleMaps.Route report event

import { ReportStop, StopState } from "./reportStop";

export interface MileageReportReportLine {
  Stop: ReportStop;
  LMiles: string;
  TMiles: string;
  LCostMile: string;
  TCostMile: string;
  LHours: string;
  THours: string;
  LTolls: string;
  TTolls: string;
  LEstghg: string;
  TEstghg: string;
  EtaEtd: string;
}

export interface MileageReportResponse {
  type: string;
  RouteID: number;
  ReportLines: MileageReportReportLine[];
}

export interface MileageReportReportLineView {
  location: string;
  legMiles: string;
  cumulativeMiles: string;
  driveTime: string;
  cumulativeDriveTime: string;
}
