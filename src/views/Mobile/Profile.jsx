//Todo: Create Backend API To Get Upvoted/Liked Posts Of User.
//Already wrote code for it here. Just gotta uncomment here.

import React, {useLayoutEffect, useState} from 'react';
import {IoBookmarkOutline, IoHeartOutline, IoPlayOutline} from "react-icons/all";
import {useSelector} from "react-redux";
import axios from "axios";
import {useNavigate, useParams} from "react-router";

function Profile(props) {

    const navigate = useNavigate();
    const {username} = useParams();

    const {isLoggedIn, user} = useSelector(state => state.auth);

    const [isProfileUserDataLoading, setIsProfileUserDataLoading] = useState(true);
    const [profileUserData, setProfileUserData] = useState(null);

    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [profilePosts, setProfilePosts] = useState([]);
    const isProfileOwner = isLoggedIn && user.username.toLowerCase() === username.toLowerCase();

    const tabIconUnderlineRef = React.createRef();

    const profileTabs = ["posts", "bookmarks"];
    const [activeProfileTab, setActiveProfileTab] = useState(profileTabs[0]);

    useLayoutEffect(() => {
        if (tabIconUnderlineRef.current) {
            moveUnderlineUnderActiveIcon();
        }

        axios.get(`/profile/${username}`).then((response) => {
            setProfileUserData(response.data);
            setIsProfileUserDataLoading(false);
        }).then(() => {

            const loadPosts = axios.get(`/posts/${username}`);
            const loadBookmarks = (!isProfileOwner) ? ([]) : (axios.get(`/bookmarks`));


            Promise.all([loadPosts, loadBookmarks]).then((values) => {
            setProfilePosts(values[0].data)
            setBookmarkedPosts(values[1].data)
            setIsPostsLoading(false);
        })

        }).catch(() => {
            navigate('/404');
        });

        window.gtag('event', 'view', {
            'event_category': 'page',
            'event_label': 'Profile'
        });

    }, []);


    // const loadUpvotes = () => {
    //     if(!(isLoggedIn && user.username.toLowerCase() === username)){
    //         return;
    //     }
    //     return axios.get(`/posts/${username}`).then((response) => {
    //         setUpvotedPosts(response.data);
    //     })
    // }

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

    const getPostContainerJsx = () => {
        if(isPostsLoading || true){
            return <div className="posts-grid">
                {Array(9).fill(1).map(() => {
                    return <li className="post-item"/>
                })}
            </div>
        }
    }

    return (
        <div className={`profile ${isProfileUserDataLoading && "loading"}`}>
            <div className="heading-container">
                <h1>
                    {profileUserData && profileUserData.name}
                </h1>
            </div>
            <div className="content-container">
                <div className="user-container">
                    <div className="avatar">
                        {isProfileUserDataLoading ? <></>:  <img
                            src={profileUserData.profile_picture_url}
                            alt="User Profile Picture"/>}
                    </div>
                    <h2 className="username">
                        {profileUserData && '@' + profileUserData.username}
                    </h2>
                    <div className="counters">
                        <div className="counter">
                            <span className="value">{profileUserData && profileUserData.post_count}</span>
                            <span className="key">Posts</span>
                        </div>
                        <div className="counter">
                            <span className="value">{profileUserData && profileUserData.follower_count}</span>
                            <span className="key">Followers</span>
                        </div>
                        <div className="counter">
                            <span className="value">{profileUserData && profileUserData.following_count}</span>
                            <span className="key">Following</span>
                        </div>
                    </div>
                </div>
                <div className="post-tabs">
                    <div className="post-tab-icons">
                        <div className="icon-container active" data-tab="posts" onClick={handleTabClick}>
                            <IoPlayOutline/>
                        </div>
                        {
                            isProfileOwner ? <div className="icon-container" data-tab="bookmarks" onClick={handleTabClick}>
                                <IoBookmarkOutline/>
                            </div> : <></>
                        }
                        {/*<div className="icon-container" onClick={handleTabClick}>*/}
                        {/*    <IoHeartOutline/>*/}
                        {/*</div>*/}
                    </div>
                    <div className="post-tab-underline" ref={tabIconUnderlineRef}/>
                </div>
                <div className="posts-container">
                    {getPostContainerJsx()}
                </div>
            </div>
        </div>
    );
}

export default Profile;