import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { constants } from "../../Utils/constants";

const CustomTooltip = ({ showToolTip }) => {
  return (
    <>
      {showToolTip ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{constants.UNLICENSED_MSG}</Tooltip>}
        >
          <span className="ml-3">
            <i className="modus-icons notranslate help-icon" aria-hidden="true">
              help
            </i>
          </span>
        </OverlayTrigger>
      ) : null}
    </>
  );
};

export default CustomTooltip;
