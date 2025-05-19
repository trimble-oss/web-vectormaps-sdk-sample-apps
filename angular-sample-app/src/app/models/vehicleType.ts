import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";

export const vehicleType = [
  {
    displayName: "Truck",
    value: TrimbleMaps.Common.VehicleType.TRUCK,
    requiresLicense: true,
  },
  {
    displayName: "Light Truck",
    value: TrimbleMaps.Common.VehicleType.LIGHT_TRUCK,
    requiresLicense: false,
  },
  {
    displayName: "Auto",
    value: TrimbleMaps.Common.VehicleType.AUTOMOBILE,
    requiresLicense: false,
  },
];
