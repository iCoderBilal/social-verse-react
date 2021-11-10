import axios from "axios";
import React, { Component } from "react";
import ShelterToaster from "../services/ShelterToaster";
import LoadingPost from "./LoadingPost";
import Post from "./Post";

export default class Feed extends Component {
  state = {
    isLoadingPosts: true,
    noOfSkeletonPosts: 4,
    posts: null,
    currentPage: 1,
    seenEverything: false,
  };

  loadPosts = () => {
    if (this.state.seenEverything) return true;
    this.setState({ isLoadingPosts: true });
    axios
      .get("/posts?page=" + this.state.currentPage)
      .then((response) => {
        if (response.data.posts !== undefined) {
          let seenEverything =
            response.data.posts.length < response.data.records_per_page;
          this.setState({
            posts: response.data.posts,
            currentPage: this.state.currentPage,
            seenEverything: seenEverything,
          });
        } else ShelterToaster.error("Something Went Wrong");
      })
      .finally(() => {
        this.setState({ isLoadingPosts: false });
      });
  };

  componentDidMount() {
    this.loadPosts();
  }

  getSeenEverything = () => {
    return (
      <div className="w-full flex items-center justify-center">
        <span className="seen-everything">
          You have caught up with everything.
        </span>
      </div>
    );
  };

  render() {
    return (
      <div className="m-10 justify-center flex-grow shelter-limit-container-width lg:mr-5">
        {this.state.posts === null ? (
          <></>
        ) : (
          this.state.posts.map((post) => (
            <Post key={post.identifier + post.slug} post={post}/>
          ))
        )}
        {this.state.isLoadingPosts ? (
          Array(this.state.noOfSkeletonPosts).fill(
            <LoadingPost customClass="mx-auto" />
          )
        ) : (
          <></>
        )}
        {this.state.seenEverything ? this.getSeenEverything() : <></>}
      </div>
    );
  }
}
