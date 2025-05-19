import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { MapRegion } from "../models/trimbleMaps";

export function siteLocation(region: MapRegion): TrimbleMaps.LngLat[] {
    let routeCoords: TrimbleMaps.LngLat[] = [];
    if (region === TrimbleMaps.Common.Region.NA) {
        routeCoords = [
            new TrimbleMaps.LngLat(-86.36886400987191, 39.6898819321506),
            new TrimbleMaps.LngLat(-86.360461, 39.689087),
            new TrimbleMaps.LngLat(-86.3559358076075, 39.68285029257417)]
    }
    if (region === TrimbleMaps.Common.Region.EU) {
        routeCoords = [
            new TrimbleMaps.LngLat(-0.1924264491031632, 51.41189897106568),
            new TrimbleMaps.LngLat(-0.18925654227312752, 51.41231142666759),
            new TrimbleMaps.LngLat(-0.18711562388321706, 51.413262867635)
        ];
    }
    return routeCoords;
}