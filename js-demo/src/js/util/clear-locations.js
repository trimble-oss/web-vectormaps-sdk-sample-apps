function clearLocations(mapService) {
  mapService.clearRouteLocation();
  document.getElementById("locationList").setAttribute("hidden", null);
  document.getElementById("locationListParagraph").innerHTML = null;
  document.getElementById("routeLocationInput").removeAttribute("disabled");
  removeRoutes(mapService.myRoute);
  document.getElementById("reportsBtn").setAttribute("hidden", null);
}
