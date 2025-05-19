import { useEffect, useState } from "react";
import { constants } from "../Utils/constants";

function useSiteRouting(placeID, apiKey) {
  const [data, setData] = useState({});
  const siteGateFeatures = [];

  const requestBody = {
    apiKey: apiKey,
  };

  useEffect(() => {
    fetch(
      `${constants.API_TRIMBLEMAPS_URL}authenticate`,

      {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: apiKey },
        body: JSON.stringify(requestBody),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const placeHeader = {
          Authorization: "bearer " + res.token,
        };

        fetch(
          `${constants.API_TRIMBLEMAPS_URL}place/${placeID}/details`,

          {
            method: "get",
            headers: placeHeader,
          }
        )
          .then((res) => res.json())
          .then((response) => {
            response.site.gates.forEach((gate) => {
              const gateName =
                gate["type"] === "Entry"
                  ? "poi_gate_entry"
                  : gate["type"] === "Two Way"
                  ? "poi_gate_both"
                  : "poi_gate_exit";
              siteGateFeatures.push({
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
              });
              setData(siteGateFeatures);
            });
          });
      });
  }, []);
  return data;
}
export default useSiteRouting;
