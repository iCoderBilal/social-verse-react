import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import FlicToaster from '../../utils/FlicToaster';
import MobileTopNavigation from '../../components/Mobile/TopNavigation';
import MobileSideNavigation from '../../components/Mobile/SideNavigation';
import { useProfile, useMultipleSubverseMemberships } from '../../utils/hooks/useProfile';
import '../../styles/subverses.css';
import suggestedSubversesIcon from '../../images/suggested-arrow.png';

function Subverses(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { joinSubverse, leaveSubverse, memberships, profileData } = useProfile();
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1024);
    
    // Phase management
    const [currentPhase, setCurrentPhase] = useState(1); // 1: Topic selection, 2: Suggested subverses
    const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'joined'
    
    // Topic selection state
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [suggestedSubverses, setSuggestedSubverses] = useState([]);
    const [recommendedSubverses, setRecommendedSubverses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstSubversePosts, setFirstSubversePosts] = useState([]);
    const [topics, setTopics] = useState([]);
    const [topicsLoading, setTopicsLoading] = useState(true);
    
    // Modal state
    const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
    
    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleOpenInterestsModal = () => {
        setIsInterestsModalOpen(true);
    };

    const handleCloseInterestsModal = () => {
        setIsInterestsModalOpen(false);
    };

    // Fetch topics from API
    const fetchTopics = async () => {
        try {
            setTopicsLoading(true);
            const response = await axios.get('/onboarding/interests?app_name=empowerverse');
            
            if (response.data && response.data.interests) {
                setTopics(response.data.interests);
            } else {
                // Fallback to default topics if API fails
                setTopics([
                    'Authenticity', 'Mindfulness', 'Creator', 'Growth', 'Visuals', 
                    'Privacy', 'Jesus', 'Spirituality', 'Rama', 'Crypto'
                ]);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            // Fallback to default topics if API fails
            setTopics([
                'Authenticity', 'Mindfulness', 'Creator', 'Growth', 'Visuals', 
                'Privacy', 'Jesus', 'Spirituality', 'Rama', 'Crypto'
            ]);
        } finally {
            setTopicsLoading(false);
        }
    };

    // Fetch topics on component mount
    useEffect(() => {
        fetchTopics();
    }, []);

    // Handle window resize to update mobile view state
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Synchronize membership status when Redux state changes
    useEffect(() => {
        // Update recommended subverses with current membership status
        setRecommendedSubverses(prev => 
            prev.map(subverse => ({
                ...subverse,
                isJoined: isMemberOfSubverse(subverse.id)
            }))
        );
        
        // Update suggested subverses with current membership status
        setSuggestedSubverses(prev => 
            prev.map(subverse => ({
                ...subverse,
                isJoined: isMemberOfSubverse(subverse.id)
            }))
        );
    }, [memberships]);

    const handleTopicSelect = (topic) => {
        setSelectedTopics(prev => {
            if (prev.includes(topic)) {
                return prev.filter(t => t !== topic);
            } else if (prev.length < 10) {
                return [...prev, topic];
            }
            return prev;
        });
    };

    const handleEnterClick = async () => {
        if (selectedTopics.length < 3 || selectedTopics.length > 10) {
            return;
        }
        
        setLoading(true);
        try {
            // Convert array to comma-separated lowercase string
            const interestsString = selectedTopics.map(topic => topic.toLowerCase()).join(', ');
            
            const response = await axios.put('/onboarding/update', {
                interests: interestsString
            });

            console.log('Response:', response);

            if (response.data) {
                // Handle recommended subverses
                if (response.data.recommendedSubvrseIds) {
                    const recommended = response.data.recommendedSubvrseIds;
                    const recommendedWithMembership = updateSubversesWithMembershipStatus(recommended);
                    setRecommendedSubverses(recommendedWithMembership);
                    
                    // Extract posts from the first recommended subverse
                    if (recommended.length > 0 && recommended[0].posts) {
                        setFirstSubversePosts(recommended[0].posts);
                    }
                }
                
                // Handle suggested subverses
                if (response.data.suggestedSubvrseIds) {
                    const suggested = response.data.suggestedSubvrseIds;
                    const suggestedWithMembership = updateSubversesWithMembershipStatus(suggested);
                    setSuggestedSubverses(suggestedWithMembership);
                }
                
                setCurrentPhase(2);
                setIsInterestsModalOpen(false); // Close modal after successful selection
                FlicToaster.success("Subverses loaded successfully!");
            } else {
                FlicToaster.error("No subverses found. Please try again.");
            }
        } catch (error) {
            if (error.response?.data?.message) {
                FlicToaster.error(error.response.data.message);
            } else {
                FlicToaster.error("It's not you, it's us. We are sorry, something went wrong on our end.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoinSubverse = async (subverseId) => {
        // Find subverse data to pass to Redux
        const subverseData = [...recommendedSubverses, ...suggestedSubverses].find(s => s.id === subverseId);
        
        if (!subverseData) {
            FlicToaster.error("Subverse data not found");
            return;
        }

        const result = await joinSubverse(subverseId, subverseData);
        
        if (result.success) {
            FlicToaster.success(result.message);
            // Update local state to reflect the join
            updateSubverseJoinStatus(subverseId, true);
        } else {
            FlicToaster.error(result.message);
        }
    };

    const handleLeaveSubverse = async (subverseId) => {
        const result = await leaveSubverse(subverseId);
        
        if (result.success) {
            FlicToaster.success(result.message);
            // Update local state to reflect the leave
            updateSubverseJoinStatus(subverseId, false);
        } else {
            FlicToaster.error(result.message);
        }
    };

    const updateSubverseJoinStatus = (subverseId, isJoined) => {
        // Update recommended subverses
        setRecommendedSubverses(prev => 
            prev.map(subverse => 
                subverse.id === subverseId 
                    ? { ...subverse, isJoined }
                    : subverse
            )
        );
        
        // Update suggested subverses
        setSuggestedSubverses(prev => 
            prev.map(subverse => 
                subverse.id === subverseId 
                    ? { ...subverse, isJoined }
                    : subverse
            )
        );
    };

    // Function to check if user is member of a subverse
    const isMemberOfSubverse = (subverseId) => {
        return memberships.some(subverse => subverse.id === subverseId);
    };

    // Function to update subverses with membership status from Redux
    const updateSubversesWithMembershipStatus = (subverses) => {
        return subverses.map(subverse => ({
            ...subverse,
            isJoined: isMemberOfSubverse(subverse.id)
        }));
    };

    const handleVideoFullscreen = (videoElement) => {
        if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
        } else if (videoElement.webkitRequestFullscreen) {
            videoElement.webkitRequestFullscreen();
        } else if (videoElement.mozRequestFullScreen) {
            videoElement.mozRequestFullScreen();
        } else if (videoElement.msRequestFullscreen) {
            videoElement.msRequestFullscreen();
        }
    };

    return (
        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
            <div className="container">
                <div style={{display : `${isSideNavOpen ? 'block' : 'none'} `}} onClick={()=> setIsSideNavOpen(false)} className="overlay"></div>
                <aside className="side-bar">
                    <MobileSideNavigation
                        isOpen={isSideNavOpen}
                        onClose={handleNavigationClick}
                    />
                </aside>
                <div className="main-container">
                    <div className="subverses-container">
                        {/* Header */}
                        <div className="subverses-header">
                            <div className="subverses-header-left">
                              
                            <div>

                                    <div style={{display: 'flex', alignItems: 'center', gap: '0px'}}>
                                    {isMobileView && (
                                    <button className="back-arrow-button" onClick={handleBackClick}>
                                        <svg className="back-arrow-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                                <h1 className="subverses-title">Subverses</h1>
                                    </div>
                                {currentPhase === 1 && (
                                    <p className="subverses-subtitle">Welcome back, Alex Chen! Here's what's happening with your content.</p>
                                )}
                                </div>
                            </div>
                            <button className="create-button">
                                <svg className="create-button-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Create
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="subverses-tabs">
                            <button 
                                className={`tab ${activeTab === 'explore' ? 'active' : ''}`}
                                onClick={() => setActiveTab('explore')}
                            >
                                Explore Subverses
                            </button>
                            <button 
                                className={`tab ${activeTab === 'joined' ? 'active' : ''}`}
                                onClick={() => setActiveTab('joined')}
                            >
                                Joined Subverses
                            </button>
                        </div>

                        {/* Explore Subverses Tab Content */}
                        {activeTab === 'explore' && (
                            <>
                                {/* Mobile/iPad: Pick your Interests Button */}
                                {isMobileView && (
                                    <div className="pick-interests-container">
                                        <button 
                                            className="pick-interests-button"
                                            onClick={handleOpenInterestsModal}
                                            disabled={topicsLoading}
                                        >
                                            <span>
                                                {topicsLoading 
                                                    ? 'Loading topics...'
                                                    : selectedTopics.length > 0 
                                                        ? `Pick your Interests (${selectedTopics.length} selected)`
                                                        : 'Pick your Interests'
                                                }
                                            </span>
                                            {!topicsLoading && (
                                                <svg className="pick-interests-arrow" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Desktop: Topic Selection - Always visible */}
                                {!isMobileView && (
                                <div className="topic-tags-container">
                                    {topicsLoading ? (
                                        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Poppins' }}>
                                            Loading topics...
                                        </div>
                                    ) : (
                                        <div className="topic-tags">
                                            {topics.map((topic, index) => (
                                                <button
                                                    key={index}
                                                    className={`topic-tag ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                                                    onClick={() => handleTopicSelect(topic)}
                                                >
                                                    {topic}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="selection-row">
                                        <p className="selection-info">
                                            Select 3-10 topics to continue ({selectedTopics.length} selected)
                                        </p>
                                        
                                        <button 
                                            className="enter-button"
                                            disabled={selectedTopics.length < 3 || selectedTopics.length > 10 || loading}
                                            onClick={handleEnterClick}
                                        >
                                                {loading ? 'Loading...' : 'Explore'}
                                        </button>
                                    </div>
                                </div>
                                )}

                                {/* Recommended Subverses - Show after Enter is clicked */}
                                {currentPhase === 2 && recommendedSubverses.length > 0 && (
                                    <div className="recommended-subverses">
                                        <div className="recommended-header"> 
                                            <img src={suggestedSubversesIcon} alt="recommended subverses icon" /> 
                                            <h2 className="recommended-title">Recommended Subverses</h2>
                                        </div>

                                        {/* Mobile/iPad: Simple List Design */}
                                        {isMobileView ? (
                                            <div className="mobile-subverses-list">
                                                {recommendedSubverses.map((subverse) => (
                                                    <div key={subverse.id} className="mobile-subverse-item">
                                                        <div className="mobile-subverse-avatar">
                                                            <img 
                                                                src={subverse.image_url} 
                                                                alt={subverse.name}
                                                                className="mobile-avatar-image"
                                                            />
                                                        </div>
                                                        <div className="mobile-subverse-info">
                                                            <h3 className="mobile-subverse-name">{subverse.name}</h3>
                                                            <p className="mobile-subverse-description">{subverse.description}</p>
                                                        </div>
                                                        <button 
                                                            className={`mobile-join-button ${subverse.isJoined ? 'joined' : ''}`}
                                                            onClick={() => subverse.isJoined ? handleLeaveSubverse(subverse.id) : handleJoinSubverse(subverse.id)}
                                                        >
                                                            {subverse.isJoined ? 'Leave' : 'Join'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* Desktop: Original Grid Design */
                                            <>
                                                {/* Featured Subverse */}
                                                {recommendedSubverses[0] && (
                                                    <div className="featured-subverse">
                                                        <div className="featured-subverse-header">
                                                            <div className="featured-icon">
                                                                <img 
                                                                    src={recommendedSubverses[0].image_url} 
                                                                    alt={recommendedSubverses[0].name}
                                                                    className="subverse-icon-image"
                                                                />
                                                            </div>
                                                            <div className="featured-info">
                                                                <h3>{recommendedSubverses[0].name}</h3>
                                                                <p>{recommendedSubverses[0].description}</p>
                                                            </div>
                                                            <div className="featured-buttons">
                                                                <button 
                                                                    className={`featured-join-button ${recommendedSubverses[0].isJoined ? 'joined' : ''}`}
                                                                    onClick={() => recommendedSubverses[0].isJoined ? handleLeaveSubverse(recommendedSubverses[0].id) : handleJoinSubverse(recommendedSubverses[0].id)}
                                                                >
                                                                    {recommendedSubverses[0].isJoined ? 'Leave' : 'Join'}
                                                                </button>
                                                                <button 
                                                                    className="featured-arrow-button"
                                                                    onClick={() => handleJoinSubverse(recommendedSubverses[0].id)}
                                                                >
                                                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Videos from first subverse posts */}
                                                        {firstSubversePosts.length > 0 ? (
                                                            <>
                                                                {/* Desktop: 5 videos per row grid */}
                                                                <div className="desktop-video-grid">
                                                                    {firstSubversePosts.map((post, index) => (
                                                                        <div key={post.id} className="desktop-video-item">
                                                                            <video 
                                                                                src={post.video_link} 
                                                                                className="post-video"
                                                                                controls
                                                                                preload="metadata"
                                                                                poster={post.thumbnail_url}
                                                                                muted
                                                                                onClick={(e) => handleVideoFullscreen(e.target)}
                                                                                style={{ cursor: 'pointer' }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                
                                                                {/* Mobile: Slider */}
                                                                <div className="mobile-video-slider">
                                                                    <div className="mobile-video-slider-container">
                                                                        {firstSubversePosts.map((post, index) => (
                                                                            <div key={post.id} className="mobile-video-slide">
                                                                                <video 
                                                                                    src={post.video_link} 
                                                                                    className="post-video"
                                                                                    controls
                                                                                    preload="metadata"
                                                                                    poster={post.thumbnail_url}
                                                                                    muted
                                                                                    onClick={(e) => handleVideoFullscreen(e.target)}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div style={{fontFamily: 'Poppins'}}>No posts available to display</div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Other Recommended Subverses */}
                                                <div className="subverses-grid">
                                                    {recommendedSubverses.slice(1).map((subverse) => (
                                                        <div key={subverse.id} className="subverse-card">
                                                            <div className="subverse-card-header">
                                                                <div className="subverse-icon">
                                                                    <img 
                                                                        src={subverse.image_url} 
                                                                        alt={subverse.name}
                                                                        className="subverse-icon-image"
                                                                    />
                                                                </div>
                                                                <div className="subverse-card-info">
                                                                    <h3 className="subverse-name">{subverse.name}</h3>
                                                                    <p className="subverse-tagline">{subverse.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="subverse-buttons">
                                                                <button 
                                                                    className={`subverse-join-button ${subverse.isJoined ? 'joined' : ''}`}
                                                                    onClick={() => subverse.isJoined ? handleLeaveSubverse(subverse.id) : handleJoinSubverse(subverse.id)}
                                                                >
                                                                    {subverse.isJoined ? 'Leave' : 'Join'}
                                                                </button>
                                                                <button 
                                                                    className="subverse-arrow-button"
                                                                    onClick={() => handleJoinSubverse(subverse.id)}
                                                                >
                                                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Suggested Subverses - Show after Enter is clicked */}
                                {currentPhase === 2 && suggestedSubverses.length > 0 && (
                                    <div className="suggested-subverses">
                                        <div className="suggested-header"> 
                                            <img src={suggestedSubversesIcon} alt="suggested subverses icon" /> 
                                            <h2 className="suggested-title">Suggested Subverses</h2>
                                        </div>

                                        {/* Mobile/iPad: Simple List Design */}
                                        {isMobileView ? (
                                            <div className="mobile-subverses-list">
                                                {suggestedSubverses.map((subverse) => (
                                                    <div key={subverse.id} className="mobile-subverse-item">
                                                        <div className="mobile-subverse-avatar">
                                                            <img 
                                                                src={subverse.image_url} 
                                                                alt={subverse.name}
                                                                className="mobile-avatar-image"
                                                            />
                                                        </div>
                                                        <div className="mobile-subverse-info">
                                                            <h3 className="mobile-subverse-name">{subverse.name}</h3>
                                                            <p className="mobile-subverse-description">{subverse.description}</p>
                                                        </div>
                                                        <button 
                                                            className={`mobile-join-button ${subverse.isJoined ? 'joined' : ''}`}
                                                            onClick={() => subverse.isJoined ? handleLeaveSubverse(subverse.id) : handleJoinSubverse(subverse.id)}
                                                        >
                                                            {subverse.isJoined ? 'Leave' : 'Join'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* Desktop: Grid Design Only */
                                            <div className="subverses-grid">
                                                {suggestedSubverses.map((subverse) => (
                                                    <div key={subverse.id} className="subverse-card">
                                                        <div className="subverse-card-header">
                                                            <div className="subverse-icon">
                                                                <img 
                                                                    src={subverse.image_url} 
                                                                    alt={subverse.name}
                                                                    className="subverse-icon-image"
                                                                />
                                                            </div>
                                                            <div className="subverse-card-info">
                                                                <h3 className="subverse-name">{subverse.name}</h3>
                                                                <p className="subverse-tagline">{subverse.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="subverse-buttons">
                                                            <button 
                                                                className={`subverse-join-button ${subverse.isJoined ? 'joined' : ''}`}
                                                                onClick={() => subverse.isJoined ? handleLeaveSubverse(subverse.id) : handleJoinSubverse(subverse.id)}
                                                            >
                                                                {subverse.isJoined ? 'Leave' : 'Join'}
                                                            </button>
                                                            <button 
                                                                className="subverse-arrow-button"
                                                                onClick={() => subverse.isJoined ? handleLeaveSubverse(subverse.id) : handleJoinSubverse(subverse.id)}
                                                            >
                                                                <svg fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Joined Subverses Tab Content */}
                        {activeTab === 'joined' && (
                            <div className="joined-subverses">
                                <div className="joined-subverses-header">
                                    <h2 className="joined-subverses-title">Joined Subverses</h2>
                                    <p className="joined-subverses-subtitle">
                                        {memberships.length} subverses joined
                                    </p>
                                </div>
                                
                                {memberships.length > 0 ? (
                                    <div className="joined-subverses-list">
                                        {memberships.map((subverse) => (
                                            <div key={subverse.id} className="joined-subverse-item">
                                                <div className="joined-subverse-avatar">
                                                    <img 
                                                        src={subverse.image_url} 
                                                        alt={subverse.name}
                                                        className="joined-avatar-image"
                                                    />
                                                </div>
                                                <div className="joined-subverse-info">
                                                    <h3 className="joined-subverse-name">{subverse.name}</h3>
                                                    <p className="joined-subverse-description">{subverse.description}</p>
                                                </div>
                                                <button 
                                                    className="joined-subverse-arrow-button"
                                                    onClick={() => handleLeaveSubverse(subverse.id)}
                                                    title="Leave subverse"
                                                >
                                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-joined-subverses">
                                        <div className="no-joined-icon">
                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3>No joined subverses yet</h3>
                                        <p>Explore subverses and join communities that interest you!</p>
                                        <button 
                                            className="explore-subverses-button"
                                            onClick={() => setActiveTab('explore')}
                                        >
                                            Explore Subverses
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Interests Selection Modal */}
            {isInterestsModalOpen && (
                <div className="modal-overlay" onClick={handleCloseInterestsModal}>
                    <div className="interests-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Pick your Interests</h2>
                            <button className="modal-close-button" onClick={handleCloseInterestsModal}>
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <div className="modal-selection-info">
                                <p className="modal-selection-text">
                                    Select 3-10 topics ({selectedTopics.length} selected)
                                </p>
                            </div>
                            
                            <div className="modal-topic-tags">
                                {topicsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Poppins' }}>
                                        Loading topics...
                                    </div>
                                ) : (
                                    topics.map((topic, index) => (
                                        <button
                                            key={index}
                                            className={`modal-topic-tag ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                                            onClick={() => handleTopicSelect(topic)}
                                        >
                                            {topic}
                                        </button>
                                    ))
                                )}
                            </div>
                            
                            <div className="modal-actions">
                                <button 
                                    className="modal-explore-button"
                                    disabled={selectedTopics.length < 3 || selectedTopics.length > 10 || loading}
                                    onClick={handleEnterClick}
                                >
                                    {loading ? 'Loading...' : 'Explore'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Subverses;

