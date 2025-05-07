function layerSelect(layerVar, mapService) {
  //Controls which accordion section is open for the content layers panel.
  mapService.resetMap();
  const regionName = mapService.regionName;
  switch (layerVar) {
    case 0:
      const trafficLocation = layerSpecificLocation(regionName, "traffic");
      changeMapLocation(trafficLocation, mapService);
      mapService.toggleTrafficVisibility();
      break;

    case 1:
      mapService.toggleWeatherRadarVisibility();
      break;

    case 2:
      mapService.toggleWeatherAlertVisibility();

      break;

    case 3:
      mapService.toggleRoadSurfaceVisibility();
      break;

    case 4:
      mapService.map.togglePlacesVisibility();
      const placeLocation = layerSpecificLocation(regionName, "places");
      changeMapLocation(placeLocation, mapService);
      mapService.map.setLayoutProperty("places_gates", "icon-size", 0.7);
      break;

    case 5:
      const poiLocation = layerSpecificLocation(regionName, "poi");
      changeMapLocation(poiLocation, mapService);
      mapService.togglePOIVisibility();
      break;

    case 6:
      const d3BuildingLocation = layerSpecificLocation(
        regionName,
        "3dBuilding"
      );
      changeMapLocation(d3BuildingLocation, mapService);
      if (
        mapService.map.getStyle().name.toLowerCase() ===
        TrimbleMaps.Common.Style.SATELLITE
      ) {
        $("#building_3d_toast .message").text(
          "3D buildings are unavailable in Satellite view"
        );
        $("#building_3d_toast").show();
      } else {
        mapService.map.toggle3dBuildingVisibility();
        mapService.map.setPitch(60);
      }

      break;

    case 7:
      const trafficIncidentLocation = layerSpecificLocation(
        regionName,
        "trafficIncident"
      );
      changeMapLocation(trafficIncidentLocation, mapService);
      mapService.trafficIncidentLayer.setVisibility(true);
      mapService.map.addControl(mapService.trafficIncidentClickCtrl);
      mapService.map.addControl(mapService.trafficIncidentFilterCtrl);
      break;

    case 8:
      const truckRestrictionLocation = layerSpecificLocation(
        regionName,
        "truckRestriction"
      );
      changeMapLocation(truckRestrictionLocation, mapService);
      mapService.truckRestrictionLayer.setVisibility(true);
      mapService.map.addControl(mapService.truckRestrictionClickCtrl);
      mapService.map.addControl(mapService.truckRestrictionFilterCtrl);
      break;
    case 9:
      //Check if the NA/EU layers exist, and if not add them to the map.
      if (regionName == TrimbleMaps.Common.Region.NA) {
        if (
          typeof mapService.map.getLayer("customPointsLayer") == "undefined"
        ) {
          document.getElementById("customContentBody").innerHTML =
            "<ul><li>Ability to plot custom data onto the map via geoJson objects.</li>" +
            "<li>Information for this example is comprised of a geojson source that is broken down into 3 different custom content layers:</li>" +
            "<ul><li><b>Fill Layer</b>: Creates the state boundary polygon of New Jersey and sets the opacity.</li>" +
            "<li><b>Line Layer</b>: Forms the outline around the New Jersey polygon.</li>" +
            "<li><b>Symbol Layer</b>: Adds the Trimble Maps logo to the map.</li></ul></ul>";

          mapService.map.addLayer(mapService.sampleJson.polygonLayerNA);
          mapService.map.addLayer(mapService.sampleJson.pointLayerNA);
          mapService.map.addLayer(mapService.sampleJson.lineLayerNA);
        }
      } else {
        if (
          typeof mapService.map.getLayer("customPointsLayerEU") == "undefined"
        ) {
          document.getElementById("customContentBody").innerHTML =
            "<ul><li>Ability to plot custom data onto the map via geoJson objects.</li>" +
            "<li>Information for this example is comprised of a geojson source that is broken down into 3 different custom content layers:</li>" +
            "<ul><li><b>Fill Layer</b>: Creates the country boundary polygon of Great Britain and sets the opacity.</li>" +
            "<li><b>Line Layer</b>: Forms the outline around the Great Britain polygon.</li>" +
            "<li><b>Symbol Layer</b>: Adds the Trimble Maps logo to the map.</li></ul></ul>";

          mapService.map.addLayer(mapService.sampleJson.polygonLayerEU);
          mapService.map.addLayer(mapService.sampleJson.pointLayerEU);
          mapService.map.addLayer(mapService.sampleJson.lineLayerEU);
        }
      }
      const customPlacesLocation = layerSpecificLocation(
        regionName,
        "customPlacesLocation"
      );
      mapService.map.flyTo({
        center: customPlacesLocation.center,
        zoom: customPlacesLocation.zoom,
      });
      break;

    default:
      console.log("Default layer.");
  }
}
function changeMapLocation({ center, zoom }, mapService) {
  mapService.map.setCenter(center);
  mapService.map.setZoom(zoom);
}
