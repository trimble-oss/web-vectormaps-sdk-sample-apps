function hidePanels(panel, mapService, license) {
  //Performs highlightning of the currently selected option in the navigation panel as well as hiding/revealing their associated panels.
  //To cut down on the lines of code this will eventually be switched over to a for loop with the panels being organized into an array.
  let twr, sr, rr;
  //Fully reset the map.
  mapService.resetMap();
  resetUserOptions(mapService, license);

  if (panel == 1) {
    //Highlight selection.
    document.getElementById("mapStyling").classList.add("active");
    document.getElementById("mapRoute").classList.remove("active");
    document.getElementById("timeWindow").classList.remove("active");
    document.getElementById("siteRouting").classList.remove("active");
    document.getElementById("mapRegion").classList.remove("active");
    document.getElementById("mapLayers").classList.remove("active");
    document.getElementById("railRouting").classList.remove("active");

    //Show and hide panels
    document.getElementById("baseMapPanel").classList.remove("collapse");
    document.getElementById("routingPanel").classList.add("collapse");
    document.getElementById("timeWindowPanel").classList.add("collapse");
    document.getElementById("siteRoutingPanel").classList.add("collapse");
    document.getElementById("mapRegionPanel").classList.add("collapse");
    document.getElementById("contentPanel").classList.add("collapse");
    document.getElementById("railRoutingDemo").classList.add("collapse");
  } else if (panel == 3) {
    //Highlight selection
    document.getElementById("mapStyling").classList.remove("active");
    document.getElementById("mapRoute").classList.add("active");
    document.getElementById("timeWindow").classList.remove("active");
    document.getElementById("siteRouting").classList.remove("active");
    document.getElementById("mapRegion").classList.remove("active");
    document.getElementById("mapLayers").classList.remove("active");
    document.getElementById("railRouting").classList.remove("active");

    //Show and hide panels
    document.getElementById("baseMapPanel").classList.add("collapse");
    document.getElementById("routingPanel").classList.remove("collapse");
    document.getElementById("timeWindowPanel").classList.add("collapse");
    document.getElementById("siteRoutingPanel").classList.add("collapse");
    document.getElementById("mapRegionPanel").classList.add("collapse");
    document.getElementById("contentPanel").classList.add("collapse");
    document.getElementById("railRoutingDemo").classList.add("collapse");
  } else if (panel == 4) {
    //Highlight selection
    document.getElementById("mapStyling").classList.remove("active");
    document.getElementById("mapRoute").classList.remove("active");
    document.getElementById("timeWindow").classList.add("active");
    document.getElementById("siteRouting").classList.remove("active");
    document.getElementById("mapRegion").classList.remove("active");
    document.getElementById("mapLayers").classList.remove("active");
    document.getElementById("railRouting").classList.remove("active");

    //Show and hide panels
    document.getElementById("baseMapPanel").classList.add("collapse");
    document.getElementById("routingPanel").classList.add("collapse");
    document.getElementById("timeWindowPanel").classList.remove("collapse");
    document.getElementById("siteRoutingPanel").classList.add("collapse");
    document.getElementById("mapRegionPanel").classList.add("collapse");
    document.getElementById("contentPanel").classList.add("collapse");
    document.getElementById("railRoutingDemo").classList.add("collapse");
    $("#timeWindowModal").modal("show");
    setTimeout(() => {
      twr = new TimeWindowRouting(mapService);
      twr.calculateTimeWindows(mapService.regionName, mapService.apiKey);
      $("#optimizeBtn").on("click", function (e) {
        $("#timeWindowModal").modal("show");
        twr.toggleTimeWindowRouting();
      });
    }, 100);
  } else if (panel == 5) {
    //Highlight selection
    document.getElementById("siteRouting").classList.add("active");
    document.getElementById("mapStyling").classList.remove("active");
    document.getElementById("mapRoute").classList.remove("active");
    document.getElementById("timeWindow").classList.remove("active");
    document.getElementById("mapRegion").classList.remove("active");
    document.getElementById("mapLayers").classList.remove("active");
    document.getElementById("railRouting").classList.remove("active");

    //Show and hide panels
    document.getElementById("baseMapPanel").classList.add("collapse");
    document.getElementById("routingPanel").classList.add("collapse");
    document.getElementById("timeWindowPanel").classList.add("collapse");
    document.getElementById("siteRoutingPanel").classList.remove("collapse");
    document.getElementById("mapRegionPanel").classList.add("collapse");
    document.getElementById("contentPanel").classList.add("collapse");
    document.getElementById("railRoutingDemo").classList.add("collapse");
    $("#railRouteModal").modal("show");
    setTimeout(() => {
      sr = new SiteRouting(mapService);
      sr.createSiteRoute(mapService.apiKey);
      $("#toggleSite").on("click", function (e) {
        e.stopPropagation();
        sr.toggleSiteRoute();
      });
    }, 100);
  } else if (panel == 0) {
    //Highlight selection
    document.getElementById("siteRouting").classList.remove("active");
    document.getElementById("mapStyling").classList.remove("active");
    document.getElementById("mapRoute").classList.remove("active");
    document.getElementById("timeWindow").classList.remove("active");
    document.getElementById("mapLayers").classList.remove("active");
    document.getElementById("mapRegion").classList.add("active");
    document.getElementById("railRouting").classList.remove("active");

    //Show and hide panels
    document.getElementById("baseMapPanel").classList.add("collapse");
    document.getElementById("routingPanel").classList.add("collapse");
    document.getElementById("timeWindowPanel").classList.add("collapse");
    document.getElementById("siteRoutingPanel").classList.add("collapse");
    document.getElementById("mapRegionPanel").classList.remove("collapse");
    document.getElementById("contentPanel").classList.add("collapse");
    document.getElementById("railRoutingDemo").classList.add("collapse");
  } else if (panel == 2) {
    //Highlight selection
    document.getElementById("siteRouting").classList.remove("active");
    document.getElementById("mapStyling").classList.remove("active");
    document.getElementById("mapRoute").classList.remove("active");
    document.getElementById("timeWindow").classList.remove("active");
    document.getElementById("mapRegion").classList.remove("active");
    document.getElementById("mapLayers").classList.add("active");
    document.getElementById("railRouting").classList.remove("active");

    //Show and hide panels
    document.getElementById("baseMapPanel").classList.add("collapse");
    document.getElementById("routingPanel").classList.add("collapse");
    document.getElementById("timeWindowPanel").classList.add("collapse");
    document.getElementById("siteRoutingPanel").classList.add("collapse");
    document.getElementById("mapRegionPanel").classList.add("collapse");
    document.getElementById("contentPanel").classList.remove("collapse");
    document.getElementById("railRoutingDemo").classList.add("collapse");

    //Control showing weather alerts, not available in Europe.
    if (mapService.regionName != TrimbleMaps.Common.Region.NA) {
      document.getElementById("weatherAlertCard").setAttribute("hidden", true);
      document.getElementById("roadSurfaceCard").setAttribute("hidden", true);
      document.getElementById("placesCard").setAttribute("hidden", true);
    } else {
      document.getElementById("weatherAlertCard").removeAttribute("hidden");
      document.getElementById("roadSurfaceCard").removeAttribute("hidden");
      document.getElementById("placesCard").removeAttribute("hidden");
    }
  } else if (panel == 6) {
    //Highlight selection
    document.getElementById("siteRouting").classList.remove("active");
    document.getElementById("mapStyling").classList.remove("active");
    document.getElementById("mapRoute").classList.remove("active");
    document.getElementById("timeWindow").classList.remove("active");
    document.getElementById("mapRegion").classList.remove("active");
    document.getElementById("mapLayers").classList.remove("active");
    document.getElementById("railRouting").classList.add("active");

    //Show and hide panels
    document.getElementById("baseMapPanel").classList.add("collapse");
    document.getElementById("routingPanel").classList.add("collapse");
    document.getElementById("timeWindowPanel").classList.add("collapse");
    document.getElementById("siteRoutingPanel").classList.add("collapse");
    document.getElementById("mapRegionPanel").classList.add("collapse");
    document.getElementById("contentPanel").classList.add("collapse");
    document.getElementById("railRoutingDemo").classList.remove("collapse");
    $("#railRouteModal").modal("show");
    setTimeout(() => {
      rr = new RailRouting(mapService);
      rr.enableRailRoute(mapService.apiKey);
    }, 100);
  }
  mapService.map.resize();
}
