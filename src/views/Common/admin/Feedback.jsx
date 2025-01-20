import React, { useEffect, useState, useCallback } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Feedback = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [selectedAppName, setSelectedAppName] = useState('all');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();
    const pageSize = 30;

    useEffect(() => {
        fetchData(1, selectedAppName);
        getProjectList();
    }, [currentPage, selectedAppName]);

    const getProjectList = async () => {
        try {
            const response = await axios.get('/admin/project/list');
            setProjects(response.data.projects);
        } catch (error) {
            console.error("Error fetching project list:", error);
        }
    };

    const fetchData = useCallback(async (page, appName) => {
        if (isLoading || (currentPage === page && appName === selectedAppName && data.length > 0)) return;

        try {
            setIsLoading(true);
            if(appName === 'bloomscroll') {
                appName = 'bloom';
            }
            const response = await axios.get('/feedback', {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    app_name: appName,
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
    }, [currentPage, selectedAppName, data.length, isLoading]);

   
    const handleSelectChange = async (event) => {
        const value = event.target.value;
        const appName = value === 'all' ? undefined : value.toLowerCase();
        let newPage = 1;

        setSelectedAppName(value);
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
                                <option key={1} value='all'>All</option>
                                {projects.map(project => (
                                    <option key={project.toLowerCase()} value={project.toLowerCase()}>{project}</option>
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
                                                            <span onClick={() => toggleRow(index)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                                                                {expandedRowIndex === index ? '↑' : '↓'}
                                                            </span>
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
                                            <th>Description</th>
                                            {selectedAppName === 'all' && <th>App Name</th>}
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
                                                <td style={{ color: item.type === "F" ? 'green' : 'red' }}>
                                                    {item.type === "F" ? "Feature" : "Bug"}
                                                </td>
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
                                                {selectedAppName === 'all' && <td>{item.app_name}</td>}
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