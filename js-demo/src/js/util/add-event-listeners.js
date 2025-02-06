function addEventListenerToDiv(mapService, tokenService) {
  var routing = new Routing(mapService);
  var license;
  $("#authModal").on("click", "#getApikey", function () {
    tokenService.getToken().then((res) => {
      license = res;
      mapService.init();
      $(".tooltip-unlicensed").attr("title", constants.UNLICENSED_MSG);
      $(".tooltip-unlicensed").tooltip({
        placement: "top",
        trigger: "hover",
        delay: { show: 500, hide: 100 } // Delay in ms
      });
    });
  });

  $("#mapStyle").on("change", function () {
    setMapStyle(mapService);
  });

  $("#mapRegionSelector").on("change", function () {
    selectRegion(mapService);
  });

  $(".sidebar").on("click", function () {
    const index = $(".sidebar").index(this);
    //hide time window optimization if not licensed
    if (index === 4 && !license.includes("time window optimization")) return;
    hidePanels(index, mapService, license);
  });

  $(".layer-select").on("click", function () {
    if ($(this).hasClass("unlicensed")) return;
    const index = $(".layer-select").index(this);
    layerSelect(index, mapService);
  });

  $("#routeLocationInput").on("input", function () {
    const text = $("routeLocationInput").val();
    routing.singlesearchLookup(mapService.apiKey, mapService.regionName);
  });

  $("#locationSelection").on("click", function (e) {
    routing.locationSelect(e);
  });

  $("#vehicleType").on("click", function (e) {
    modifyRouteType(mapService.regionName, license);
  });

  $("#routeBtn").on("click", function (e) {
    routing.addRouteLayer(license.includes("premium reports"));
  });

  $("#reportsBtn").on("click", function (e) {
    routing.createReports();
  });

  $("#clearLocationsBtn").on("click", function (e) {
    clearLocations(mapService);
  });
}
