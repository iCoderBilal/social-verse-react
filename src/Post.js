import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import FlicToaster from "./services/FlicToaster";
import axios from "axios";
import LoadingPost from "./components/LoadingPost";
import NavBar from "./components/NavBar";
import AuthHelper from "./services/AuthHelper";
import Comment from "./components/Comment";
import ChildPost from "./components/Post";
import MobileFeed from "./components/mobile/MobileFeed";
import Skeleton from "react-loading-skeleton";


class Post extends Component {

  state = {
    post: null,
    comments: null,
    files: [],
    commentText: null,
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
        FlicToaster.error("Something went wrong while loading the post!");
      });

    const fetchCommentData = axios.get("/comments/" + identifier + "/" + slug);
    fetchCommentData
      .then((response) => {
        this.setState({ comments: response.data });
      })
      .catch(() => {
        FlicToaster.error(
          "Something went wrong while fetching the comments!"
        );
      });


    window.gtag('event', 'view', {
      'event_category' : 'page',
      'event_label' : window.innerWidth < 768 ? 'Mobile Post' : 'Desktop Post'
    });

  }

  handleCommentKeyUp = (e) => {
    this.setState({
      commentText: e.target.value
    })
  }

  handleCommentSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let formData = new FormData(event.currentTarget);

    formData.append("body", this.state.commentText);
    formData.append("slug", this.state.post.slug);
    formData.append("identifier", this.state.post.identifier);

    axios.post("/comment/add", formData).then((response) => {
      if (response.data.status === "success") {
        FlicToaster.success(response.data.message);
      }
    });
  };

  getCommentAdd = () => {
    if (!AuthHelper.isUserLoggedIn()) {
      return (
        <Link
          to="/auth"
          className="text-gray-700"
        >
          <span>You must login to add submission!</span>
        </Link>
      );
    }

    return (
      <form
        className="comment-add-form"
        onSubmit={(e) => this.handleCommentSubmit(e)}
      >
        <input
        type="text"
        className="w-full p-3 border border-grey-100 outline-none rounded-md text-lg my-3"
        name="body"
        placeholder="Add Comment"
        onKeyUp={(e) => this.handleCommentKeyUp(e)}
        required
    />

        <button
          type="submit"
          className="text-white text-sm m-4 w-32 bg-red-400 p-2 uppercase rounded-full hover:bg-red-500"
        >
          Add Comment
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
          <string className={"no-comments-message"}>No submissions! Be the first one!</string>
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
      <React.Fragment>
        <ChildPost post={this.state.post}/>
        <div className={`comment-container`}>
          {this.getCommentAdd()}
          <div className={`comment-list`}>
            {this.getComments()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {

    if(window.innerWidth < 768) {
      if(this.state.post === null){
        return <Skeleton height={100} width={100}/>;
      }
      return <MobileFeed post={this.state.post} singlePost={true} hasUserInteracted = {this.props.hasUserInteracted}/>
    }

    return (
      <React.Fragment>
        <NavBar/>
        <div className="mx-auto flex post-page-container">
          {this.state.post === null ? (
            <LoadingPost customClass={`mx-10`}/>
          ) : (
            this.postPageComponents()
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Post);
