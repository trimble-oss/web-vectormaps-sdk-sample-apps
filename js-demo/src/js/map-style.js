function setMapStyle(mapService) {
  const map = mapService.map;
  // Sets the map style.
  const mapStyle = document.getElementById("mapStyle").value;

  switch (mapStyle) {
    case "Accessible":
      map.setStyle(TrimbleMaps.Common.Style.ACCESSIBLE_LIGHT);
      break;

    case "Accessible (Dark)":
      map.setStyle(TrimbleMaps.Common.Style.ACCESSIBLE_DARK);
      break;

    case "Basic":
      map.setStyle(TrimbleMaps.Common.Style.BASIC);
      break;

    case "Basic (Dark)":
      map.setStyle(TrimbleMaps.Common.Style.BASIC_DARK);
      break;

    case "Data":
      map.setStyle(TrimbleMaps.Common.Style.DATALIGHT);
      break;

    case "Data (Dark)":
      map.setStyle(TrimbleMaps.Common.Style.DATADARK);
      break;

    case "Mobile Day":
      map.setStyle(TrimbleMaps.Common.Style.MOBILE_DAY);
      break;

    case "Mobile Night":
      map.setStyle(TrimbleMaps.Common.Style.MOBILE_NIGHT);
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

    case "Simple":
      map.setStyle(TrimbleMaps.Common.Style.SIMPLE_LIGHT);
      break;

    case "Simple (Dark)":
      map.setStyle(TrimbleMaps.Common.Style.SIMPLE_DARK);
      break;

    case "Terrain":
      map.setStyle(TrimbleMaps.Common.Style.TERRAIN);
      break;

    case "Transportation":
      map.setStyle(TrimbleMaps.Common.Style.TRANSPORTATION);
      break;

    case "Transportation (Dark)":
      map.setStyle(TrimbleMaps.Common.Style.TRANSPORTATION_DARK);
      break;

    default:
      console.log("Default style.");
  }
}
