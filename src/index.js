import React from "react";
import ReactDOM from "react-dom";
import indexSass from "./styles/index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/configureStore";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
