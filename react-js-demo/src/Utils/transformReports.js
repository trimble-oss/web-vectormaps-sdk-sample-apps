export function transformReports(reports) {
  const mileageReports = createMileageReports(reports[0]);
  const detailedReports = createDetailedReports(reports[1]);
  const directionReports = createDirectionReport(reports[2]);
  const roadReports = createRoadReport(reports[3]);
  const stateReports = createStateReport(reports[4]);
  const treports = {
    mileageReports,
    detailedReports,
    directionReports,
    stateReports,
    roadReports,
  };
  return treports;
}

const createMileageReports = (mileageRawReport) => {
  let mileageReports = [];
  for (let i = 0; i < mileageRawReport["ReportLines"].length; i++) {
    let locationName = "";

    locationName =
      mileageRawReport["ReportLines"][i]["Stop"]["Address"]["StreetAddress"] !=
      ""
        ? mileageRawReport["ReportLines"][i]["Stop"]["Address"][
            "StreetAddress"
          ] + ", "
        : "";

    locationName +=
      mileageRawReport["ReportLines"][i]["Stop"]["Address"]["City"] != ""
        ? mileageRawReport["ReportLines"][i]["Stop"]["Address"]["City"] + ", "
        : "";

    locationName +=
      mileageRawReport["ReportLines"][i]["Stop"]["Address"]["State"] != ""
        ? mileageRawReport["ReportLines"][i]["Stop"]["Address"]["State"] + ", "
        : "";

    locationName += mileageRawReport["ReportLines"][i]["Stop"]["Address"]["Zip"]
      ? mileageRawReport["ReportLines"][i]["Stop"]["Address"]["Zip"]
      : "";

    const mileageReport = {
      location: locationName,
      legMiles: mileageRawReport["ReportLines"][i]["LMiles"],
      cumulativeMiles: mileageRawReport["ReportLines"][i]["TMiles"],
      driveTime: mileageRawReport["ReportLines"][i]["LHours"],
      cumulativeDriveTime: mileageRawReport["ReportLines"][i]["THours"],
    };
    mileageReports.push(mileageReport);
  }
  return mileageReports;
};

const createDetailedReports = (detailRawReport) => {
  let detailedReports = [];
  for (let y = 0; y < detailRawReport["ReportLegs"].length; y++) {
    for (
      let i = 0;
      i < detailRawReport["ReportLegs"][y]["ReportLines"].length;
      i++
    ) {
      let routeStop;
      let tollPlaza = "";

      routeStop =
        i === 0 ||
        i === detailRawReport["ReportLegs"][y]["ReportLines"].length - 1
          ? detailRawReport["ReportLegs"][y]["ReportLines"][i]["Stop"]
          : detailRawReport["ReportLegs"][y]["ReportLines"][i]["Route"];

      tollPlaza =
        detailRawReport["ReportLegs"][y]["ReportLines"][i]["TollPlazaName"] !=
        null
          ? detailRawReport["ReportLegs"][y]["ReportLines"][i]["TollPlazaName"]
          : "";

      if (detailRawReport["ReportLegs"][y]["ReportLines"][i]["Route"] != null) {
        const tollAmount = detailRawReport["ReportLegs"][y]["ReportLines"][i][
          "LToll"
        ]
          ? detailRawReport["ReportLegs"][y]["ReportLines"][i]["LToll"]
          : "0.00";
        const detailedReport = {
          stop: routeStop,
          miles: detailRawReport["ReportLegs"][y]["ReportLines"][i]["Miles"],
          time: detailRawReport["ReportLegs"][y]["ReportLines"][i]["Time"],
          interchange:
            detailRawReport["ReportLegs"][y]["ReportLines"][i]["InterCh"],
          cumulativeMiles:
            detailRawReport["ReportLegs"][y]["ReportLines"][i]["TMiles"],
          cumulativeDriveTime:
            detailRawReport["ReportLegs"][y]["ReportLines"][i]["TTime"],
          tollPlaza: tollPlaza,
          tollAmount: tollAmount,
        };
        detailedReports.push(detailedReport);
      }
    }
  }
  return detailedReports;
};

const createStateReport = (stateCountryRawReport) => {
  let stateReports = [];
  for (let i = 0; i < stateCountryRawReport["StateReportLines"].length; i++) {
    const stateReport = {
      state: stateCountryRawReport["StateReportLines"][i]["StCntry"],
      total: stateCountryRawReport["StateReportLines"][i]["Total"],
      toll: stateCountryRawReport["StateReportLines"][i]["Toll"],
      free: stateCountryRawReport["StateReportLines"][i]["Free"],
      ferry: stateCountryRawReport["StateReportLines"][i]["Ferry"],
      loaded: stateCountryRawReport["StateReportLines"][i]["Loaded"],
      empty: stateCountryRawReport["StateReportLines"][i]["Empty"],
      tolls: stateCountryRawReport["StateReportLines"][i]["Tolls"],
      energy: stateCountryRawReport["StateReportLines"][i]["Energy"],
    };

    stateReports.push(stateReport);
  }
  return stateReports;
};

const createDirectionReport = (drivingDirectionsRawReport) => {
  let directionReports = [];
  for (let y = 0; y < drivingDirectionsRawReport["ReportLegs"].length; y++) {
    for (
      let i = 0;
      i < drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"].length;
      i++
    ) {
      if (
        drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][i][
          "Begin"
        ] != null
      ) {
        const directionReport = {
          direction:
            drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][i][
              "Direction"
            ],
          distance:
            drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][i][
              "Dist"
            ] === null
              ? ""
              : drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][i][
                  "Dist"
                ],
          time:
            drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][i][
              "Time"
            ] === null
              ? ""
              : drivingDirectionsRawReport["ReportLegs"][y]["ReportLines"][i][
                  "Time"
                ],
        };
        directionReports.push(directionReport);
      }
    }
  }
  return directionReports;
};

const createRoadReport = (roadTypeRawReport) => {
  let roadReports = [];
  for (let i = 0; i < roadTypeRawReport["ReportLines"].length; i++) {
    let location = "";
    try {
      location +=
        roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
          "StreetAddress"
        ] !== ""
          ? roadTypeRawReport["ReportLines"][i]["Stop"]["Address"][
              "StreetAddress"
            ] + ", "
          : "";

      location +=
        roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["City"] != ""
          ? roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["City"] + " "
          : "";

      location +=
        roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["State"] != ""
          ? roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["State"] +
            ", "
          : "";

      location +=
        roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["Zip"] != ""
          ? (location +=
              roadTypeRawReport["ReportLines"][i]["Stop"]["Address"]["Zip"])
          : "";
    } catch (err) {
      location = "TOTAL";
    }
    const roadReport = {
      location: location,
      miles: roadTypeRawReport["ReportLines"][i]["LMiles"],
      interState: roadTypeRawReport["ReportLines"][i]["InterSt"],
      dividedHighWay: roadTypeRawReport["ReportLines"][i]["Divide"],
      primaryHighway: roadTypeRawReport["ReportLines"][i]["Prime"],
      ferry: roadTypeRawReport["ReportLines"][i]["Ferry"],
      secondaryHighWay: roadTypeRawReport["ReportLines"][i]["Second"],
      ramp: roadTypeRawReport["ReportLines"][i]["Ramp"],
      local: roadTypeRawReport["ReportLines"][i]["Local"],
      pathway: roadTypeRawReport["ReportLines"][i]["Pathway"],
      toll: roadTypeRawReport["ReportLines"][i]["Toll"],
      energy: roadTypeRawReport["ReportLines"][i]["Energy"],
    };
    roadReports.push(roadReport);
  }
  return roadReports;
};
