import React, { useEffect, useState, useCallback } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EMPOWERVERSE = 'empowerverse';
const VIBLE = 'vible';
const SOLTOK = 'soltok';
const FLIC = 'flic';
const ETHTOK = 'ethtok';
const FUSETRENDZ = 'fusetrendz';
const BLOOM = 'bloom';
const BLOOMSCROLL = 'bloomscroll';

function Feedback() {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [selectedAppName, setSelectedAppName] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    const navigate = useNavigate();

    const pageSize = 30;

    const appOptions = [
        { value: 'all', label: 'All' },
        { value: EMPOWERVERSE, label: EMPOWERVERSE },
        { value: VIBLE, label: VIBLE },
        { value: SOLTOK, label: SOLTOK },
        { value: FLIC, label: FLIC },
        { value: ETHTOK, label: ETHTOK },
        { value: FUSETRENDZ, label: FUSETRENDZ },
        { value: BLOOM, label: BLOOM },
        { value: BLOOMSCROLL, label: BLOOMSCROLL },
    ];

    const fetchData = useCallback(async (page, appName) => {
        if (currentPage === page && appName === selectedAppName && data.length > 0) return;

        try {
            setIsLoading(true);
            if(appName === 'bloomscroll') {
                appName = 'bloom';
            }
            const response = await axios.get('/feedback', {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    app_name: appName || undefined
                },
            });
            const fetchedData = response.data.feedbacks.feedbacks;

            if (fetchedData.length < pageSize) {
                setHasMoreData(false);
            }
            setData((prevData) => [...prevData, ...fetchedData]);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, selectedAppName, data.length]);

    useEffect(() => {
        fetchData(1, selectedAppName);
    }, [currentPage, selectedAppName, fetchData]);

    const handleSelectChange = async (event) => {
        const value = event.target.value;
        const appName = value === 'all' ? '' : value.split(' ').join('').toLowerCase();
        let newPage = 1;

        setSelectedAppName(appName);
        setData([]);
        setCurrentPage(newPage);
        setHasMoreData(true);

        fetchData(newPage, appName);
    };

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (!isLoading && hasMoreData && scrollTop + clientHeight >= scrollHeight - 10) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
    };

    const toggleRow = (index) => {
        setExpandedRowIndex(expandedRowIndex === index ? null : index);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                            <select onChange={handleSelectChange} className="select" value={selectedAppName || 'all'}>
                                {appOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="table-container" onScroll={handleScroll}>
                            {isMobileView ? (
                                <div className="feedback-cards">
                                    {data.map((item, index) => (
                                        <div key={index} className="feedback-card">
                                            <div className="feedback-header">
                                                <div className="user-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <img className="sender-image" src={item.sender.profile_picture_url} alt="" />
                                                    <span className="sender-name">{item.sender.first_name + ' ' + item.sender.last_name}</span>
                                                </div>
                                                <span className="feedback-type" style={{ color: item.type === "F" ? 'green' : 'red' }}>
                                                    {item.type === "F" ? "Feature" : "Bug"}
                                                </span>
                                            </div>
                                            <div className="feedback-description" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ flex: 1, marginRight: '10px' }}>
                                                    {item.feedback.length > 100 ? (
                                                        <>
                                                            {expandedRowIndex === index ? item.feedback : item.feedback.substring(0, 100) + '...'}
                                                            {expandedRowIndex === index ? (
                                                                <span onClick={() => toggleRow(index)} style={{ cursor: 'pointer', marginLeft: '10px' }}>↑</span>
                                                            ) : (
                                                                <span onClick={() => toggleRow(index)} style={{ cursor: 'pointer', marginLeft: '10px' }}>↓</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        item.feedback
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <table className="feedback-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Type</th>
                                            {selectedAppName === 'empowerverse' && <th>App Name</th>}
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td className="feedback-user-info">
                                                    <div className="user-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <img className="sender-image" src={item.sender.profile_picture_url} alt="" />
                                                        <span className="sender-name">{item.sender.first_name + ' ' + item.sender.last_name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ color: item.type === "F" ? 'black' : 'red' }}>
                                                    {item.type === "F" ? "Feedback" : "Bug"}
                                                </td>
                                                {selectedAppName === 'empowerverse' && <td>{item.app_name}</td>}
                                                <td>
                                                    {item.feedback.length > 100 ? (
                                                        <>
                                                            {expandedRowIndex === index ? item.feedback : item.feedback.substring(0, 100) + '...'}
                                                            <span onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
                                                                {expandedRowIndex === index ? '↑' : '↓'}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        item.feedback
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Feedback;