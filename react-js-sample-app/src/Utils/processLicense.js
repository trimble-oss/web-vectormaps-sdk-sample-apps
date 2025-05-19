export function processLicense(licensedFeatures) {
  const license = {};
  if (licensedFeatures.includes("eu streets")) {
    license.euSupport = true;
  } else {
    license.euSupport = false;
  }
  if (licensedFeatures.includes("truck restrictions on map")) {
    license.truckRestriction = true;
  } else {
    license.truckRestriction = false;
  }
  if (licensedFeatures.includes("truck routing")) {
    license.truckRouting = true;
  } else {
    license.truckRouting = false;
  }
  if (licensedFeatures.includes("time window optimization")) {
    license.timeWindowOptimization = true;
  } else {
    license.timeWindowOptimization = false;
  }
  if (licensedFeatures.includes("weather alerts")) {
    license.weatherAlerts = true;
  } else {
    license.weatherAlerts = false;
  }
  if (licensedFeatures.includes("weather")) {
    license.weatherRadar = true;
  } else {
    license.weatherRadar = false;
  }
  if (licensedFeatures.includes("vehicle dimension")) {
    license.vehicleDimension = true;
  } else {
    license.vehicleDimension = false;
  }
  if (licensedFeatures.includes("traffic")) {
    license.traffic = true;
  } else {
    license.traffic = false;
  }
  if (licensedFeatures.includes("tolls")) {
    license.tolls = true;
  } else {
    license.tolls = false;
  }
  if (licensedFeatures.includes("road surface")) {
    license.roadSurface = true;
  } else {
    license.roadSurface = false;
  }
  if (licensedFeatures.includes("premium satellite")) {
    license.premiumSatellite = true;
  } else {
    license.premiumSatellite = false;
  }
  if (licensedFeatures.includes("premium reports")) {
    license.premiumReports = true;
  } else {
    license.premiumReports = false;
  }
  if (licensedFeatures.includes("hazmat")) {
    license.hazmat = true;
  } else {
    license.hazmat = false;
  }
  if (licensedFeatures.includes("custom data")) {
    license.customData = true;
  } else {
    license.customData = false;
  }
  if (licensedFeatures.includes("poi search")) {
    license.poi = true;
  } else {
    license.poi = false;
  }

  return license;
}
