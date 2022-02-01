import React, { Component } from "react";
import FormGroup from "../components/FormGroup";
import ProgressiveImage from "react-progressive-image";
import axios from "axios";

export class NotFound extends Component {
  state = {
    originalURL: null,
    placeholderURL: null,
  };

  componentDidMount() {
    document.body.classList.remove("grey-bg");
    let fetchImage = axios.head(
      "https://source.unsplash.com/1138x1390/?homeless,person"
    );
    fetchImage.then((response) => {
      const originalURL = response.request.responseURL;
      const url = new URL(originalURL);
      url.searchParams.set("fit", "clamp");
      url.searchParams.set("w", 113);
      url.searchParams.set("h", 139);
      url.searchParams.delete("crop");
      const placeholderURL = url.href;
      this.setState({
        originalURL: originalURL,
        placeholderURL: placeholderURL,
      });
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
              alt="Flic Logo"
            />
            <div className="mt-10">
              <h1 className="text-7xl font-thin text-red-500">
                404
                <br />
                Not Found
              </h1>
            </div>
            <div className="mt-12">
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

export default NotFound;
