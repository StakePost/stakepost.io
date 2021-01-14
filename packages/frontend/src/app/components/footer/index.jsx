import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const LinkBehavior = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

export function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.root}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs>
            <Link
              component={LinkBehavior}
              to="/about"
              className={classes.footerLink}
            >
              About
            </Link>
            <Link
              component={LinkBehavior}
              to="/terms"
              className={classes.footerLink}
            >
              Terms
            </Link>
          </Grid>
          <Grid item xs className={classes.footerYear}>
            <span>2021</span>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexShrink: "0",
    height: "2.5rem",
    backgroundColor: "white",
  },
  footerLink: {
    color: "#8ACF9C",
    marginRight: theme.spacing(2),
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  footerYear: {
    color: "#8ACF9C",
    display: "flex",
    justifyContent: "flex-end",
  },
}));
