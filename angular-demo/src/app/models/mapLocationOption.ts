import { LngLatLike } from "@trimblemaps/trimblemaps-js";

export interface mapLocationOption {
  zoom: number;
  center: LngLatLike;
  source?: string;
  pitch?: number;
  bearing?: number;
}
