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

    return (
        <div className="video__video-post-interaction-buttons" onClick={(event)=>handleBottomNavigationClick(event)}>
            <MobileUserFollowButton instagramImage={props.instagramImage}/>
            <MobileLikeButton likesCount={props.likesCount}/>
            <MobileCommentButton commentCount={props.commentCount}/>
            <MobileShareButton shareCount={props.shareCount}/>
        </div>
    );
}

export default VideoPostInteractionButtons;