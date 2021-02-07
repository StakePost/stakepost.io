import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import { useEagerConnect, useInactiveListener } from './hooks';

import Header from './components/header';
import Footer from './components/footer';
import Index from './pages/index';
import About from './pages/about';
import Terms from './pages/terms';

import { getAccountDataRequest } from './store/slices/eth';
import { statusRequest } from './store/slices/auth';

import Alert from './components/alert';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#141414',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

const App = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const { account, library } = useWeb3React();

  useEffect(() => {
    if (!!account && !!library) {
      dispatch(statusRequest({ account, provider: library }));
      dispatch(getAccountDataRequest({ account, library }));
    }
  }, [dispatch, account, library]);

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
          <Alert />
        </div>
      </ThemeProvider>
    </Router>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    fontFamily: '"Inter", sans-serif;',
    fontSize: '1rem',
  },
}));

export default App;
