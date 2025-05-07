/* eslint-disable no-unused-vars */
import React from "react";
import { useMapContext } from "../../context/mapContext";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { useState, useEffect } from "react";
import useTimeWindowService from "../../hooks/useTimeWindowService";
import Button from "react-bootstrap/Button";
import LoadingModal from "../sharedComponents/LoadingModal";

function TimeWindowRouting() {
  const { map, mapService } = useMapContext();
  const [routeOptimization, setRouteOptimization] = useState(2);
  const [routeDetails, setRouteDetails] = useState([]);
  const [twBtnText, setTwBtnText] = useState("optimize");
  const [mapRoute, setMapRoute] = useState(undefined);
  const [show, setShow] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading...");

  const twRes = useTimeWindowService(
    routeOptimization,
    map.getRegion(),
    TrimbleMaps.getAPIKey()
  );

  let routeStops;

  let displayText = null;
  let titleText, optimize_btn_txt;
  titleText = "Route Optimization";
  optimize_btn_txt = "Optimize";
  displayText =
    '<li> Ability to feed in locations with time windows for optimization, will provide the best route path that accomidates as many time windows as possible, while returning locations that do not fit based on their time window information.</li><li>Utilizes the Time Window Routing API (<a href="https://developer.trimblemaps.com/restful-apis/routing/time-window-routing/" target="_blank">Documentation</a>).</li><li>Sample locations optimized assuming 40 minute dwell times at each location.</li>';

  useEffect(() => {
    if (twRes) {
      setShow(false);
      setRouteDetails(twRes.routeDetails);
      routeStops = twRes.routeStops;
      const mapRouteObj = mapService.createRoute(
        map,
        routeStops,
        TrimbleMaps.Common.RouteType.PRACTICAL,
        TrimbleMaps.Common.VehicleType.TRUCK,
        false,
        TrimbleMaps.Common.TollRoadsType.USE,
        false,
        TrimbleMaps.Common.HazMatType.NONE,
        false,
        map.getRegion(),
        0
      );
      setMapRoute(mapRouteObj);
    }
  }, [twRes]);

  const toggleTimeWindowRouting = () => {
    setShow(true);
    mapService.removeRoutes();
    if (routeOptimization === 2) {
      setTwBtnText("Revert");
      setRouteOptimization(1);
    } else {
      setTwBtnText(optimize_btn_txt);
      setRouteOptimization(2);
    }
  };

  return (
    <>
      <div className="modus-panel panel-lg h-100 shadow">
        <div className="panel-header">
          <h4>{titleText}</h4>
        </div>
        <div className="panel-body flex-fill">
          <div className="static-container d-flex align-items-center justify-content-start overflow-auto">
            <div className="mb-3">
              <div className="mb-1">
                <Button
                  type="button"
                  className="btn btn-primary col-md-12 text-capitalize"
                  id="optimizeBtn"
                  onClick={toggleTimeWindowRouting}>
                  {twBtnText}
                </Button>
              </div>
              <table
                className="table table-bordered table-sm"
                id="timeWindowTable">
                <thead>
                  <tr>
                    <th>Stop #</th>
                    <th>Location</th>
                    <th>Arrival</th>
                    <th>Departure</th>
                    <th>Time Window</th>
                    <th>Window Met</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {routeDetails.map((routeDetail, index) => (
                      <tr key={"unOptimize" + index}>
                        <td>{routeDetail.stopNo}</td>
                        <td>{routeDetail.location}</td>
                        <td>{routeDetail.arrival}</td>
                        <td>{routeDetail.departure}</td>
                        <td>{routeDetail.timeWindow}</td>

                        <td>
                          {routeDetail.windowMet ? (
                            <span>
                              <i
                                className="modus-icons"
                                aria-hidden="true"
                                style={{ color: "green" }}>
                                check_circle
                              </i>
                            </span>
                          ) : (
                            <span>
                              <i
                                className="modus-icons"
                                aria-hidden="true"
                                style={{ color: "red" }}>
                                warning
                              </i>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                </tbody>
              </table>
              <ul dangerouslySetInnerHTML={{ __html: displayText }}></ul>

              <LoadingModal
                setShow={setShow}
                show={show}
                loadingText={loadingText}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimeWindowRouting;
