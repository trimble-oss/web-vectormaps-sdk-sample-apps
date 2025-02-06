import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
export const mapStyleOptions = [
  {
    displayName: "Transportation",
    value: TrimbleMaps.Common.Style.TRANSPORTATION,
    requireLicense: false,
  },
  {
    displayName: "Transportation Dark",
    value: TrimbleMaps.Common.Style.TRANSPORTATION_DARK,
    requireLicense: false,
  },
  {
    displayName: "Satellite",
    value: TrimbleMaps.Common.Style.SATELLITE,
    satelliteProvider: TrimbleMaps.Common.SatelliteProvider.DEFAULT,
    requireLicense: false,
  },
  {
    displayName: "Satellite (Premium)",
    value: TrimbleMaps.Common.Style.SATELLITE,
    satelliteProvider: TrimbleMaps.Common.SatelliteProvider.SAT2,
    requireLicense: false,
  },
  {
    displayName: "Terrain",
    value: TrimbleMaps.Common.Style.TERRAIN,
    requireLicense: false,
  },
  {
    displayName: "Basic",
    value: TrimbleMaps.Common.Style.BASIC,
    requireLicense: false,
  },
];

export const mapStyleOptionsWithoutSatellitePremium = [
  {
    displayName: "Transportation",
    value: TrimbleMaps.Common.Style.TRANSPORTATION,
    requireLicense: false,
  },
  {
    displayName: "Transportation Dark",
    value: TrimbleMaps.Common.Style.TRANSPORTATION_DARK,
    requireLicense: false,
  },
  {
    displayName: "Satellite",
    value: TrimbleMaps.Common.Style.SATELLITE,
    satelliteProvider: TrimbleMaps.Common.SatelliteProvider.DEFAULT,
    requireLicense: false,
  },
  {
    displayName: "Satellite (Premium)",
    value: TrimbleMaps.Common.Style.SATELLITE,
    satelliteProvider: TrimbleMaps.Common.SatelliteProvider.SAT2,
    requireLicense: true,
  },
  {
    displayName: "Terrain",
    value: TrimbleMaps.Common.Style.TERRAIN,
    requireLicense: false,
  },
  {
    displayName: "Basic",
    value: TrimbleMaps.Common.Style.BASIC,
    requireLicense: false,
  },
];
