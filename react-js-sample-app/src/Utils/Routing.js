import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";

export const vehicleType = [
  {
    displayName: "Truck",
    value: TrimbleMaps.Common.VehicleType.TRUCK,
    requireLicense: false,
  },
  {
    displayName: "Light Truck",
    value: TrimbleMaps.Common.VehicleType.LIGHT_TRUCK,
    requireLicense: false,
  },
  {
    displayName: "Auto",
    value: TrimbleMaps.Common.VehicleType.AUTOMOBILE,
    requireLicense: false,
  },
];
export const routeTypes = [
  { displayName: "Practical", value: TrimbleMaps.Common.RouteType.PRACTICAL },
  { displayName: "Shortest", value: TrimbleMaps.Common.RouteType.SHORTEST },
];
export const hazardousTypes = [
  {
    displayName: "None",
    value: TrimbleMaps.Common.HazMatType.NONE,
  },

  {
    displayName: "General",
    value: TrimbleMaps.Common.HazMatType.GENERAL,
  },

  {
    displayName: "Caustic",
    value: TrimbleMaps.Common.HazMatType.CAUSTIC,
  },

  {
    displayName: "Explosives",
    value: TrimbleMaps.Common.HazMatType.EXPLOSIVES,
  },

  {
    displayName: "Flammable",
    value: TrimbleMaps.Common.HazMatType.FLAMMABLE,
  },

  {
    displayName: "Inhalants",
    value: TrimbleMaps.Common.HazMatType.INHALANTS,
  },

  {
    displayName: "Radioactive",
    value: TrimbleMaps.Common.HazMatType.RADIOACTIVE,
  },
];
