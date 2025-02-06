function layerSpecificLocation(region, layer) {
  region = region?.toLocaleLowerCase();
  if (region === TrimbleMaps.Common.Region.NA) {
    switch (layer) {
      case "traffic":
        return {
          center: [-73.98917577717128, 40.74304499593169],
          zoom: 15,
        };
      case "poi":
        return {
          center: [-74.48960455530846, 40.372447878728025],
          zoom: 16,
        };
      case "3dBuilding":
        return {
          center: [-73.98917577717128, 40.74304499593169],
          zoom: 16,
        };
      case "trafficIncident":
        return {
          center: [-75.1581928644878, 39.92535198317328],
          zoom: 14,
        };
      case "truckRestriction":
        return {
          center: [-75.1581928644878, 39.92535198317328],
          zoom: 14,
        };
      case "customPlacesLocation":
        return {
          center: [-74.534, 40.0838],
          zoom: 8,
        };
      case "places":
        return {
          center: [-86.36045870849613, 39.68919336361747],
          zoom: 17,
        };
      default:
        return {
          center: [-97, 38],
          zoom: 4,
          pitch: 0,
        };
    }
  }
  if (region === TrimbleMaps.Common.Region.EU) {
    switch (layer) {
      case "traffic":
        return {
          center: [-0.10916612871948775, 51.49815313845417],
          zoom: 15,
        };
      case "poi":
        return {
          center: [-0.19525358614194946, 51.41935251749252],
          zoom: 16,
        };
      case "3dBuilding":
        return {
          center: [-0.09621162497595687, 51.51266107268069],
          zoom: 16,
        };
      case "trafficIncident":
        return {
          center: [-0.12724361838168577, 51.506604765663766],
          zoom: 13,
        };
      case "truckRestriction":
        return {
          center: [-0.12724361838168577, 51.506604765663766],
          zoom: 14,
        };
      case "customPlacesLocation":
        return {
          center: [-0.09621162497595687, 51.51266107268069],
          zoom: 5.5,
        };

      default:
        return {
          center: [15, 50],
          zoom: 4,
        };
    }
  } else {
    return {
      center: [-97, 38],
      zoom: 4,
      pitch: 0,
    };
  }
}
