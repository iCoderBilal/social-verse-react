import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

const Logout = (props) => {
  axios.get("/user/logout");
  axios.defaults.headers.common = [];
  localStorage.clear();
  return <Redirect to="/auth" />;
};

export default Logout;
