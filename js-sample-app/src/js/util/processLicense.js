function processLicense(licensedFeatures) {
  const license = {};
  const euOption = document
    .getElementById("mapRegionSelector")
    .querySelector("#euOption");
  if (licensedFeatures.includes("eu streets")) {
    euOption.style.display = "";
    euOption.classList.remove("disabled");
    euOption.disabled = false;
  } else {
    euOption.classList.add("disabled");
    euOption.disabled = true;
    euOption.textContent += " - (Unlicensed feature)";
  }
  if (licensedFeatures.includes("truck restrictions on map")) {
    document.getElementById("truckRestrictionCard").style.display = "";
  } else {
    disableFeature("truckRestrictionsHeader");
  }
  const truckOption = document
    .getElementById("vehicleType")
    .querySelector("#truckOption");
  if (licensedFeatures.includes("truck routing")) {
    truckOption.style.display = "";
    document.getElementById("vehicleType").value = "Truck";
    truckOption.classList.remove("disabled");
    truckOption.disabled = false;
  } else {
    document.getElementById("vehicleType").value = "Auto";
    truckOption.classList.add("disabled");
    truckOption.disabled = true;
    truckOption.textContent += " - (Unlicensed feature)";
  }
  if (licensedFeatures.includes("time window optimization")) {
    document.getElementById("timeWindow").style.display = "";
  } else {
    document.getElementById("timeWindowHeader").classList.add("disabled");
    document
      .getElementById("timeWindow")
      .setAttribute(
        "title",
        "Time Window Routing" + " - " + constants.UNLICENSED_MSG
      );
    disableFeature("timeWindow");
  }
  if (licensedFeatures.includes("weather alerts")) {
    document.getElementById("weatherAlertCard").style.display = "";
  } else {
    disableFeature("weatherAlertsHeader");
  }
  if (licensedFeatures.includes("weather")) {
    document.getElementById("weatherRadarCard").style.display = "";
  } else {
    disableFeature("weatherRadarHeader");
  }
  if (licensedFeatures.includes("traffic")) {
    document.getElementById("trafficCard").style.display = "";
  } else {
    disableFeature("trafficLayerHeader");
    disableFeature("trafficIncidentHeader");
  }
  if (licensedFeatures.includes("tolls")) {
    document.getElementById("tolls").style.display = "";
  } else {
    disableFeature("tolls");
    document.getElementById("avoidTollsForm").classList.add("disabled");
  }
  if (licensedFeatures.includes("road surface")) {
    document.getElementById("roadSurfaceCard").style.display = "";
  } else {
    disableFeature("roadSurfaceHeader");
  }
  const satellitePremiumOption = document
    .getElementById("mapStyle")
    .querySelector("#satellitePremiumOption");
  if (licensedFeatures.includes("premium satellite")) {
    satellitePremiumOption.style.display = "";
    satellitePremiumOption.classList.remove("disabled");
    satellitePremiumOption.disabled = false;
  } else {
    satellitePremiumOption.classList.add("disabled");
    satellitePremiumOption.disabled = true;
    satellitePremiumOption.textContent += " - (Unlicensed feature)";
  }
  if (licensedFeatures.includes("premium reports")) {
    const reportsBtn = document.getElementById("reportsBtn");
    reportsBtn.style.display = "";
    reportsBtn.disabled = false;
  } else {
  }
  if (licensedFeatures.includes("hazmat")) {
    document.getElementById("hazmat").style.display = "";
  } else {
    document.getElementById("hazMat").disabled = true;
  }
  if (licensedFeatures.includes("custom data")) {
    document.getElementById("customDataCard").style.display = "";
  } else {
    disableFeature("customContentHeader");
  }
  if (licensedFeatures.includes("poi search")) {
    document.getElementById("poiCard").style.display = "";
  } else {
    disableFeature("poiHeader");
  }
}

function disableFeature(feature) {
  const toolTipContent = `
    <span class="ms-3 tooltip-unlicensed" title="unlicensed_msg">
      <i class="modus-icons notranslate help-icon" aria-hidden="true">
        help
      </i>
    </span>`;
  const featureEl = document.getElementById(feature);
  featureEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  featureEl.classList.add("unlicensed");
  featureEl.removeAttribute("data-bs-toggle");
  featureEl
    .querySelector(".supporting-label")
    .insertAdjacentHTML("beforeend", toolTipContent);
}
