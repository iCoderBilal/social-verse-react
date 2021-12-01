import React from 'react';
import {PlusIcon} from "@heroicons/react/outline";

const MobileUserFollowButton = (props) => {
    return (
        <div onClick={(e)=>props.handleFollowClick(e)} className="video__post-information__interaction-button-follow">
            <img src={props.instagramImage}/>
            <div className="video__post-information__interaction-button-follow__plus">
                <PlusIcon/>
            </div>
        </div>
    );
};

export default MobileUserFollowButton;