function clearLocations(mapService) {
  mapService.clearRouteLocation();
  document.getElementById("routeBtn").disabled = true;
  document.getElementById("locationList").setAttribute("hidden", null);
  document.getElementById("routeLocationInput").placeholder =
    "Enter Location...";
  document.getElementById("locationListTable").innerHTML = null;
  document.getElementById("routeLocationInput").removeAttribute("disabled");
  removeRoutes(mapService.myRoute);
  document.getElementById("reportsBtn").setAttribute("hidden", null);
  mapService.removeStops();
  const mapLocation = layerSpecificLocation(mapService.getRegion());
  changeMapLocation(mapLocation, mapService);
}
