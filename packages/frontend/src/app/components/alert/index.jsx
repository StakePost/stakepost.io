import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { clearAlert } from "../../store/slices/alert";

export function Alert() {
  const dispatch = useDispatch();
  const { show, message } = useSelector((state) => state.alert);

  const handleAlertClose = () => {
    dispatch(clearAlert());
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={show}
      autoHideDuration={6000}
      onClose={handleAlertClose}
      message={message}
      action={
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleAlertClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
}
