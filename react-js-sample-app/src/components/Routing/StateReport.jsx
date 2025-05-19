import React from "react";

function StateReport(props) {
  const { stateReports } = props;
  return (
    <table id="stateTable" className="table table-hover">
      <thead className="bg-gray-light">
        <tr>
          <th key="state" scope="col">
            State
          </th>
          <th key="total" scope="col">
            Total
          </th>
          <th key="toll" scope="col">
            Toll
          </th>
          <th key="free" scope="col">
            Free
          </th>
          <th key="ferry" scope="col">
            Ferry
          </th>
          <th key="loaded" scope="col">
            Loaded
          </th>
          <th key="empty" scope="col">
            Empty
          </th>
          <th key="tolls" scope="col">
            Tolls
          </th>
          <th key="energy" scope="col">
            Energy
          </th>
        </tr>
      </thead>
      <tbody id="stateTableBody">
        {stateReports.map((state, index) => (
          <tr key={index}>
            <td key={"state" + index}>{state.state}</td>
            <td key={"total" + index}>{state.total}</td>
            <td key={"toll" + index}>{state.toll}</td>
            <td key={"free" + index}>{state.free}</td>
            <td key={"ferry" + index}>{state.ferry}</td>
            <td key={"loaded" + index}>{state.loaded}</td>
            <td key={"empty" + index}>{state.empty}</td>
            <td key={"tolls" + index}>{state.tolls}</td>
            <td key={"energy" + index}>{state.energy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StateReport;
