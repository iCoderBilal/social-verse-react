import React from 'react';
import {StarIcon} from "@heroicons/react/solid";

const MobileLikeButton = (props) => {
    return (
        <div onClick={(e)=>props.handleLikesClick(e)} className="video__post-information__interaction-button">
            <StarIcon/>
            <p>{props.likesCount}</p>
        </div>
    );
};

export default MobileLikeButton;