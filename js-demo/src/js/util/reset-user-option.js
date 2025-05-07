function resetUserOptions(mapService, license) {
  //Reset the options and input boxes from all panels

  //Layers Panel, there's gotta be a better way to handle this but for the time being it is what it is
  document.getElementById("trafficLayer").classList.remove("show");
  document.getElementById("weatherRadar").classList.remove("show");
  document.getElementById("weatherAlerts").classList.remove("show");
  document.getElementById("roadSurface").classList.remove("show");
  document.getElementById("places").classList.remove("show");
  document.getElementById("pointsOfInterest").classList.remove("show");
  document.getElementById("buildings").classList.remove("show");
  document.getElementById("customContent").classList.remove("show");
  document.getElementById("trafficIncident").classList.remove("show");
  document.getElementById("truckRestrictions").classList.remove("show");

  //Routing Panel
  document.getElementById("routeType").value = "Practical";
  document.getElementById("routingHighwayOnly").checked = false;
  document.getElementById("avoidTolls").checked = false;
  document.getElementById("bordersOpen").checked = false;
  document.getElementById("hazMat").value = "None";

  document.getElementById("reportsBtn").setAttribute("hidden", null);

  document.getElementById("locationList").setAttribute("hidden", null);
  document.getElementById("locationSelectionDiv").setAttribute("hidden", null);
  document.getElementById("routeLocationInput").value = "";
  document.getElementById("locationListTable").innerHTML = null;

  modifyRouteType(mapService.regionName, license); //Needed because if you navigate away with auto selected, it'll remove the options forever.

  document.getElementById("timeWindowTable").innerHTML = null;
  document.getElementById("timeWindowRoutingText").innerHTML = null;

  autoDescription(mapService.regionName);

  clearLocations(mapService);
  document.getElementById("routeLocationInput").removeAttribute("disabled");
}
