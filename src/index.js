import React from "react";
import ReactDOM from "react-dom";
import indexSass from "./styles/index.scss";
import axios from "axios";
import App from "./App";
import AuthHelper from "./services/AuthHelper";

axios.defaults.baseURL = "https://api.watchflic.com";
axios.defaults.baseURL = "https://127.0.0.1:8003";
if (AuthHelper.getUserToken())
  axios.defaults.headers.common["Flic-Token"] = AuthHelper.getUserToken();

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById("root")
);
