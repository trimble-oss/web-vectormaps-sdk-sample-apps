export interface SegmentLine {
  Country: string;
  DistanceBased: string;
  Flat: string;
  Pass: string;
  Road: string;
  TollName: string;
}
export interface SummaryLine {
  Country: string;
  PaymentOption: string;
  TollDistance: string;
  TollName: string;
  TollType: string;
  Tolls: string;
  TollsLocal: string;
}
export interface TollReport {
  SegmentLines: SegmentLine[];
  RouteID: string;
  SummaryLines: SummaryLine[];
  TollCurrency: number;
}
