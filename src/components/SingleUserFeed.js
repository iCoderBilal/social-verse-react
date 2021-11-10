import React, { Component } from "react";
import LoadingPost from "./LoadingPost";

export default class SingleUserFeed extends Component {
  getFeedByUserName = () => {
    if (this.props.user.username != undefined) {
      return "No Posts From @" + this.props.user.username + " To Show";
    }
    return <LoadingPost></LoadingPost>;
  };

  render() {
    return <div>{this.getFeedByUserName()}</div>;
  }
}
