import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { vehicleType, routeTypes, hazardousTypes } from "../../Utils/routing";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import "./Routing.scss";
import { useMapContext } from "../../context/mapContext";
import { useOutletContext } from "react-router-dom";
import SearchInput from "./SearchInput";
import ShowReports from "./Reports";
import AutoDescription from "./autoDescription";
import CustomTooltip from "../ToolTip/CustomToolTip";

function Routing() {
  const { register } = useForm({
    mode: "onChange",
  });
  // eslint-disable-next-line no-unused-vars
  const [routeLocations, setRouteLocation] = useState([]);
  const { licensedFeature } = useOutletContext();
  const { map, mapService } = useMapContext();
  const [showReportsBtn, setShowReportsBtn] = useState(false);
  const [disabledRouteBtn, setDisabledRouteBtn] = useState(true);
  const [vehicleTypes, setVehicleTypes] = useState(vehicleType);
  const region = map.getRegion();
  // eslint-disable-next-line no-unused-vars
  const [mapRoute, setMapRoute] = useState(undefined);
  const [reports, setReports] = useState(undefined);
  const [routeFormData, setRouteFormData] = useState({
    vehicleType: TrimbleMaps.Common.VehicleType.TRUCK,
    routeType: TrimbleMaps.Common.RouteType.PRACTICAL,
    routingHighwayOnly: false,
    avoidTolls: false,
    bordersOpen: false,
    hazMat: TrimbleMaps.Common.HazMatType.NONE,
  });
  const [routeTypeOptions, setRouteTypeOptions] = useState(routeTypes);

  useEffect(() => {
    if (!licensedFeature.truckRouting) {
      setVehicleTypes([
        {
          displayName: "Truck",
          value: TrimbleMaps.Common.VehicleType.TRUCK,
          requireLicense: true,
        },
        {
          displayName: "Light Truck",
          value: TrimbleMaps.Common.VehicleType.LIGHT_TRUCK,
          requireLicense: false,
        },
        {
          displayName: "Auto",
          value: TrimbleMaps.Common.VehicleType.AUTOMOBILE,
          requireLicense: false,
        },
      ]);
      setRouteFormData((prev) => ({
        ...prev,
        vehicleType: TrimbleMaps.Common.VehicleType.AUTOMOBILE,
      }));
    }
  }, [licensedFeature]);

  const addRouteLayer = () => {
    mapService.removeRoutes();
    let tolls;
    if (routeFormData.avoidTolls) {
      tolls = TrimbleMaps.Common.TollRoadsType.AVOID_IF_POSSIBLE;
    } else {
      tolls = TrimbleMaps.Common.TollRoadsType.USE;
    }
    const stops = routeLocations.map((location) => location.coord);
    mapService.createRoute(
      map,
      stops,
      routeFormData.routeType,
      routeFormData.vehicleType,
      routeFormData.routingHighwayOnly,
      tolls,
      routeFormData.bordersOpen,
      routeFormData.hazMat,
      false,
      region,
      1
    );

    mapService.mapRoute.on("report", (reports) => {
      setReports(reports);
      setMapRoute(mapService.mapRoute);
      setShowReportsBtn(true);
    });
  };

  const setRouteLocationValue = (routeLocations) => {
    if (routeLocations.length > 1) {
      setDisabledRouteBtn(false);
    } else {
      setDisabledRouteBtn(true);
      setShowReportsBtn(false);
    }
  };
  const onChangeEvent = (input, e) => {
    if (input === "switch") {
      setRouteFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.checked,
      }));
    } else {
      setRouteFormData((prev) => ({
        ...prev,
        [e.target.id]: Number(e.target.value),
      }));
    }
  };
  const onVehicleTypeChange = (e, input, callback) => {
    if (Number(e.target.value) === TrimbleMaps.Common.VehicleType.AUTOMOBILE) {
      setRouteTypeOptions([
        { displayName: "Fastest", value: TrimbleMaps.Common.RouteType.FASTEST },
      ]);
    } else {
      setRouteTypeOptions(routeTypes);
    }
    callback(input, e);
  };

  return (
    <div>
      <div className="modus-panel panel-lg h-100 shadow">
        <div className="panel-header">
          <h4>Locations</h4>
        </div>
        <SearchInput
          routeLocations={routeLocations}
          setRouteLocation={setRouteLocationValue}
        />
        <div className="panel-header bg-transparent border-bottom align-items-center">
          <h5 className="px-2 text-center">Route Settings</h5>
        </div>
        <div className="panel-body flex-fill p-2 overflow-auto">
          <form>
            <div className=" ">
              <div className="mb-3">
                <label
                  htmlFor="vehicleType"
                  className="col-form-label fw-normal">
                  <b>Vehicle Type</b>
                </label>
                {licensedFeature.vehicleDimension ? (
                  <div>
                    <p className="p-font-size">
                      Demo uses pre-defined vehicle profiles, but SDK does
                      support full vehicle dimension customization.
                      <br />
                      <br />
                      <b>Current vehicle dimensions:</b>
                    </p>
                    <AutoDescription
                      region={region}
                      vehicleType={routeFormData.vehicleType}></AutoDescription>
                  </div>
                ) : null}
                <Form.Group controlId="vehicleType">
                  <Form.Control
                    as="select"
                    className="form-select"
                    value={routeFormData.vehicleType}
                    {...register("vehicleType")}
                    // eslint-disable-next-line no-unused-vars
                    onChange={(e, _input, callback) =>
                      onVehicleTypeChange(e, "select", onChangeEvent)
                    }>
                    {vehicleTypes.map((vehicle) => (
                      <option
                        key={vehicle.value}
                        value={vehicle.value}
                        disabled={vehicle.requireLicense}>
                        {vehicle.requireLicense
                          ? vehicle.displayName + " (Unlicensed Feature)"
                          : vehicle.displayName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <Form.Group controlId="routeType">
                <Form.Label>Route Type</Form.Label>
                <p className="p-font-size">
                  <b>Practical</b>: Most logical route we believe a driver would
                  take. Balances distance, duration, number of turns and road
                  classifications.
                  <br />
                  <b>Shortest</b>: Uses shortest distance from stop to stop.
                  <br />
                  <b>Fastest</b>: Uses the fastest duration from stop to stop.
                </p>
                <Form.Control
                  as="select"
                  className="form-select"
                  value={routeFormData.routeType}
                  {...register("routeType")}
                  onChange={(e) => onChangeEvent("select", e)}>
                  {routeTypeOptions.map((route) => (
                    <option key={route.value} value={route.value}>
                      {route.displayName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {region === TrimbleMaps.Common.Region.NA ? (
                <Form.Group controlId="routingHighwayOnly">
                  <Form.Check
                    type="switch"
                    id="routingHighwayOnly"
                    label="Highway Routing Only "
                    {...register("routingHighwayOnly")}
                    onChange={(e) => onChangeEvent("switch", e)}
                    defaultChecked={false}
                  />
                  <p className="p-font-size">
                    Use street data or only highways for routing.
                  </p>
                </Form.Group>
              ) : null}

              <Form.Group controlId="avoidTolls">
                <Form.Check
                  type="switch"
                  id="avoidTolls"
                  label="Avoid Tolls"
                  {...register("avoidTolls")}
                  onChange={(e) => onChangeEvent("switch", e)}
                  disabled={!licensedFeature.tolls}
                />
                <p
                  className={
                    !licensedFeature.tolls
                      ? "p-font-size d-inline disabled"
                      : "p-font-size d-inline"
                  }
                  disabled={!licensedFeature.tolls}>
                  Allow use of tolls plazas or avoid if possible.
                </p>
                <CustomTooltip
                  showToolTip={!licensedFeature.tolls}></CustomTooltip>
              </Form.Group>

              <Form.Group controlId="bordersOpen">
                <Form.Check
                  type="switch"
                  id="bordersOpen"
                  label="Borders Open"
                  {...register("bordersOpen")}
                  onChange={(e) => onChangeEvent("switch", e)}
                />
                <p className="p-font-size">
                  Open/close international borders if possible.
                </p>
              </Form.Group>

              <Form.Group controlId="hazMat">
                <Form.Label>Hazardous Materials</Form.Label>
                <CustomTooltip
                  showToolTip={!licensedFeature.hazmat}></CustomTooltip>
                <Form.Control
                  as="select"
                  className="form-select"
                  value={routeFormData.hazMat}
                  {...register("hazMat")}
                  onChange={(e) => onChangeEvent("select", e)}
                  disabled={!licensedFeature.hazmat}>
                  {hazardousTypes.map((hazardousType) => (
                    <option
                      key={hazardousType.value}
                      value={hazardousType.value}>
                      {hazardousType.displayName}
                    </option>
                  ))}
                </Form.Control>
                <p className="p-font-size">
                  Include hazardous materials for transit.
                </p>
              </Form.Group>
            </div>

            <div className="float-end">
              <Button
                type="button"
                className="btn btn-primary"
                id="routeBtn"
                onClick={addRouteLayer}
                disabled={disabledRouteBtn}>
                Route
              </Button>
              {showReportsBtn ? (
                <ShowReports
                  reports={reports}
                  disableBtn={showReportsBtn && !licensedFeature.premiumReports}
                />
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Routing;
