import React, { useState } from "react";
import MobileTopNavigation from "../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../components/Mobile/SideNavigation";
import axios from "axios";
import form_data from "form-data";

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
            const form = new FormData();
            form.append('prompt', videoPrompt);
            form.append('file_url', imageUrl);
            const response = await axios.post(
                'https://vidgencraft.com/api/generate-single-image-video/',
                form,
                {
                  headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb2Rld2l0aGFpc2hhQGdtYWlsLmNvbSIsInVzZXJfaWQiOiI4MiIsInR5cGUiOiJhY2Nlc3MiLCJleHAiOjE3NDk5MDExMDJ9.BIXV6A6tGHX3Axq9ZRepZGGCN5RU76UENtEuFNx_8ag'
                  }
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
                    <div style={{ display: 'flex', gap: 32, padding: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', minHeight: '100vh' }}>
                        {/* Left Column: Image Generation */}
                        <div className="dashboard-container" style={{ maxWidth: 600, flex: 1, padding: 32, marginBottom: 24 }}>
                            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#000', marginBottom: 4 }}>Create Image</h2>
                            <div style={{ marginBottom: 20, width: '100%' }}>
                                <label htmlFor="prompt-textarea" style={{ display: 'block', marginBottom: 6, color: '#000', fontWeight: 500, fontSize: 15 }}>
                                    Prompt for Image Generation*
                                </label>
                                <textarea
                                    id="prompt-textarea"
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    placeholder="e.g., subtle zoom in, character smiles, background clouds moving slowly..."
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: 16,
                                        borderRadius: 8,
                                        border: '1px solid #333',
                                        background: '#fff',
                                        color: '#000',
                                        outline: 'none',
                                        marginBottom: 10,
                                        boxSizing: 'border-box',
                                        resize: 'vertical',
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input
                                    type="number"
                                    value={width}
                                    min={1}
                                    onChange={e => setWidth(e.target.value)}
                                    placeholder="Width"
                                    style={{ width: 80, padding: 8, fontSize: 16, borderRadius: 8, border: '1px solid #333', background: '#fff', color: '#000', outline: 'none' }}
                                />
                                <input
                                    type="number"
                                    value={height}
                                    min={1}
                                    onChange={e => setHeight(e.target.value)}
                                    placeholder="Height"
                                    style={{ width: 80, padding: 8, fontSize: 16, borderRadius: 8, border: '1px solid #333', background: '#fff', color: '#000', outline: 'none' }}
                                />
                                <button
                                    onClick={handleGenerate}
                                    style={{ padding: '12px 24px', fontSize: 17, background: 'linear-gradient(90deg, #5f5fff 0%, #a259ff 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Generating...' : 'Generate Image'}
                                </button>
                            </div>
                            <label style={{ color: '#000', fontWeight: 500, fontSize: 16, marginBottom: 10, display: 'block' }}>Generated Image*</label>
                            <div style={{ border: '1.5px dashed #333', borderRadius: 16, padding: 24, background: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 340, minWidth: 340 }}>
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt="Generated" 
                                        style={{ 
                                            width: '100%', 
                                            maxWidth: 400, 
                                            borderRadius: 12, 
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }} 
                                    />
                                ) : (
                                    <div style={{ color: '#888', fontSize: 16 }}>No image generated yet.</div>
                                )}
                            </div>
                            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
                            {imageUrl && (
                                <div style={{ marginTop: 16 }}>
                                    <button 
                                        onClick={() => setShowVideoPrompt(true)}
                                        style={{ padding: '12px 24px', fontSize: 17, background: 'linear-gradient(90deg, #5f5fff 0%, #a259ff 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, marginBottom: 12, cursor: 'pointer' }}
                                    >
                                        Use Image for Generate Video
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Right Column: Video Generation - Only show when showVideoPrompt is true */}
                        {showVideoPrompt && (
                        <div className="dashboard-container" style={{ maxWidth: 600, flex: 1, padding: 32, marginBottom: 24 }}>
                            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#000', marginBottom: 4 }}>Create Video</h2>
                            <div style={{ marginBottom: 20, width: '100%' }}>
                                <label htmlFor="video-prompt-textarea" style={{ display: 'block', marginBottom: 6, color: '#000', fontWeight: 500, fontSize: 15 }}>
                                    Prompt for Video Generation*
                                </label>
                                <textarea
                                    id="video-prompt-textarea"
                                    value={videoPrompt}
                                    onChange={e => setVideoPrompt(e.target.value)}
                                    placeholder="e.g., subtle zoom in, character smiles, background clouds moving slowly..."
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: 16,
                                        borderRadius: 8,
                                        border: '1px solid #333',
                                        background: '#fff',
                                        color: '#000',
                                        outline: 'none',
                                        marginBottom: 10,
                                        boxSizing: 'border-box',
                                        resize: 'vertical',
                                    }}
                                />
                                <button
                                    onClick={handleGenerateVideo}
                                    style={{ padding: '12px 24px', fontSize: 17, background: 'linear-gradient(90deg, #5f5fff 0%, #a259ff 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, marginBottom: 12, cursor: 'pointer' }}
                                    disabled={isVideoLoading}
                                >
                                    {isVideoLoading ? 'Generating Video...' : 'Generate Video'}
                                </button>
                                {videoError && <div style={{ color: 'red', marginTop: 8 }}>{videoError}</div>}
                            </div>
                            <label style={{ color: '#000', fontWeight: 500, fontSize: 16, marginBottom: 10, display: 'block' }}>Generated Video*</label>
                            <div style={{ border: '1.5px solid #222', borderRadius: 16, background: '#fff', padding: 32, minHeight: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                {videoUrl ? (
                                    <div style={{ marginTop: 0, width: '100%' }}>
                                        <video controls style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)' }}>
                                            <source src={videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ) : (
                                    <div style={{ color: '#888', textAlign: 'center', width: '100%' }}>
                                        <div style={{ fontSize: 48, marginBottom: 12 }}>
                                            <svg width="48" height="48" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3V9z"/></svg>
                                        </div>
                                        Generated video will appear here.
                                    </div>
                                )}
                            </div>
                        </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ImageGenerator; 