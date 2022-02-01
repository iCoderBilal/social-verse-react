import React from 'react';
import {AnnotationIcon} from "@heroicons/react/solid";

const MobileCommentButton = (props) => {
    return (
        <div onClick={(e)=>props.handleCommentClick(e)} className="video__post-information__interaction-button">
            <AnnotationIcon/>
            <p>{props.commentCount}</p>
        </div>
    );
};

export default MobileCommentButton;