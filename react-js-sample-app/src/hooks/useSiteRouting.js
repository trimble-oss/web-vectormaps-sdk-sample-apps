import { useEffect, useState } from "react";
import { constants } from "../Utils/constants";

function useSiteRouting(placeID, apiKey) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!placeID || !apiKey) {
      return;
    }

    const requestBody = {
      apiKey: apiKey,
    };

    fetch(`${constants.API_TRIMBLEMAPS_URL}authenticate`, {
      method: "post",
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((res) => {
        const placeHeader = {
          Authorization: "bearer " + res.token,
        };

        return fetch(
          `${constants.API_TRIMBLEMAPS_URL}place/${placeID}/details`,
          {
            method: "get",
            headers: placeHeader,
          }
        );
      })
      .then((res) => res.json())
      .then((response) => {
        const siteGateFeatures = response.site.gates.map((gate) => {
          const gateName =
            gate["type"] === "Entry"
              ? "poi_gate_entry"
              : gate["type"] === "Two Way"
              ? "poi_gate_both"
              : "poi_gate_exit";
          return {
            type: "Feature",
            properties: {
              name: gateName + "_name",
              icon: gateName,
              "icon-size": 0.5,
            },
            geometry: {
              type: "Point",
              coordinates: [
                gate["gateToSite"]["coordinates"]["coordinates"][0],
                gate["gateToSite"]["coordinates"]["coordinates"][1],
              ],
            },
          };
        });
        setData(siteGateFeatures);
      });
  }, [placeID, apiKey]);
  return data;
}
export default useSiteRouting;
