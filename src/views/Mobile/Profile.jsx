import React, { useLayoutEffect, useState, useRef } from 'react';
import { IoBookmarkOutline, IoPlayOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
import { LuClipboardList } from "react-icons/lu";
import MobileTopNavigation from '../../components/Mobile/TopNavigation';
import MobileSideNavigation from '../../components/Mobile/SideNavigation';

function Profile() {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useSelector(state => state.auth);

    const [isProfileUserDataLoading, setIsProfileUserDataLoading] = useState(true);
    const [profileUserData, setProfileUserData] = useState(null);
    const [profilePosts, setProfilePosts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const tabIconUnderlineRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    // Fetch user posts with pagination
    const fetchPosts = (page) => {
        axios.get(`/users/${user.username}/posts`, { params: { page, limit: 12 } }).then((response) => {
            const newPosts = response.data.posts;
            setProfilePosts(prevPosts => {
                const postIds = new Set(prevPosts.map(post => post.id));
                const uniqueNewPosts = newPosts.filter(post => !postIds.has(post.id));
                return [...prevPosts, ...uniqueNewPosts];
            });
            if (newPosts.length < 12) {
                setHasMorePosts(false);
            }
        }).catch(error => {
            console.error("Error fetching posts:", error);
        });
    };

    useLayoutEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth');
            return;
        }

        // Fetch user profile data
        axios.get(`/profile/${user.username}`).then((response) => {
            setProfileUserData(response.data);
            setIsProfileUserDataLoading(false);
        }).catch(error => {
            console.error("Error fetching profile data:", error);
            setIsProfileUserDataLoading(false);
        });

        // Fetch initial posts
        fetchPosts(currentPage);

        // Fetch user projects
        axios.get(`/projects/user/get`).then((response) => {
            if (response.data.status === 'success' && Array.isArray(response.data.projects)) {
                setProjects(response.data.projects);
            } else {
                console.error("Error fetching user projects:", response.data.message);
                setProjects([]);
            }
        }).catch(error => {
            console.error("Error fetching projects:", error);
            setProjects([]);
        });
    }, [isLoggedIn, currentPage]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        moveUnderlineUnderActiveIcon();
    };

    const moveUnderlineUnderActiveIcon = () => {
        if (tabIconUnderlineRef.current) {
            const underline = tabIconUnderlineRef.current;
            const underLineXLength = underline.getBoundingClientRect().right - underline.getBoundingClientRect().left;
            const activeTab = document.getElementsByClassName("icon-container active")[0];
            if (activeTab) {
                underline.style.left = (activeTab.getBoundingClientRect().left + activeTab.getBoundingClientRect().right) / 2 - (underLineXLength / 2) + "px";
            }
        }
    };

    const handleShowMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const renderAboutMeContent = () => {
        // Placeholder for about me data
        const aboutMeData = ""; // Replace with actual data source

        return (
            <div className="about-me-container">
                {aboutMeData ? (
                    <p>{aboutMeData}</p>
                ) : (
                    <p>No content available</p>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (isProfileUserDataLoading) {
            return <div className="loading-spinner">Loading...</div>;
        }

        if (activeTab === 'posts') {
            return (
                <div className="posts-container">
                    <div className="posts-grid">
                        {Array.isArray(profilePosts) && profilePosts.length > 0 ? (
                            profilePosts.map(post => (
                                <div className="post-item" key={post.id}>
                                    <video src={post.video_link} className="post-video" controls />
                                </div>
                            ))
                        ) : (
                            <li className="no-posts-message">No posts available</li>
                        )}
                    </div>
                    {hasMorePosts && (
                        <button className="load-more-button" onClick={handleShowMore}>
                            Show More
                        </button>
                    )}
                </div>
            );
        }

        if (activeTab === 'projects') {
            return (
                <div className="projects-container">
                    <div className="projects-grid">
                        {projects.length > 0 ? (
                            projects.map(project => (
                                <div key={project.id} className="project-card">
                                    <img
                                        src={project.logo_url}
                                        alt={project.name}
                                        className="project-logo"
                                    />
                                    <h3 className="project-name">{project.name}</h3>
                                </div>
                            ))
                        ) : (
                            <li className="no-projects-message">No projects available</li>
                        )}
                    </div>
                </div>
            );
        }

        if (activeTab === 'about') {
            return renderAboutMeContent();
        }

        return null; // Handle other tabs as needed
    };

    return (
        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
        
            <div className="container">
                <div style={{ display: `${isSideNavOpen ? 'block' : 'none'}` }} onClick={() => setIsSideNavOpen(false)} className="overlay"></div>
                <aside className="side-bar">
                    <MobileSideNavigation
                        isOpen={isSideNavOpen}
                        onClose={() => setIsSideNavOpen(false)}
                    />
                </aside>
                <main className="main-container">


              
                    <div className={`profile profile-page ${isProfileUserDataLoading && "loading"}`}>
                    <div className="gradient-bg"/>
                        <div className="profile-header">
                            <div className="background-image"></div>
                            <div className="profile-info">
                                <img src={profileUserData?.profile_picture_url} alt="Profile" className="profile-picture" />
                                <h1>{profileUserData?.name}</h1>
                                <div className="profile-stats">
                                    <span>{profileUserData?.post_count} Posts</span>
                                    <span>{profileUserData?.follower_count} Followers</span>
                                    <span>{profileUserData?.following_count} Following</span>
                                    <span>{profileUserData?.total_inspired_user_count} Inspired</span>
                                </div>
                            </div>
                        </div>
                        <div className="tabs">
                            <button onClick={() => handleTabClick('posts')} className={activeTab === 'posts' ? 'active' : ''}>Posts</button>
                            <button onClick={() => handleTabClick('projects')} className={activeTab === 'projects' ? 'active' : ''}>Projects</button>
                            <button onClick={() => handleTabClick('about')} className={activeTab === 'about' ? 'active' : ''}>About Me</button>
                        </div>
                        <div className="content-section">
                    
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Profile;