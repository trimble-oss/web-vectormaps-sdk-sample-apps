function selectRegion(mapService) {
  const map = mapService.map;
  //Change the region that will be used for the demo and resets the content layers.
  mapService.resetMap();
  const region = document.getElementById("mapRegionSelector").value;

  if (region == "North America") {
    mapService.regionName = TrimbleMaps.Common.Region.NA;
    map.setRegion(TrimbleMaps.Common.Region.NA);
    map.setCenter([-97, 38]);
    map.setZoom(4);

    document.getElementById("railRoutingItem").removeAttribute("hidden");
    document.getElementById("highwayOnlyForm").removeAttribute("hidden");
    document.getElementById("siteRoutingItem").removeAttribute("hidden");
  } else {
    mapService.regionName = TrimbleMaps.Common.Region.EU;
    map.setRegion(TrimbleMaps.Common.Region.EU);
    map.setCenter([15, 50]);
    map.setZoom(4);

    document.getElementById("railRoutingItem").setAttribute("hidden", null);
    document.getElementById("siteRoutingItem").setAttribute("hidden", null);
    document.getElementById("highwayOnlyForm").setAttribute("hidden", null);
  }
}
