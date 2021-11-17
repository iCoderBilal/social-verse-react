import React from 'react';
import UserHelper from "../services/UserHelper";

function UploadProgress(props) {

    if(props.isUploading !== true || props.uploadProgress === undefined){
        return <></>
    }

    return (
        <div className='upload-progress'>
            <div className='small-avatar-container'>
                <div className="flic-dual-ring-spinner">
                    <img className="small-avatar" src={UserHelper.getProfilePicture()} alt={UserHelper.getUsername()}/>
                </div>
            </div>
            <div className='progress'>
                <div className='completion' style={{"width": `${props.uploadProgress}%`}}>
                </div>
            </div>
            <div className='small-flic-icon'>
                <img src="https://shelter-cdn.nyc3.cdn.digitaloceanspaces.com/flic/assets/coin_logo_x64.png" alt={"flic-icon"}/>
            </div>
        </div>
    );
}

export default UploadProgress;