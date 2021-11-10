import React, { Component } from "react";
import UserHelper from "./services/UserHelper";
import NavBar from "./components/NavBar";
import TopDonor from "./components/TopDonor";
import ShelterToaster from "./services/ShelterToaster";
import axios from "axios";
import { Redirect } from "react-router-dom";

export class CreatePost extends Component {
  state = {
    show_loader: false,
    formData: null,
    redirect: false,
  };

  componentDidMount() {
    document.body.classList.add("grey-bg");
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  avatarSection = () => {
    return (
      <div className="mr-4">
        <img
          className="flex-shrink-0 w-12 h-12 rounded-full"
          src={UserHelper.getProfilePicture()}
         alt={UserHelper.getUsername()}/>
      </div>
    );
  };

  handleBountyAmount = (e) => {
    let checkIfNum;
    if (e.key !== undefined) {
      // Check if it's a "e", ".", "+" or "-"
      checkIfNum =
        e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
    } else if (e.keyCode !== undefined) {
      // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
      checkIfNum =
        e.keyCode === 69 ||
        e.keyCode === 190 ||
        e.keyCode === 187 ||
        e.keyCode === 189;
    }
    return checkIfNum && e.preventDefault();
  };

  handleBidSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);

    const bountyAmount = Math.abs(parseInt(formData.get("bid_amount")));

    if (bountyAmount > UserHelper.getBalance()) {
      ShelterToaster.error("Insufficient shelter tokens. Buy some more!");
      return false;
    }

    if (formData.get("bid_heading").length < 6) {
      ShelterToaster.error("The bidding heading is too short!");
      return false;
    }

    if (formData.get("bid_content").length < 10) {
      ShelterToaster.error("The bidding content is too short!");
      return false;
    }

    this.setState({ formData: formData, show_loader: true }, () => {
      axios
        .post("/post/create", this.state.formData)
        .then((response) => {
          if (response.data.status === "success") {
            ShelterToaster.success("Your bid was created!");
            this.setState({
              redirect: true,
              identifier: response.data.identifier,
              slug: response.data.slug,
            });
          }
        })
        .catch((response) => {
          ShelterToaster.error(response.data.message);
          this.setState({ show_loader: false });
        });
    });

    return false;
  };

  loader = () => {
    return (
      <div className="flex flex-col justify-center items-start my-5 max-w-md mx-auto bg-white rounded-xl shadow-none overflow-hidden md:max-w-2xl">
        <p className="flex justify-center p-10 mt-24">
          <img src="/loader.gif"  alt="Shelter Loader"/>
        </p>
      </div>
    );
  };

  createPost = () => {
    return (
      <form
        onSubmit={(e) => this.handleBidSubmit(e)}
        className="flex flex-col w-3/4 h-3/4 m-10 bg-white rounded-xl shadow shelter-limit-container-width lg:mr-5 overflow-hidden"
      >
        <div className="flex p-4 flex-wrap justify-center md:justify-items-start">
          {this.avatarSection()}
          <input
            type="text"
            className="mt-4 h-12 w-11/12 flex-grow px-2 outline-none text-xl border rounded-full border-green-50 placeholder-opacity-30 focus:ring-1 focus:ring-green-200 md:w-auto md:mt-0"
            placeholder="Bid Heading"
            name="bid_heading"
            defaultValue={
              this.state.formData && this.state.formData.get("bid_heading")
            }
            required
          />
        </div>
        <div className="w-full p-2 mx-4">
          <textarea
            rows="5"
            className="p-2 outline-none w-11/12 text-xl border rounded-md border-green-50 placeholder-opacity-30 focus:ring-1 focus:ring-green-200"
            placeholder="Bid Details..."
            name="bid_content"
            defaultValue={
              this.state.formData && this.state.formData.get("bid_content")
            }
            required
          />
        </div>
        <div className="mx-6 mb-4 flex flex-col md:block">
          <input
            onKeyPress={(e) => this.handleBountyAmount(e)}
            type="number"
            placeholder="Bid Amount"
            name="bid_amount"
            defaultValue={
              this.state.formData && this.state.formData.get("bid_amount")
            }
            className="w-11/12 outline-none p-2 text-xl rounded-md border border-green-50 placeholder-opacity-30 focus:ring-1 focus:ring-green-200 md:w-6/12"
            required
          />
        </div>

        <hr/>
        <button
          type="submit"
          className="text-white text-sm m-4 w-32 bg-green-400 p-2 uppercase rounded-full hover:bg-green-500"
        >
          Submit Bid
        </button>
      </form>
    );
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to={`/post/${this.state.identifier}/${this.state.slug}`} />
      );
    }

    return (
      <React.Fragment>
        <NavBar/>
        <div className="mx-auto flex justify-center">
          {this.createPost()}
          <TopDonor/>
        </div>
      </React.Fragment>
    );
  }
}

export default CreatePost;
