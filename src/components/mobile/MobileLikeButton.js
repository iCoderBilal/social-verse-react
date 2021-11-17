import React from 'react';
import {HeartIcon} from "@heroicons/react/solid";

const MobileLikeButton = (props) => {
    return (
        <div className="video__post-information__interaction-button">
            <HeartIcon/>
            <p>{props.likesCount}</p>
        </div>
    );
};

export default MobileLikeButton;