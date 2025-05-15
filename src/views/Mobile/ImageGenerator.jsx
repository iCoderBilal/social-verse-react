import React, { useState } from "react";
import MobileTopNavigation from "../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../components/Mobile/SideNavigation";
import axios from "axios";

const ImageGenerator = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [width, setWidth] = useState(1280);
    const [height, setHeight] = useState(720);
    const [showVideoPrompt, setShowVideoPrompt] = useState(false);
    const [videoPrompt, setVideoPrompt] = useState("");
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoError, setVideoError] = useState("");

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError("");
        setImageUrl("");
        try {
            // Construct the API URL
            const encodedPrompt = encodeURIComponent(prompt);
            const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true`;
            setImageUrl(url);
        } catch (err) {
            setError("Failed to generate image.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!videoPrompt.trim() || !imageUrl) return;
        setIsVideoLoading(true);
        setVideoError("");
        setVideoUrl("");
        try {
            const response = await axios.post(
                "https://vidgencraft.com/api/upload_and_generate/",
                {
                    file_url: imageUrl,
                    prompt: videoPrompt
                }
            );
            // Assuming the API returns { video_url: "..." }
            setVideoUrl(response.data.video_url);
        } catch (err) {
            setVideoError("Failed to generate video.");
        } finally {
            setIsVideoLoading(false);
        }
    };

    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
    };

    return (
        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
            <div className="container">
                <div style={{ display: `${isSideNavOpen ? "block" : "none"}` }} onClick={() => setIsSideNavOpen(false)} className="overlay"></div>
                <aside className="side-bar">
                    <MobileSideNavigation
                        isOpen={isSideNavOpen}
                        onClose={handleNavigationClick}
                    />
                </aside>
                <main className="main-container">
                    <div className="dashboard-container">
                        <h2>Image Generator</h2>
                        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input
                                type="text"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="Enter your prompt..."
                                style={{ width: '40%', padding: 8, fontSize: 16 }}
                            />
                            <input
                                type="number"
                                value={width}
                                min={1}
                                onChange={e => setWidth(e.target.value)}
                                placeholder="Width"
                                style={{ width: 80, padding: 8, fontSize: 16 }}
                            />
                            <input
                                type="number"
                                value={height}
                                min={1}
                                onChange={e => setHeight(e.target.value)}
                                placeholder="Height"
                                style={{ width: 80, padding: 8, fontSize: 16 }}
                            />
                            <button
                                onClick={handleGenerate}
                                style={{ padding: '8px 16px', fontSize: 16 }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Generating...' : 'Generate Image'}
                            </button>
                        </div>
                        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
                        {imageUrl && (
                            <div style={{ marginTop: 20 }}>
                                <img 
                                    src={imageUrl} 
                                    alt="Generated" 
                                    style={{ 
                                        width: width + 'px', 
                                        height: height + 'px', 
                                        maxWidth: '100%', 
                                        borderRadius: 8, 
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }} 
                                />
                                <div style={{ marginTop: 16 }}>
                                    <button 
                                        onClick={() => setShowVideoPrompt(v => !v)}
                                        style={{ padding: '8px 16px', fontSize: 16 }}
                                    >
                                        Use Image for Generate Video
                                    </button>
                                </div>
                                {showVideoPrompt && (
                                    <div style={{ marginTop: 16 }}>
                                        <textarea
                                            value={videoPrompt}
                                            onChange={e => setVideoPrompt(e.target.value)}
                                            placeholder="Enter your prompt for video generation..."
                                            rows={3}
                                            style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 8 }}
                                        />
                                        <button
                                            onClick={handleGenerateVideo}
                                            style={{ padding: '8px 16px', fontSize: 16 }}
                                            disabled={isVideoLoading}
                                        >
                                            {isVideoLoading ? 'Generating Video...' : 'Generate Video'}
                                        </button>
                                        {videoError && <div style={{ color: 'red', marginTop: 8 }}>{videoError}</div>}
                                    </div>
                                )}
                                {videoUrl && (
                                    <div style={{ marginTop: 20 }}>
                                        <video controls style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                            <source src={videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ImageGenerator; 