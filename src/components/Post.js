import React, { Component } from "react";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
import ShelterToaster from "../services/ShelterToaster";
import axios from "axios";

export default class Post extends Component {
  state = {
    url: "https://" + window.location.hostname + "/post/" + this.props.post.identifier + "/" + this.props.post.slug,
    has_upvoted: this.props.post.has_upvoted,
    upvote_count: this.props.post.upvote_count
  };

  share = () => {
    navigator.clipboard.writeText(this.state.url).then(()=>{
      ShelterToaster.success("Copied URL to Clipboard");}
    )
  };

  handleUpvoteEvent = () =>{
    (this.state.has_upvoted) ? this.unUpvote() : this.upvote();
  }

  upvote = () => {
    this.setState({has_upvoted: true, upvote_count: (this.state.upvote_count + 1)}, () => {
      axios.post(`/posts/${this.props.post.identifier }/${this.props.post.slug}/upvote`)
    })
  }

  unUpvote = () =>{
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
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
    className="rounded-full w-10 h-10"
    src={this.props.post.picture_url}
     alt={this.props.post.username}/>
            </div>
            <div className="ml-4">
              <div className="text-lg font-medium text-gray-900 flex flex-wrap">
                {this.props.post.title}{" "}
                <span className="ml-2 rounded-full p-1 px-3 bg-green-100 text-green-500 text-sm flex items-center">
                  <img
    src="https://shelter-cdn.nyc3.digitaloceanspaces.com/public/coin_logo%20x64.png"
    className="h-4 mr-2"
     alt={`Shelter Coin`}/>
                  {this.props.post.bounty_amount}
                </span>
                <span className="ml-2 rounded-full p-1 px-3 bg-yellow-100 text-yellow-500 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Expires in
                  <TimeAgo
                    className="ml-1"
                    date={this.props.post.created_at + 604800000}
                  />
                </span>
              </div>
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
            </div>
          </div>

          <div className="my-5 hidden md:block">{this.props.post.body}</div>

          <div className="w-11/12 border-t border-grey-50 m-2"/>

          <div className="flex items-center justify-items-center">
            <span onClick={()=>this.handleUpvoteEvent()} className={(this.state.has_upvoted ? `bg-green-100 hover:bg-gray-200`: `bg-gray-100 hover:bg-gray-200`) +` rounded-full p-1 px-4  text-black text-sm flex items-center cursor-pointer`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill={this.state.has_upvoted ? `green`:`none`}
                viewBox="0 0 24 24"
                stroke="green"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              {this.state.upvote_count}
            </span>

            <span className="ml-2 rounded-full p-1 px-4 bg-gray-100 text-black text-sm flex items-center hover:bg-gray-200 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>{" "}
              {this.props.post.comment_count}
            </span>
            <span
              onClick={() => this.share()}
              className="ml-2 rounded-full p-1 px-4 bg-gray-100 text-black text-sm flex items-center hover:bg-gray-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>{" "}
              Share
            </span>
          </div>
        </div>
      </div>
    );
  }
}
