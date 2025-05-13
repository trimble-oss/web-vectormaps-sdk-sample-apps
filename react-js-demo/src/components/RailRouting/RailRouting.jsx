import React, { useEffect, useState } from "react";
import { useMapContext } from "../../context/mapContext";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import useRailRouting from "../../hooks/useRailRouting";
import * as _ from "lodash";
import LoadingModal from "../sharedComponents/LoadingModal";

function RailRouting() {
  const { map, mapService } = useMapContext();
  const [show, setShow] = useState(true);
  const railRouting = useRailRouting(TrimbleMaps.getAPIKey());

  useEffect(() => {
    if (!_.isEmpty(railRouting)) {
      const { railGeojson, railOrigin, railDestination } = railRouting;
      const railGeojsonFeatures = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                name: "origin",
                icon: "poi_origin",
                "icon-size": 0.5,
              },
              geometry: {
                type: "Point",
                coordinates: railOrigin,
              },
            },
            {
              type: "Feature",
              properties: {
                name: "destination",
                icon: "poi_destination",
                "icon-size": 0.5,
              },
              geometry: {
                type: "Point",
                coordinates: railDestination,
              },
            },
          ],
        },
      };
      mapService.addRailRouting(map, railGeojson, railGeojsonFeatures);
      setShow(false);
    }
  }, [railRouting]);

  return (
    <>
      <div className="modus-panel panel-lg h-100 shadow">
        <div className="panel-header">
          <h4>Rail Routing</h4>
        </div>
        <div className="panel-body flex-fill">
          <div className="static-container d-flex align-items-center justify-content-start">
            <div className="mb-3">
              <ul>
                <li>
                  Utilizes the rail routing APIs (
                  <a
                    href="https://developer.trimblemaps.com/restful-apis/freight-rail/overview/"
                    target="_blank"
                    rel="noopener">
                    Documentation
                  </a>
                  ) to gather the route path between rail stations.
                </li>
                <li>
                  Rail route line applied a custom layer geojson that mimics the
                  properties of a truck routing line style, along with using
                  Trimble MAPS origin and destination icons.
                </li>
                <li>
                  Rail routing requires knowing the origin, destination, rail
                  stations between them and all respective railroad providers
                  for each location.
                </li>
                <li>
                  Example BNSF route from Denver, CO to Pueblo, CO, mimicking a
                  scan point in Colorado Springs, CO.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LoadingModal
        setShow={setShow}
        show={show}
        loadingText={"Loading..."}></LoadingModal>
    </>
  );
}

export default RailRouting;
