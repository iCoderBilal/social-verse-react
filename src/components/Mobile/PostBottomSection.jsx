import React from 'react';
import PropTypes from 'prop-types';

PostBottomSection.propTypes = {
    authorUsername: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    authorProfilePictureURL: PropTypes.string.isRequired,
    postDescription: PropTypes.string.isRequired
};

function PostBottomSection(props) {
    return (
        <div className={`post-bottom-section-container`}>
            <div className={`post-bottom-section`}>
                <div className={`bottom-left`}>
                    <a className={`username`}>
                        @{props.authorUsername}
                    </a>
                    <h1 className={`description`}>
                        <span>{props.postDescription}</span>
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default PostBottomSection;