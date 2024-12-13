import React, { useEffect, useState, useRef } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Posts() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loadError, setLoadError] = useState({});
    const [page, setPage] = useState(1);
    const [hasMoreData, sethasMoreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [dataUrl, setDataUrl] = useState('/feed');

    const handleVideoError = (id) => {
        setLoadError((prev) => ({
            ...prev,
            [id]: true,
        }));
    };

    const videoRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts(dataUrl, page);

    }, [page]);

    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
    };

    const handleCategoryChange = async (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        setPosts([]);
        setPage(1);
        sethasMoreData(true);

        let newDataUrl = categoryId == 0 ? '/feed' : `/categories/${categoryId}/posts`;
        let newPage = 1;

        setDataUrl(newDataUrl);
        fetchPosts(newDataUrl, newPage);
    };

    const fetchPosts = async (dataUrl, currentPage) => {
        if (isLoading) return;
        let pageSize = 20;

        try {
            setIsLoading(true);
            const response = await axios.get(dataUrl, {
                params: { page: currentPage, page_size: pageSize }, // Include pagination params
            });

            const fetchedPosts = response.data.posts;
            // console.log(fetchedPosts);
            
            setPosts((prevData) => [...prevData, ...fetchedPosts]);
            if (fetchedPosts.length < pageSize) sethasMoreData(false);

        } catch (error) {
            console.error("Error fetching posts:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostDelete = (id, name) => {
        if (window.confirm(`Delete this post from ${name} with ID: ${id} ?`)) {
            axios.delete(`/posts/${id}`)
                .then(() => {
                    setPosts((prevData) => prevData.filter((post) => post.id !== id));
                })
                .catch((err) => console.error("Error deleting post:", err));
        }
    };

    const toggleVideoPlayback = (index) => {
        const video = videoRefs.current[index];
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const categories = [
        { "id": 0, "name": "All Categories" },
        { "id": 2, "name": "Vible" },
        { "id": 3, "name": "The Igloo" },
        { "id": 4, "name": "E/ACC" },
        { "id": 5, "name": "Gratitube" },
        { "id": 6, "name": "InstaRama" },
        { "id": 7, "name": "Energy Feed" },
        { "id": 8, "name": "Bloom Scroll" },
        { "id": 9, "name": "Top Vibes" },
        { "id": 10, "name": "Digital Coffee" },
        { "id": 11, "name": "Stop Scrolling" },
        { "id": 12, "name": "Social Caffeine" },
        { "id": 13, "name": "Flic" },
        { "id": 14, "name": "Prime Program" },
        { "id": 15, "name": "Love" },
        { "id": 17, "name": "ExitVerse" },
        { "id": 18, "name": "Startup College" },
        { "id": 20, "name": "OvaDrive" },
        { "id": 21, "name": "Pumptok" },
        { "id": 22, "name": "SolTok" },
        { "id": 23, "name": "PepTok" },
        { "id": 25, "name": "Super Feed" },
        { "id": 26, "name": "Bot" }
    ];

    return (
        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
            <div className="container">
                <aside className="side-bar">
                    <MobileSideNavigation
                        isOpen={isSideNavOpen}
                        onClose={handleNavigationClick}
                    />
                </aside>
                <main className="main-container">
                    <div className="dashboard-container">

                        <div className="header-actions">
                            <button onClick={() => navigate(-1)} className="back-btn">Back</button>
                            <select onChange={handleCategoryChange} value={selectedCategory} className="select">
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="list">
                            {posts && posts.length > 0 ? (
                                <div className="posts-container">
                                    <div className="posts-grid">
                                        {posts.map((post, index) => (
                                            <div className="post-item" key={post.id}>
                                                {loadError[post.id] ? (
                                                    <div className="video-error"> Video not available </div>
                                                ) : (
                                                    <video
                                                        src={post.video_link}
                                                        ref={(el) => (videoRefs.current[index] = el)}
                                                        onClick={() => toggleVideoPlayback(index)}
                                                        onError={() => handleVideoError(post.id)}
                                                    />
                                                )}
                                                <button onClick={() => handlePostDelete(post.id, post.first_name + ' ' + post.last_name)} className="delete-btn">Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                    {hasMoreData && (
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            className="load-more-btn"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Loading..." : "Load More"}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <li>No data available</li>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Posts;