import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import store from "./app/store";
import { Provider } from "react-redux";
import { ethers } from "ethers";
import { Web3ReactProvider } from "@web3-react/core";
import * as serviceWorker from "./serviceWorker";

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

ReactDOM.render(
  //<React.StrictMode>
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </Provider>,
  //</React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
