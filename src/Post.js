import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import ShelterToaster from "./services/ShelterToaster";
import axios from "axios";
import LoadingPost from "./components/LoadingPost";
import NavBar from "./components/NavBar";
import TopDonor from "./components/TopDonor";
import TimeAgo from "react-timeago";
import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import AuthHelper from "./services/AuthHelper";
import Comment from "./components/Comment";

registerPlugin(FilePondPluginFileValidateType);

const weekInMilliSeconds = 604800000;

class Post extends Component {
  state = {
    post: null,
    comments: null,
    files: [],
    video_link: null,
  };

  componentDidMount() {
    document.body.classList.add("grey-bg");
    this.commentTitle = React.createRef();
    const identifier = this.props.match.params.identifier;
    const slug = this.props.match.params.slug;
    const fetchPostData = axios.get("/posts/" + identifier + "/" + slug);

    fetchPostData
      .then((response) => {
        this.setState({ post: response.data });
      })
      .catch(() => {
        ShelterToaster.error("Something went wrong while loading the post!");
      });

    const fetchCommentData = axios.get("/comments/" + identifier + "/" + slug);
    fetchCommentData
      .then((response) => {
        console.log(response.data);
        this.setState({ comments: response.data });
      })
      .catch(() => {
        ShelterToaster.error(
          "Something went wrong while fetching the comments!"
        );
      });
  }

  getPost = () => {
    return (
      <div className="m-10 p-5 bg-white rounded-xl shadow overflow-hidden flex flex-wrap md:flex-nowrap hover:shadow-lg">
        <div className="ml-4 flex items-start flex-col flex-shrink-1">
          <div className="flex items-center">
            <div>
              <img
    className="rounded-full w-10 h-10"
    src={this.state.post.picture_url}
     alt={this.state.post.username}/>
            </div>
            <div className="ml-4">
              <div className="text-lg font-medium text-gray-900 flex">
                {this.state.post.title}{" "}
                <span className="ml-2 rounded-full p-1 px-3 bg-green-100 text-green-500 text-sm flex items-center">
                  <img
    src="https://shelter-cdn.nyc3.digitaloceanspaces.com/public/coin_logo%20x64.png"
    className="h-4 mr-2"
    />
                  {this.state.post.bounty_amount}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                posted by{" "}
                <Link
                  to={`/profile/${this.state.post.username}`}
                  className="hover:underline mr-1"
                >
                  {this.state.post.username}
                </Link>
                <TimeAgo date={this.state.post.created_at} />
              </div>
            </div>
          </div>

          <div className="my-5 hidden md:block">{this.state.post.body}</div>

          <div className="w-11/12 border-t border-grey-50 m-2"/>

          <div className="flex items-center justify-items-center">
            <span className="rounded-full p-1 px-3 bg-green-100 text-green-500 text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Upvotes {this.state.post.upvote_count}
            </span>

            <span className="ml-2 rounded-full p-1 px-3 bg-green-100 text-green-500 text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>{" "}
              Submissions: {this.state.post.comment_count}
            </span>
            <span className="ml-2 rounded-full p-1 px-3 bg-yellow-100 text-yellow-500 text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {
                (Date.now() - this.state.post.created_at + weekInMilliSeconds > 0) ? ("Expired") : ("Expires in" + <TimeAgo
                    className="ml-1"
                    date={this.state.post.created_at + weekInMilliSeconds}
                />)
              }
            </span>
          </div>
        </div>
      </div>
    );
  };

  getServerConfig = () => {
    return {
      url: axios.defaults.baseURL + "/comment/upload",
      process: {
        method: "POST",
        headers: {
          "Shelter-Token": AuthHelper.getUserToken(),
        },
        onload: (response) => {
          response = JSON.parse(response);
          if (response.status == "success") {
            ShelterToaster.success(response.message);
            {
              this.setState({video_link: response.video_link});
            }
          } else
            ShelterToaster.error(response.message || "Something went wrong!");
        },
      },
    };
  };

  handleCommentSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.state.video_link === null) {
      ShelterToaster.error("You must upload a video");
      return false;
    }

    let formData = new FormData(event.currentTarget);
    formData.append("video_link", this.state.video_link);
    formData.append("slug", this.state.post.slug);
    formData.append("identifier", this.state.post.identifier);

    axios.post("/comment/add", formData).then((response) => {
      if (response.data.status === "success") {
        ShelterToaster.success(response.data.message);
      }
    });
  };

  getCommentAdd = () => {
    if (!AuthHelper.isUserLoggedIn()) {
      return (
        <Link
          to="/auth"
          className="mx-10 bg-blue-100 p-3 px-4 shadow-md text-blue-500 rounded-md flex flex-nowrap justify-between"
        >
          <span>You must login to add submission!</span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </Link>
      );
    }

    if (this.state.post.is_locked) {
      return (
      <div className="mx-10 bg-blue-100 p-3 px-4 shadow-md text-blue-500 rounded-md flex flex-nowrap justify-between">
        <span>You are viewing an archived post!</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </span>
      </div>);
    }

    return (
      <form
        className="mx-10 p-3 shadow-md rounded-md bg-white"
        onSubmit={(e) => this.handleCommentSubmit(e)}
      >
        <input
    type="text"
    className="w-full p-3 border border-grey-100 outline-none rounded-md text-lg my-3"
    name="comment_title"
    placeholder="Bid Comment"
    required
    />
        <FilePond
          ref={(ref) => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={false}
          allowReorder={false}
          allowReplace={false}
          allowRevert={false}
          allowRemove={false}
          allowDrop={true}
          allowBrowse={true}
          allowPaste={false}
          maxFiles={1}
          labelIdle={`Drag & Drop your Shelter video or <span class="filepond--label-action"> Browse </span>`}
          server={this.getServerConfig()}
          name="bid_video_file"
          onupdatefiles={(fileItems) => {
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
        />
        <button
          type="submit"
          className="text-white text-sm m-4 w-32 bg-green-400 p-2 uppercase rounded-full hover:bg-green-500"
        >
          Submit
        </button>
      </form>
    );
  };

  getComments = () => {
    if (this.state.comments == null) {
      return <LoadingPost />;
    }

    if (this.state.comments.length === 0) {
      return (
        <div className="mx-10 bg-blue-100 p-3 px-4 shadow-md text-blue-500 rounded-md flex flex-nowrap justify-between">
          <span>No submissions! Be the first one!</span>
        </div>
      );
    }

    return this.state.comments.map((comment) => (
      <Comment
    key={comment.username + comment.created_at}
    comment={comment}
    />
    ));
  };

  postPageComponents = () => {
    return (
      <div className="flex flex-col">
        {this.getPost()}
        {this.getCommentAdd()}
        {this.getComments()}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <NavBar/>
        <div className="mx-auto flex">
          {this.state.post === null ? (
            <LoadingPost customClass={`mx-10`}/>
          ) : (
            this.postPageComponents()
          )}
          <TopDonor/>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Post);
