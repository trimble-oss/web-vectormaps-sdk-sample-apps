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
              ? "toast-danger"
              : message.type === "warning"
              ? "toast-warning"
              : "toast-success"
          }
        >
          <Toast.Header closeButton="true"></Toast.Header>
          <Toast.Body>{message.text}</Toast.Body>
        </Toast>
      ) : null}
    </>
  );
}

export default ToastMessage;
