import React, {useState} from "react";
import {useSelector} from "react-redux";
import PostBottomSection from "./PostBottomSection";
import PostRightSidebar from "./PostRightSidebar";
import {BsPlayFill} from "react-icons/all";

export default function Post(props) {

    const {ui} = useSelector((state) => state);
    const {post} = props;
    const {hasUserInteracted} = ui;
    const [isBuffering, setIsBuffering] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const shareURL = "https://" + window.location.hostname + "/@" + post.username + "/post/" + post.identifier + "/" + post.slug;
    const videoRef = React.createRef();

    const playVideo = () => {
        videoRef.current.play();
    };

    const pauseVideo = () => {
        videoRef.current.pause();
    };

    const toggleVideoState = () => {
        if (isVideoPlaying) {
            pauseVideo();
        } else {
            playVideo();
        }
    };


    const handleLikeButtonClick = () => {

    }

    const handleCommentButtonClick = () => {

    }

    const handleShareButtonClick = () => {

    }

    const handleBookmarkButtonClick = () => {

    }

    const handlePipButtonClick = () => {
        if(document.pictureInPictureElement){
            document.exitPictureInPicture();
        } else {
            videoRef.current.requestPictureInPicture();
        }
    }

    const handleError = () => {
        const existingPosterURL = videoRef.current.getAttribute('poster');
        let newPosterURL = existingPosterURL;
        const trickleDownMap = new Map();

        trickleDownMap.set("0000002.jpg", "0000000.jpg")
        trickleDownMap.set("0000005.jpg", "0000002.jpg")

        trickleDownMap.forEach((value, key, map) => {
            console.log("Looping");
            newPosterURL = newPosterURL.replace(key, value);
        });

        if (newPosterURL === existingPosterURL) {
            newPosterURL = "https://via.placeholder.com/720x1280/eb122d/FFFFFF?text=Flic"
        }

        console.log(newPosterURL);

        videoRef.current.setAttribute('poster', newPosterURL)
    }

    // useEffect(() => {
    //     const checkInterval = 50.0;
    //     let lastPlayPos = 0;
    //     let currentPlayPos = 0;
    //     let bufferingDetected = false;
    //     const player = videoRef.current;
    //
    //     let that = this;
    //     let intervalListener = setInterval(function () {
    //         checkBuffering();
    //     }, checkInterval);
    //
    //     function checkBuffering() {
    //         currentPlayPos = player.currentTime;
    //
    //         // checking offset should be at most the check interval
    //         // but allow for some margin
    //         let offset = (checkInterval - 20) / 1000;
    //
    //         // if no buffering is currently detected,
    //         // and the position does not seem to increase
    //         // and the player isn't manually paused...
    //         if (!bufferingDetected && currentPlayPos < lastPlayPos + offset && !player.paused) {
    //             bufferingDetected = true;
    //             setIsBuffering(bufferingDetected)
    //         }
    //
    //         // if we were buffering but the player has advanced,
    //         // then there is no buffering
    //         if (bufferingDetected && currentPlayPos > lastPlayPos + offset && !player.paused) {
    //             if (Math.round(player.buffered.end(0)) / Math.round(player.seekable.end(0)) === 1) {
    //                 clearInterval(intervalListener);
    //             }
    //
    //             bufferingDetected = false;
    //             setIsBuffering(bufferingDetected)
    //
    //         }
    //         lastPlayPos = currentPlayPos;
    //     }
    //
    // }, [])

    return <div className="post"
                ref={props.lastPostElementRef && props.lastPostElementRef}>
        <video
            ref={videoRef}
            muted={!hasUserInteracted}
            src={post.video_link}
            poster={post.thumbnail_url}
            controls={false}
            playsInline={true}
            onError={handleError}
            onPlay={() => {
                setIsVideoPlaying(true);
                setIsBuffering(false)
            }}
            onPause={() => {
                setIsVideoPlaying(false);
                setIsBuffering(false)
            }}
            loop={true}
        />
        <PostBottomSection authorUsername={post.username}
                           isVerified={true}
                           authorProfilePictureURL={post.picture_url}
                           postDescription={post.title}
        />
        <PostRightSidebar authorName={`${post.first_name} ${post.last_name}`}
                          authorUsername={post.username}
                          isFollowingAuthor={false}
                          hasLikedPost={post.upvoted}
                          postLikeCount={post.upvote_count}
                          postCommentCount={post.comment_count}
                          hasBookmarked={post.bookmarked}
                          authorAvatarPictureURL={post.picture_url}
                          handleLikeButtonClick={handleLikeButtonClick}
                          handleCommentButtonClick={handleCommentButtonClick}
                          handleShareButtonClick={handleShareButtonClick}
                          handleBookmarkButtonClick={handleBookmarkButtonClick}
                          handlePipButtonClick={handlePipButtonClick}
        />
        <div className={`video-click-container ${!isVideoPlaying && "paused"}`} onClick={toggleVideoState}>
            <BsPlayFill color="white"/>
        </div>
    </div>
}
