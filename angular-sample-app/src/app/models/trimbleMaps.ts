// Types for TrimbleMaps object based enums
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";

export type MapStyle =
  (typeof TrimbleMaps.Common.Style)[keyof typeof TrimbleMaps.Common.Style];

export type MapRegion =
  (typeof TrimbleMaps.Common.Region)[keyof typeof TrimbleMaps.Common.Region];

export type RouteOptimization =
  (typeof TrimbleMaps.Common.RouteOptimization)[keyof typeof TrimbleMaps.Common.RouteOptimization];

export type VehicleType =
  (typeof TrimbleMaps.Common.VehicleType)[keyof typeof TrimbleMaps.Common.VehicleType];
