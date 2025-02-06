import { createContext, useContext } from "react";

export const MapContext = createContext(undefined);

export function useMapContext() {
  const map = useContext(MapContext);
  if (map === undefined || map === "") {
    throw new Error("useMapContext must be used with a outletContext");
  }
  return map;
}
