import React from 'react';
import { useSelector } from 'react-redux';

function UploadProgress(props) {

    const { user } = useSelector((state) => state.auth);


    if(props.isUploading !== true || props.uploadProgress === undefined){
        return <></>
    }

    return (
        <div className='upload-progress'>
            <div className='small-avatar-container'>
                <div className="flic-dual-ring-spinner">
                    <img className="small-avatar" src={user.profile_picture_url} alt={user.username}/>
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