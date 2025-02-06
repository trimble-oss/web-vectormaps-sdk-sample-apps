import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { transformReports } from "../../Utils/transformReports";
import { Tabs, Tab } from "react-bootstrap";
import { useMapContext } from "../../context/mapContext";
import * as TrimbleMaps from "@trimblemaps/trimblemaps-js";
import * as _ from "lodash";
import MileageReport from "./MileageReport";
import DetailedReport from "./DetailedReport";
import DirectionReport from "./DirectionReport";
import RoadReport from "./RoadReport";
import StateReport from "./StateReport";
import CustomTooltip from "../ToolTip/CustomToolTip";

function ShowReports(props) {
  const { map } = useMapContext();
  const [show, setShow] = useState(false);
  const [mileageType, setMileageType] = useState("Miles");
  const { reports, disableBtn } = props;
  const [transformedReports, setTransformedReports] = useState(undefined);

  useEffect(() => {
    if (map.getRegion() === TrimbleMaps.Common.Region.NA) {
      setMileageType("Miles");
    } else {
      setMileageType("Kilometres");
    }
    if (!_.isUndefined(reports)) {
      const newReports = transformReports(reports);
      setTransformedReports(newReports);
    }
  }, [reports]);

  return (
    <>
      <Button
        variant="primary"
        className="ml-1"
        onClick={() => setShow(true)}
        disabled={disableBtn}
      >
        Show Reports
      </Button>
      <CustomTooltip showToolTip={disableBtn}></CustomTooltip>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-xl modal-dialog-scrollable"
        aria-labelledby="reports"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="reports">Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ng-container>
            {transformedReports ? (
              <Tabs
                className="nav nav-tabs nav-tabs-sm mt-3 d-print-none"
                defaultActiveKey="mileageReport"
                id="reports"
              >
                <Tab
                  className="py-3"
                  eventKey="mileageReport"
                  title="Mileage Report"
                >
                  <MileageReport
                    mileageReports={transformedReports.mileageReports}
                    mileageType={mileageType}
                  ></MileageReport>
                </Tab>

                <Tab
                  className="py-3"
                  eventKey="detailedRoute"
                  title="Detailed Route"
                >
                  <DetailedReport
                    detailedReports={transformedReports.detailedReports}
                    mileageType={mileageType}
                  ></DetailedReport>
                </Tab>
                <Tab className="py-3" eventKey="directions" title="Directions">
                  <DirectionReport
                    directionReports={transformedReports.directionReports}
                  ></DirectionReport>
                </Tab>
                <Tab className="py-3" eventKey="state" title="State">
                  <StateReport
                    stateReports={transformedReports.stateReports}
                  ></StateReport>
                </Tab>
                <Tab className="py-3" eventKey="road" title="Road">
                  <RoadReport
                    roadReports={transformedReports?.roadReports}
                  ></RoadReport>
                </Tab>
              </Tabs>
            ) : null}
          </ng-container>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default ShowReports;
