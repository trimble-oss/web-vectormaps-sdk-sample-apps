function modifyRouteType(regionName, license) {
  /*
    For routing, automatically change the route type to Fastest when Auto is selected as the vehicle type and removes Practical + Shortest. Likewise, remove
    fastest for Truck/Light Truck.
    */

  document.getElementById("routeType").options.length = 0;

  if (document.getElementById("vehicleType").value == "Auto") {
    const fastOption = document.createElement("option");
    fastOption.text = "Fastest";

    document
      .getElementById("routeType")
      .add(fastOption, document.getElementById("routeType")[0]);

    document.getElementById("routeType").value = "Fastest";

    document.getElementById("hazMat").value = "None";
    document.getElementById("hazMat").disabled = true;
  } else {
    const pracOption = document.createElement("option");
    const shortOption = document.createElement("option");

    pracOption.text = "Practical";
    shortOption.text = "Shortest";

    document
      .getElementById("routeType")
      .add(pracOption, document.getElementById("routeType")[0]);
    document
      .getElementById("routeType")
      .add(shortOption, document.getElementById("routeType")[1]);

    document.getElementById("routeType").value = "Practical";
    if (license.includes("hazmat")) {
      document.getElementById("hazMat").disabled = false;
    } else {
      document.getElementById("hazMat").disabled = true;
    }
  }

  autoDescription(regionName);
}
