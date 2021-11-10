import axios from "axios";
import React, { Component } from "react";
import ShelterToaster from "../services/ShelterToaster";
import TopUserDonor from "./TopUserDonor";
import TopUserDonorLoading from "./TopUserDonorLoading";

export default class TopDonor extends Component {
  state = {
    top_donors: null,
  };

  componentDidMount() {
    axios
      .get("/donors")
      .then((response) => {
        this.setState({ top_donors: response.data });
      })
      .catch(() => {
        ShelterToaster.error("Something went wrong loading the top donors");
      });
  }

  render() {
    return (
      <div className="top-donner-container bg-white rounded-2xl shadow donor flex-shrink-0 sticky top-10 m-10 hidden lg:flex flex-col items-center lg:ml-5">
        <p className="mt-4 bg-green-100 rounded-full w-1/2 text-center font-light text-green-500 flex flex-nowrap justify-center items-center">
          <img
    className="w-4 h-4 inline-block mr-1"
    src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/star_2b50.png"
    />{" "}
          Top Donors
        </p>
        <div className="flex flex-col items-baseline">
          {this.state.top_donors === null
            ? Array(7).fill(<TopUserDonorLoading></TopUserDonorLoading>)
            : this.state.top_donors.map((donor) => (
                <TopUserDonor key={donor.username} donor={donor}></TopUserDonor>
              ))}
        </div>
      </div>
    );
  }
}
