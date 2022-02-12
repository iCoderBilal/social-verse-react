import React from 'react';
import useLeftPaneImage from "../../utils/hooks/useLeftPaneImage";

function LeftPaneImage(props) {

    const {leftPaneImageURL} = useLeftPaneImage();

    
    const getContainerContent = () => {
        if (leftPaneImageURL === null) {
            return <div className={`loading`}/>
        }
        return <img src={leftPaneImageURL}/>
    }

    return (<div className="left-pane-image-container">
        {getContainerContent()}
    </div>)
}

export default LeftPaneImage;