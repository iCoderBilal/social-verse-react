import React, { Component, Button } from "react";
import MobileVideoPostInteractionButtons from "./MobileVideoPostInteractionButtons";
import MobileVideoPostInformation from "./MobileVideoPostInformation";
import MobilePlayButton from "./MobilePlayButton";
import FlicToaster from "../../services/FlicToaster";
import ReactHlsPlayer from "react-hls-player";

class MobileFeedVideoPost extends Component {
  state = {
    share_url: "https://" + window.location.hostname + "/post/" + this.props.identifier + "/" + this.props.slug,
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
      if (!bufferingDetected && currentPlayPos < lastPlayPos + offset && !player.paused) {
        bufferingDetected = true;
        that.setState({
          isBuffering: bufferingDetected,
        });
      }

      // if we were buffering but the player has advanced,
      // then there is no buffering
      if (bufferingDetected && currentPlayPos > lastPlayPos + offset && !player.paused) {
        if (Math.round(player.buffered.end(0)) / Math.round(player.seekable.end(0)) === 1) {
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
  componentWillUnmount() {
    if (this.state.videoRef && this.state.videoRef.current !== undefined && window.FlicObserver) {
      window.FlicObserver.unobserve(this.state.videoRef.current);
    }
  }

  playVideo = () => {
    this.state.videoRef.current.play();
  };

  pauseVideo = () => {
    this.state.videoRef.current.pause();
  };
  pip = (event) => {
    const player = this.state.videoRef.current;
    // enabling picture in pictuer mode
    player.requestPictureInPicture().catch((error) => {
      console.log(error);
      alert("Your browser does not support picture in picture mode");
      console.log("please make sure the video is playing first..");
    });
    event.preventDefault();
    event.stopPropagation();
  };
  toggleVideoState = (e) => {
    if (
      e.target.classList.contains("video__post-information__interaction-button") ||
      e.target.classList.contains("video__post-information__interaction-button-follow")
    ) {
      return;
    }

    if (this.state.isVideoPlaying) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  };

  render() {
    return (
      <div
        className={`feed_video-container ${this.state.isBuffering ? "loading" : ""}`}
        onClick={(e) => {
          this.toggleVideoState(e);
        }}
      >
        <ReactHlsPlayer
          className='feed_video-container__video'
          playerRef={this.state.videoRef}
          poster={this.props.poster}
          muted={!this.props.hasUserInteracted}
          src={this.props.url}
          controls={false}
          playsInline={true}
          onPlay={() => this.setState({ isVideoPlaying: true, isBuffering: false })}
          onPause={() => this.setState({ isVideoPlaying: false, isBuffering: false })}
          loop={true}
        />
        <MobilePlayButton isVideoPlaying={this.state.isVideoPlaying} />
        <div className='feed_video-container__pip' style={{ marginRight: "500" }} onClick={this.pip}>
          <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABEUlEQVRoge3YvU7DMBiF4fewI37mZu5YbhSx9xIAiQkhBmZWVlZgRQjfwNehHYKxiBJUO5XOM35y0nPiDG7AzMwsExFdRNxGRIr2UkTcRcSylFWl8MALcL7vBzXSF7CS9N4fHhUWXjG/8ABnwGU+LO1AAo5rJJogSTrpD0oFol6e8ST9yFx6hQ6KC7TmAq25QGsu0JoLtFajwD2w0EhABzwM3bzGYa6T9DHlwt1/k7f+LD/M7b1A/oNj5Xl8Gp0bF2jNBVpzgSERsfjHtd3Qmho7sJ5SYhd+PbTu0D5sfUs67Q9KO/BUKcwUj/mgtANL4Jntt8g5+QQu8oPhrx2Q9AqsgBsg1cn2pwRcUwhvZma2AQ2o16hFvoYXAAAAAElFTkSuQmCC' />{" "}
        </div>
        <MobileVideoPostInformation
          isVideoPlaying={this.state.isVideoPlaying}
          username={this.props.username}
          musicName={this.props.musicName}
          description={this.props.description}
          isVerified={this.props.isVerified}
        />
        <MobileVideoPostInteractionButtons
          shareURL={this.state.share_url}
          openDialog={this.props.openDialog}
          likesCount={this.props.likesCount}
          commentCount={this.props.commentCount}
          shareCount={this.props.shareCount}
          instagramImage={this.props.instagramImage}
        />
      </div>
    );
  }
}

export default MobileFeedVideoPost;
