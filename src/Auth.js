import React, { Component } from "react";
import FormGroup from "./components/FormGroup";
import ProgressiveImage from "react-progressive-image";
import axios from "axios";
import RightArrowIcon from "./components/RightArrowIcon";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AuthHelper from "./services/AuthHelper";
import HorizontalLogo from "./components/HorizontalLogo";
import ShelterToaster from "./services/ShelterToaster";

export class Auth extends Component {
  state = {
    formType: "login",
    originalURL: null,
    placeholderURL: null,
    isSubmitButtonLoading: false,
  };

  componentDidMount() {
    if (AuthHelper.isUserLoggedIn()) {
      this.props.history.push("/");
      this.props.history.go();
    }
    document.body.classList.remove("grey-bg");
    const fetchImage = axios.head(
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

  showLogin = () => {
    this.setState({ formType: "login" });
  };

  showRegister = () => {
    this.setState({ formType: "register" });
  };

  enableSubmitButton = () => {
    this.setState({ isSubmitButtonLoading: false });
  };

  doLogin = (formData) => {
    axios
      .post("/user/login", formData)
      .then((response) => {
        if (response.data.status === "success") {
          ShelterToaster.success("Login success! :D");
          AuthHelper.setUser(response.data);
          this.props.forceUpdateAppState();
          this.props.history.push("/");
          this.props.history.go();
        } else {
          ShelterToaster.error(response.data.message);
        }
      })
      .catch((response) => {
        ShelterToaster.error("We are sorry. Something went wrong.");
      })
      .finally(() => {
        this.enableSubmitButton();
      });
  };

  doRegister = (formData) => {
    axios
      .post("/user/create", formData)
      .then((response) => {
        if (response.data.status === "success") {
          ShelterToaster.success(response.data.message);
        } else {
          ShelterToaster.error(response.data.message);
        }
      })
      .catch((response) => {
        ShelterToaster.error("We are sorry. Something went wrong.");
      })
      .finally(() => {
        this.enableSubmitButton();
      });
  };

  handleAuthSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isSubmitButtonLoading: true });
    const formData = new FormData(event.currentTarget);

    switch (this.state.formType) {
      case "login":
        this.doLogin(formData);
        break;
      case "register":
        this.doRegister(formData);
        break;
      default:
        console.log("error");
    }
  };

  getLeftSideBar = () => {
    if (this.state.originalURL == null || this.state.placeholderURL == null)
      return (
        <div className="w-full h-full object-cover animate-pulse bg-green-200" />
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
            alt="Shelter Sidebar"
          />
        )}
      </ProgressiveImage>
    );
  };

  getFormHeading = () => {
    if (this.state.formType === "login")
      return (
        <>
          <h2 className="text-3xl text-gray-800">Login</h2>
          <p className="mt-3 text-gray-800">
            New to Shelter?
            <span
              onClick={() => this.showRegister()}
              className="ml-2 text-green-500 cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </>
      );
    return (
      <>
        <h2 className="text-3xl text-gray-800">Register</h2>
        <p className="mt-3 text-gray-800">
          Already a member?
          <span
            onClick={() => this.showLogin()}
            className="ml-2 text-green-500 cursor-pointer"
          >
            Login in
          </span>
        </p>
      </>
    );
  };

  getFormButton = () => {
    if (this.state.isSubmitButtonLoading === true)
      return (
        <button
          type="button"
          className="shadow-inner inline-block rounded-sm font-medium border border-solid cursor-wait text-center transition-colors duration-200 text-base py-3 px-6 text-white bg-green-500 border-green-500 hover:bg-green-400 hover:border-green-400 w-full animate-pulse opacity-80"
          disabled
        >
          Continue <RightArrowIcon />
        </button>
      );
    return (
      <button
        type="submit"
        className="shadow-lg inline-block rounded-sm font-medium border border-solid cursor-pointer text-center transition-colors duration-200 text-base py-3 px-6 text-white bg-green-500 border-green-500 hover:bg-green-400 hover:border-green-400 w-full"
      >
        Continue <RightArrowIcon />
      </button>
    );
  };

  render() {
    return (
      <div className="absolute w-screen h-screen flex">
        <div className="hidden lg:block w-5/12 h-full">
          {this.getLeftSideBar()}
        </div>
        <div className="w-full lg:w-7/12 overflow-hidden py-12 relative sm:py-24">
          <form
            onSubmit={(e) => this.handleAuthSubmit(e)}
            className="w-5/6 sm:w-1/2 mx-auto text-center"
          >
            <HorizontalLogo />
            <div className="mt-10">{this.getFormHeading()}</div>
            <div className="mt-12">
              {this.state.formType === "login" ? (
                <LoginForm></LoginForm>
              ) : (
                <RegisterForm></RegisterForm>
              )}
              <FormGroup>{this.getFormButton()}</FormGroup>
              <div className="text-right">
                <span className="text-green-500">Forgot your password?</span>
              </div>

              <p className="text-sm mt-6 text-left">
                By continuing you accept our{" "}
                <span href="#" className="text-green-500 cursor-pointer">
                  Terms of Use
                </span>{" "}
                and{" "}
                <span className="text-green-500 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Auth;
