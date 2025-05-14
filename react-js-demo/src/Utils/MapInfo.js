import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import jsonCustomFeaturesNA from "../Jsons/jsonCustomFeaturesNA.json";
import jsonCustomFeaturesEU from "../Jsons/jsonCustomFeaturesEU.json";

export const regions = [
  {
    displayName: "North America",
    value: TrimbleMaps.Common.Region.NA,
    requireLicense: false,
  },
  {
    displayName: "Europe",
    value: TrimbleMaps.Common.Region.EU,
    requireLicense: false,
  },
];

export function mapInfoSelectedRegion(region) {
  region = region?.toLocaleLowerCase();
  switch (region) {
    case TrimbleMaps.Common.Region.NA:
      return {
        center: [-97, 38],
        zoom: 4,
        region: TrimbleMaps.Common.Region.NA,
        unit: TrimbleMaps.Common.Unit.ENGLISH,
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
        unit: TrimbleMaps.Common.Unit.METRIC,
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
        unit: TrimbleMaps.Common.Unit.ENGLISH,
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
