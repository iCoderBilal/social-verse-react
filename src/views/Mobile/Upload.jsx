import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router";
import UploadProgressCircle from "../../components/Common/UploadProgressCircle";
import {BsUpload} from "react-icons/all";
import axios from "axios";
import FlicToaster from "../../utils/FlicToaster";

function Upload(props) {

    const navigate = useNavigate();
    const {isLoggedIn, user} = useSelector(state => state.auth);


    const [uploadProgress, setUploadProgress] = useState(-1);
    const [showPostTitleAdditionCard, setShowPostTitleAdditionCard] = useState(false)
    const [uploadStartTime, setUploadStartTime] = useState(+new Date());
    const [uploadHash, setUploadHash] = useState(null);
    const [waitingForPostCreation, setWaitingForPostCreation] = useState(false);
    const fileInputRef = React.useRef();

    if (!isLoggedIn) {
        return <Navigate to="/auth"/>
    }

    const handleFileInput = async () => {
        await setUploadStartTime(+new Date());

        const axiosUploadConfig = {
            onUploadProgress: (progressEvent) => {
                const progress = (progressEvent.loaded / progressEvent.total) * 100;
                setUploadProgress(progress);
            },
            headers: {
                "Flic-Token": user.token,
            },
        };

        axios.get("/posts/generate-upload-url").then((response) => {
            setUploadHash(response.data.hash);

            axios
                .put(response.data.url, fileInputRef.current.files[0], axiosUploadConfig)
                .then((res) => {
                    FlicToaster.success("Your video was uploaded!")
                    setUploadProgress(-1);
                    setShowPostTitleAdditionCard(true);
                })
                .catch((err) => {
                    FlicToaster.error("Try uploading video later");
                });

        });

    }

    const handlePostCreationFormSubmit = (formSubmitEvent) => {
        setWaitingForPostCreation(true);
        formSubmitEvent.preventDefault();
        const formData = new FormData(formSubmitEvent.currentTarget);

        axios
            .post("/posts/add", formData)
            .then((res) => {
                if (res.status === 200) {
                    FlicToaster.success("Your post was created");
                    window.location.href = `/@${user.username}`;
                }
            })
            .catch((err) => {
                FlicToaster.error("Something went wrong!")
            }).finally(() => {
            setWaitingForPostCreation(false);
            setShowPostTitleAdditionCard(false);
        });

    }

    const uploadSelectorJsx = () => {

        const hideUploadSelector = showPostTitleAdditionCard || uploadProgress > 0;

        return <div className={`file-upload-container ${hideUploadSelector && 'uploading'}`}>
            <div className="upper">
                Image will go here
            </div>
            <div className="lower">
                <input
                    id="flic-upload-video-input"
                    ref={fileInputRef}
                    type="file"
                    multiple={false}
                    accept='video/mp4,video/x-m4v,video/webm'
                    onChange={handleFileInput}
                />
                <span>Post a video to your account and share with the world!</span>
                <label htmlFor="flic-upload-video-input" className={uploadProgress > 0 ? "loading" : ""}>Choose a
                    file <BsUpload/></label>
            </div>
        </div>
    }

    const uploadProgressJsx = () => {
        if (uploadProgress === -1) {
            return <></>
        }

        return <UploadProgressCircle progress={uploadProgress}
                                     stroke={4}
                                     radius={window.innerWidth * 0.4}
                                     startTime={uploadStartTime}
        />
    }

    const postCreationFormJsx = () => {
        if (!showPostTitleAdditionCard) {
            return <></>
        }
        return <form className={`create-post-container ${waitingForPostCreation ? 'loading' : ''}`}
                     onSubmit={handlePostCreationFormSubmit}>
            <div className="form-group">
                <textarea placeholder="Add a caption to your post" name="title" minLength={3} rows={3} required/>
                <input type="hidden" value={uploadHash} name="hash"/>
            </div>
            <div className="form-group">
                <button type="submit" className={waitingForPostCreation ? 'loading' : ''}>Create Post</button>
            </div>
        </form>
    }

    return (
        <div className="upload">
            <div className="heading-container">
                <h1>Create Post</h1>
            </div>
            <div className="content-container">
                {uploadSelectorJsx()}
                {uploadProgressJsx()}
                {postCreationFormJsx()}
            </div>
        </div>
    );
}

export default Upload;