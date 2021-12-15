import React, {Component} from "react";
import UserHelper from "../services/UserHelper";
import AuthHelper from "../services/AuthHelper";
import axios from "axios";
import FlicToaster from "../services/FlicToaster";
import UploadProgress from "./UploadProgress";
import RightArrowIcon from "./RightArrowIcon";

class CreateFlicCard extends Component {
  state = {
    isUploading: false,
    uploadProgress: 0,
    fileInputRef: React.createRef(),
    captionInputRef: React.createRef(),
    hash: null,
    waitingForPostCreation: false,
    captionText: "",
    preSigned: null,
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.target.innerText = "Release to upload";
    e.target.classList.add("hover");
  };

  handleDrop = (e) => {
    e.preventDefault();
    let fileInput = this.state.fileInputRef.current;
    fileInput.files = e.dataTransfer.files;
    const dT = new DataTransfer();
    dT.items.add(e.dataTransfer.files[0]);
    fileInput.files = dT.files;
    e.target.innerText = "Upload (Drag or Click)";
    e.target.classList.remove("hover");
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    e.target.innerText = "Upload (Drag or Click)";
    e.target.classList.remove("hover");
  };

  uploadVideo = (e) => {
    this.setState({isUploading: true}, () => {
      window.gtag("event", "upload", {
        event_category: "interactions",
        event_label: "Upload",
      });
    });

    const config = {
      onUploadProgress: (progressEvent) => {
        let progress = (progressEvent.loaded / progressEvent.total) * 100;
        this.setState({uploadProgress: progress});
      },
      headers: {
        "Flic-Token": AuthHelper.getUserToken(),
      },
    };

    let that = this;

    axios.get("/post/upload/token").then((response) => {
      this.setState(
          {
            preSigned: response.data.token,
            hash: response.data.hash,
          },
          () => {
            axios
                .put(this.state.preSigned, this.state.fileInputRef.current.files[0], config)
                .then((res) => {
                  let videoLink = "https://" + window.location.hostname + "/post/" + res.data.identifier + "/" + res.data.slug;
                  this.setState({isUploading: false, uploadProgress: 100, videoLink: videoLink}, () => {
                    FlicToaster.customJSX(this.getSuccessJSX());
                  });
                })
                .catch((err) => {
                  FlicToaster.error("Try uploading video later");
                });
          },
      );
    });
  };

  componentWillUnmount() {
    //Destroy Event Listeners
  }

  getGuestView = () => {
    return "";
  };

  getSuccessJSX = () => {
    return (
        <div
            className={`animate-enter max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                    className="h-10 w-10 rounded-full"
                    src={UserHelper.getProfilePicture()}
                    alt={`${UserHelper.getUsername()}'s Avatar`}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {UserHelper.getUsername()}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {this.state.captionText}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <a href={this.state.videoLink}
               className={`className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}>
              View
            </a>
          </div>
        </div>)
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.setState({waitingForPostCreation: true});
    let formData = new FormData();
    formData.append("hash", this.state.hash);
    formData.append("title", this.state.captionText);

    axios
        .post("/post/add", formData)
        .then((res) => {
          if (res.status === 200) {
            this.setState(
                {
                  isUploading: false,
                  uploadProgress: 0,
                  hash: null,
                  waitingForPostCreation: false,
                  captionText: "",
                },
                () => {
                  FlicToaster.success("Your post was created!");
                  let link = "https://" + window.location.hostname + "/post/" + res.data.identifier + "/" + res.data.slug;
                  FlicToaster.success(
                      <a style={{color: "blue"}} href={link}>
                        {link}
                      </a>,
                  );
                },
            );
          }
        })
        .catch((err) => {
          this.setState(
              {
                waitingForPostCreation: false,
              },
              () => FlicToaster.error("Something went wrong!"),
          );
        });
  };

  handleDiscard = () => {
    this.setState({
      isUploading: false,
      uploadProgress: 0,
      hash: null,
      waitingForPostCreation: false,
      captionText: "",
    });
  };

  getFormButtons = () => {
    const disableSubmitButton = this.state.captionText.length < 10;

    return (
        <div
            className={`upload-form-buttons ${this.state.uploadProgress === 100 && this.state.isUploading === false ? "" : "hidden"}`}>
          <button
              onClick={() => this.handleDiscard()}
              type='reset'
              className={`shadow inline-block rounded-sm font-medium border border-solid text-center transition-colors duration-200 text-base py-3 px-6 text-gray-700 bg-white border-gray-100  w-full ${
                  this.state.waitingForPostCreation ? "shadow-inner opacity-40 cursor-wait" : "hover:bg-gray-50"
              }`}
              disabled={this.state.waitingForPostCreation}
          >
            Discard
          </button>
          <button
              type='submit'
              className={`shadow inline-block rounded-sm font-medium border border-solid text-center transition-colors duration-200 text-base py-3 px-6 text-white bg-red-500 border-red-500 w-full ${
                  disableSubmitButton ? "shadow-inner opacity-40" : "hover:bg-red-400 hover:border-red-400"
              } ${this.state.waitingForPostCreation ? "animate-pulse opacity-80 cursor-wait hover:bg-red-500 hover:border-red-500" : ""}`}
              disabled={disableSubmitButton || this.state.waitingForPostCreation}
          >
            Post Flic <RightArrowIcon/>
          </button>
        </div>
    );
  };

  getLoggedInView = () => {
    return (
        <div className='create-flic-card'>
          <div className='flic-upload'>
            <form className='flic-data-input' onSubmit={(e) => this.handleFormSubmit(e)}>
              <div className={"avatar-and-caption"}>
                <div className='avatar-container'>
                  <img className='avatar' src={UserHelper.getProfilePicture()} alt={UserHelper.getUsername()}/>
                </div>
                <input
                    onKeyUp={(e) => this.setState({captionText: e.target.value})}
                    ref={this.state.captionInputRef}
                    className='upload-text-input'
                    readOnly={this.state.waitingForPostCreation}
                    placeholder={`Give a caption to your video!`}
                />
              </div>
              <input
                  ref={this.state.fileInputRef}
                  id='flic-video'
                  multiple={false}
                  className='upload-file-input'
                  name='flic-video'
                  type='file'
                  accept='video/mp4,video/x-m4v,video/webm'
                  onChange={(e) => this.uploadVideo(e)}
              />
              <label
                  htmlFor='flic-video'
                  className={`upload-drag-area ${this.state.isUploading || this.state.uploadProgress !== 0 ? "hidden" : ""}`}
                  onDragOver={(e) => this.handleDragOver(e)}
                  onDragLeave={(e) => this.handleDragLeave(e)}
                  onDrop={(e) => this.handleDrop(e)}
              >
                Upload (Drag or Click)
              </label>
              {this.getFormButtons()}
            </form>
          </div>
          <UploadProgress isUploading={this.state.isUploading} uploadProgress={this.state.uploadProgress}/>
        </div>
    );
  };

  render() {
    return AuthHelper.isUserLoggedIn() ? this.getLoggedInView() : this.getGuestView();
  }
}

export default CreateFlicCard;
