import React, {Component} from 'react';
import axios from "axios";
import FlicToaster from "../utils/FlicToaster";
import LoadingPost from "../components/LoadingPost";
import EmbedPlayer from "./EmbedPlayer";
import Skeleton from "react-loading-skeleton";
import {Link} from "react-router-dom";
import TimeAgo from "react-timeago";

class Embed extends Component {

    state = {
        post: null
    }

    componentDidMount() {
        const identifier = this.props.match.params.identifier;
        const slug = this.props.match.params.slug;

        const fetchPostData = axios.get("/posts/" + identifier + "/" + slug);
        let that = this;

        fetchPostData
            .then((response) => {
                this.setState({ post: response.data });
            })
            .catch(() => {
                FlicToaster.error("Something went wrong while loading the post!");
            });
    }

    render() {
        return (
            <div className={'embed-post'}>
                {
                    this.state.post === null ? <LoadingPost/> :
                        <React.Fragment>

                            <div
                                className={`my-5 p-5 bg-white shadow overflow-hidden flex-grow ${
                                    this.props.customClass || ""
                                }`}
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 mt-1">
                                        <img className="rounded-full w-12 h-12"
                                             src={this.state.post.picture_url}
                                             alt={this.state.post.username}
                                        />
                                    </div>
                                    <div className="ml-4 mt-3">
                                                     <span className="text-lg font-medium text-gray-900 flex flex-wrap">
                {this.state.post.title}
              </span>
                                        <div className="text-sm text-gray-500">
                                            posted by{" "}
                                            <a
                                                href={`https://beta.watchflic.com/profile/${this.state.post.username}`}
                                                className="hover:underline mr-1"
                                                target="_blank"
                                            >
                                                {this.state.post.username}
                                            </a>
                                            <TimeAgo date={this.state.post.created_at} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 rounded-lg embed-post-embed-player">
                                    <EmbedPlayer
                                        className={`child-embed`}
                                        post={this.state.post}
                                        slug={this.props.match.params.slug}
                                        identifier={this.props.match.params.identifier}
                                    />
                                </div>
                                <div className={`watch-on-flic-container`}>
                                    <a
                                        className={`watch-on-flic`}
                                        href={`https://beta.watchflic.com/post/${this.props.match.params.identifier}/${this.props.match.params.slug}`}
                                        target="_blank"
                                    >Watch On Flic</a>
                                </div>
                            </div>

                    </React.Fragment>
                }

            </div>
        );
    }
}

export default Embed;