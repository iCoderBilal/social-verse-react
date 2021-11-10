import React, { Component } from "react";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import TopDonor from "./components/TopDonor";

export class Home extends Component {
  componentDidMount() {
    document.body.classList.add("grey-bg");
  }

  render() {
    return (
      <React.Fragment>
        <NavBar/>
        <div className="mx-auto flex justify-center">
          <Feed/>
          <TopDonor/>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
