function addEventListenerToDiv(mapService, tokenService) {
  var routing = new Routing(mapService);
  var license;
  $("#authModal").on("click", "#getApikey", function () {
    tokenService.getToken().then(
      (res) => {
        $("#authModal").modal("hide");
        license = res;
        mapService.init(license);
        $(".tooltip-unlicensed").attr("title", constants.UNLICENSED_MSG);
        $(".tooltip-unlicensed").tooltip({
          placement: "top",
          trigger: "hover",
          delay: { show: 500, hide: 100 }, // Delay in ms
        });
      },
      (err) => {
        console.log("Error getting token:", err);
        document.getElementById("apiKeyError").innerHTML =
          constants.API_ERROR_MSG;
        document.getElementById("apiKeyError").style.display = "block";
      }
    );
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
    document.querySelectorAll(".accordion-collapse.show").forEach((item) => {
      new bootstrap.Collapse(item, { toggle: true });
    });
    hidePanels(index, mapService, license);
  });

  $(".layer-select").on("click", function () {
    if ($(this).hasClass("unlicensed")) return;
    const index = $(".layer-select").index(this);
    layerSelect(index, mapService);
  });

  const debouncedInputHandler = debounce(function () {
    const text = $("#routeLocationInput").val()?.trim();
    if (text !== "") {
      routing.singlesearchLookup(
        mapService.apiKey,
        mapService.regionName,
        text
      );
    } else {
      document
        .getElementById("routeLocationInput")
        .classList.remove("is-invalid");
      document.getElementById("singleSearchErrorText").innerHTML = "";
      document
        .getElementById("locationSelectionDiv")
        .setAttribute("hidden", null);
    }
  }, 200);
  $("#routeLocationInput").on("input", debouncedInputHandler);
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

  document.addEventListener("hidden.bs.modal", function (event) {
    document.body.focus(); // Moves focus to a safe element
  });
}
