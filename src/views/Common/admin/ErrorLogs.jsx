import React, { useEffect, useState } from "react";
import Loader from "../../../components/Common/Loader";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Function to format date
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
};

function ErrorLogs({ dataUrl }) {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]); 
    const [selectedAppName, setSelectedAppName] = useState('all'); 

    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
        getProjectList(); 
        fetchData(currentPage, selectedAppName);
    }, [currentPage, isSideNavOpen, isMobileView, selectedAppName]); 

    const getCategories = async () => {
        const response = await axios.get('/categories?page=1&page_size=50');
        const sortedCategories = response.data.categories.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCategories);
    };

    // New function to fetch project list
    const getProjectList = async () => {
        try {
            const response = await axios.get('/admin/project/list');
            // let projectList = response.data.projects;
            setProjects(response.data.projects); // Set the fetched projects
        } catch (error) {
            console.error("Error fetching project list:", error);
        }
    };

    const handleSelectChange = async (event) => {
        const value = event.target.value;
        const appName = value.toLowerCase(); // Set appName to empty for "All"
        setSelectedAppName(appName);
        setData([]);
        setCurrentPage(1);
        setHasMoreData(true);
        fetchData(1, appName); // Fetch data for the selected app or all apps
    };

    const pageSize = 50;

    const fetchData = async (page, appName) => {
        if (isLoading || (currentPage === page && data.length > 0 && appName === selectedAppName)) return;

        try {
            setIsLoading(true);
            const response = await axios.get(dataUrl, {
                params: {
                    page: page,
                    page_size: pageSize,
                    app_name: appName
                },
            });
            const fetchedData = response.data.logs;

            if (fetchedData.length < pageSize) {
                setHasMoreData(false);
            }
            setData((prevData) => [...prevData, ...fetchedData]);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
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

    const handleFileNameClick = (item) => {
        console.log("File clicked:", item.file_name);
    };

    return (
        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
            <div className="container" onScroll={handleScroll}>
                <div style={{ display: `${isSideNavOpen ? 'block' : 'none'} ` }} onClick={() => setIsSideNavOpen(false)} className="overlay"></div>
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
                            <select onChange={handleSelectChange} className="select" value={selectedAppName}>
                                <option key={1} value='all'>All</option>
                                {projects.map(project => (
                                    <option key={project.toLowerCase()} value={project.toLowerCase()}>{project}</option>
                                ))}
                            </select>
                        </div>
                        <table className="error-logs-table">
                            <thead>
                                <tr>
                                    <th>Status Code</th>
                                    <th>Path</th>
                                    <th>Line</th>
                                    <th>Created At</th>
                                    {selectedAppName === 'all' && <th>App Name</th>} {/* Show App Name when 'All' is selected */}
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={index}>
                                            <td className="status-code" style={{ color: 'red'}}>{item.status_code}</td>
                                            <td>{item.path}</td>
                                            <td onClick={() => handleFileNameClick(item)} style={{ cursor: 'pointer', color: '#000' }}>{item.line}</td>
                                            <td>{formatDate(item.created_at)}</td>
                                            {selectedAppName === 'all' && <td>{item.app_name}</td>} {/* Show App Name when 'All' is selected */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={selectedAppName === 'all' ? 5 : 4}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="error-logs-card">
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <div key={index} className="log">
                                        <div className="log-header">
                                            <p className="header-item" style={{ color: 'red' }}>{item.status_code}</p>
                                            <p className="header-item">{item.path}</p>
                                            <p className="header-item">{item.line}</p>
                                            <p className="header-item">{formatDate(item.created_at)}</p>
                                            {selectedAppName === 'all' && <p className="header-item">{item.app_name}</p>} {/* Show App Name when 'All' is selected */}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No data available</div>
                            )}
                        </div>
                    </div>
                </main >
            </div >
        </>
    );
}

export default ErrorLogs;