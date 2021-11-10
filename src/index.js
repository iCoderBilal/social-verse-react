import React from "react";
import ReactDOM from "react-dom";
import "./shelter.css";
import axios from "axios";
import App from "./App";
import AuthHelper from "./services/AuthHelper";

axios.defaults.baseURL = "https://api.shelterhumanity.com";
//axios.defaults.baseURL = "http://localhost";
if (AuthHelper.getUserToken())
  axios.defaults.headers.common["Shelter-Token"] = AuthHelper.getUserToken();

ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.getElementById("root")
);
