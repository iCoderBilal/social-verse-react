import React, { Component } from "react";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
import FlicToaster from "../utils/FlicToaster";
import axios from "axios";
import DesktopVideoContainer from "./DesktopVideoContainer";

export default class Post extends Component {
  state = {
    url:
      "https://" +
      window.location.hostname +
      "/post/" +
      this.props.post.identifier +
      "/" +
      this.props.post.slug,
    embedUrl:
      "https://" +
      window.location.hostname +
      "/embed/" +
      this.props.post.identifier +
      "/" +
      this.props.post.slug,
    upvoted: this.props.post.upvoted,
    upvote_count: this.props.post.upvote_count,
    comment_count: this.props.post.comment_count,
    bookmarked: this.props.post.bookmarked,
  };

  clickShare = (e) => {
    navigator.clipboard.writeText(this.state.url).then(() => {
      FlicToaster.success("Copied URL to Clipboard");
    });
  };

  clickEmbed = (e) => {
    navigator.clipboard
      .writeText(
        `<embed width="500" height="800" style="overflow: hidden" src="${this.state.embedUrl}"/>`
      )
      .then(() => {
        FlicToaster.success("Copied Embed Code to Clipboard");
      });
  };

  clickComment = () => {
    this.props.history.push(
      "/post/" + this.props.post.identifier + "/" + this.props.post.slug
    );
  };

  clickUpvote = () => {
    this.state.upvoted ? this.removeUpvote() : this.addUpvote();
  };

  clickBookmark = () => {
    this.state.bookmarked ? this.removeBookmark() : this.addBookmark();
  };

  addBookmark = () => {
    this.setState({ bookmarked: true }, () => {
      axios.post(
        `/posts/${this.props.post.identifier}/${this.props.post.slug}/bookmarks/add`
      );
    });
  };

  removeBookmark = () => {
    this.setState({ bookmarked: false }, () => {
      axios.post(
        `/posts/${this.props.post.identifier}/${this.props.post.slug}/bookmarks/remove`
      );
    });
  };

  addUpvote = () => {
    this.setState(
      { upvoted: true, upvote_count: this.state.upvote_count + 1 },
      () => {
        axios.post(
          `/posts/${this.props.post.identifier}/${this.props.post.slug}/upvote/add`
        );
      }
    );
  };

  removeUpvote = () => {
    this.setState(
      {
        upvoted: false,
        upvote_count: Math.max(0, this.state.upvote_count - 1),
      },
      () => {
        axios.post(
          `/posts/${this.props.post.identifier}/${this.props.post.slug}/upvote/remove`
        );
      }
    );
  };

  getRef = () => {
    if (this.props.lastPostElementRef) {
      return this.props.lastPostElementRef;
    }
  };

  render() {
    return (
      <div
        ref={this.props.lastPostElementRef ?? null}
        className="my-5 p-5 bg-white rounded-xl shadow overflow-hidden flex flex-wrap md:flex-nowrap hover:shadow-lg feed-post"
      >
        <div className="w-full ml-4 flex items-start flex-col flex-shrink-1">
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <img
                className="rounded-full w-12 h-12"
                src={this.props.post.picture_url}
                alt={this.props.post.username}
              />
            </div>
            <div className="ml-4">
              <span className="text-lg font-medium text-gray-900 flex flex-wrap">
                {this.props.post.title}
              </span>
              <div className="text-sm text-gray-500">
                posted by{" "}
                <Link
                  to={`/profile/${this.props.post.username}`}
                  className="hover:underline mr-1"
                >
                  {this.props.post.username}
                </Link>
                <TimeAgo date={this.props.post.created_at} />
              </div>

              <DesktopVideoContainer
                {...this.props}
                bookmarked={this.state.bookmarked}
                upvoted={this.state.upvoted}
                commentCount={this.state.comment_count}
                upvoteCount={this.state.upvote_count}
                clickBookmark={this.clickBookmark}
                clickComment={this.clickComment}
                clickUpvote={this.clickUpvote}
                clickShare={this.clickShare}
                clickEmbed={this.clickEmbed}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
