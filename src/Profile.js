import React, { Component } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import SingleUserFeed from "./components/SingleUserFeed";
import NavBar from "./components/NavBar";
import AuthHelper from "./services/AuthHelper";
import UserHelper from "./services/UserHelper";
import { Redirect, withRouter } from "react-router-dom";
import ShelterToaster from "./services/ShelterToaster";

class Profile extends Component {
  state = {
    hasLoaded: false,
    user: {},
    width: window.innerWidth,
    height: window.innerHeight,
    is_connection_button_loading: false,
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentDidMount() {
    console.log(this.props);
    window.addEventListener("resize", this.updateDimensions);
    const username = this.props.match.params.username;
    const fetchProfileData = axios.get("/profile/" + username);
    fetchProfileData.then((response) => {
      this.setState({ user: response.data });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  loadingAnimation = () => {
    if (this.state.hasLoaded === false) return "animate-pulse bg-gray-300";
  };

  redirectToLogin = () => {
    window.location.href = "/auth";
  };

  redirectToEdit = () => {
    this.props.history.push("/profile/" + this.state.user.username + "/edit");
  };

  doFollow = () => {
    if (!AuthHelper.isUserLoggedIn()) {
      return <Redirect to="/auth" />;
    }

    this.setState({ is_connection_button_loading: true });

    axios
      .post("/profile/follow/" + this.state.user.username)
      .then((response) => {
        if (response.data.status === "success") {
          ShelterToaster.success(response.data.message);
          let userNewState = this.state.user;
          userNewState.is_following = true;
          userNewState.follower_count =
            parseInt(userNewState.follower_count) + 1;
          this.setState({ user: userNewState });
        }
      })
      .catch(() => {
        ShelterToaster.error("Something went wrong 😔");
      })
      .finally(() => {
        this.setState({ is_connection_button_loading: false });
      });
  };

  doUnfollow = () => {
    if (!AuthHelper.isUserLoggedIn()) {
      return <Redirect to="/auth" />;
    }

    this.setState({ is_connection_button_loading: true });

    axios
      .post("/profile/unfollow/" + this.state.user.username)
      .then((response) => {
        if (response.data.status === "success") {
          ShelterToaster.success(response.data.message);
          let userNewState = this.state.user;
          userNewState.is_following = false;
          userNewState.follower_count = userNewState.follower_count - 1;
          this.setState({ user: userNewState });
        }
      })
      .catch(() => {
        ShelterToaster.error("Something went wrong 😔");
      })
      .finally(() => {
        this.setState({ is_connection_button_loading: false });
      });
  };

  getConnectionButton = () => {
    if (this.state.user.username) {
      if (this.state.user.username !== UserHelper.getUsername()) {
        if (this.state.user.is_following) {
          return (
            <button
              onClick={() => this.doUnfollow()}
              className={`${
                this.state.is_connection_button_loading
                  ? "animate-pulse shadow-inner"
                  : "shadow-md"
              } bg-red-500 uppercase text-white font-bold text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 hover:bg-red-700`}
              type="button"
              style={{ transition: "all .15s ease" }}
              disabled={this.state.is_connection_button_loading}
            >
              + Unfollow @{this.state.user.username}
            </button>
          );
        } else {
          return (
            <button
              onClick={() => this.doFollow()}
              title={`Login to follow ${this.state.user.username}`}
              className={`${
                this.state.is_connection_button_loading
                  ? "animate-pulse shadow-inner"
                  : "shadow-md"
              } bg-green-500 uppercase text-white font-bold text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 hover:bg-green-700`}
              type="button"
              style={{ transition: "all .15s ease" }}
              disabled={this.state.is_connection_button_loading}
            >
              + Follow @{this.state.user.username}
            </button>
          );
        }
      }
      return <></>;
    }

    return <Skeleton width={100} height={30} />;
  };

  getEditProfileButton = () => {
    if (this.state.user.username) {
      if (
        AuthHelper.isUserLoggedIn() &&
        UserHelper.getUsername() === this.state.user.username
      ) {
        return (
          <button
            onClick={() => this.redirectToEdit()}
            className="bg-green-400 uppercase text-white font-bold text-xs px-4 py-2 rounded outline-none focus:outline-none shadow-md sm:mr-2 mb-1 hover:bg-green-500"
            type="button"
            style={{ transition: "all .15s ease" }}
          >
            Edit Profile
          </button>
        );
      }
      return <></>;
    }
    return <Skeleton className="ml-2" width={100} height={30} />;
  };

  getProfileBio = () => {
    if (this.state.user.bio !== undefined) return this.state.user.bio;
    return <Skeleton height={30} width={this.state.width > 600 ? 500 : 200} />;
  };

  getProfileWebsite = () => {
    if (this.state.user.website !== undefined) return this.state.user.website;
    return <Skeleton width={200} />;
  };

  getProfile = () => {
    return (
      <main className="profile-page">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
    id="blackOverlay"
    className="w-full h-full absolute opacity-50 bg-black"
    />
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
    className="text-gray-300 fill-current"
    points="2560 0 2560 100 0 100"
    />
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-gray-300">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      {this.state.user.profile_picture_url ? (
                        <img
                          alt="..."
                          src={this.state.user.profile_picture_url}
                          className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                          style={{ maxWidth: "150px" }}
                        />
                      ) : (
                        <Skeleton
                          className="absolute -m-16 -ml-20 lg:-ml-16 align-middle shadow-xl"
                          circle={true}
                          height={150}
                          width={150}
                        />
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="flex py-6 px-3 mt-32 sm:mt-0 justify-center md:justify-end">
                      {this.getConnectionButton()}
                      {this.getEditProfileButton()}
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          {this.state.user.post_count !== undefined ? (
                            this.state.user.post_count
                          ) : (
                            <Skeleton />
                          )}
                        </span>
                        <span className="text-sm text-gray-500">Posts</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          {this.state.user.follower_count !== undefined ? (
                            this.state.user.follower_count
                          ) : (
                            <Skeleton />
                          )}
                        </span>
                        <span className="text-sm text-gray-500">Followers</span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          {this.state.user.following_count !== undefined ? (
                            this.state.user.following_count
                          ) : (
                            <Skeleton />
                          )}
                        </span>
                        <span className="text-sm text-gray-500">Following</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800">
                    {this.state.user.name || (
                      <Skeleton width={this.state.width > 400 ? 300 : 200} />
                    )}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"/>{" "}
                    {this.state.user.username || (
                      <Skeleton width={200} height={20} />
                    )}
                  </div>
                  <div className="mb-2 text-gray-700 mt-10">
                    <i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
                    {this.getProfileBio()}
                  </div>
                  <div className="mb-2 text-gray-700">
                    <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                    {this.getProfileWebsite()}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <SingleUserFeed user={this.state.user}></SingleUserFeed>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  };

  render() {
    return (
      <React.Fragment>
        <NavBar></NavBar>
        {this.getProfile()}
      </React.Fragment>
    );
  }
}

export default withRouter(Profile);
