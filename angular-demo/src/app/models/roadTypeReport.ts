// https://developer.trimblemaps.com/restful-apis/routing/route-reports/road/
// Response from both the web service and TrimbleMaps.Route report event

import { ReportStop, StopState } from "./reportStop";

export interface RoadTypeReportReportLine {
  Stop: ReportStop;
  LMiles: string;
  InterSt: string;
  InterstNoRamp: string;
  Divide: string;
  Prime: string;
  Ferry: string;
  Second: string;
  Ramp: string;
  Local: string;
  Pathway: string;
  Toll: string;
  Energy: string;
}

export interface RoadTypeReport {
  Disclaimers: string[];
  RouteID: string;
  ReportLines: RoadTypeReportReportLine[];
}

export interface RoadTypeReportReportLineView {
  location: string;
  miles: string;
  interState: string;
  dividedHighWay: string;
  primaryHighway: string;
  ferry: string;
  secondaryHighWay: string;
  ramp: string;
  local: string;
  pathway: string;
  toll: string;
  energy: string;
}
