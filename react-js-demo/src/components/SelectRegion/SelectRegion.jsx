import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { regions } from "../../Utils/mapInfo";
import { useMapContext } from "../../context/mapContext";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";

function SelectRegion() {
  const { map, mapService } = useMapContext();
  const { setRegion, setMapStyleLoaded, licensedFeature } = useOutletContext();
  const [selectedRegion, setSelectedRegion] = useState(map.getRegion());
  const [regionOptions, setRegionOptions] = useState(regions);

  if (map) {
    mapService.resetMapLayers(map);
  }
  useEffect(() => {
    if (!licensedFeature.euSupport) {
      setRegionOptions([
        {
          displayName: "North America",
          value: TrimbleMaps.Common.Region.NA,
          requireLicense: false
        },
        {
          displayName: "Europe",
          value: TrimbleMaps.Common.Region.EU,
          requireLicense: true
        }
      ]);
    }
  }, [licensedFeature]);

  const selectRegion = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setRegion(region);
    setMapStyleLoaded(false);
    mapService.changeRegion(map, region);
  };

  return (
    <>
      <div className="modus-panel panel-lg h-100 shadow">
        <div className="panel-header">
          <h4>Region</h4>
        </div>
        <div className="panel-body flex-fill">
          <div className="static-container d-flex align-items-center justify-content-start">
            <div className="mb-3">
              <ul>
                <li>
                  Ability to change which region of the map is selected to
                  display detailed location, highway and street information.
                </li>
              </ul>
              <label htmlFor="mapStyle" className="col-form-label fw-normal">
                Region Selector
              </label>
              <select
                onChange={selectRegion}
                value={selectedRegion}
                className="form-select">
                {regionOptions.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                    disabled={item.requireLicense}>
                    {item.requireLicense
                      ? item.displayName + " (Unlicensed Feature)"
                      : item.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SelectRegion;
