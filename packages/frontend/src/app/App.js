import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Index } from "./pages/index";
import { About } from "./pages/about";
import { Terms } from "./pages/terms";

function App() {
  const classes = useStyles();
  return (
    <Router>
      <CssBaseline />
      <div className={classes.root}>
        <Container maxWidth="lg" className={classes.root}>
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
        </Container>
      </div>
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
