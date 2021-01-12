import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TwitterIcon from "@material-ui/icons/Twitter";
import TelegramIcon from "@material-ui/icons/Telegram";
import GithubIcon from "@material-ui/icons/GitHub";

const LinkBehavior = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
));
export function Header() {
  const classes = useStyles();
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar className={classes.noGutters}>
        <Link component={LinkBehavior} to="/" className={classes.logoLink}>
          <Box className={classes.logo}>stakepost</Box>
        </Link>
        <Box className={classes.iconBox}>
          <IconButton className={classes.headerIcon}>
            <TwitterIcon />
          </IconButton>
          <IconButton className={classes.headerIcon}>
            <TelegramIcon />
          </IconButton>
          <IconButton className={classes.headerIcon}>
            <GithubIcon />
          </IconButton>
        </Box>
        <UnlockButton variant="contained" disableElevation>
          unlock wallet
        </UnlockButton>
      </Toolbar>
    </AppBar>
  );
}

const UnlockButton = withStyles((theme) => ({
  root: {
    color: "white",
    backgroundColor: "#141414",
    textTransform: "none",
    fontFamily: "'Roboto Slab', serif",
    fontWeight: "900",
    fontSize: "16px",
    lineHeight: "21px",
    "&:hover": {
      backgroundColor: "#191919",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  noGutters: {
    paddingLeft: "0px",
    paddingRight: "0px",
  },
  logo: {
    fontFamily: "'Roboto Slab', serif",
    fontWeight: "900",
    fontSize: "24px",
    lineHeight: "32px",
  },
  logoLink: {
    color: "black",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
  iconBox: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  headerIcon: {
    color: "#464545",
  },
}));
