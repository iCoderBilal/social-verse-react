import React, {Component} from "react";
import {IoPlay} from "react-icons/io5";
import ReactHlsPlayer from "react-hls-player";
import {BsBookmark, BsChatLeft, BsCodeSlash, BsHeart, BsShare,} from "react-icons/all";

class DesktopVideoContainer extends Component {
    state = {
        isBuffering: false,
        isVideoPlaying: false,
        videoRef: React.createRef(),
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const checkInterval = 50.0;
        let lastPlayPos = 0;
        let currentPlayPos = 0;
        let bufferingDetected = false;
        const player = this.state.videoRef.current;

        let that = this;
        let intervalListener = setInterval(function () {
            checkBuffering();
        }, checkInterval);

        function checkBuffering() {
            currentPlayPos = player.currentTime;

            // checking offset should be at most the check interval
            // but allow for some margin
            let offset = (checkInterval - 20) / 1000;

            // if no buffering is currently detected,
            // and the position does not seem to increase
            // and the player isn't manually paused...
            if (
                !bufferingDetected &&
                currentPlayPos < lastPlayPos + offset &&
                !player.paused
            ) {
                bufferingDetected = true;
                that.setState({
                    isBuffering: bufferingDetected,
                });
            }

            // if we were buffering but the player has advanced,
            // then there is no buffering
            if (
                bufferingDetected &&
                currentPlayPos > lastPlayPos + offset &&
                !player.paused
            ) {
                if (
                    Math.round(player.buffered.end(0)) /
                    Math.round(player.seekable.end(0)) ===
                    1
                ) {
                    window.gtag("event", "finish", {
                        event_category: "video",
                        event_label: "finish",
                        value: parseInt(currentPlayPos),
                    });
                    clearInterval(intervalListener);
                }

                bufferingDetected = false;
                that.setState({
                    isBuffering: bufferingDetected,
                });
            }
            lastPlayPos = currentPlayPos;
        }
    }

    playVideo = () => {
        this.state.videoRef.current.play();
    };

    pauseVideo = () => {
        this.state.videoRef.current.pause();
    };

    toggleVideoState = () => {
        if (this.state.isVideoPlaying) {
            this.pauseVideo();
        } else {
            this.playVideo();
        }
    };

    onError = (e) => {
        e.target.setAttribute(
            "poster",
            "https://placehold.co/405x720/0e0e0e/ffffff.png?text=Flic%20is%20processing%20this%20video&font=Montserrat"
        );
    };

    render() {
        return (
            <div
                className={`desktop-video-container ${
                    this.state.isBuffering ? "loading" : ""
                }`}
            >
                <ReactHlsPlayer
                    className={`flic-video`}
                    src={this.props.post.video_link}
                    controls={false}
                    playerRef={this.state.videoRef}
                    poster={this.props.post.thumbnail_url}
                    onError={(e) => this.onError(e)}
                    onPlay={() =>
                        this.setState({isVideoPlaying: true, isBuffering: false}, () => {
                            window.gtag("event", "playing", {
                                event_category: "video",
                                event_label: "playing",
                                value: parseInt(this.state.videoRef.current.currentTime),
                            });
                        })
                    }
                    onPause={() =>
                        this.setState({isVideoPlaying: false, isBuffering: false}, () => {
                            window.gtag("event", "pause", {
                                event_category: "video",
                                event_label: "pause",
                                value: parseInt(this.state.videoRef.current.currentTime),
                            });
                        })
                    }
                    loop={true}
                />
                <div className={`interact-buttons`}>
                    <div className={`item-button-container`}>
                        <div
                            onClick={(e) => this.props.clickUpvote(e)}
                            className={`interact-icon`}
                        >
                            <BsHeart fill={this.props.upvoted ? "pink" : undefined}/>
                        </div>
                        <strong>{this.props.upvoteCount}</strong>
                    </div>
                    <div className={`item-button-container`}>
                        <div
                            onClick={(e) => this.props.clickComment(e)}
                            className={`interact-icon`}
                        >
                            <BsChatLeft/>
                        </div>
                        <strong>{this.props.commentCount}</strong>
                    </div>
                    <div className={`item-button-container`}>
                        <div
                            onClick={(e) => this.props.clickBookmark(e)}
                            className={`interact-icon`}
                        >
                            <BsBookmark fill={this.props.bookmarked ? "yellow" : undefined}/>
                        </div>
                    </div>
                    <div className={`item-button-container`}>
                        <div
                            onClick={(e) => this.props.clickShare(e)}
                            className={`interact-icon`}
                        >
                            <BsShare/>
                        </div>
                    </div>
                    <div className={`item-button-container`}>
                        <div
                            onClick={(e) => this.props.clickEmbed(e)}
                            className={`interact-icon`}
                        >
                            <BsCodeSlash/>
                        </div>
                    </div>
                </div>
                <div
                    className="event-delegator"
                    onClick={() => this.toggleVideoState()}
                ></div>
                <IoPlay
                    className={`play-icon ${this.state.isVideoPlaying ? "hidden" : ""}`}
                />
            </div>
        );
    }
}

export default DesktopVideoContainer;
