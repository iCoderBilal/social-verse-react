import React from 'react';
import PropTypes from 'prop-types';
import {
    BsFillChatDotsFill,
    BsFillChatSquareDotsFill, BsFillHeartFill,
    BsHeart,
    BsShareFill,
    IoIosShareAlt,
    RiPictureInPicture2Fill
} from "react-icons/all";

function PostRightSidebar(props) {
    return (
        <div className={`post-right-sidebar`}>
            <a href={`/@${props.authorUsername}`} title={`${props.authorName} (${props.authorUsername})`}
               className={`sidebar-avatar-container`}>
                <span className={`flic-avatar`}>
                    <img alt={`${props.authorName} (${props.authorUsername}) Avatar`}
                         src={props.authorAvatarPictureURL}/>
                </span>
                <div className={`icon-container`}>
                    <div className={`follow-plus`}>
                        <img alt={`follow-plus-icon`}
                             src={`https://cdn-asset.watchflic.com/images/follow-plus-icon.svg`}/>
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