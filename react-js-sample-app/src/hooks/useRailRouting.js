import { useEffect, useState } from "react";
import * as railJson from "../Jsons/railJsonPayload.json";
import { constants } from "../Utils/constants";

function useRailRouting(apiKey) {
  const [data, setData] = useState({});
  let requestBody = railJson;
  useEffect(() => {
    fetch(constants.PCM_RAIL_URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((railResponse) => {
        const railGeojson = { type: "geojson", data: railResponse };
        const railOrigin = railResponse["geometry"]["coordinates"][0][0];
        const railDestination =
          railResponse["geometry"]["coordinates"][0][
            railResponse["geometry"]["coordinates"][0].length - 1
          ];
        setData({
          railGeojson: railGeojson,
          railOrigin: railOrigin,
          railDestination: railDestination,
        });
      });
  }, []);
  return data;
}
export default useRailRouting;
