import axios from "axios";
import React, { Component, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { withRouter } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import FlicToaster from "../utils/FlicToaster";
import { useSelector } from "react-redux";
import { useState } from "react";

const ProfileEdit = () => {

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadUser = () => {
    axios.get("/profile/" + user.username).then((response) => {
      setProfileUser(response.data);
    });
  };

  useEffect(()=>{
    document.body.classList.add("grey-bg");
    const username = this.props.match.params.username;
    if (username != user.username) {
      this.props.history.push("/");
    }
    loadUser();
  });


  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    axios
      .post("/profile/update", formData)
      .then((response) => {
        if (response.data.status == "success") {
          FlicToaster.success(response.data.message);
        } else {
          FlicToaster.error(response.data.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    return false;
  };


  return (
    <React.Fragment>
      <NavigationBar></NavigationBar>
      <div className="mx-auto flex">
        <div className="m-10 bg-white rounded-lg shadow-md flex w-11/12 p-5 flex-wrap justify-evenly">
          <div>
            {this.state.user ? (
              <img
                src={user.profile_picture_url}
                className="rounded-full w-48 h-48"
                draggable={false}
              ></img>
            ) : (
              <Skeleton circle="true" width={200} height={200} />
            )}
          </div>
          <form
            className="w-full max-w-lg"
            onSubmit={(e) => this.handleFormSubmit(e)}
          >
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  First Name
                </label>
                {this.state.user ? (
                  <input
                    className="appearance-none block w-full bg-gray-200 text-black border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    name="first_name"
                    type="text"
                    defaultValue={this.state.user.first_name}
                    placeholder="John"
                    required
                  />
                ) : (
                  <Skeleton width={200} height={45}></Skeleton>
                )}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Last Name
                </label>
                {this.state.user ? (
                  <input
                    className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    name="last_name"
                    type="text"
                    defaultValue={this.state.user.last_name}
                    placeholder="Doe"
                    required
                  />
                ) : (
                  <Skeleton width={200} height={45}></Skeleton>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  for="grid-website"
                >
                  Website
                </label>
                {this.state.user ? (
                  <input
                    className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-website"
                    name="website"
                    type="text"
                    placeholder="https://example.com"
                    defaultValue={this.state.user.website}
                  />
                ) : (
                  <Skeleton width={480} height={45}></Skeleton>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  for="grid-bio"
                >
                  Bio
                </label>
                {this.state.user ? (
                  <textarea
                    className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-bio"
                    name="bio"
                    type="text"
                    placeholder="Something about you"
                    defaultValue={this.state.user.bio}
                  />
                ) : (
                  <Skeleton width={480} height={60}></Skeleton>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                {this.state.isLoading ? (
                  <p className="flex justify-center">
                    <img src="/loader.gif" />
                  </p>
                ) : (
                  <button
                    type="submit"
                    className="text-white text-sm m-4 ml-0 w-32 bg-red-400 p-2 uppercase rounded-full hover:bg-red-500"
                  >
                    Save Profile
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );

}



export default withRouter(ProfileEdit);


