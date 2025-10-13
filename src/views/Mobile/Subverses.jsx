import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import MobileTopNavigation from '../../components/Mobile/TopNavigation';
import MobileSideNavigation from '../../components/Mobile/SideNavigation';
import '../../styles/subverses.css';

function Subverses(props) {
    const dispatch = useDispatch();
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    
    // Phase management
    const [currentPhase, setCurrentPhase] = useState(1); // 1: Topic selection, 2: Suggested subverses
    
    // Topic selection state
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [suggestedSubverses, setSuggestedSubverses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Available topics
    const topics = [
        'Authenticity', 'Mindfulness', 'Creator', 'Growth', 'Visuals', 
        'Privacy', 'Jesus', 'Spirituality', 'Rama'
    ];
    
    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
    };

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
            // TODO: Replace with actual API call
            // const response = await fetch('/onboarding/update', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ selectedTopics })
            // });
            // const data = await response.json();
            // setSuggestedSubverses(data.suggestedSubvrseIds);
            
            // Mock data for now
            setTimeout(() => {
                setSuggestedSubverses([
                    {
                        id: 1,
                        name: 'Vible',
                        tagline: 'All the best vibes!',
                        icon: 'V',
                        isFeatured: true,
                        videos: [
                            { id: 1, thumbnail: '/api/placeholder/120/160' },
                            { id: 2, thumbnail: '/api/placeholder/120/160' },
                            { id: 3, thumbnail: '/api/placeholder/120/160' },
                            { id: 4, thumbnail: '/api/placeholder/120/160' },
                            { id: 5, thumbnail: '/api/placeholder/120/160' }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Bloom Scroll',
                        tagline: 'All the best vibes!',
                        icon: 'B'
                    },
                    {
                        id: 3,
                        name: 'Flic',
                        tagline: 'All the best vibes!',
                        icon: 'F'
                    },
                    {
                        id: 4,
                        name: 'SolTok',
                        tagline: 'All the best vibes!',
                        icon: 'S'
                    }
                ]);
                setCurrentPhase(2);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching suggested subverses:', error);
            setLoading(false);
        }
    };

    const handleJoinSubverse = (subverseId) => {
        console.log('Joining subverse:', subverseId);
        // TODO: Implement join functionality
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
                            <div>
                                <h1 className="subverses-title">Subverses</h1>
                                {currentPhase === 1 && (
                                    <p className="subverses-subtitle">Welcome back, Alex Chen! Here's what's happening with your content.</p>
                                )}
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
                            <button className={`tab ${currentPhase === 1 ? 'active' : ''}`}>
                                Explore Subverses
                            </button>
                            <button className={`tab ${currentPhase === 2 ? 'active' : ''}`}>
                                Joined Subverses
                            </button>
                        </div>

                        {/* Phase 1: Topic Selection */}
                        {currentPhase === 1 && (
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
                                
                                <p className="selection-info">
                                    Select 3-10 topics to continue ({selectedTopics.length} selected)
                                </p>
                                
                                <button 
                                    className="enter-button"
                                    disabled={selectedTopics.length < 3 || selectedTopics.length > 10 || loading}
                                    onClick={handleEnterClick}
                                >
                                    {loading ? 'Loading...' : 'Enter'}
                                </button>
                            </div>
                        )}

                        {/* Phase 2: Suggested Subverses */}
                        {currentPhase === 2 && suggestedSubverses.length > 0 && (
                            <div className="suggested-subverses">
                                <div className="suggested-header">
                                    <h2 className="suggested-title">Suggested Subverses</h2>
                                    <svg className="suggested-arrow" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {/* Featured Subverse */}
                                {suggestedSubverses[0] && suggestedSubverses[0].isFeatured && (
                                    <div className="featured-subverse">
                                        <div className="featured-subverse-header">
                                            <div className="featured-icon">
                                                {suggestedSubverses[0].icon}
                                            </div>
                                            <div className="featured-info">
                                                <h3>{suggestedSubverses[0].name}</h3>
                                                <p>{suggestedSubverses[0].tagline}</p>
                                            </div>
                                            <button 
                                                className="featured-join-button"
                                                onClick={() => handleJoinSubverse(suggestedSubverses[0].id)}
                                            >
                                                Join
                                                <svg className="featured-arrow" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        {/* Video Thumbnails */}
                                        {suggestedSubverses[0].videos && (
                                            <div className="video-thumbnails">
                                                {suggestedSubverses[0].videos.map((video, index) => (
                                                    <div key={index} className="video-thumbnail">
                                                        <img src={video.thumbnail} alt={`Video ${index + 1}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Simple Subverse Cards Grid */}
                                <div className="subverses-grid">
                                    {suggestedSubverses.slice(1).map((subverse) => (
                                        <div key={subverse.id} className="subverse-card">
                                            <div className="subverse-icon">
                                                {subverse.icon}
                                            </div>
                                            <h3 className="subverse-name">{subverse.name}</h3>
                                            <p className="subverse-tagline">{subverse.tagline}</p>
                                            <button 
                                                className="subverse-join-button"
                                                onClick={() => handleJoinSubverse(subverse.id)}
                                            >
                                                Join
                                                <svg className="subverse-arrow" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Subverses;

