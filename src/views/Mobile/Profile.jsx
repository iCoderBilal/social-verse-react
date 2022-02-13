import React, {useEffect} from 'react';

function Profile(props) {

    useEffect(() => {

    })

    return (
        <div className="profile">
            <div className="heading-container">
                <h1>Piyush Jha</h1>
            </div>
            <div className="content-container">
                <div className="user-container">
                    <div className="avatar">
                        <img
                            src="https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/7064106969132433454~c5_100x100.jpeg?x-expires=1644829200&x-signature=ub9HhNTUxPL6fzoCatMFsF9NBvA%3D"
                            alt="User Profile Picture"/>
                    </div>
                    <h2 className="username">
                        @hackinet
                    </h2>
                    <div className="counters">
                        <div className="counter">
                            <span className="value">1M</span>
                            <span className="key">Following</span>
                        </div>
                        <div className="counter">
                            <span className="value">1M</span>
                            <span className="key">Following</span>
                        </div>
                        <div className="counter">
                            <span className="value">1M</span>
                            <span className="key">Following</span>
                        </div>
                    </div>
                </div>
                <div className="post-tabs">

                </div>
                <div className="post-container">

                </div>
            </div>
        </div>
    );
}

export default Profile;