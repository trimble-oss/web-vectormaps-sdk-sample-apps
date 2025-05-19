import React from "react";

function MileageReport(props) {
  const { mileageReports, mileageType } = props;
  return (
    <table id="mileageTable" className="table table-hover">
      <thead className="bg-gray-light" id="mileageTableHeader">
        <tr>
          <th key="location">Location</th>
          <th key="leg">Leg {mileageType}</th>
          <th key="cumulativeMileageType">Cumulative {mileageType}</th>
          <th key="legDriveTime">Leg Drive Time</th>
          <th key="cumulativeDriveTime">Cumulative Drive Time</th>
        </tr>
      </thead>
      <tbody id="detailTableBody">
        {mileageReports.map((mileageReport, index) => (
          <tr key={index}>
            <td key={"location" + index}>{mileageReport.location}</td>
            <td key={"leg" + index}>{mileageReport.legMiles}</td>
            <td key={"cumulativeMileageType" + index}>
              {mileageReport.cumulativeMiles}
            </td>
            <td key={"legDriveTime" + index}>{mileageReport.driveTime}</td>
            <td key={"cumulativeDriveTime" + index}>
              {mileageReport.cumulativeDriveTime}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MileageReport;
