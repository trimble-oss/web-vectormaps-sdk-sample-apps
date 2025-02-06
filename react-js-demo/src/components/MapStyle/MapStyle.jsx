import React, { useState, useEffect } from "react";
import {
  mapStyleOptions,
  mapStyleOptionsWithoutSatellitePremium,
} from "../../Utils/mapStyle";
import { useMapContext } from "../../context/mapContext";
import { useOutletContext } from "react-router-dom";

function MapStyle() {
  const { map, mapService } = useMapContext();
  const { licensedFeature } = useOutletContext();
  const [mapStyles, setMapStyles] = useState(mapStyleOptions);
  const defaultStyle = mapStyleOptions.findIndex(
    (opt) => opt.value === map.getStyleName()
  );
  const [selectedStyle, setSelectedStyle] = useState(defaultStyle);
  useEffect(() => {
    if (!licensedFeature.premiumSatellite) {
      setMapStyles(mapStyleOptionsWithoutSatellitePremium);
    }
  }, [licensedFeature]);
  const selectStyle = (event) => {
    const optionIndex = event.target.value;
    const setValue = mapStyleOptions[optionIndex];
    setSelectedStyle(optionIndex);
    mapService.changeStyle(map, setValue.value, setValue?.satelliteProvider);
  };

  return (
    <div className="modus-panel panel-lg h-100 shadow">
      <div className="panel-header">
        <h4>Styling</h4>
      </div>
      <div className="panel-body flex-fill">
        <div className="static-container d-flex align-items-center justify-content-start">
          <div className="form-group w-100">
            <ul>
              <li>Ability to change the display style of the map.</li>
            </ul>
            <label htmlFor="mapStyle">Map Style</label>
            <select
              name="selectedStyle"
              id="mapStyle"
              onChange={selectStyle}
              className="form-control"
              value={selectedStyle}
            >
              {mapStyles.map((item, index) => (
                <option
                  key={item.value + index}
                  value={index}
                  disabled={item.requireLicense}
                >
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
  );
}

export default MapStyle;
