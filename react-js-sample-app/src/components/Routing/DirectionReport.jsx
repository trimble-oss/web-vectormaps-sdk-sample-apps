import React from "react";

function DirectionReport(props) {
  const { directionReports } = props;
  return (
    <table id="directionsTable" className="table table-hover">
      <thead className="bg-gray-light">
        <tr>
          <th key="direction" scope="col">
            Direction
          </th>
          <th key="distance" scope="col">
            Distance
          </th>
          <th key="time" scope="col">
            Time
          </th>
        </tr>
      </thead>
      <tbody id="directionsTableBody">
        {directionReports.map((directionReport, index) => (
          <tr key={index}>
            <td key={"direction" + index}>{directionReport.direction}</td>
            <td key={"distance" + index}>{directionReport.distance}</td>
            <td key={"time" + index}>{directionReport.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DirectionReport;
