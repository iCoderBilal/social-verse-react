import React from 'react';
import {PlayIcon} from "@heroicons/react/solid";

function MobilePlayButton(props) {
    return (
        <PlayIcon className={`feed_video-container__play ${props.isVideoPlaying ? 'feed_video-container__play--hidden' : ''}`} />
    );
}

export default MobilePlayButton;