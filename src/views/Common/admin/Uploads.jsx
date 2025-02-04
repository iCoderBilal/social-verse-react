import React, { useState } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import { FaTrash } from 'react-icons/fa';
import axios from "axios";

const Uploads = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [linkList, setLinkList] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [taskId, setTaskId] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addLinks(inputValue);
                setInputValue('');
            }
        }
    };

    const handleSubmit = () => {
        if (inputValue.trim()) {
            addLinks(inputValue);
            setInputValue('');
        }
    };

    const addLinks = (input) => {
        const initialSplit = input.split(',');

        const potentialLinks = initialSplit
            .map(chunk => {
                chunk = chunk.trim();

                if (chunk.toLowerCase().indexOf('https://') !== chunk.toLowerCase().lastIndexOf('https://')) {
                    return chunk.split(/(https:\/\/)/i)
                        .filter(part => part)
                        .map((part, index, array) => {
                            if (part.toLowerCase() === 'https://') {
                                return index + 1 < array.length ? part + array[index + 1] : part;
                            }
                            if (index > 0 && array[index - 1].toLowerCase() === 'https://') {
                                return null;
                            }
                            return part.toLowerCase().startsWith('https://') ? part : `https://${part}`;
                        })
                        .filter(Boolean);
                }

                return [chunk.toLowerCase().startsWith('https://') ? chunk : `https://${chunk}`];
            })
            .flat()
            .filter(link => link.trim());

        const validLinks = potentialLinks.filter(link => {
            try {
                new URL(link);
                return true;
            } catch (_) {
                return false;
            }
        });

        if (validLinks.length > 0) {
            const newLinks = validLinks.filter(link =>
                !linkList.includes(link)
            );

            setLinkList(prevList => [...prevList, ...newLinks]);

            if (potentialLinks.length !== validLinks.length) {
                alert("Some links were invalid and were not added.");
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        addLinks(pastedText);
        setInputValue('');
    };

    const handleRemoveLink = (linkToRemove) => {
        setLinkList(prevList =>
            prevList.filter(link => link !== linkToRemove)
        );
    };


    const handleUpload = async () => {
        if (linkList.length === 0) {
            alert("No links to upload.");
            return;
        }


        try {
            const response = await axios.post('https://texttovideo.empowerverse.org/api/v1/upload/social-media', {
                date: selectedDate,
                urls: linkList.join(','),
            }, {
                headers: {
                    'Flic-Token': "flic_ea7c78247d2ac6cfa2ff6cf328e75772343f953b1cbe5795e9da2040918d4b51",
                    'Content-Type': 'application/json',
                },
            });

            if (response.data && response.data.task_id) {
                setTaskId(response.data.task_id);
                console.log("Task ID:", response.data.task_id);
                alert(`Upload started. Task ID: ${response.data.task_id}`);
            } else {
                alert("Failed to retrieve task ID.");
            }
        } catch (error) {
            console.error("Error uploading links:", error);
            if (error.response && error.response.data) {
                alert(`Failed to upload links: ${error.response.data.detail || "Unknown error."}`);
            } else {
                alert("Failed to upload links.");
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
                            <button onClick={() => navigate(-1)} className="back-btn">Back</button>
                        </div>

                        <div className="upload-container">
                            {/* <div className="date-picker-section">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div> */}
                            <div className="input-section">
                                <label>Select date for daily feed</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                                <label>Add links</label>
                                <div className="input-with-button">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={handleInputKeyDown}
                                        onPaste={handlePaste}
                                        placeholder="https://example.com https://example2.com"
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
                                        {linkList.map((link, index) => (
                                            <div key={index} className="link-item">
                                                <span>{link}</span>
                                                <button
                                                    className="remove-button"
                                                    onClick={() => handleRemoveLink(link)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {linkList.length >0 && (
                                        <button
                                            className="upload-button"
                                            onClick={handleUpload}
                                        >
                                            Upload Links
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Uploads;
