import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./Layout.jsx";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import SelectRegion from "./components/SelectRegion/SelectRegion.jsx";
import MapStyle from "./components/MapStyle/MapStyle.jsx";
import "./index.scss";
import Routing from "./components/Routing/Routing.jsx";
import TimeWindowRouting from "./components/TimeWindowRouting/TimeWindowRouting.jsx";
import SiteLocationRouting from "./components/SiteLocationRouting/SiteLocationRouting.jsx";
import RailRouting from "./components/RailRouting/RailRouting.jsx";
import ContentLayers from "./components/ContentLayers/ContentLayers.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/selectRegion" element={<SelectRegion />} />
      <Route path="/mapStyle" element={<MapStyle />} />
      <Route path="/contentLayers" element={<ContentLayers />} />
      <Route path="/routing" element={<Routing />} />
      <Route path="/timeWindowRouting" element={<TimeWindowRouting />} />
      <Route path="/siteLocationRouting" element={<SiteLocationRouting />} />
      <Route path="/railRouting" element={<RailRouting />} />
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
