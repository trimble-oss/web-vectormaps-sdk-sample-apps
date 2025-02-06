/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Brandingname from "../BrandingName/Brandingname";

function Header(props) {
  const { setSidebarOpen } = props;
  function toggleHidden() {
    setSidebarOpen((prev) => !prev);
  }
  return (
    <>
      <nav
        className="navbar navbar-expand-sm modus-header pl-1"
        id="modus-header"
      >
        <a
          id="menuButton"
          data-modus-item="menu-btn"
          role="button"
          className="btn btn-lg btn-icon-only btn-text-dark mr-2"
          onClick={toggleHidden}
        >
          <i className="modus-icons menu-btn">menu</i>
        </a>
        <Brandingname></Brandingname>
        <div className="navbar-nav justify-content-end"></div>
      </nav>
    </>
  );
}

export default Header;
