/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import {
    BsFillChatDotsFill,
    BsFillChatSquareDotsFill, BsFillHeartFill,
    BsHeart,
    BsShareFill
} from "react-icons/bs";
import {IoIosShareAlt} from "react-icons/io"
import { RiPictureInPicture2Fill} from "react-icons/ri"
import FollowPlusIcon from '../../images/followIcon.png';
import {setShowSwitchToAppSuggestionDialog} from "../../store/ui";
import {useDispatch} from "react-redux";

function PostRightSidebar(props) {
    const dispatch = useDispatch();
    const handleOnClick = () => {
        dispatch(setShowSwitchToAppSuggestionDialog(true))
    }

    return (
        <div className={`post-right-sidebar`}>
         {/* href={`/@${props.authorUsername}`}  */}
            <a href="#" onClick={handleOnClick} title={`${props.authorName} (${props.authorUsername})`}
               className={`sidebar-avatar-container`}>
                <span className={`flic-avatar`}>
                    <img alt={`${props.authorName} (${props.authorUsername}) Avatar`}
                         src={props.authorAvatarPictureURL}/>
                </span>
                <div className={`icon-container`}>
                    <div className={`follow-plus`}>
                        <img alt={`follow-plus-icon`}
                             src={FollowPlusIcon}/>
                    </div>
                </div>
            </a>

            <div className="sidebar-toolbar">
                <div className="tool" onClick={props.handleLikeButtonClick}>
                    <BsFillHeartFill/>
                    <strong>{props.postLikeCount}</strong>
                </div>
                <div className="tool" onClick={props.handleCommentButtonClick}>
                    <BsFillChatDotsFill/>
                    <strong>{props.postCommentCount}</strong>
                </div>
                <div className="tool" onClick={props.handleShareButtonClick}>
                    <IoIosShareAlt/>
                </div>
                {
                    document.pictureInPictureEnabled ?  <div className="tool" onClick={props.handlePipButtonClick}>
                        <RiPictureInPicture2Fill/>
                    </div>: <></>
                }

            </div>

        </div>
    );
}

PostRightSidebar.propTypes = {
    authorName: PropTypes.string.isRequired,
    authorUsername: PropTypes.string.isRequired,
    isFollowingAuthor: PropTypes.bool.isRequired,
    hasLikedPost: PropTypes.bool.isRequired,
    postLikeCount: PropTypes.number.isRequired,
    postCommentCount: PropTypes.number.isRequired,
    hasBookmarked: PropTypes.bool.isRequired,
    authorAvatarPictureURL: PropTypes.string.isRequired,
    handleLikeButtonClick: PropTypes.func.isRequired,
    handleCommentButtonClick: PropTypes.func.isRequired,
    handleShareButtonClick: PropTypes.func.isRequired,
    handleBookmarkButtonClick: PropTypes.func.isRequired,
    handlePipButtonClick: PropTypes.func.isRequired
};

export default PostRightSidebar;