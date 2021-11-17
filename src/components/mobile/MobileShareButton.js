import React from 'react';
import {ShareIcon} from "@heroicons/react/solid";

const MobileShareButton = (props) => {
    return (
        <div className="video__post-information__interaction-button">
            <ShareIcon/>
            <p>{props.shareCount}</p>
        </div>
    );
};

export default MobileShareButton;