import React from "react";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

export function About() {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.root}>
      About
    </Container>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    flex: "1 0 auto",
  },
}));
