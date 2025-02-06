import React, { useRef, useEffect } from "react";

import { mapInfoSelectedRegion } from "../../Utils/mapInfo";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";

function Map(props) {
  const mapInfo = mapInfoSelectedRegion(TrimbleMaps.Common.Region.NA);
  const mapContainer = useRef(null);
  const { setMap, mapService, apiKey } = props;
  useEffect(() => {
    if (apiKey) {
      const mapInstance = mapService.initMap(
        {
          container: mapContainer.current,
          style: "transportation",
          center: mapInfo.center,
          zoom: mapInfo.zoom,
          hash: false,
          region: mapInfo.region,
        },
        apiKey
      );
      setMap(mapInstance);
    }
  }, [apiKey]);

  return <div className="map h-100" id="map" ref={mapContainer}></div>;
}

export default Map;
