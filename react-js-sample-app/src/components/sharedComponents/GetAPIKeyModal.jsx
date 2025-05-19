import React, { useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import useToken from "../../hooks/useToken";
import * as _ from "lodash";
import { constants } from "../../Utils/constants";

function GetAPIKeyModal(props) {
  const { showModal, setShowModal, apiKey, setApiKey, setLicensedFeature } =
    props;

  let { jwtToken, error } = useToken(apiKey);
  useEffect(() => {
    if (!_.isEmpty(jwtToken)) {
      setLicensedFeature(jwtToken);
      setShowModal(false);
    }
  }, [jwtToken, error]);

  const submit = () => {
    setApiKey(inputRef.current.value);
  };
  const inputRef = useRef();
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      backdrop="static"
      keyboard={false}
      aria-labelledby="getAPIKey"
      animation={false}
      centered>
      <Modal.Header>
        <Modal.Title id="getAPIKey">Authentication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? (
          <Alert key="danger" variant="danger">
            {constants.API_ERROR_MSG}
          </Alert>
        ) : null}
        <label htmlFor="keyInput" className="col-form-label fw-normal">
          <span>Trimble Maps SDK API Key</span>
          <span className="required">*</span>
        </label>
        <input
          ref={inputRef}
          defaultValue={apiKey}
          className="form-control"
          id="keyInput"
          maxLength="32"
          minLength="32"
          placeholder="API Key"
          type="password"
          required
        />
        <div className="fst-italic mt-1">
          To gain access you must have an API key. Please contact your Trimble
          Maps representative or our{" "}
          <a
            href="https://maps.trimble.com/contact/"
            target="_blank"
            rel="noopener noreferrer">
            Sales team
          </a>{" "}
          for more information.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" className="btn btn-primary" onClick={submit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GetAPIKeyModal;
