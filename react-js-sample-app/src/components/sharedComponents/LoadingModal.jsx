import React from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

function LoadingModal(props) {
  const { show, setShow, loadingText } = props;
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      size="sm"
      aria-labelledby="reports"
      animation={false}
      centered
    >
      <Modal.Body>
        <div className="text-center text-primary">
          <Spinner animation="border" variant="primary" />{" "}
          <div className="h3 text-primary mt-3">{loadingText}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default LoadingModal;
