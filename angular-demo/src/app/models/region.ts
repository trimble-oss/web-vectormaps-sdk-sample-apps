import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { SelectOption } from "./selectOption";
import { MapRegion } from "./trimbleMaps";
import * as jsonCustomFeaturesNA from "../json/jsonCustomFeaturesNA.json";
import * as jsonCustomFeaturesEU from "../json/jsonCustomFeaturesEU.json";

export const regions: SelectOption[] = [
  {
    displayName: "North America",
    value: TrimbleMaps.Common.Region.NA,
    requiresLicense: false,
  },
  {
    displayName: "Europe",
    value: TrimbleMaps.Common.Region.EU,
    requiresLicense: true,
  },
];

export interface Locate {
  center: TrimbleMaps.LngLatLike;
  zoom: number;
  pitch?: number;
  region?: MapRegion;
  customDataSource?: any;
}

export function mapInfoSelectedRegion(region: string): Locate {
  region = region?.toLocaleLowerCase();
  switch (region) {
    case TrimbleMaps.Common.Region.NA:
      return {
        center: [-97, 38],
        zoom: 4,
        region: TrimbleMaps.Common.Region.NA,
        customDataSource: {
          sourceName: "customFeaturesSource",
          geoJson: {
            type: "geojson",
            data: jsonCustomFeaturesNA,
          },
        },
      };
    case TrimbleMaps.Common.Region.EU:
      return {
        center: [15, 50],
        zoom: 4,
        region: TrimbleMaps.Common.Region.EU,
        customDataSource: {
          sourceName: "customFeaturesSourceEU",
          geoJson: {
            type: "geojson",
            data: jsonCustomFeaturesEU,
          },
        },
      };
    default:
      return {
        center: [-97, 38],
        zoom: 4,
        region: TrimbleMaps.Common.Region.NA,
        customDataSource: {
          sourceName: "customFeaturesSource",
          geoJson: {
            type: "geojson",
            data: jsonCustomFeaturesNA,
          },
        },
      };
  }
}
