import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "./hooks";
import makeBlockie from "ethereum-blockies-base64";

import { ethers } from "ethers";

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";

import CssBaseline from "@material-ui/core/CssBaseline";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Index } from "./pages/index";
import { About } from "./pages/about";
import { Terms } from "./pages/terms";

import config from "./config";
import { injected } from "./store/connectors";
import { activate, deacivate } from "./store/slices/eth";
import {
  authSelector,
  registerRequest,
  loginRequest,
  restoreLoginSuccess,
  signatureSuccess,
  signatureFailure,
} from "./store/slices/auth";

import { clearAlert, alertSelector } from "./store/slices/alert";

import { getAuthFromStore, saveAuthToStore } from "../utils";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#141414",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function App() {
  const dispatch = useDispatch();
  const {
    requestSignature,
    nonce,
    authorized,
    token,
    refreshToken,
  } = useSelector(authSelector);

  const { account, library } = useWeb3React();
  const classes = useStyles();

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  useEffect(() => {
    async function fetchData() {
      if (!!account && !!library) {
        let stale = false;

        try {
          const image = makeBlockie(account);
          const balanceBn = await library.getBalance(account);
          const balance = ethers.utils.formatEther(balanceBn).substr(0, 4);

          dispatch(activate({ account, image, balance }));
          if (!authorized) dispatch(registerRequest(account));
        } catch (e) {
          if (!stale) {
            dispatch(deacivate());
          }
        }

        return () => {
          stale = true;
          dispatch(deacivate());
        };
      }
    }
    fetchData();
  }, [dispatch, account, library, authorized]);

  useEffect(() => {
    async function fetchData() {
      if (!!requestSignature) {
        let stale = false;

        try {
          const message = config.SignatureTemplate + ` ${nonce}`;

          const signature = await library
            .getSigner(account)
            .signMessage(message);

          dispatch(signatureSuccess());
          dispatch(loginRequest(account, signature));
        } catch (e) {
          console.log(e);
          if (!stale) {
            dispatch(signatureFailure(e));
          }
        }

        return () => {
          stale = true;
          dispatch(deacivate());
        };
      }
    }
    fetchData();
  }, [requestSignature, account, dispatch, library, nonce]);

  useEffect(() => {
    if (!!authorized) {
      saveAuthToStore({ account, token, refreshToken });
    }
  }, [authorized, account, token, refreshToken, dispatch]);

  useEffect(() => {
    if (!authorized) {
      const {
        storeAccount,
        storeToken,
        storeRefreshToken,
      } = getAuthFromStore();

      if (storeAccount && storeToken && storeRefreshToken) {
        dispatch(
          restoreLoginSuccess({
            token: storeToken,
            refreshToken: storeRefreshToken,
          })
        );
        injected.isAuthorized().then((isAuthorized) => {
          if (isAuthorized) {
            activate(injected);
          }
        });
      }
    }
  }, [authorized, dispatch, account]);

  const { show, message } = useSelector(alertSelector);
  const alertShow = show;
  const alertMessage = message;

  const handleAlertClose = () => {
    dispatch(clearAlert());
  };

  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <Header />
          <Switch>
            <Route exact path="/about">
              <About />
            </Route>
            <Route exact path="/terms">
              <Terms />
            </Route>
            <Route exact path="/">
              <Index />
            </Route>
          </Switch>
          <Footer />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={alertShow}
            autoHideDuration={6000}
            onClose={handleAlertClose}
            message={alertMessage}
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
        </div>
      </ThemeProvider>
    </Router>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    fontFamily: '"Inter", sans-serif;',
    fontSize: "1rem",
  },
}));

export default App;
