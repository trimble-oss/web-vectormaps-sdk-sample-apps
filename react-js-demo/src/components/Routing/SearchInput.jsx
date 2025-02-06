import React, { useState, useEffect } from "react";
import useSearchInput from "../../hooks/useSearchInput";
import { useMapContext } from "../../context/mapContext";
import { useForm } from "react-hook-form";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import * as _ from "lodash";
import { useOutletContext } from "react-router-dom";

function SearchInput(props) {
  const [locationListContents, setLocationListContents] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [routeLocationInput, setRouteLocationInput] = useState("");
  const [disableInput, setDisableInput] = useState(false);
  const [noData, setNoData] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const { routeLocations, setRouteLocation } = props;

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
    setRouteLocationInput(event.target.value);
    setShowLoading(true);
    trigger("routeLocationInput");
  };

  const clearSearchInput = () => {
    setValue("routeLocationInput", "");
  };
  const clearLocations = () => {
    clearSearchInput();
    setRouteLocation([]);
    setLocationListContents([]);
    setDisableInput(false);
    mapService.removeRoutes();
  };

  const locationSelect = (location) => {
    setLocationListContents([...locationListContents, location.ShortString]);
    if (!_.isUndefined(location.Coords)) {
      routeLocations.push(
        new TrimbleMaps.LngLat(location.Coords.Lon, location.Coords.Lat)
      );
      setRouteLocation(routeLocations);
    }
    if (routeLocations.length > 2) {
      setDisableInput((prev) => !prev);
    }
    clearSearchInput();
    setLocationList([]);
  };

  return (
    <>
      <div className="form-group p-2">
        <div id="locationList" className="p-2">
          {locationListContents.map((list, index) => (
            <p id="locationListParagraph" key={index}>
              {list}
            </p>
          ))}
          {locationListContents.length > 0 ? (
            <Button
              type="button"
              className="btn btn-primary"
              id="clearLocationsBtn"
              onClick={clearLocations}
            >
              Clear
            </Button>
          ) : null}
        </div>

        <div className="form-group p-2">
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
              id="locationSelection"
            >
              {locationList.map((location, index) => (
                <li
                  className="list-group-item"
                  key={index}
                  onClick={() => locationSelect(location)}
                >
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
