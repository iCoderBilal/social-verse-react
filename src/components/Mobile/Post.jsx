import React, {useEffect, useState} from "react";
import ReactHlsPlayer from "react-hls-player";
import {useSelector} from "react-redux";
import PostBottomSection from "./PostBottomSection";
import PostRightSidebar from "./PostRightSidebar";

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
        setIsVideoPlaying(true);
    };

    const pauseVideo = () => {
        videoRef.current.pause();
        setIsVideoPlaying(false);
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

    useEffect(() => {
        const checkInterval = 50.0;
        let lastPlayPos = 0;
        let currentPlayPos = 0;
        let bufferingDetected = false;
        const player = videoRef.current;

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
                setIsBuffering(bufferingDetected)
            }

            // if we were buffering but the player has advanced,
            // then there is no buffering
            if (bufferingDetected && currentPlayPos > lastPlayPos + offset && !player.paused) {
                if (Math.round(player.buffered.end(0)) / Math.round(player.seekable.end(0)) === 1) {
                    clearInterval(intervalListener);
                }

                bufferingDetected = false;
                setIsBuffering(bufferingDetected)

            }
            lastPlayPos = currentPlayPos;
        }

    }, [])

    return <div className={`post`}>
        <ReactHlsPlayer
            playerRef={videoRef}
            poster={post.poster}
            muted={!hasUserInteracted}
            src={post.video_link}
            controls={false}
            playsInline={true}
            onPlay={() => {
                setIsVideoPlaying(false);
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
                          propsCommentCount={post.comment_count}
                          hasBookmarked={post.bookmarked}
                          authorAvatarPictureURL={post.picture_url}
        />
    </div>
}
