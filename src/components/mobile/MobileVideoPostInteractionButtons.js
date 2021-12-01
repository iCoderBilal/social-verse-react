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
        navigator.clipboard.writeText(props.share_url ?? '').then(()=>{
            FlicToaster.success("Copied URL to Clipboard");
            window.gtag('event', 'touch', {
                'event_category': 'interactions',
                'event_label': 'share',
            });
        })
    }


    return (
        <div className="video__video-post-interaction-buttons" >
            <MobileUserFollowButton handleFollowClick = {handleFollowClick} instagramImage={props.instagramImage}/>
            <MobileLikeButton handleLikesClick ={handleLikesClick} likesCount={props.likesCount}/>
            <MobileCommentButton handleCommentClick={handleCommentClick} commentCount={props.commentCount}/>
            <MobileShareButton handleShareClick={handleShareClick} shareCount={props.shareCount}/>
        </div>
    );
}

export default VideoPostInteractionButtons;