import React from "react";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";

function AutoDescription(props) {
  const { region, vehicleType } = props;

  const autoDescription = (regionName, vehicleType) => {
    let autoDescription = "";
    if (regionName == TrimbleMaps.Common.Region.NA) {
      if (vehicleType === TrimbleMaps.Common.VehicleType.AUTOMOBILE) {
        //auto description
        autoDescription =
          'Height: 5\'10"<br/>Width: 75"<br/>Length: 16\'8"<br/>Weight: 3,300 lbs.<br/>Axles: 2';
      } else if (vehicleType == TrimbleMaps.Common.VehicleType.LIGHT_TRUCK) {
        autoDescription =
          'Height: 7\'0"<br/>Width: 96"<br/>Length: 20\'0"<br/>Weight: 8,500 lbs.<br/>Axles: 2';
      } else {
        autoDescription =
          'Height: 13\'6"<br/>Width: 96"<br/>Length: 48\'0"<br/>Weight: 80,000 lbs<br/>Axles: 5';
      }
    } else {
      if (vehicleType == TrimbleMaps.Common.VehicleType.AUTOMOBILE) {
        //auto description
        autoDescription =
          "Height: 1.8 metres<br/>Width: 1.9 metres<br/>Length: 5 metres<br/>Weight: 1.5 tonnes<br/>Axles: 2";
      } else if (vehicleType == TrimbleMaps.Common.VehicleType.LIGHT_TRUCK) {
        autoDescription =
          "Height: 3.5 metres<br/>Width: 2.4 metres<br/>Length: 8 metres<br/>Weight: 7.29 tonnes<br/>Axles: 2";
      } else {
        autoDescription =
          "Height: 4 metres<br/>Width: 2.55 metres<br/>Length: 16.5 metres<br/>Weight: 11.5 tonnes<br/>Axles: 5";
      }
    }
    return {
      __html: autoDescription,
    };
  };

  return (
    <>
      <p
        id="profileDimensions"
        className="p-font-size"
        dangerouslySetInnerHTML={autoDescription(region, vehicleType)}
      />
    </>
  );
}

export default AutoDescription;
