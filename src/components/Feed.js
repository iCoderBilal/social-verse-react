import axios from "axios";
import React, { Component } from "react";
import FlicToaster from "../services/FlicToaster";
import LoadingPost from "./LoadingPost";
import Post from "./Post";
import { FcOk } from "react-icons/fc";

export default class Feed extends Component {
  state = {
    isLoadingPosts: true,
    noOfSkeletonPosts: 4,
    posts: null,
    currentPage: 1,
    seenEverything: false,
  };

  videoIntersectionObserverAutoPlay = () => {
    const videos = document.getElementsByClassName("flic-video");
    let hasUserInteracted = this.props.hasUserInteracted;

    [...videos].forEach((video) => {
      // We can only control playback without intersection if video is mute
      video.muted = true;
      video.volume = 1;
      window.FlicObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                  entry.intersectionRatio !== 1 &&
                  !video.paused
              ) {
                video.pause();
              } else if (entry.intersectionRatio === 1 && video.paused) {
                video.muted = hasUserInteracted;
                video.play();
              }
            });
          },
          { threshold: 1 }
      );
      window.FlicObserver.observe(video);
      // Play is a promise so we need to check we have it
      // let playPromise = video.play();
      // if (playPromise !== undefined) {
      //   playPromise.then((_) => {
      //
      //   });
      // }
    });
  }

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
          }, () => this.videoIntersectionObserverAutoPlay());
        } else FlicToaster.error("Something Went Wrong");
      })
      .finally(() => {
        this.setState({ isLoadingPosts: false });
      });
  };

  componentDidMount() {
    this.loadPosts();
    window.gtag('event', 'view', {
      'event_category' : 'page',
      'event_label' : 'Desktop Home'
    });
  }

  getSeenEverything = () => {
    return (
      <div className="seen-everything-card">
          <FcOk/>
          You have caught up with everything.
      </div>
    );
  };

  render() {
    return (
      <div className="flic-feed">
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
