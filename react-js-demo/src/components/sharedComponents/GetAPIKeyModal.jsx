import React, { useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import useToken from "../../hooks/useToken";
import * as _ from "lodash";

function GetAPIKeyModal(props) {
  const { showModal, setShowModal, apiKey, setApiKey, setLicensedFeature } =
    props;
  let jwtToken;
  jwtToken = useToken(apiKey);
  useEffect(() => {
    if (!_.isEmpty(jwtToken)) {
      setLicensedFeature(jwtToken);
    }
  }, [jwtToken]);

  const submit = () => {
    setApiKey(inputRef.current.value);
    setShowModal(false);
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
      centered
    >
      <Modal.Header>
        <Modal.Title id="getAPIKey">Authentication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="keyInput">API Key:</label>
        <input
          ref={inputRef}
          defaultValue={apiKey}
          className="form-control"
          id="keyInput"
          placeholder="API Key"
          type="password"
          required
        />
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
