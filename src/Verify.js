import React, { Component } from "react";
import FormGroup from "./components/FormGroup";
import ProgressiveImage from "react-progressive-image";
import axios from "axios";
import FlicToaster from "./services/FlicToaster";

export class Verify extends Component {
  state = {
    originalURL: null,
    placeholderURL: null,
  };

  componentDidMount() {
    document.body.classList.remove("grey-bg");
    let fetchImage = axios.head(
      "https://source.unsplash.com/1138x1390/?mobile,person"
    );
    const pageURL = new URL(window.location.href);
    let formData = new FormData();
    formData.append("username", pageURL.searchParams.get("username") || "");
    formData.append("code", pageURL.searchParams.get("code") || "");
    let verifyUsername = axios.post("/user/verify", formData);
    fetchImage.then((response) => {
      const originalResponseURL = response.request.responseURL;
      const url = new URL(originalResponseURL);
      url.searchParams.set("fit", "clamp");
      url.searchParams.set("w", 113);
      url.searchParams.set("h", 139);
      url.searchParams.delete("crop");
      const placeholderURL = url.href;
      this.setState({
        originalURL: originalResponseURL,
        placeholderURL: placeholderURL,
      });
    });

    verifyUsername.then((response) => {
      if (response.data.status == "success") {
        this.setState({ emailVerified: true });
        FlicToaster.success(response.data.message);
      } else {
        this.setState({ emailVerified: false });
        FlicToaster.error(response.data.message);
      }
    });


    gtag('event', 'view', {
      'event_category' : 'page',
      'event_label' : 'Verification Page'
    });

  }

  getLeftSideBar = () => {
    if (this.state.originalURL == null || this.state.placeholderURL == null)
      return (
        <div className="w-full h-full object-cover animate-pulse bg-red-200" />
      );
    return (
      <ProgressiveImage
        src={this.state.originalURL}
        placeholder={this.state.placeholderURL}
      >
        {(src) => (
          <img
            src={src}
            className="w-full h-full object-cover"
            alt="Flic Sidebar"
          />
        )}
      </ProgressiveImage>
    );
  };

  getRightSideBar = () => {
    if (this.state.emailVerified == undefined) {
      return (
        <>
          <p className="flex justify-center p-10 mt-24">
            <img src="loader.gif" />
          </p>
          <h2 className="text-7xl font-thin text-red-500">Checking...</h2>
        </>
      );
    }
    return (
      <h3 className="text-7xl font-thin text-red-500 p-10 mt-24">
        {this.state.emailVerified ? "Email Verified" : "Failed 😔"}
      </h3>
    );
  };

  render() {
    return (
      <div className="absolute w-screen h-screen flex">
        <div className="hidden lg:block w-5/12 h-full">
          {this.getLeftSideBar()}
        </div>
        <div className="w-full lg:w-7/12 overflow-hidden py-24 relative">
          <form
            onSubmit={(e) => this.handleAuthSubmit(e)}
            className="w-5/6 sm:w-1/2 mx-auto text-center"
          >
            <img
              src="https://shelter-cdn.nyc3.cdn.digitaloceanspaces.com/flic/assets/flic.png"
              className="h-8 block mx-auto"
              alt="Flic's Logo"
            />
            <div className="mt-10">{this.getRightSideBar()}</div>
            <div className="mt-12">
              {this.state.emailVerified != undefined ? (
                <FormGroup>
                  <button
                    type="button"
                    onClick={() => {
                      this.props.history.push("/");
                    }}
                    className="shadow-lg inline-block rounded-sm font-medium border border-solid cursor-pointer text-center transition-colors duration-200 text-base py-3 px-6 text-white bg-red-500 border-red-500 hover:bg-red-400 hover:border-red-400 w-full"
                  >
                    Let's go back to home?
                  </button>
                </FormGroup>
              ) : (
                <></>
              )}
              <p className="text-sm mt-6 text-center">
                Flic, 2021.
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Verify;
