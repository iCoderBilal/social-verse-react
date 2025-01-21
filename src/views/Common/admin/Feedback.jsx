import React, { useEffect, useState } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import TableView from "../../../components/Common/TableView";
import axios from "axios";

// Header Model
const headerModel = [
    { key: 'user', label: 'User', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'feedback', label: 'Description', visible: true },
    { key: 'app_name', label: 'App Name', visible: true },
];

const Feedback = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [selectedAppName, setSelectedAppName] = useState('all');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();
    const pageSize = 30;

    useEffect(() => {
        const getProjectList = async () => {
            try {
                const response = await axios.get('/admin/project/list');
                setProjects(response.data.projects);
            } catch (error) {
                console.error("Error fetching project list:", error);
            }
        };

        getProjectList();
    }, []);

    useEffect(() => {
        fetchData(1, selectedAppName);
    }, [selectedAppName]);

    const fetchData = async (page, appName) => {
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
                    app_name: appName === 'all' ? undefined : appName,
                },
            });
            const fetchedData = response.data.feedbacks.feedbacks;

            if (fetchedData.length < pageSize) {
                setHasMoreData(false);
            }

            // Transform the data to match the table structure
            const transformedData = fetchedData.map(item => ({
                user: {
                    profile_picture_url: item.sender.profile_picture_url,
                    name: `${item.sender.first_name} ${item.sender.last_name}`
                },
                type: item.type === "F" ? "Feature" : "Bug",
                feedback: item.feedback,
                app_name: item.app_name,
                _original: item // Preserve original data for popup
            }));

            setData(prevData => [...prevData, ...transformedData]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = async (event) => {
        const value = event.target.value;
        setSelectedAppName(value);
        setData([]);
        setCurrentPage(1);
        setHasMoreData(true);
    };

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (!isLoading && hasMoreData && scrollTop + clientHeight >= scrollHeight - 10) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
    };

    // Filter header based on selected app name
    const visibleHeaders = headerModel.filter(header => 
        selectedAppName === 'all' ? true : header.key !== 'app_name'
    );

    return (
        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
            <div className="container" onScroll={handleScroll}>
                <div style={{ display: `${isSideNavOpen ? "block" : "none"} ` }} onClick={() => setIsSideNavOpen(false)} className="overlay"></div>
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
                                    <option key={project.toLowerCase()} value={project.toLowerCase()}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <TableView 
                            header={visibleHeaders}
                            data={data}
                            renderCustomCell={(key, value) => {
                                if (key === 'user') {
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img 
                                                src={value.profile_picture_url} 
                                                alt="" 
                                                style={{ 
                                                    width: '30px', 
                                                    height: '30px', 
                                                    borderRadius: '50%' 
                                                }} 
                                            />
                                            <span>{value.name}</span>
                                        </div>
                                    );
                                }
                                if (key === 'type') {
                                    return (
                                        <span style={{ 
                                            backgroundColor: value === "Feature" ? 'green' : 'red',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {value}
                                        </span>
                                    );
                                }
                                if (key === 'feedback') {
                                    return value && value.length > 20 ? value.substring(0, 20) + "..." : value;
                                }
                                return value;
                            }}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}

export default Feedback;
