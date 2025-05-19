import React from "react";
import { useNavigate } from "react-router-dom";
import "./BrandingName.scss";
function Brandingname() {
  const navigate = useNavigate();
  const navigateToHomePage = () => {
    navigate("/selectRegion");
  };
  return (
    <div className="d-flex align-items-center mr-auto set-cursor">
      <a>
        <img
          src={"../../assets/img/trimble-logo.svg"}
          className="app-logo d-block"
        />
      </a>
      <a onClick={navigateToHomePage}>
        <h1 className="app-name ml-2">{"Vector Maps Demo"}</h1>
      </a>
    </div>
  );
}

export default Brandingname;
