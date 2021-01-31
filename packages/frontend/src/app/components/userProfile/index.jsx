import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { DateTime } from "luxon";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";

import { truncateAddress } from "../../../utils";

import { logoutRequest } from "../../store/slices/auth";
import { showAlert } from "../../store/slices/alert";

import { ethService } from "../../api";

export function UserProfile() {
  const dispatch = useDispatch();
  const { account, image, balance, post } = useSelector((state) => state.eth);
  const { library, deactivate } = useWeb3React();

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleLogout = (event) => {
    deactivate();
    dispatch(logoutRequest());
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleExit = async (event) => {
    try {
      await ethService.sendExitTx({ account }, library);
    } catch (e) {
      dispatch(showAlert(e.message));
    }
  };

  const handleMe = () => {
    //dispatch(meRequest(token, refreshToken));
  };

  return (
    <Grid container alignItems="center" className={classes.root}>
      <ButtonGroup
        variant="contained"
        color="primary"
        size="small"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button
          disableFocusRipple
          disableRipple
          size="small"
          onClick={handleMe}
        >
          <div className={classes.balance}>{balance} ETH</div>
          <Divider orientation="vertical" flexItem />
          <div className={classes.account}>{truncateAddress(account)}</div>
          <Avatar className={classes.avatar} src={image} />
        </Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {post && (
                    <MenuItem key="post" onClick={handleExit}>
                      {truncateAddress(post.hash)} | {post.stake} ETH |{" "}
                      {DateTime.fromMillis(post.time).toRelative()}
                    </MenuItem>
                  )}
                  <MenuItem key="deactivate" onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: "white",
    width: "fit-content",
    backgroundColor: "#141414",
    textTransform: "none",
    fontFamily: "'Roboto Slab', serif",
    fontWeight: "900",
    fontSize: "1rem",
    lineHeight: "1.3125rem",
    borderRadius: 2,
    display: "flex",
    "& div": {
      margin: theme.spacing(0.5),
    },
    "& hr": {
      margin: theme.spacing(0.5),
      backgroundColor: "#454545",
    },
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));
