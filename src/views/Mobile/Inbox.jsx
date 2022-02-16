import React from 'react';

function Inbox(props) {
    return (
        <div className="inbox">
            <div className="heading-container">
                <h1>Notifications</h1>
            </div>
            <div className="content-container">
                <div className="notification-tabs">
                    <span className="active">All</span>
                    <span>Likes</span>
                    <span>Comments</span>
                    <span>Mentions</span>
                    <span>Followers</span>
                </div>
            </div>
        </div>
    );
}

export default Inbox;