import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetToastify } from "@/reduxtoolkit/global.slice";

const ToastifyMain = () => {
  const { globalToastifyOpen, toastifyMsg, toastifyType } = useSelector(
    (s) => s.global
  );

  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(resetToastify());
  };

  return (
    <>
      <Snackbar
        open={globalToastifyOpen}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={onClose} severity={toastifyType} sx={{ width: "100%" }}>
          {toastifyMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ToastifyMain;
