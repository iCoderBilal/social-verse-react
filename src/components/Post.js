import React, { Component } from "react";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
import FlicToaster from "../services/FlicToaster";
import axios from "axios";
import DesktopVideoContainer from "./DesktopVideoContainer";

export default class Post extends Component {

  state = {
    url: "https://" + window.location.hostname + "/post/" + this.props.post.identifier + "/" + this.props.post.slug,
    embedUrl: "https://" + window.location.hostname + "/embed/" + this.props.post.identifier + "/" + this.props.post.slug,
    has_upvoted: this.props.post.has_upvoted,
    upvote_count: this.props.post.upvote_count,
    comment_count: this.props.post.comment_count,
    has_bookmarked: false,
    has_saved: false
  };

  clickShare = (e) => {
    e.preventDefault()
    // e.stopPropagation()
    navigator.clipboard.writeText(this.state.url).then(()=>{
      FlicToaster.success("Copied URL to Clipboard");}
    )
  };

  clickEmbedCode = (e) => {
    navigator.clipboard.writeText(`<embed width="500" height="800" style="overflow: hidden" src="${this.state.embedUrl}"/>`).then(()=>{
      FlicToaster.success("Copied Embed Code to Clipboard");
    })
  }

  clickComment = () => {

  }

  clickUpvote = () => {
    (this.state.has_upvoted) ? this.unUpvote() : this.upvote();
  }

  upvote = () => {
    this.setState({has_upvoted: true, upvote_count: (this.state.upvote_count + 1)}, () => {
      axios.post(`/posts/${this.props.post.identifier }/${this.props.post.slug}/upvote`)
    })
  }

  unUpvote = () => {
    this.setState({has_upvoted: false, upvote_count: (this.state.upvote_count - 1)}, () => {
      axios.post(`/posts/${this.props.post.identifier }/${this.props.post.slug}/unupvote`)
    })
  }

  render() {
    return (
      <div
        className="my-5 p-5 bg-white rounded-xl shadow overflow-hidden flex flex-wrap md:flex-nowrap hover:shadow-lg feed-post"
      >
        <div className="w-full ml-4 flex items-start flex-col flex-shrink-1">
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <img className="rounded-full w-12 h-12"
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
                  clickBookmark = {this.clickBookmark}
                  clickComment = {this.clickComment}
                  clickUpvote = {this.clickUpvote}
                  clickShare = {this.clickShare}
                  clickEmbedCode = {this.clickEmbedCode}
                  {...this.props}
              />

            </div>
          </div>

        </div>
      </div>
    );
  }
}
