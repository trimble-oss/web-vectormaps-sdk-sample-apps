import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";

export interface StyleOption {
  displayName: string;
  value: (typeof TrimbleMaps.Common.Style)[keyof typeof TrimbleMaps.Common.Style];
  satelliteProvider?: (typeof TrimbleMaps.Common.SatelliteProvider)[keyof typeof TrimbleMaps.Common.SatelliteProvider];
  requiresLicense?: boolean;
}

export const mapStyleOptions: StyleOption[] = [
  {
    displayName: "Transportation",
    value: TrimbleMaps.Common.Style.TRANSPORTATION,
    requiresLicense: false,
  },
  {
    displayName: "Transportation Dark",
    value: TrimbleMaps.Common.Style.TRANSPORTATION_DARK,
    requiresLicense: false,
  },
  {
    displayName: "Satellite",
    value: TrimbleMaps.Common.Style.SATELLITE,
    satelliteProvider: TrimbleMaps.Common.SatelliteProvider.DEFAULT,
    requiresLicense: false,
  },
  {
    displayName: "Satellite (Premium)",
    value: TrimbleMaps.Common.Style.SATELLITE,
    satelliteProvider: TrimbleMaps.Common.SatelliteProvider.SAT2,
    requiresLicense: true,
  },
  {
    displayName: "Terrain",
    value: TrimbleMaps.Common.Style.TERRAIN,
    requiresLicense: false,
  },
  {
    displayName: "Basic",
    value: TrimbleMaps.Common.Style.BASIC,
    requiresLicense: false,
  },
];
