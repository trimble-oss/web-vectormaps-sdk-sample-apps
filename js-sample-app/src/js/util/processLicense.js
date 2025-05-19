function processLicense(licensedFeatures) {
  const license = {};
  if (licensedFeatures.includes("eu streets")) {
    $("#mapRegionSelector").find("#euOption").show();
    $("#mapRegionSelector").find("#euOption").removeClass("disabled");
    $("#mapRegionSelector").find("#euOption").prop("disabled", false);
  } else {
    $("#mapRegionSelector").find("#euOption").addClass("disabled");
    $("#mapRegionSelector").find("#euOption").prop("disabled", true);
    $("#mapRegionSelector")
      .find("#euOption")
      .text(function (index, text) {
        return text + " - (Unlicensed feature)";
      });
  }
  if (licensedFeatures.includes("truck restrictions on map")) {
    $("#truckRestrictionCard").show();
  } else {
    disableFeature("truckRestrictionsHeader");
  }
  if (licensedFeatures.includes("truck routing")) {
    $("#vehicleType").find("#truckOption").show();
    document.getElementById("vehicleType").value = "Truck";
    $("#vehicleType").find("#truckOption").removeClass("disabled");
    $("#vehicleType").find("#truckOption").prop("disabled", false);
  } else {
    document.getElementById("vehicleType").value = "Auto";
    $("#vehicleType").find("#truckOption").addClass("disabled");
    $("#vehicleType").find("#truckOption").prop("disabled", true);
    $("#vehicleType")
      .find("#truckOption")
      .text(function (index, text) {
        return text + " - (Unlicensed feature)";
      });
  }
  if (licensedFeatures.includes("time window optimization")) {
    $("#timeWindow").show();
  } else {
    $("#timeWindowHeader").addClass("disabled");
    $("#timeWindow").attr(
      "title",
      "Time Window Routing" + " - " + constants.UNLICENSED_MSG
    );
    disableFeature("timeWindow");
  }
  if (licensedFeatures.includes("weather alerts")) {
    $("#weatherAlertCard").show();
  } else {
    disableFeature("weatherAlertsHeader");
  }
  if (licensedFeatures.includes("weather")) {
    $("#weatherRadarCard").show();
  } else {
    disableFeature("weatherRadarHeader");
  }
  if (licensedFeatures.includes("traffic")) {
    $("#trafficCard").show();
  } else {
    disableFeature("trafficLayerHeader");
    disableFeature("trafficIncidentHeader");
  }
  if (licensedFeatures.includes("tolls")) {
    $("#tolls").show();
  } else {
    disableFeature("tolls");
    $("#avoidTollsForm").addClass("disabled");
  }
  if (licensedFeatures.includes("road surface")) {
    $("#roadSurfaceCard").show();
  } else {
    disableFeature("roadSurfaceHeader");
  }
  if (licensedFeatures.includes("premium satellite")) {
    $("#mapStyle").find("#satellitePremiumOption").show();
    $("#mapStyle").find("#satellitePremiumOption").removeClass("disabled");
    $("#mapStyle").find("#satellitePremiumOption").prop("disabled", false);
  } else {
    $("#mapStyle").find("#satellitePremiumOption").addClass("disabled");
    $("#mapStyle").find("#satellitePremiumOption").prop("disabled", true);
    $("#mapStyle")
      .find("#satellitePremiumOption")
      .text(function (index, text) {
        return text + " - (Unlicensed feature)";
      });
  }
  if (licensedFeatures.includes("premium reports")) {
    $("#reportsBtn").show();
    $("#reportsBtn").prop("disabled", false);
  } else {
  }
  if (licensedFeatures.includes("hazmat")) {
    $("#hazmat").show();
  } else {
    document.getElementById("hazMat").disabled = true;
  }
  if (licensedFeatures.includes("custom data")) {
    $("#customDataCard").show();
  } else {
    disableFeature("customContentHeader");
  }
  if (licensedFeatures.includes("poi search")) {
    $("#poiCard").show();
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
  $("#" + feature).on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  $("#" + feature).addClass("unlicensed");
  $("#" + feature).removeAttr("data-bs-toggle");
  $("#" + feature + ">.supporting-label").append(toolTipContent);
}
