import React from "react";

function DetailedReport(props) {
  const { detailedReports, mileageType } = props;
  return (
    <table id="detailTable" className="table table-hover">
      <thead className="bg-gray-light" id="detailTableHeader">
        <tr>
          <th key="stop" scope="col">
            Stop
          </th>
          <th key="milType" scope="col">
            {mileageType}
          </th>
          <th key="time" scope="col">
            Time
          </th>
          <th key="interchange" scope="col">
            Interchange
          </th>
          <th key="mileageType" scope="col">
            Cumulative {mileageType}
          </th>
          <th key="drivingTime" scope="col">
            Cumulative Drive Time
          </th>
          <th key="tollPlaza" scope="col">
            Toll Plaza
          </th>
          <th key="tollCost" scope="col">
            Toll Cost
          </th>
        </tr>
      </thead>
      <tbody id="detailTableBody">
        {detailedReports.map((detailReport, index) => (
          <tr key={index}>
            <td key={"stop" + index}>{detailReport.stop}</td>
            <td key={"miles" + index}>{detailReport.miles}</td>
            <td key={"time" + index}>{detailReport.time}</td>
            <td key={"interchange" + index}>{detailReport.interchange}</td>
            <td key={"cumulativeMiles" + index}>
              {detailReport.cumulativeMiles}
            </td>
            <td key={"cumulativeDriveTime" + index}>
              {detailReport.cumulativeDriveTime}
            </td>
            <td key={"tollPlaza" + index}>{detailReport.tollPlaza}</td>
            <td key={"tollAmount" + index}>{detailReport.tollAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DetailedReport;
