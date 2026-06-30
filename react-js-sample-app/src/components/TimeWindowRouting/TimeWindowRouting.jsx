import React, { useState, useEffect } from "react";
import { useMapContext } from "../../context/mapContext";
import { useOutletContext } from "react-router-dom";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import useTimeWindowService from "../../hooks/useTimeWindowService";
import Button from "react-bootstrap/Button";
import LoadingModal from "../sharedComponents/LoadingModal";

const DISPLAY_TEXT =
  '<li> Ability to feed in locations with time windows for optimization, will provide the best route path that accommodates as many time windows as possible, while returning locations that do not fit based on their time window information.</li><li>Utilizes the Time Window Routing API (<a href="https://developer.trimblemaps.com/restful-apis/routing/time-window-routing/" target="_blank" rel="noopener">Documentation</a>).</li><li>Sample locations optimized assuming 40 minute dwell times at each location.</li>';

function TimeWindowRouting() {
  const { map, mapService } = useMapContext();
  const { apiKey } = useOutletContext();
  const [routeOptimization, setRouteOptimization] = useState(2);
  const [routeDetails, setRouteDetails] = useState([]);
  const [show, setShow] = useState(true);

  const region = map?.getRegion();
  const { data: timeWindowData, error } = useTimeWindowService(region, apiKey);

  useEffect(() => {
    if (!map || !timeWindowData) {
      return;
    }

    const activeRoute =
      routeOptimization === 1
        ? timeWindowData.optimized
        : timeWindowData.unoptimized;

    setRouteDetails(activeRoute.routeDetails);
    setShow(false);

    mapService.createRoute(
      map,
      activeRoute.routeStops,
      TrimbleMaps.Common.RouteType.PRACTICAL,
      TrimbleMaps.Common.VehicleType.TRUCK,
      false,
      TrimbleMaps.Common.TollRoadsType.USE,
      false,
      TrimbleMaps.Common.HazMatType.NONE,
      false,
      region,
      0
    );
  }, [map, mapService, region, routeOptimization, timeWindowData]);

  useEffect(() => {
    if (error) {
      setShow(false);
    }
  }, [error]);

  const toggleTimeWindowRouting = () => {
    if (!timeWindowData) {
      return;
    }

    mapService.removeRoutes();
    setRouteOptimization((current) => (current === 2 ? 1 : 2));
  };

  if (!map) {
    return null;
  }

  return (
    <>
      <div className="modus-panel panel-lg h-100 shadow">
        <div className="panel-header">
          <h4>Route Optimization</h4>
        </div>
        <div className="panel-body flex-fill">
          <div className="static-container d-flex align-items-center justify-content-start overflow-auto">
            <div className="mb-3">
              {error ? (
                <p className="text-danger">
                  Unable to load time window routing data.
                </p>
              ) : null}
              <div className="mb-1">
                <Button
                  type="button"
                  className="btn btn-primary col-md-12 text-capitalize"
                  id="optimizeBtn"
                  onClick={toggleTimeWindowRouting}
                  disabled={!timeWindowData}>
                  {routeOptimization === 2 ? "optimize" : "Revert"}
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
                  {routeDetails.map((routeDetail, index) => (
                    <tr key={"timeWindow" + index}>
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
                </tbody>
              </table>
              <ul dangerouslySetInnerHTML={{ __html: DISPLAY_TEXT }}></ul>

              <LoadingModal
                setShow={setShow}
                show={show}
                loadingText="Loading..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimeWindowRouting;
