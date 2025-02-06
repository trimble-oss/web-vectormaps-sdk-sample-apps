function setMapStyle(mapService) {
  const map = mapService.map;
  //Sets the map style.
  const mapStyle = document.getElementById("mapStyle").value;

  switch (mapStyle) {
    case "Transportation":
      map.setStyle(TrimbleMaps.Common.Style.TRANSPORTATION);
      break;

    case "Transportation Dark":
      map.setStyle(TrimbleMaps.Common.Style.TRANSPORTATION_DARK);
      break;

    case "Satellite":
      map.setStyle(TrimbleMaps.Common.Style.SATELLITE, {
        satelliteProvider: TrimbleMaps.Common.SatelliteProvider.DEFAULT,
      });
      break;

    case "Satellite (Premium)":
      map.setStyle(TrimbleMaps.Common.Style.SATELLITE, {
        satelliteProvider: TrimbleMaps.Common.SatelliteProvider.SAT2,
      });

      break;

    case "Terrain":
      map.setStyle(TrimbleMaps.Common.Style.TERRAIN);
      break;

    case "Basic":
      map.setStyle(TrimbleMaps.Common.Style.BASIC);
      break;

    default:
      console.log("Default style.");
  }
}
