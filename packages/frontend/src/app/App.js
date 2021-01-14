import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";

import { Web3Provider } from "@ethersproject/providers";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Index } from "./pages/index";
import { About } from "./pages/about";
import { Terms } from "./pages/terms";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Web3ReactProvider getLibrary={getLibrary}>
        <CssBaseline />
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
        </div>
      </Web3ReactProvider>
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
