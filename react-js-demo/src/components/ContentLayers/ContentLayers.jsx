import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useMapContext } from "../../context/mapContext";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { layerSpecificLocation } from "../../Utils/layerSpecificlocation";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import CustomTooltip from "../ToolTip/CustomToolTip";

function ContentLayers() {
  const { map, mapService } = useMapContext();
  const { licensedFeature, setShowToast, setMessage } = useOutletContext();
  const [selected, setSelected] = useState(0);
  const region = map.getRegion();

  useEffect(() => {
    openLayer(selected);
  }, [selected]);
  const openLayer = (i) => {
    setShowToast(false);
    mapService.resetMapLayers(map);

    switch (i) {
      case 0: {
        if (!map.isTrafficVisible() && licensedFeature.traffic) {
          const mapLocation = layerSpecificLocation(region, "traffic");
          mapService.changeMapLocation(map, mapLocation);
          map.toggleTrafficVisibility();
        }
        break;
      }

      case 1: {
        map.toggleWeatherRadarVisibility();
        break;
      }
      case 2: {
        map.toggleWeatherAlertVisibility();
        map.on("weatheralert", () => {
          map.setWeatherAlertVisibility(true);
        });
        break;
      }

      case 3: {
        mapService.toggleRoadSurfaceVisibility(map);
        mapService.toggleRoadSurfaceVisibility(map);
        break;
      }

      case 4: {
        const place = layerSpecificLocation(region, "places");
        mapService.changeMapLocation(map, place);
        map.togglePlacesVisibility();
        map.setLayoutProperty("places_gates", "icon-size", 0.7);
        break;
      }

      case 5: {
        const poiLocation = layerSpecificLocation(region, "poi");
        mapService.changeMapLocation(map, poiLocation);
        map.togglePOIVisibility();
        break;
      }

      case 6: {
        if (
          map.getStyle().name.toLowerCase() ===
          TrimbleMaps.Common.Style.SATELLITE
        ) {
          setShowToast(true);
          setMessage({
            type: "warning",
            text: "3D buildings are unavailable in Satellite view"
          });
        } else {
          const d3BuildingLocation = layerSpecificLocation(
            region,
            "3dBuilding"
          );
          mapService.changeMapLocation(map, d3BuildingLocation);
          map.toggle3dBuildingVisibility();
          map.setPitch(60);
        }
        break;
      }

      case 7: {
        const trafficIncidentLocation = layerSpecificLocation(
          region,
          "trafficIncident"
        );
        mapService.changeMapLocation(map, trafficIncidentLocation);
        mapService.addTrafficIncidentLayer(map);
        break;
      }

      case 8: {
        const truckRestrictionLocation = layerSpecificLocation(
          region,
          "truckRestriction"
        );
        mapService.changeMapLocation(map, truckRestrictionLocation);
        mapService.addTruckRestrictionLayer(map);
        break;
      }
      case 9: {
        const customPlacesLocation = layerSpecificLocation(
          region,
          "customPlacesLocation"
        );
        if (region === TrimbleMaps.Common.Region.NA) {
          mapService.addCustomPlaceLayerNA(map, customPlacesLocation);
        } else {
          mapService.addCustomPlaceLayerEU(map, customPlacesLocation);
        }

        break;
      }

      default:
    }
  };
  return (
    <>
      <div className="modus-panel panel-lg h-100 shadow">
        <div className="panel-header">
          <h4>Content Layers</h4>
        </div>
        <Accordion defaultActiveKey="0">
          <Card
            onClick={() => {
              licensedFeature.traffic ? setSelected(0) : null;
            }}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              className={!licensedFeature.traffic ? "unlicensed" : ""}
            >
              <h6
                className={
                  !licensedFeature.traffic
                    ? "disabled mb-0 d-inline"
                    : "mb-0 d-inline"
                }
                id="collapsible-group-item-1"
              >
                Traffic
              </h6>
              <CustomTooltip
                showToolTip={!licensedFeature.traffic}></CustomTooltip>
            </Accordion.Toggle>
            {licensedFeature.traffic ? (
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <ul>
                    <li>
                      Indicates the flow of traffic based on 4 congestion
                      levels.
                    </li>
                    <li>Visible at zoom level 9 and greater.</li>
                  </ul>
                  <div className="panel-header bg-transparent mb-1">
                    <h5 className="px-2 text-center">Traffic Key</h5>
                  <div className="panel-header bg-transparent mb-1">
                    <h5 className="px-2 text-center">Traffic Key</h5>
                  </div>
                  <svg
                    className="bi pe-none me-2 mr-2"
                    width="18"
                    height="18"
                    style={{ background: "green" }}></svg>
                  No/Little Traffic
                  <br />
                  <svg
                    className="bi pe-none me-2 mr-2"
                    width="18"
                    height="18"
                    style={{ background: "orange" }}></svg>
                  Light Traffic
                  <br />
                  <svg
                    className="bi pe-none me-2 mr-2"
                    width="18"
                    height="18"
                    style={{ background: "red" }}></svg>
                  Heavy Traffic
                  <br />
                  <svg
                    className="bi pe-none me-2 mr-2"
                    width="18"
                    height="18"
                    style={{ background: "black" }}></svg>
                  Road Closed
                </Card.Body>
              </Accordion.Collapse>
            ) : null}
          </Card>
          <Card
            onClick={() => {
              licensedFeature.weatherRadar ? setSelected(1) : null;
            }}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="1"
              className={!licensedFeature.weatherRadar ? "unlicensed" : ""}
            >
              <h6
                className={
                  !licensedFeature.weatherRadar
                    ? "disabled mb-0 d-inline"
                    : "mb-0 d-inline"
                }
                id="collapsible-group-item-1"
              >
                Weather Radar
              </h6>
              <CustomTooltip
                showToolTip={!licensedFeature.weatherRadar}></CustomTooltip>
            </Accordion.Toggle>
            {licensedFeature.weatherRadar ? (
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <ul>
                    <li>Displays weather radar overlay on map.</li>
                  </ul>
                </Card.Body>
              </Accordion.Collapse>
            ) : null}
          </Card>

          {region === TrimbleMaps.Common.Region.NA ? (
            <Card
              onClick={() => {
                licensedFeature.weatherAlerts ? setSelected(2) : null;
              }}>
              <Accordion.Toggle
                as={Card.Header}
                eventKey="2"
                className={!licensedFeature.weatherAlerts ? "unlicensed" : ""}
              >
                <h6
                  className={
                    !licensedFeature.weatherAlerts
                      ? "disabled mb-0 d-inline"
                      : "mb-0 d-inline"
                  }
                  id="collapsible-group-item-1"
                >
                  Weather Alerts
                </h6>
                <CustomTooltip
                  showToolTip={!licensedFeature.weatherAlerts}></CustomTooltip>
              </Accordion.Toggle>
              {licensedFeature.weatherAlerts ? (
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                    <ul>
                      <li>
                        Displays weather alerts for various weather events only
                        in North America.
                      </li>
                      <li>
                        Can add click event to layer to display event
                        information.
                      </li>
                      <li>
                        Alert Filter Control can toggle visibility of different
                        alert severity, urgency and certainty.
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              ) : null}
            </Card>
          ) : null}
          {region === TrimbleMaps.Common.Region.NA ? (
            <Card
              onClick={() => {
                licensedFeature.roadSurface ? setSelected(3) : null;
              }}>
              <Accordion.Toggle
                as={Card.Header}
                eventKey="3"
                className={!licensedFeature.roadSurface ? "unlicensed" : ""}
              >
                <h6
                  className={
                    !licensedFeature.roadSurface
                      ? "disabled mb-0 d-inline"
                      : "mb-0 d-inline"
                  }
                  id="collapsible-group-item-1"
                >
                  Road Surface
                </h6>
                <CustomTooltip
                  showToolTip={!licensedFeature.roadSurface}></CustomTooltip>
              </Accordion.Toggle>
              {licensedFeature.roadSurface ? (
                <Accordion.Collapse eventKey="3">
                  <Card.Body>
                    <ul>
                      <li>
                        Displays road surface condition for North America.
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              ) : null}
            </Card>
          ) : null}
          {region === TrimbleMaps.Common.Region.NA ? (
            <Card
              onClick={() => {
                setSelected(4);
              }}>
              <Accordion.Toggle as={Card.Header} eventKey="4">
                <h6 className="mb-0" id="collapsible-group-item-1">
                  Places
                </h6>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="4">
                <Card.Body>
                  <ul>
                    <li>
                      Displays place polygon on the map, such as distribution
                      centers and manufacturing facilities.
                    </li>
                    <li>
                      Place information includes site polygon and truck
                      entry/exit gates (where available).
                    </li>
                    <li>Includes points of interest icons.</li>
                  </ul>
                  <div className="panel-header bg-transparent mb-1">
                    <h5 className="px-2 text-center">Gate Icons</h5>
                  <div className="panel-header bg-transparent mb-1">
                    <h5 className="px-2 text-center">Gate Icons</h5>
                  </div>
                  <img
                    src={"../../assets/img/circle-outline-green.png"}
                    width="22"
                    height="22"
                    alt=""
                  />
                  Entrance Gate
                  <br />
                  <img
                    src={"../../assets/img/circle-outline-cyan.png"}
                    width="22"
                    height="22"
                    alt=""
                  />
                  Two-Way Gate
                  <br />
                  <img
                    src="../../assets/img/circle-outline-red.png"
                    width="22"
                    height="22"
                    alt=""
                  />
                  Exit Gate
                  <br />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ) : null}

          <Card
            onClick={() => {
              licensedFeature.poi ? setSelected(5) : null;
            }}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="5"
              className={!licensedFeature.poi ? "unlicensed" : ""}
            >
              <h6
                className={
                  !licensedFeature.poi
                    ? "disabled mb-0 d-inline"
                    : "mb-0 d-inline"
                }
                id="collapsible-group-item-1"
              >
                Point of Interest
              </h6>
              <CustomTooltip showToolTip={!licensedFeature.poi}></CustomTooltip>
            </Accordion.Toggle>
            {licensedFeature.poi ? (
              <Accordion.Collapse eventKey="5">
                <Card.Body>
                  <ul>
                    <li>Display points of interest icons on the map.</li>
                  </ul>
                  <div className="panel-header bg-transparent mb-1">
                    <h5 className="px-2 text-center">Example Place Icons</h5>
                  <div className="panel-header bg-transparent mb-1">
                    <h5 className="px-2 text-center">Example Place Icons</h5>
                  </div>
                  <img
                    src="../../assets/img/poi_distribution_center.png"
                    width="22"
                    height="22"
                    alt=""
                  />
                  Distribution Center
                  <br />
                  <img
                    src="../../assets/img/poi_fuel.png"
                    width="22"
                    height="22"
                    alt=""
                  />
                  Fuel
                  <br />
                  <img
                    src="../../assets/img/poi_manufacturing_plant.png"
                    width="22"
                    height="22"
                    alt=""
                  />
                  Manufacturing Plant
                  <br />
                  <img
                    src="../../assets/img/poi_rest_area.png"
                    width="22"
                    height="22"
                    alt=""
                  />
                  Rest Area
                  <br />
                </Card.Body>
              </Accordion.Collapse>
            ) : null}
          </Card>

          <Card
            onClick={() => {
              setSelected(6);
            }}>
            <Accordion.Toggle as={Card.Header} eventKey="6">
              <h6 className="mb-0" id="collapsible-group-item-1">
                3D Building
              </h6>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="6">
              <Card.Body>
                <ul>
                  <li>Displays 3D buildings.</li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card
            onClick={() => {
              licensedFeature.traffic ? setSelected(7) : null;
            }}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="7"
              className={!licensedFeature.traffic ? "unlicensed" : ""}
            >
              <h6
                className={
                  !licensedFeature.traffic
                    ? "disabled mb-0 d-inline"
                    : "mb-0 d-inline"
                }
                id="collapsible-group-item-1"
              >
                Traffic Incidents
              </h6>
              <CustomTooltip
                showToolTip={!licensedFeature.traffic}></CustomTooltip>
            </Accordion.Toggle>
            {licensedFeature.traffic ? (
              <Accordion.Collapse eventKey="7">
                <Card.Body>
                  <div className="card-body">
                    <ul>
                      <li>Displays current traffic incidents.</li>
                      <li>
                        Click event can be added to layer to show incident
                        information.
                      </li>
                      <li>
                        Control can be added to layer to filter incident types.
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            ) : null}
          </Card>

          <Card
            onClick={() => {
              licensedFeature.truckRestriction ? setSelected(8) : null;
            }}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="8"
              className={!licensedFeature.truckRestriction ? "unlicensed" : ""}
            >
              <h6
                className={
                  !licensedFeature.truckRestriction
                    ? "disabled mb-0 d-inline"
                    : "mb-0 d-inline"
                }
                id="collapsible-group-item-1"
              >
                Truck Restrictions
              </h6>
              <CustomTooltip
                showToolTip={!licensedFeature.truckRestriction}></CustomTooltip>
            </Accordion.Toggle>
            {licensedFeature.truckRestriction ? (
              <Accordion.Collapse eventKey="8">
                <Card.Body>
                  <ul>
                    <li>Displays truck restrictions on the map.</li>
                  </ul>
                </Card.Body>
              </Accordion.Collapse>
            ) : null}
          </Card>

          <Card
            onClick={() => {
              licensedFeature.customData ? setSelected(9) : null;
            }}>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="9"
              className={!licensedFeature.customData ? "unlicensed" : ""}
            >
              <h6
                className={
                  !licensedFeature.customData
                    ? "disabled mb-0 d-inline"
                    : "mb-0 d-inline"
                }
                id="collapsible-group-item-1"
              >
                Custom Content
              </h6>
              <CustomTooltip
                showToolTip={!licensedFeature.customData}></CustomTooltip>
            </Accordion.Toggle>
            {licensedFeature.customData ? (
              <Accordion.Collapse eventKey="9">
                <Card.Body>
                  {region === TrimbleMaps.Common.Region.NA ? (
                    <div>
                      <ul>
                        <li>
                          Ability to plot custom data onto the map via geoJson
                          objects.
                        </li>
                        <li>
                          Information for this example is comprised of a geojson
                          source that is broken down into 3 different custom
                          content layers:
                        </li>
                        <ul>
                          <li>
                            <b>Fill Layer</b>: Creates the state boundary
                            polygon of New Jersey and sets the opacity.
                          </li>
                          <li>
                            <b>Line Layer</b>: Forms the outline around the New
                            Jersey polygon.
                          </li>
                          <li>
                            <b>Symbol Layer</b>: Adds the Trimble MAPS logo to
                            the map.
                          </li>
                        </ul>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <ul>
                        <li>
                          Ability to plot custom data onto the map via geoJson
                          objects.
                        </li>
                        <li>
                          Information for this example is comprised of a geojson
                          source that is broken down into 3 different custom
                          content layers:
                        </li>
                        <ul>
                          <li>
                            <b>Fill Layer</b>: Creates the country boundary
                            polygon of Great Britain and sets the opacity.
                          </li>
                          <li>
                            <b>Line Layer</b>: Forms the outline around the
                            Great Britain polygon.
                          </li>
                          <li>
                            <b>Symbol Layer</b>: Adds the Trimble Maps logo to
                            the map.
                          </li>
                        </ul>
                      </ul>
                    </div>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            ) : null}
          </Card>
        </Accordion>
      </div>
    </>
  );
}

export default ContentLayers;
