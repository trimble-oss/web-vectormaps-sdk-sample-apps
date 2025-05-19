// https://developer.trimblemaps.com/restful-apis/routing/route-reports/directions/
// Response from both the web service and TrimbleMaps.Route report event

import { ReportStop, StopState } from "./reportStop";

export interface DirectionsReportReportLine {
  Warn: string;
  Direction: string;
  Dist: string;
  Time: string;
  InterCh: string;
  Delay: string;
  Begin: {
    Lat: string;
    Lon: string;
  };
  End: {
    Lat: string;
    Lon: string;
  };
  TurnInstruction: string;
  DriveSide: string;
  IsRoundabout: boolean;
}

export interface DirectionsReportReportLeg {
  Origin: ReportStop;
  Dest: ReportStop;
  ReportLines: DirectionsReportReportLine[];
}

export interface DirectionsReportResponse {
  Origin: ReportStop;
  Destination: ReportStop;
  ReportLegs: DirectionsReportReportLeg[];
  RouteID: string;
}
export interface DirectionsReportReportLineView {
  direction: string;
  distance: string;
  time: string;
}
