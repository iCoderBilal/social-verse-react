import React from 'react';
import {IoIosShareAlt} from "react-icons/io";


const MobileShareButton = (props) => {
    return (
        <div onClick={(e)=>props.handleShareClick(e)} className="video__post-information__interaction-button">
            <IoIosShareAlt/>
            <p>{props.shareCount}</p>
        </div>
    );
};

export default MobileShareButton;