import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import FlicToaster from '../../utils/FlicToaster';
import MobileTopNavigation from '../../components/Mobile/TopNavigation';
import MobileSideNavigation from '../../components/Mobile/SideNavigation';
import '../../styles/subverses.css';
import suggestedSubversesIcon from '../../images/suggested-arrow.png';

function Subverses(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1024);
    
    // Phase management
    const [currentPhase, setCurrentPhase] = useState(1); // 1: Topic selection, 2: Suggested subverses
    const [activeTab, setActiveTab] = useState('explore'); // 'explore' or 'joined'
    
    // Topic selection state
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [suggestedSubverses, setSuggestedSubverses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstSubversePosts, setFirstSubversePosts] = useState([]);
    
    // Modal state
    const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
    
    // Available topics
    const topics = [
        'Authenticity', 'Mindfulness', 'Creator', 'Growth', 'Visuals', 
        'Privacy', 'Jesus', 'Spirituality', 'Rama', 'Crypto'
    ];
    
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

    // Handle window resize to update mobile view state
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            
            if (response.data && response.data.suggestedSubvrseIds) {
                const subverses = response.data.suggestedSubvrseIds;
                console.log('Received subverses:', subverses);
                setSuggestedSubverses(subverses);
                
                // Extract posts from the first subverse
                if (subverses.length > 0 && subverses[0].posts) {
                    console.log('First subverse posts:', subverses[0].posts);
                    console.log('First subverse:', subverses[0]);
                    setFirstSubversePosts(subverses[0].posts);
                } else {
                    console.log('No posts found in first subverse');
                    console.log('First subverse data:', subverses[0]);
                }
                
                setCurrentPhase(2);
                setIsInterestsModalOpen(false); // Close modal after successful selection
                FlicToaster.success("Suggested subverses loaded successfully!");
            } else {
                console.error('No suggested subverses data received');
                console.log('Response data:', response.data);
                FlicToaster.error("No suggested subverses found. Please try again.");
            }
        } catch (error) {
            console.error('Error fetching suggested subverses:', error);
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
        try {
            // TODO: Replace with actual API call when endpoint is available
            // const response = await axios.post(`/subverses/${subverseId}/join`);
            // if (response.data.status === 'success') {
            //     FlicToaster.success(`Successfully joined subverse!`);
            // } else {
            //     FlicToaster.error(response.data.message || 'Failed to join subverse');
            // }
            
            // Temporary success message for now
            FlicToaster.success(`Successfully joined subverse!`);
        } catch (error) {
            console.error('Error joining subverse:', error);
            if (error.response?.data?.message) {
                FlicToaster.error(error.response.data.message);
            } else {
                FlicToaster.error("Failed to join subverse. Please try again.");
            }
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
                                        >
                                            <span>
                                                {selectedTopics.length > 0 
                                                    ? `Pick your Interests (${selectedTopics.length} selected)`
                                                    : 'Pick your Interests'
                                                }
                                            </span>
                                            <svg className="pick-interests-arrow" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {/* Desktop: Topic Selection - Always visible */}
                                {!isMobileView && (
                                <div className="topic-tags-container">
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
                                                            className="mobile-join-button"
                                                            onClick={() => handleJoinSubverse(subverse.id)}
                                                        >
                                                            Join
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* Desktop: Original Grid Design */
                                            <>
                                                {/* Featured Subverse */}
                                                {suggestedSubverses[0] && (
                                                    <div className="featured-subverse">
                                                <div className="featured-subverse-header">
                                                    <div className="featured-icon">
                                                        <img 
                                                            src={suggestedSubverses[0].image_url} 
                                                            alt={suggestedSubverses[0].name}
                                                            className="subverse-icon-image"
                                                        />
                                                    </div>
                                                    <div className="featured-info">
                                                        <h3>{suggestedSubverses[0].name}</h3>
                                                        <p>{suggestedSubverses[0].description}</p>
                                                    </div>
                                                    <div className="featured-buttons">
                                                        <button 
                                                            className="featured-join-button"
                                                            onClick={() => handleJoinSubverse(suggestedSubverses[0].id)}
                                                        >
                                                            Join
                                                        </button>
                                                        <button 
                                                            className="featured-arrow-button"
                                                            onClick={() => handleJoinSubverse(suggestedSubverses[0].id)}
                                                        >
                                                            <svg fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Videos from first subverse posts */}
                                                {firstSubversePosts.length > 0 ? (
                                                    <div className="video-thumbnails">
                                                        {console.log('Rendering videos for posts:', firstSubversePosts)}
                                                        {firstSubversePosts.map((post, index) => {
                                                            console.log(`Post ${index}:`, post);
                                                            console.log(`Video link for post ${index}:`, post.video_link);
                                                            return (
                                                                <div key={post.id} className="video-thumbnail">
                                                                    <video 
                                                                        src={post.video_link} 
                                                                        className="post-video"
                                                                        controls
                                                                        preload="metadata"
                                                                        poster={post.thumbnail_url}
                                                                        muted
                                                                        onError={(e) => console.error('Video error for post', post.id, ':', e)}
                                                                        onLoadStart={() => console.log('Video loading started for post:', post.id)}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div style={{fontFamily: 'Poppins'}}>No posts available to display</div>
                                                )}
                                            </div>
                                        )}

                                        {/* Subverse Cards Grid */}
                                        <div className="subverses-grid">
                                            {suggestedSubverses.slice(1).map((subverse) => (
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
                                                            className="subverse-join-button"
                                                            onClick={() => handleJoinSubverse(subverse.id)}
                                                        >
                                                            Join
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
                            </>
                        )}

                        {/* Joined Subverses Tab Content */}
                        {activeTab === 'joined' && (
                            <div className="joined-subverses">
                                <p>Joined Subverses content will be implemented here.</p>
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
                                {topics.map((topic, index) => (
                                    <button
                                        key={index}
                                        className={`modal-topic-tag ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                                        onClick={() => handleTopicSelect(topic)}
                                    >
                                        {topic}
                                    </button>
                                ))}
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

