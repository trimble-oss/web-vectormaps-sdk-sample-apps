// https://developer.trimblemaps.com/restful-apis/routing/route-reports/state/
// Response from both the web service and TrimbleMaps.Route report event

import { MileageReportReportLine } from "./mileageReport";

export interface StateReportReportLine {
  StCntry: string;
  Total: string;
  Toll: string;
  Free: string;
  Ferry: string;
  Loaded: string;
  Empty: string;
  Tolls: string;
  Energy: string;
}

export interface StateReportResponse {
  RouteID: string;
  StateReportLines: StateReportReportLine[];
  MileageReportLines: MileageReportReportLine[];
}

export interface StateReportReportLineView {
  state: string;
  total: string;
  toll: string;
  free: string;
  ferry: string;
  loaded: string;
  empty: string;
  tolls: string;
  energy: string;
}
