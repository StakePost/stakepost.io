import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import makeBlockie from "ethereum-blockies-base64";
import { formatEther } from "@ethersproject/units";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { truncateAddress } from "../../../utils";

export function UserProfile() {
  const { library, account, chainId, deactivate } = useWeb3React();
  const classes = useStyles();
  const [balance, setBalance] = useState(0);
  const [accountImage, setAccountImage] = useState("");

  useEffect(() => {
    setAccountImage(makeBlockie(account));
  }, [account, accountImage]);

  useEffect(() => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]);

  return (
    <Button disableFocusRipple disableRipple onClick={deactivate}>
      <Grid container alignItems="center" className={classes.root}>
        <div className={classes.balance}>
          {balance ? formatEther(balance).substr(0, 4) : "..."} ETH
        </div>
        <Divider orientation="vertical" flexItem />
        <div className={classes.account}>{truncateAddress(account)}</div>
        <Avatar className={classes.avatar} src={accountImage} />
      </Grid>
    </Button>
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
