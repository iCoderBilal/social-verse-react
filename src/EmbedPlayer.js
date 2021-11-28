import React, {Component} from 'react';
import axios from "axios";
import FlicToaster from "./services/FlicToaster";
import Skeleton from "react-loading-skeleton";
import ReactHlsPlayer from "react-hls-player";
import {IoPlay} from "react-icons/io5";

class EmbedPlayer extends Component {

    state = {
        post: this.props.post ?? null,
        isBuffering: false,
        isVideoPlaying: false,
        videoRef: React.createRef(),
        videoSizeWrapperRef: React.createRef(),
        videoSizeWrapperHeight:0,
        videoSizeWrapperWidth:0
    };

    playVideo = () => {
        if(this.props.hasUserInteracted){
            let tmpVideo = this.state.videoRef.current;
            tmpVideo.muted = false;
        }
        this.state.videoRef.current.play();
    }

    pauseVideo = () => {
        this.state.videoRef.current.pause();
    }

    toggleVideoState = () => {
        if(this.state.isVideoPlaying){
            this.pauseVideo();
        } else{
            this.playVideo();
        }
    }

    monitorVideo = () => {
        const checkInterval  = 50.0
        let lastPlayPos    = 0
        let currentPlayPos = 0
        let bufferingDetected = false
        const player = this.state.videoRef.current;
        let that = this;
        let intervalListener = setInterval(function () {checkBuffering()}, checkInterval);

        function checkBuffering() {
            currentPlayPos = player.currentTime

            // checking offset should be at most the check interval
            // but allow for some margin
            let offset = (checkInterval - 20) / 1000

            // if no buffering is currently detected,
            // and the position does not seem to increase
            // and the player isn't manually paused...
            if (
                !bufferingDetected
                && currentPlayPos < (lastPlayPos + offset)
                && !player.paused
            ) {
                bufferingDetected = true
                that.setState({
                    isBuffering: bufferingDetected
                });
            }

            // if we were buffering but the player has advanced,
            // then there is no buffering
            if (
                bufferingDetected
                && currentPlayPos > (lastPlayPos + offset)
                && !player.paused
            ) {
                if (Math.round(player.buffered.end(0)) / Math.round(player.seekable.end(0)) === 1) {
                    window.gtag('event', 'finish', {
                        'event_category' : 'video',
                        'event_label' : 'finish',
                        'value': parseInt(currentPlayPos)
                    });
                    clearInterval(intervalListener);
                }

                bufferingDetected = false
                that.setState({
                    isBuffering: bufferingDetected
                });
            }
            lastPlayPos = currentPlayPos
        }

        window.gtag('event', 'embed', {
            'event_category' : 'page',
            'event_label' : window.innerWidth < 768 ? 'Small Device Embed' : 'Desktop Embed'
        });
    }

    componentDidMount() {
        const identifier = this.props.identifier ?? this.props.match.params.identifier;
        const slug = this.props.slug ?? this.props.match.params.slug;

        if(this.state.post !== null){
            this.monitorVideo();
            this.calculateVideoSizeWrapper();
            return;
        }

        const fetchPostData = axios.get("/posts/" + identifier + "/" + slug);
        let that = this;
        fetchPostData
            .then((response) => {
                this.setState({ post: response.data }, () => {
                    that.monitorVideo();
                    this.calculateVideoSizeWrapper();
                });
            })
            .catch(() => {
                FlicToaster.error("Something went wrong while loading the post!");
            });
    }

    calculateVideoSizeWrapper = () => {
        const videoContainer = document.getElementById('video-embed-container');
        const videoPlayer = this.state.videoRef.current;
        const videoSizeWrapper = this.state.videoSizeWrapperRef.current;
        videoSizeWrapper.width = videoContainer.videoHeight*videoPlayer.videoWidth/videoPlayer.height;
    }

    render() {
        return (
            this.state.post === null ?
                <Skeleton height="100%" width="100%"/> :
               <div id="video-embed-container" className={`video-embed-container ${this.state.isBuffering ? 'loading': ''}`}>
                <div className={`video-size-wrapper`} ref={this.state.videoSizeWrapperRef}>
                    <ReactHlsPlayer
                        className={`video-embed`}
                        src={this.state.post.video_link}
                        controls={false}
                        playerRef={this.state.videoRef}
                        poster={this.state.post.thumbnail_url}
                        playsInline={true}
                        muted={false}
                        autoPlay={false}
                        onPlay={()=>this.setState({isVideoPlaying: true, isBuffering: false}, () => {
                            window.gtag('event', 'playing', {
                                'event_category' : 'video',
                                'event_label' : 'playing',
                                'value': parseInt(this.state.videoRef.current.currentTime)
                            });
                        })}
                        onPause={()=>this.setState({isVideoPlaying: false, isBuffering: false}, () => {
                            window.gtag('event', 'pause', {
                                'event_category' : 'video',
                                'event_label' : 'pause',
                                'value': parseInt(this.state.videoRef.current.currentTime)
                            });
                        })}
                        loop={true}
                    />
                    <div className='event-delegator'
                         onClick={()=>this.toggleVideoState()}>
                    </div>
                    <IoPlay className={`play-icon ${this.state.isVideoPlaying ? 'hidden': ''}`}/>

                </div>
               </div>
        );
    }
}

export default EmbedPlayer;