import React, { Component } from "react";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";

export default class Comment extends Component {
  render() {
    return (
      <div className="my-3 mx-10 p-5 bg-white rounded-xl shadow overflow-hidden flex flex-wrap md:flex-nowrap hover:shadow-lg">
        <div className="ml-4 flex items-start flex-col flex-shrink-1">
          <div className="flex items-center">
            <div>
              <img
                className="rounded-full w-10 h-10"
                src={this.props.comment.picture_url}
              ></img>
            </div>
            <div className="ml-4">
              <div className="text-lg font-medium text-gray-900 flex">
                {this.props.comment.body}{" "}
              </div>
              <div className="text-sm text-gray-500">
                submitted by{" "}
                <Link
                  to={`/profile/${this.props.comment.username}`}
                  className="hover:underline mr-1"
                >
                  {this.props.comment.username}
                </Link>
                <TimeAgo date={this.props.comment.created_at} />
              </div>
            </div>
          </div>

          <div className="my-5 block">
            <div className="player-wrapper relative">
              <ReactPlayer
                controls={true}
                className="react-player"
                url={this.props.comment.video_link}
                width="80%"
                height="80%"
              />
            </div>
          </div>

          <div className="w-11/12 border-t border-grey-50 m-2"></div>

          <div className="flex items-center justify-items-center">
            <span className="rounded-full p-1 px-3 bg-red-100 text-red-500 text-sm flex items-center">
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
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Upvotes {this.props.comment.upvote_count}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
