import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export function StyledButton(props) {
  const classes = useStyles();
  const { onClick, children, ...rest } = props;
  return (
    <Button
      className={classes.root}
      variant="contained"
      disableElevation
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: "white",
    backgroundColor: "#141414",
    textTransform: "none",
    fontFamily: "'Roboto Slab', serif",
    fontWeight: "900",
    fontSize: "1rem",
    lineHeight: "1.3125rem",
    "&:hover": {
      backgroundColor: "#191919",
    },
  },
}));
