// https://developer.trimblemaps.com/restful-apis/routing/route-reports/detailed/
// Response from both the web service and TrimbleMaps.Route report event

import { ReportStop, StopState } from "./reportStop";

export interface DetailReportReportLine {
  Warn: string;
  ArState: string;
  Stop?: string;
  State: string;
  Direction: string;
  Route: string;
  Miles: string;
  Time: string;
  InterCh: string;
  LMiles: string;
  LTime: string;
  TMiles: string;
  TTime: string;
  LToll: string;
  TToll: string;
  TollPlazaAbbr: string;
  TollPlazaName: string;
  EtaEtd: string;
  Info: string;
  Restriction: string;
  StartCoordinate: string;
  EndCoordinate: string;
}

export interface DetailReportReportLeg {
  Origin: ReportStop;
  Destination: ReportStop;
  ReportLines: DetailReportReportLine[];
}

export interface DetailReportResponse {
  Origin: ReportStop;
  Destination: ReportStop;
  RouteID: string;
  ReportLegs: DetailReportReportLeg[];
}

export interface DetailReportReportLineView {
  stop: string | undefined;
  miles: string;
  time: string;
  interchange: string;
  cumulativeMiles: string;
  cumulativeDriveTime: string;
  tollPlaza: string;
  tollAmount: string;
}
