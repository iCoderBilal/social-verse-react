import React, {useLayoutEffect, useState} from 'react';
import {IoBookmarkOutline, IoHeartOutline, IoPlayOutline} from "react-icons/all";
import {useSelector} from "react-redux";
import axios from "axios";
import {useNavigate, useParams} from "react-router";

function Profile(props) {

    const navigate = useNavigate();
    const {username} = useParams();

    const {isLoggedIn, user} = useSelector(state => state.auth);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileUserData, setProfileUserData] = useState(null);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [profilePosts, setProfilePosts] = useState([]);

    const tabIconUnderlineRef = React.createRef();

    useLayoutEffect(() => {
        if (tabIconUnderlineRef.current) {
            moveUnderlineUnderActiveIcon();
        }

        axios.get(`/profile/${username}`).then((response) => {
            setProfileUserData(response.data);
            setIsProfileLoading(false);
        }).catch(() => {
            navigate('/404');
        });

        window.gtag('event', 'view', {
            'event_category': 'page',
            'event_label': 'Profile'
        });

    }, [])

    const handleTabClick = (clickEvent) => {
        getActiveTab().classList.remove("active");
        clickEvent.target.classList.add("active");
        moveUnderlineUnderActiveIcon();
    }


    const getActiveTab = () => {
        return document.getElementsByClassName("icon-container active")[0];
    }

    const moveUnderlineUnderActiveIcon = () => {
        const underline = tabIconUnderlineRef.current;
        const underLineXLength = underline.getBoundingClientRect().right - underline.getBoundingClientRect().left;
        const activeTab = getActiveTab();
        tabIconUnderlineRef.current.style.left = (activeTab.getBoundingClientRect().left + activeTab.getBoundingClientRect().right) / 2 - (underLineXLength / 2) + "px";
    }


    return (
        <div className="profile">
            <div className="heading-container">
                <h1 className={isProfileLoading ? 'skeleton' : ''}>
                    {profileUserData && profileUserData.name}
                </h1>
            </div>
            <div className="content-container">
                <div className="user-container">
                    <div className="avatar">
                        {isProfileLoading ? <div className="skeleton-circle"/> : <img
                            src="https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/7064106969132433454~c5_100x100.jpeg?x-expires=1644829200&x-signature=ub9HhNTUxPL6fzoCatMFsF9NBvA%3D"
                            alt="User Profile Picture"/>}
                    </div>
                    <h2 className={`username ${isProfileLoading ? 'skeleton w33' : ''}`}>
                        {profileUserData && '@' + profileUserData.username}
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
                    <div className="post-tab-icons">
                        <div className="icon-container active" onClick={handleTabClick}>
                            <IoPlayOutline/>
                        </div>
                        <div className="icon-container" onClick={handleTabClick}>
                            <IoBookmarkOutline/>
                        </div>
                        <div className="icon-container" onClick={handleTabClick}>
                            <IoHeartOutline/>
                        </div>
                    </div>
                    <div className="post-tab-underline" ref={tabIconUnderlineRef}/>
                </div>
                <div className="posts-container">

                </div>
            </div>
        </div>
    );
}

export default Profile;