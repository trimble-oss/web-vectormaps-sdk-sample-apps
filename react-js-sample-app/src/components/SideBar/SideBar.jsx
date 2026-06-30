import React from "react";
import { NavLink } from "react-router-dom";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { constants } from "../../Utils/constants";

function SideBar(props) {
  const { mapService, region, licensedFeature, setShowToast } = props;

  const resetMap = () => {
    mapService.removeRoutes();
    mapService.resetMapLayers();
    setShowToast(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";
  return (
    <nav id="mainSidebar" className="nav flex-column modus-sidebar">
      <ul>
        <li>
          <NavLink
            className={navLinkClass}
            to="/selectRegion"
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
            className={navLinkClass}
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
            className={navLinkClass}
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
            className={navLinkClass}
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
              className={navLinkClass}
              to="/timeWindowRouting"
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
              className={navLinkClass}
              title="Site Location and Routing"
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
              className={navLinkClass}
              title="Rail Routing Display"
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
