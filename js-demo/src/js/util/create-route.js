function createRoute(
  mapService,
  routeStops,
  rtType,
  vehType,
  hwyOnly,
  tolls,
  borders,
  hazmat,
  sites,
  routeRegion,
  reportType,
  enableReportBtn
) {
  let distanceUnits;
  if (mapService.regionName == TrimbleMaps.Common.Region.NA) {
    distanceUnits = TrimbleMaps.Common.DistanceUnit.MILES;
  } else {
    distanceUnits = TrimbleMaps.Common.DistanceUnit.KILOMETERS;
    hwyOnly = false;
  }
  try {
    mapService.myRoute = new TrimbleMaps.Route({
      stops: routeStops,
      routeColor: "blue",
      routeType: rtType,
      vehicleType: vehType,
      highwayOnly: hwyOnly,
      tollRoads: tolls,
      bordersOpen: borders,
      hazMatType: hazmat,
      useSites: sites,
      region: routeRegion,
      distanceUnits: distanceUnits,
      reportType:
        reportType == 1
          ? [
              TrimbleMaps.Common.ReportType.MILEAGE,
              TrimbleMaps.Common.ReportType.DIRECTIONS,
              TrimbleMaps.Common.ReportType.DETAIL,
              TrimbleMaps.Common.ReportType.STATE,
              TrimbleMaps.Common.ReportType.ROAD,
            ]
          : undefined,
    });
  } catch (e) {
    console.log("Error creating route:", e);
  }

  mapService.myRoute.on("report", function (reports) {
    mapService.routeReports = reports;
    document.getElementById("reportsBtn").removeAttribute("hidden");
    if (!enableReportBtn) {
      $("#routeBtns").prepend(
        `
      <span class="ms-3 float-right tooltip-unlicensed-report" title="unlicensed">
        <i class="modus-icons notranslate help-icon" aria-hidden="true">
          help
        </i>
      </span>`
      );
      $(".tooltip-unlicensed-report").attr("title", constants.UNLICENSED_MSG);
      $(".tooltip-unlicensed-report").tooltip({
        placement: "top",
        trigger: "hover",
        delay: { show: 500, hide: 100 }, // Delay in ms
      });
      $("#reportsBtn").prop("disabled", true);
    }
  });

  mapService.myRoute.addTo(mapService.map);
}
