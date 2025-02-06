import React from "react";
import { NavLink } from "react-router-dom";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { constants } from "../../Utils/constants";

function SideBar(props) {
  const { mapService, region, map, licensedFeature, setShowToast } = props;

  const resetMap = () => {
    mapService.removeRoutes();
    mapService.resetMapLayers(map);
    setShowToast(false);
  };
  return (
    <nav id="mainSidebar" className="nav flex-column modus-sidebar">
      <ul>
        <li>
          <NavLink
            className="nav-link"
            to="/selectRegion"
            activeclassname="active"
            onClick={resetMap}
            title="Select Region"
          >
            <span className="left-nav-icon">
              <i className="modus-icons notranslate" aria-hidden="true">
                globe
              </i>
            </span>
            Select Region
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            activeclassname="active"
            to="/mapStyle"
            title="Base Map and Styles"
            onClick={resetMap}
          >
            <span className="left-nav-icon">
              <i className="modus-icons notranslate" aria-hidden="true">
                map
              </i>
            </span>
            Base Map and Styles
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            activeclassname="active"
            to="/contentLayers"
            onClick={resetMap}
            title="Content Layers"
          >
            <span className="left-nav-icon">
              <i className="modus-icons notranslate" aria-hidden="true">
                map_layers
              </i>
            </span>
            Content Layers
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-link"
            activeclassname="active"
            to="/routing"
            onClick={resetMap}
            title="Basic Routing"
          >
            <span className="left-nav-icon">
              <i className="modus-icons notranslate" aria-hidden="true">
                route
              </i>
            </span>
            Basic Routing
          </NavLink>
        </li>

        {licensedFeature.timeWindowOptimization ? (
          <li>
            <NavLink
              className="nav-link"
              activeclassname="active"
              to={
                licensedFeature.timeWindowOptimization
                  ? "/timeWindowRouting"
                  : null
              }
              onClick={licensedFeature.timeWindowOptimization ? resetMap : null}
              title={
                licensedFeature.timeWindowOptimization
                  ? "Time Window Routing"
                  : constants.UNLICENSED_FEATURE
              }
            >
              <span className="left-nav-icon">
                <i className="modus-icons notranslate" aria-hidden="true">
                  dispatch
                </i>
              </span>
              Time Window Routing
            </NavLink>
          </li>
        ) : (
          <li>
            <a className="nav-link" title={constants.UNLICENSED_MSG}>
              <span className="d-flex disabled">
                <span className="left-nav-icon">
                  <i className="modus-icons notranslate" aria-hidden="true">
                    dispatch
                  </i>
                </span>
                Time Window Routing
              </span>
            </a>
          </li>
        )}
        <li>
          {region === TrimbleMaps.Common.Region.NA ? (
            <NavLink
              className="nav-link"
              title="Site Location and Routing"
              activeclassname="active"
              to="/siteLocationRouting"
              onClick={resetMap}
            >
              <span className="left-nav-icon">
                <i className="modus-icons notranslate" aria-hidden="true">
                  site_manager
                </i>
              </span>
              Site Location and Routing
            </NavLink>
          ) : null}
        </li>
        <li>
          {region === TrimbleMaps.Common.Region.NA ? (
            <NavLink
              className="nav-link"
              title="Rail Routing Display"
              activeclassname="active"
              to="/railRouting"
              onClick={resetMap}
            >
              <span className="left-nav-icon">
                <i className="modus-icons notranslate" aria-hidden="true">
                  train
                </i>
              </span>
              Rail Routing Display
            </NavLink>
          ) : null}
        </li>
      </ul>
    </nav>
  );
}

export default SideBar;
