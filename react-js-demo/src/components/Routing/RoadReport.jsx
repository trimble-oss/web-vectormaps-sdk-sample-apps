import React from "react";

function RoadReport(props) {
  const { roadReports } = props;
  return (
    <table id="roadTable" className="table table-hover">
      <thead className="bg-gray-light">
        <tr>
          <th key="location" scope="col">
            Location
          </th>
          <th key="miles" scope="col">
            Miles
          </th>
          <th key="interstate" scope="col">
            Interstate
          </th>
          <th key="dividedHighway" scope="col">
            Divided Highway
          </th>
          <th key="primaryHighway" scope="col">
            Primary Highway
          </th>
          <th key="ferry" scope="col">
            Ferry
          </th>
          <th key="secondaryHighWay" scope="col">
            Secondary Highway
          </th>
          <th key="ramp" scope="col">
            Ramp
          </th>
          <th key="local" scope="col">
            Local
          </th>
          <th key="pathWay" scope="col">
            Pathway
          </th>
          <th key="toll" scope="col">
            Toll
          </th>
          <th key="energy" scope="col">
            Energy
          </th>
        </tr>
      </thead>
      <tbody id="roadTableBody">
        {roadReports.map((road, index) => (
          <tr key={index}>
            <td key={"location" + index}>{road.location}</td>
            <td key={"miles" + index}>{road.miles}</td>
            <td key={"interstate" + index}>{road.interstate}</td>
            <td key={"dividedHighway" + index}>{road.dividedHighway}</td>
            <td key={"primaryHighway" + index}>{road.primaryHighway}</td>
            <td key={"ferry" + index}>{road.ferry}</td>
            <td key={"secondaryHighway" + index}>{road.secondaryHighway}</td>
            <td key={"ramp" + index}>{road.ramp}</td>
            <td key={"local" + index}>{road.local}</td>
            <td key={"pathway" + index}>{road.pathway}</td>
            <td key={"toll" + index}>{road.toll}</td>
            <td key={"energy" + index}>{road.energy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RoadReport;
