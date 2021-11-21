import React, {Component} from 'react';
import MobileVideoPostInteractionButtons from "./MobileVideoPostInteractionButtons";
import MobileVideoPostInformation from "./MobileVideoPostInformation";
import MobilePlayButton from "./MobilePlayButton";

class MobileFeedVideoPost extends Component {

    state = {
        isBuffering: false,
        isVideoPlaying: false,
        videoRef: React.createRef(),
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
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
                    clearInterval(intervalListener);
                }

                bufferingDetected = false
                that.setState({
                    isBuffering: bufferingDetected
                });
            }
            lastPlayPos = currentPlayPos
        }
    }
    componentWillUnmount() {
        if(this.state.videoRef && this.state.videoRef.current !== undefined){
            window.FlicObserver.unobserve(this.state.videoRef.current);
        }
    }


    playVideo = () => {
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

    render() {
        return (<div
                    className={`feed_video-container ${this.state.isBuffering ? 'loading': ''}`}
                    onClick={() => {this.toggleVideoState()}}
            >
                <video className="feed_video-container__video"
                       ref={this.state.videoRef}
                       poster={this.props.poster}
                       muted={!(this.props.hasUserInteracted)}
                       src={this.props.url}
                       controls={false}
                       playsInline={true}
                       onPlay={()=>this.setState({isVideoPlaying: true, isBuffering: false})}
                       onPause={()=>this.setState({isVideoPlaying: false, isBuffering: false})}
                       loop={true}

                />
                <MobilePlayButton isVideoPlaying={this.state.isVideoPlaying}/>
                <MobileVideoPostInformation
                    isVideoPlaying={this.state.isVideoPlaying}
                    username={this.props.username}
                    musicName={this.props.musicName}
                    description={this.props.description}
                    isVerified={this.props.isVerified}
                />
                <MobileVideoPostInteractionButtons
                    openDialog={this.props.openDialog}
                    likesCount={this.props.likesCount}
                    commentCount={this.props.commentCount}
                    shareCount={this.props.shareCount}
                    instagramImage={this.props.instagramImage}
                /></div>
        );
    }
}

export default MobileFeedVideoPost;


