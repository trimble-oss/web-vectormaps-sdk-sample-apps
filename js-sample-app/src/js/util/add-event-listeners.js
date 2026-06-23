function addEventListenerToDiv(mapService, tokenService) {
  var routing = new Routing(mapService);
  var license;
  document.getElementById("authModal").addEventListener("click", (e) => {
    if (!e.target.closest("#getApikey")) return;
    tokenService.getToken().then(
      (res) => {
        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("authModal")
        ).hide();
        license = res;
        mapService.init(license);
        document.querySelectorAll(".tooltip-unlicensed").forEach((el) => {
          el.setAttribute("title", constants.UNLICENSED_MSG);
          new bootstrap.Tooltip(el, {
            placement: "top",
            trigger: "hover",
            delay: { show: 500, hide: 100 },
          });
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

  document.getElementById("mapStyle").addEventListener("change", () => {
    setMapStyle(mapService);
  });

  document.getElementById("mapRegionSelector").addEventListener("change", () => {
    selectRegion(mapService);
  });

  document.querySelectorAll(".sidebar").forEach((el) => {
    el.addEventListener("click", function () {
      const index = Array.from(document.querySelectorAll(".sidebar")).indexOf(
        this
      );
      //hide time window optimization if not licensed
      if (index === 4 && !license.includes("time window optimization")) return;
      document.querySelectorAll(".accordion-collapse.show").forEach((item) => {
        new bootstrap.Collapse(item, { toggle: true });
      });
      hidePanels(index, mapService, license);
    });
  });

  document.querySelectorAll(".layer-select").forEach((el) => {
    el.addEventListener("click", function () {
      if (this.classList.contains("unlicensed")) return;
      const index = Array.from(
        document.querySelectorAll(".layer-select")
      ).indexOf(this);
      layerSelect(index, mapService);
    });
  });

  const debouncedInputHandler = debounce(function () {
    const text = document.getElementById("routeLocationInput").value?.trim();
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
  document
    .getElementById("routeLocationInput")
    .addEventListener("input", debouncedInputHandler);
  document.getElementById("locationSelection").addEventListener("click", (e) => {
    routing.locationSelect(e);
  });

  document.getElementById("vehicleType").addEventListener("click", () => {
    modifyRouteType(mapService.regionName, license);
  });

  document.getElementById("routeBtn").addEventListener("click", () => {
    routing.addRouteLayer(license.includes("premium reports"));
  });

  document.getElementById("reportsBtn").addEventListener("click", () => {
    routing.createReports();
  });

  document.getElementById("clearLocationsBtn").addEventListener("click", () => {
    clearLocations(mapService);
  });

  document.addEventListener("hidden.bs.modal", function (event) {
    document.body.focus(); // Moves focus to a safe element
  });
}
