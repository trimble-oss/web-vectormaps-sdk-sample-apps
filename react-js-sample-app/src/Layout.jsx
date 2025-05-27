import { Outlet, useNavigate } from "react-router-dom";

import Map from "./components/Map/Map.jsx";
import React, { useState, useEffect } from "react";
import { MapContext } from "./context/mapContext.js";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import MapService from "./services/MapService.js";
import GetAPIKeyModal from "./components/sharedComponents/GetAPIKeyModal.jsx";
import LoadingModal from "./components/sharedComponents/LoadingModal.jsx";
import ToastMessage from "./components/sharedComponents/toastMessage.jsx";
import SideBar from "./components/SideBar/SideBar.jsx";
import { useLocation } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import * as _ from "lodash";

function Layout() {
  const [isSidebaropen, setSidebarOpen] = useState(false);
  const [map, setMap] = useState(undefined);
  const [region, setRegion] = useState(TrimbleMaps.Common.Region.NA);
  const [mapStyleLoaded, setMapStyleLoaded] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [show, setShow] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [licensedFeature, setLicensedFeature] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState(undefined);
  const location = useLocation();
  const navigate = useNavigate();

  // Persisting mapService across renders
  const [mapService] = useState(() => new MapService());

  if (map) {
    map.on("style.load", () => {
      setMapStyleLoaded(true);
      setShow(false);
    });
  }
  if (location.pathname === "/") {
    navigate("/selectRegion");
  }
  useEffect(() => {
    if (!showModal) {
      setShow(true);
    }
  }, [showModal]);

  return (
    <>
      <div className="modus-layout d-flex flex-column margin-0 h-100 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen}></Header>
        <div
          className={
            "modus-body sidebar-closed " +
            (isSidebaropen ? "sidebar-open" : "sidebar-closed")
          }
          data-modus-item="body"
          id="modusBody">
          <SideBar
            mapService={mapService}
            region={region}
            map={map}
            licensedFeature={licensedFeature}
            setShowToast={setShowToast}></SideBar>

          <div className="modus-content-rows overflow-hidden">
            <div className="modus-content-columns container-body">
              {mapStyleLoaded && !_.isEmpty(licensedFeature) ? (
                <MapContext.Provider value={{ map, mapService }}>
                  <Outlet
                    context={{
                      setRegion,
                      setMapStyleLoaded,
                      licensedFeature,
                      apiKey,
                      setShowToast,
                      setMessage,
                    }}
                  />
                </MapContext.Provider>
              ) : null}

              <div className="modus-content" style={{ flexBasis: "50%" }}>
                <div className="map-container h-100">
                  <Map
                    setMap={setMap}
                    map={map}
                    mapService={mapService}
                    apiKey={apiKey}
                    licensedFeature={licensedFeature}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GetAPIKeyModal
        setShowModal={setShowModal}
        showModal={showModal}
        apiKey={apiKey}
        setApiKey={setApiKey}
        setLicensedFeature={setLicensedFeature}></GetAPIKeyModal>
      <LoadingModal
        show={show}
        setShow={setShow}
        loadingText={"Loading..."}></LoadingModal>

      <ToastMessage
        showToast={showToast}
        setShowToast={setShowToast}
        message={message}></ToastMessage>
    </>
  );
}

export default Layout;
