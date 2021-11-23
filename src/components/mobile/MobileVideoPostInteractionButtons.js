import React from 'react';
import MobileLikeButton from "./MobileLikeButton";
import MobileCommentButton from "./MobileCommentButton";
import MobileShareButton from "./MobileShareButton";
import MobileUserFollowButton from "./MobileUserFollowButton";

function VideoPostInteractionButtons(props) {

    const handleBottomNavigationClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.openDialog();
    }

    const handleLikesClick = () => {
        window.gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'like',
        });
    }

    const handleFollowClick = () => {
        window.gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'follow',
        });
    }

    const handleCommentClick = () => {
        window.gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'comment',
        });
    }

    const handleShareClick = () => {
        window.gtag('event', 'touch', {
            'event_category': 'interactions',
            'event_label': 'share',
        });
    }


    return (
        <div className="video__video-post-interaction-buttons" onClick={(event)=>handleBottomNavigationClick(event)}>
            <MobileUserFollowButton onClick={()=>handleFollowClick()} instagramImage={props.instagramImage}/>
            <MobileLikeButton onClick={()=>handleLikesClick()} likesCount={props.likesCount}/>
            <MobileCommentButton onClick={()=>handleCommentClick()} commentCount={props.commentCount}/>
            <MobileShareButton onClick={()=>handleShareClick()} shareCount={props.shareCount}/>
        </div>
    );
}

export default VideoPostInteractionButtons;