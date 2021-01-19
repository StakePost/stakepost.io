import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
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

import {
  truncateAddress,
  addIPFSPrefix,
  delIPFSPrefix,
  removeAuthFromStore,
} from "../../../utils";
import { ethSelector, deacivate } from "../../store/slices/eth";
import { logout } from "../../store/slices/auth";
import config from "../../config";

export function UserProfile() {
  const dispatch = useDispatch();
  const { account, image, balance } = useSelector(ethSelector);
  const { library, chainId, deactivate } = useWeb3React();

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [post, setPost] = useState(null);

  const handleLogout = (event) => {
    deactivate();
    dispatch(deacivate());
    dispatch(logout());
    removeAuthFromStore();
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

  const exitPost = async () => {
    try {
      const contract = new ethers.Contract(
        config.StakepostContractAt,
        config.StakepostContractAbi,
        library.getSigner(account)
      );
      await contract.exit();
    } catch (e) {
      //console.log(e);
    }
  };

  const stakePost = async () => {
    try {
      const contract = new ethers.Contract(
        config.StakepostContractAt,
        config.StakepostContractAbi,
        library.getSigner(account)
      );
      const hash = "QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vz";
      const encoded = ethers.utils.hexlify(ethers.utils.base58.decode(hash));
      const postHash = delIPFSPrefix(encoded);
      //console.log();
      await contract.stakeAndPost(postHash, {
        value: ethers.utils.parseEther("1.0"),
      });
    } catch (e) {
      //console.log(e);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!!account && !!library) {
        let stale = false;

        const contract = new ethers.Contract(
          config.StakepostContractAt,
          config.StakepostContractAbi,
          library
        );

        try {
          const postId = await contract.getStakepostIndexByUser(account);
          if (postId.gte(0)) {
            const post = await contract.posts(postId);
            if (post && !stale) {
              const hash = ethers.utils.base58.encode(addIPFSPrefix(post.post));
              const p = {
                hash: hash,
                user: post.user,
                stake: ethers.utils.formatEther(post.stake),
                time: new Date(post.time.toNumber() * 1000),
              };
              setPost(p);
            }
          }
        } catch (e) {
          if (!stale) {
            setPost(null);
          }
        }

        return () => {
          stale = true;
          setPost(undefined);
        };
      }
    }
    fetchData();
  }, [account, library, chainId]);

  return (
    <Grid container alignItems="center" className={classes.root}>
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button disableFocusRipple disableRipple onClick={deactivate}>
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
                    <MenuItem key="post" onClick={exitPost}>
                      {truncateAddress(post.hash)} | {post.stake} ETH |{" "}
                      {DateTime.fromJSDate(post.time).toRelative()}
                    </MenuItem>
                  )}
                  <MenuItem key="stakepost" onClick={stakePost}>
                    Stakepost
                  </MenuItem>
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
