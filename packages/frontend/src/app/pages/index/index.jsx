import React from "react";
import { makeStyles } from "@material-ui/core/styles";

export function Index() {
  const classes = useStyles();
  return <div className={classes.root}>Index</div>;
}
const useStyles = makeStyles((theme) => ({
  root: {
    flex: "1 0 auto",
  },
}));
