import React, { useState, useEffect } from "react";
import useSearchInput from "../../hooks/useSearchInput";
import { useMapContext } from "../../context/mapContext";
import { useForm } from "react-hook-form";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import * as _ from "lodash";
import { useOutletContext } from "react-router-dom";
import { layerSpecificLocation } from "../../Utils/layerSpecificlocation";

function SearchInput(props) {
  const [locationListContents, setLocationListContents] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [routeLocationInput, setRouteLocationInput] = useState("");
  const [disableInput, setDisableInput] = useState(false);
  const [noData, setNoData] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const { routeLocations, setRouteLocation, setShowToast } = props;
  const [placeholderText, setPlaceholderText] = useState("Enter Location...");

  const { map, mapService } = useMapContext();
  const { apiKey } = useOutletContext();
  let list;
  const { register, setValue, setError, formState, trigger } = useForm({
    mode: "onChange",
  });
  const { errors } = formState;
  list = useSearchInput(routeLocationInput, map.getRegion(), apiKey);

  useEffect(() => {
    if (!_.isEmpty(list)) {
      setShowLoading(false);
      setLocationList(list["Locations"]);
      setError("server", {
        type: list.ErrString ? list.ErrString : "",
      });
      if (list.ErrString) return;
      setNoData(
        list["Locations"] && list["Locations"].length <= 0 ? true : false
      );
    }
  }, [list]);

  const valueChangeInput = (event) => {
    if (event.target.value.length !== 0) {
      setRouteLocationInput(event.target.value);
      setShowLoading(true);
      trigger("routeLocationInput");
    } else {
      setLocationList([]);
    }
  };

  const clearSearchInput = () => {
    setValue("routeLocationInput", "");
  };
  const clearLocations = () => {
    clearSearchInput();
    routeLocations.length = 0;
    setRouteLocation([]);
    setLocationListContents([]);
    setDisableInput(false);
    setPlaceholderText("Enter Location...");
    mapService.removeRoutes();
    mapService.removeStops();
    const mapLocation = layerSpecificLocation(map.getRegion());
    mapService.changeMapLocation(mapLocation);
    setShowToast(false);
  };

  const locationSelect = (location) => {
    if (!_.isUndefined(location.Coords)) {
      routeLocations.push({
        coord: new TrimbleMaps.LngLat(location.Coords.Lon, location.Coords.Lat),
        address: location.ShortString,
      });
      setRouteLocation(routeLocations);
      setLocationListContents([]);
      mapService.centerOnMap([location.Coords.Lon, location.Coords.Lat]);
      mapService.addMarker(routeLocations);
    }
    if (routeLocations.length > 2) {
      setDisableInput((prev) => !prev);
      setPlaceholderText("This sample app is limited to a max of three stops");
    }
    clearSearchInput();
    let stopsList = [];
    stopsList = routeLocations.map((s) => s.address);
    const locationListContents = stopsList.map((s, index) =>
      transformStops(s, index, stopsList)
    );
    setLocationListContents(locationListContents);
    setLocationList([]);
  };

  const transformStops = (shortAddress, index, stopState) => {
    let stopType = "S";
    if (index === 0) {
      stopType = "O";
    } else if (index === stopState.length - 1) {
      stopType = "D";
    }
    return {
      stopType,
      shortAddress,
    };
  };
  return (
    <>
      <div className="mb-3 p-2">
        <div id="locationList" className="p-2">
          <table className="w-100">
            <tbody>
              <tr className="route-stop-row">
                <th colSpan="2"></th>
                <th className="route-stop-detail-cell"></th>
              </tr>
              {locationListContents.map((stop, stopIndex) => (
                <tr className="route-stop-row" key={stopIndex}>
                  <td className="route-stop-icon-cell">
                    {locationListContents.length > 0 ? (
                      <span
                        className={`route-stop-line ${
                          locationListContents.length > 1 && stopIndex === 0
                            ? "top"
                            : stopIndex === locationListContents.length - 1 &&
                              stopIndex !== 0
                            ? "bottom"
                            : stopIndex !== 0 &&
                              stopIndex !== locationListContents.length - 1
                            ? "middle"
                            : ""
                        }`}></span>
                    ) : null}
                    {stop.stopType === "O" || stop.stopType === "D" ? (
                      <span
                        className={`route-stop-circle ${
                          stop.stopType === "O"
                            ? "origin"
                            : stop.stopType === "D"
                            ? "destination"
                            : ""
                        }`}></span>
                    ) : null}
                    {stop.stopType === "S" ? (
                      <span className="route-stop-number routeColor">
                        {stopIndex}
                      </span>
                    ) : null}
                  </td>
                  <td className="route-stop-address">
                    <div className="font-weight-bolder">
                      {stop.shortAddress}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {locationListContents.length > 0 ? (
            <Button
              type="button"
              className="btn btn-primary"
              id="clearLocationsBtn"
              onClick={clearLocations}>
              Clear
            </Button>
          ) : null}
        </div>

        <div className="mb-3 p-2">
          <Form.Group className="mb-3" controlId="routeLocationInput">
            <Form.Label>Location Selection</Form.Label>
            <Form.Control
              className={
                (errors.routeLocationInput &&
                  errors.routeLocationInput.types &&
                  errors.routeLocationInput.types.pattern) ||
                (errors.server && errors.server.type)
                  ? "is-invalid"
                  : null
              }
              type="text"
              {...register("routeLocationInput", {
                required: "",
                pattern: {
                  value: "^[a-zA-Z ]+$",
                  message: " Single search error invalid input",
                },
              })}
              placeholder={placeholderText}
              onChange={valueChangeInput}
              disabled={disableInput}
            />
            {errors.routeLocationInput && (
              <p>{errors.routeLocationInput.message}</p>
            )}
            {errors.routeLocationInput &&
              errors.routeLocationInput.types &&
              errors.routeLocationInput.types.pattern && (
                <p className="text-danger">Single search error invalid input</p>
              )}
            {(errors.routeLocationInput &&
              errors.routeLocationInput.types &&
              errors.routeLocationInput.types.pattern) ||
              (errors.server && errors.server.type && (
                <p className="text-danger">Single search error invalid input</p>
              ))}
          </Form.Group>
        </div>
        <div className="p-2">
          {showLoading ? (
            <div id="singleSearchLoading">
              <div>
                <div className="text-center text-primary">
                  <div className="spinner-border"></div>
                  <div className="h3 text-primary mt-3">Loading...</div>
                </div>
              </div>
            </div>
          ) : null}
          <div id="locationSelectionDiv">
            <ul
              className="list-group list-group-condensed"
              id="locationSelection">
              {locationList.map((location, index) => (
                <li
                  className="list-group-item"
                  key={index}
                  onClick={() => locationSelect(location)}>
                  {location?.ShortString}
                </li>
              ))}
            </ul>
          </div>
          {noData ? <span>No result found</span> : null}
        </div>
      </div>
    </>
  );
}

export default SearchInput;
