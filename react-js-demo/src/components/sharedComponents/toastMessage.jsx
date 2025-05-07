import React from "react";
import Toast from "react-bootstrap/Toast";
import * as _ from "lodash";

function ToastMessage(props) {
  const { setShowToast, showToast, message } = props;
  return (
    <>
      {!_.isUndefined(message) ? (
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          id="toastMsg"
          className={
            message.type === "error"
              ? "d-inline-block m-1 toast-danger"
              : message.type === "warning"
              ? "d-inline-block m-1 toast-warning"
              : "d-inline-block m-1 toast-success"
          }>
          <Toast.Header>
            <strong className="me-auto">{message.text}</strong>
          </Toast.Header>
        </Toast>
      ) : null}
    </>
  );
}

export default ToastMessage;
