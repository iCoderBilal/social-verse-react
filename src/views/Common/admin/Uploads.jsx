import React, { useState, useEffect } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import { FaTrash } from 'react-icons/fa';
import axios from "axios";

const Uploads = () => {
    const navigate = useNavigate();
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [linkList, setLinkList] = useState([]);
    const [taskId, setTaskId] = useState(null);
    const [progressData, setProgressData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [uploadInProgress, setUploadInProgress] = useState(false);
    const [showUploadButton, setShowUploadButton] = useState(false);
    const [uploadFailed, setUploadFailed] = useState(false);
    const [completedLinks, setCompletedLinks] = useState(new Set()); // Track completed links
    const [failedLinks, setFailedLinks] = useState(new Set()); // Track failed links
    const [failedLinksCount, setFailedLinksCount] = useState(0); // Track failed links count
    const [timer, setTimer] = useState(5); // Timer to clear screen after 5 seconds
    const [startTimer, setStartTimer] = useState(false); // Timer to clear screen after 5 seconds

    //use effect to handle timer count down 
    useEffect(() => {
        if (!startTimer) {
            return;
        }
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 0) {
                    clearInterval(interval);
                    handleClearData();
                    //reload the page after 5 seconds
                    window.location.reload();
                    return 5;
                }
                return prev - 1;
            }
            );
        }, 1000);
        return () => clearInterval(interval);
    }, [startTimer]);


    // Get today's date in the required format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    };

    // Get tomorrow's date in the required format
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    };

    const [selectedDate, setSelectedDate] = useState(getTomorrowDate());

    // Prevent selecting past dates (allow today and future dates)
    const handleDateChange = (e) => {
        const selected = e.target.value;
        const minDate = getTodayDate(); // Today's date

        if (selected < minDate) {
            setSelectedDate(minDate); // Reset to today's date if past date is selected
        } else {
            setSelectedDate(selected);
        }
    };

    useEffect(() => {
        setFailedLinksCount(failedLinks.size);
    }, [failedLinks]);




    // Poll API only once when taskId exists
    useEffect(() => {
        let interval;
        if (taskId) {
            fetchUploadProgress(); // Fetch progress immediately when taskId is set
            interval = setInterval(fetchUploadProgress, 1000); // Poll every second
        }
        return () => clearInterval(interval); // Clear interval on cleanup
    }, [taskId]);

    const fetchUploadProgress = async () => {
        try {
            const response = await axios.get(`https://texttovideo.empowerverse.org/api/v1/upload/progress/${taskId}`);
            if (response.data && response.data.urls) {
                setProgressData(response.data.urls);

               
                const urls = response.data.urls;
                // Create new sets for failed and completed links
                const newFailedLinks = new Set();
                const newCompletedLinks = new Set();

                Object.entries(urls).forEach(([url, data]) => {
                    if (data.progress === -1) {
                        newFailedLinks.add(url);
                        console.log("Failed links: ");
                        setFailedLinksCount(failedLinksCount + 1);
                    } else if (data.progress === 100) {
                        newCompletedLinks.add(url);
                    }
                });

                // Update the state with the new sets
                setFailedLinks(newFailedLinks);
                setCompletedLinks(newCompletedLinks);
                if (response.data.overall_progress === 100 || (response.data.status === "error" && response.data.overall_progress === 0)) {
                    setTaskId(null); // Clear taskId to stop further polling
                    setUploadInProgress(false); // Set uploadInProgress to false
                    if (failedLinksCount >= 1 || newFailedLinks.size >= 1) {
                        setUploadFailed(true); // Set uploadFailed if any link failed
                    } else {
                        setUploadFailed(false); // Reset uploadFailed if all links succeeded
                    }
                    Object.entries(urls).forEach(([url, data]) => {
                        if (data.progress === -1) {
                            setUploadFailed(true);
                            setUploadInProgress(false); // Set uploadInProgress to false
                            setShowUploadButton(false); // Hide upload button if any link failed
                            console.log("Failed links: ");
                        }
                    });
                    setUploadFailed(true);
                    setStartTimer(true);
                } else {
                    setUploadInProgress(true); // Set uploadInProgress to true
                }
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
            setUploadFailed(true); // Set uploadFailed on error
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                const isValidLink = validateLink(inputValue);
                if (isValidLink) {
                    addLinks(inputValue);
                    setInputValue('');
                    setShowUploadButton(true); // Show upload button only if valid link
                    setIsLoading(false);
                    setUploadInProgress(false);
                } else {
                    setShowUploadButton(false); // Hide upload button if invalid link
                }
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const isValidLink = validateLink(pastedText);
        if (isValidLink) {
            addLinks(pastedText);
            setInputValue('');
            setShowUploadButton(true); // Show upload button only if valid link
            setIsLoading(false);
            setUploadInProgress(false);
        } else {
            setShowUploadButton(false); // Hide upload button if invalid link
        }
    };

    // Function to validate if the input is a valid link
    const validateLink = (link) => {
        try {
            new URL(link); // Attempt to create a new URL object
            return true; // If successful, it's a valid link
        } catch (_) {
            return false; // If an error occurs, it's not a valid link
        }
    };

    const addLinks = (input) => {
        const potentialLinks = input.split(/(?=https:\/\/)/i) // Split based on "https://"
            .map(link => link.trim())
            .filter(link => link); // Filter out empty strings

        const validLinks = potentialLinks.filter(link => {
            try {
                new URL(link);
                return true;
            } catch (_) {
                return false;
            }
        });

        if (validLinks.length > 0) {
            // Filter out duplicates by creating a Set
            const newLinks = validLinks.filter(link => !linkList.includes(link));

            // Update the linkList state with unique links only
            setLinkList(prevList => [...new Set([...prevList, ...newLinks])]);

            if (potentialLinks.length !== validLinks.length) {
                console.error("Some links were invalid and were not added.");
            }
        }
    };

    const handleRemoveLink = (linkToRemove) => {
        setLinkList(prevList => {
            const updatedList = prevList.filter(link => link !== linkToRemove);
            setShowUploadButton(updatedList.length > 0); // Show button if links are left
            //hide when links are empty then no need to show upload button and clear button
            if (updatedList.length === 0) {
                setShowUploadButton(false);
                setUploadFailed(false);
            }
            return updatedList;
        });
    };

    const handleUpload = async () => {
        if (linkList.length === 0) {
            console.error("No links to upload.");
            return;
        }

        setUploadInProgress(true);
        setIsLoading(true);
        setShowUploadButton(false);
        setCompletedLinks(new Set()); // Reset completed links at the start
        setUploadFailed(false); // Reset the failed state before starting the upload

        try {
            const response = await axios.post('https://texttovideo.empowerverse.org/api/v1/upload/social-media', {
                date: selectedDate,
                urls: linkList.join(','),
            }, {
                headers: {
                    'Flic-Token': "flic_60e33b36cd6894257097de76e935115abb228bdacf1e8016b6fd6141522c8723",
                    'Content-Type': 'application/json',
                },
            });

            if (response.data && response.data.task_id) {
                setTaskId(response.data.task_id);
                console.log(`Upload started. Task ID: ${response.data.task_id}`);
                setUploadInProgress(true);
            } else {
                console.error("Failed to retrieve task ID.");
                setUploadFailed(true);
            }
        } catch (error) {
            console.error("Error uploading links:", error);
            setUploadFailed(true); // Set uploadFailed to true on error
        } finally {
            setIsLoading(false);
        }
    };


    // Function to clear all data
    const handleClearData = () => {
        setLinkList([]);
        setSelectedDate(getTomorrowDate());
        setInputValue('');
        setShowUploadButton(false);
        setUploadFailed(false);
        setUploadInProgress(false);

    };

    useEffect(() => {
        // Clear localStorage on component mount
        localStorage.removeItem('linkList');
        localStorage.removeItem('selectedDate');

        // Initialize state with default values
        setLinkList([]);
        setSelectedDate(getTomorrowDate());
        setInputValue('');
        setShowUploadButton(false);
        setUploadFailed(false);
        setUploadInProgress(false);
    }, []);

    // Save state to localStorage whenever linkList or selectedDate changes
    useEffect(() => {
        localStorage.setItem('linkList', JSON.stringify(linkList));
        localStorage.setItem('selectedDate', selectedDate);
    }, [linkList, selectedDate]);

    return (
        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
            <div className="container">
                <div
                    style={{ display: `${isSideNavOpen ? "block" : "none"}` }}
                    onClick={() => setIsSideNavOpen(false)}
                    className="overlay"
                />
                <aside className="side-bar">
                    <MobileSideNavigation
                        isOpen={isSideNavOpen}
                        onClose={() => setIsSideNavOpen(false)}
                    />
                </aside>
                <main className="main-container">
                    <div className="dashboard-container">
                        <div className="header-actions">
                            <button onClick={() => navigate("/admin/dashboard/daily-feed")} className="feed-btn">Daily Feed</button>
                        </div>

                        <div className="upload-container">
                            <div className="input-section">
                                <label>Select date for daily feed</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={getTodayDate()} // Prevents selecting past dates but allows today
                                />
                                <label>Add links</label>
                                <div className="input-with-button">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={handleInputKeyDown}
                                        onPaste={handlePaste}
                                        placeholder="Paste multiple links here"
                                    />
                                </div>
                                <small>
                                    Paste multiple links or press Enter to add them to your list
                                </small>
                            </div>

                            {linkList.length > 0 && (
                                <div className="link-list-section">
                                    <label>Links added *</label>
                                    <div className="link-list">
                                        {linkList.map((link, index) => {
                                            const progress = progressData[link]?.progress || 0;
                                            return (
                                                <div
                                                    key={index}
                                                    className="link-item"
                                                    style={{
                                                        position: "relative",
                                                        background: progress === -1
                                                            ? "#ff4d4d"
                                                            : `linear-gradient(to right, #4caf50 ${progress}%, #fff ${progress}%)`,
                                                        padding: "10px",
                                                        borderRadius: "5px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        transition: "background 0.5s ease",
                                                    }}
                                                >
                                                    <span>{link}</span>
                                                    <button
                                                        className="remove-button"
                                                        onClick={() => handleRemoveLink(link)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {uploadInProgress && (
                                        <img
                                            height={"80px"}
                                            src="loader.gif"
                                            alt="Loading..."
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                flexDirection: 'row-reverse',
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                            {showUploadButton && !uploadInProgress && (
                                <button onClick={handleUpload} className="upload-button">
                                    Upload Links
                                </button>
                            )}
                            {uploadFailed && !uploadInProgress && (
                                <button onClick={handleClearData} className="clear-button">
                                    Clearing screen in {timer} 
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Uploads;
