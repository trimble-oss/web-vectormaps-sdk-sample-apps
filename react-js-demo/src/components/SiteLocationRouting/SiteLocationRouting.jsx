import React, { useState, useEffect } from "react";
import { useMapContext } from "../../context/mapContext";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import useSiteRouting from "../../hooks/useSiteRouting";
import { siteLocation } from "../../Utils/siteLocation";
import * as _ from "lodash";
import LoadingModal from "../sharedComponents/LoadingModal";

function SiteLocationRouting() {
  const { map, mapService } = useMapContext();
  const [siteEnabled, setSiteEnabled] = useState(false);
  const [show, setShow] = useState(true);
  const PLACE_ID = "0xZqVCm3sA0k--1OtaidIcpQ";

  const siteGateFeatures = useSiteRouting(PLACE_ID, TrimbleMaps.APIKey);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!_.isEmpty(siteGateFeatures)) {
      const siteGateGeojson = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: siteGateFeatures,
        },
      };
      mapService.addSiteLocation(map, siteGateGeojson);
      createSiteRoute();
      setShow(false);
    }
  }, [siteGateFeatures]);

  const toggleSiteLocationRouting = () => {
    setSiteEnabled((prev) => !prev);
    mapService.updateSite(!siteEnabled);
  };

  const createSiteRoute = () => {
    const routeCoords = siteLocation(TrimbleMaps.Common.Region.NA);
    mapService.createRoute(
      map,
      routeCoords,
      TrimbleMaps.Common.RouteType.PRACTICAL,
      TrimbleMaps.Common.VehicleType.TRUCK,
      false,
      TrimbleMaps.Common.TollRoadsType.USE,
      true,
      TrimbleMaps.Common.HazMatType.NONE,
      siteEnabled,
      map.getRegion(),
      0
    );
  };

  return (
    <>
      <div className="modus-panel panel-lg h-100 shadow">
        <div className="panel-header">
          <h4>Site Routing</h4>
        </div>
        <div className="panel-body flex-fill">
          <div className="static-container d-flex align-items-center justify-content-start">
            <div className="form-group">
              <ul>
                <li>
                  Verified Trimble MAPS Places are publicly available locations
                  that contain site information such as place name, address,
                  operating hours, amenities and entry/exit gates.
                </li>
                <li>
                  Over 5 million locations with unique site geofence data (as of
                  October 2023).
                </li>
                <li>
                  Site gates used in routing can increase routing accuracy for
                  final mile stretches and alleviate driver frustration when
                  arriving at new locations.
                </li>
                <li>
                  Demonstration uses geojson layer to place Trimble MAPS gate
                  icons onto the map.
                </li>
              </ul>

              <div className="">
                <button
                  type="button"
                  className="btn btn-primary col-md-12"
                  id="optimizeBtn"
                  onClick={toggleSiteLocationRouting}
                >
                  <span>
                    {siteEnabled
                      ? "Disable Site Routing"
                      : "Enable Site Routing"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoadingModal
        setShow={setShow}
        show={show}
        loadingText={"Loading..."}
      ></LoadingModal>
    </>
  );
}

export default SiteLocationRouting;
