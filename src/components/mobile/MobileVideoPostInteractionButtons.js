import React from 'react';
import MobileLikeButton from "./MobileLikeButton";
import MobileCommentButton from "./MobileCommentButton";
import MobileShareButton from "./MobileShareButton";
import MobileUserFollowButton from "./MobileUserFollowButton";
import FlicToaster from "../../services/FlicToaster";

function VideoPostInteractionButtons(props) {

    const handleBottomNavigationClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.openDialog();
    }

    const handleLikesClick = (e) => {
        console.log("hello");
        window.gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'like',
        });
        handleBottomNavigationClick(e);
    }

    const handleFollowClick = (e) => {
        console.log("hello");
        window.gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'follow',
        });
        handleBottomNavigationClick(e);
    }

    const handleCommentClick = (e) => {
        console.log("hello");
        window.gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'comment',
        });
        handleBottomNavigationClick(e);
    }

    const handleShareClick = (e) => {
        console.log("hello");
        navigator.clipboard.writeText(props.share_url).then(()=>{
            FlicToaster.success("Copied URL to Clipboard");
            window.gtag('event', 'touch', {
                'event_category': 'interactions',
                'event_label': 'share',
            });
        })
    }


    return (
        <div className="video__video-post-interaction-buttons" >
            <MobileUserFollowButton onClick={(e)=>handleFollowClick(e)} instagramImage={props.instagramImage}/>
            <MobileLikeButton onClick={(e)=>handleLikesClick(e)} likesCount={props.likesCount}/>
            <MobileCommentButton onClick={(e)=>handleCommentClick(e)} commentCount={props.commentCount}/>
            <MobileShareButton onClick={(e)=>handleShareClick(e)} shareCount={props.shareCount}/>
        </div>
    );
}

export default VideoPostInteractionButtons;