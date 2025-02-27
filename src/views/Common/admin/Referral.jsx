import React, { useEffect, useState } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import TableView from "../../../components/Common/TableView";
import axios from "axios";

// Header Model for Referral table
const headerModel = [
    { key: 'user', label: 'User', visible: true },
    { key: 'referral_count', label: 'Referral Count', visible: true },
    { key: 'referral_point', label: 'Points', visible: true },
    { key: 'app_name', label: 'App Name', visible: true },
    { key: 'created_at', label: 'Created At', visible: true },
    { key: 'action', label: 'Action', visible: true } 
];

const Referral = () => {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [selectedAppName, setSelectedAppName] = useState('vible');
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
            const response = await axios.get('/limited/referral/requested', {
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    app_name: appName === 'all' ? undefined : appName,
                },
            });
            const fetchedData = response.data.referrals;

            if (fetchedData.length < pageSize) {
                setHasMoreData(false);
            }

            // Transform the data to match the table structure
            const transformedData = fetchedData.map(item => ({
                user: {
                    profile_picture_url: item.user.profile_url,
                    name: item.user.username,
                    username: item.user.username
                },
                referral_count: item.referralCount,
                referral_point: item.referralPoint,
                app_name: item.appName,
                created_at: new Date(item.createdAt).toLocaleDateString(),
                action: item  // Pass the entire item to action
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

    const handleApproveClick = async (row) => {
        try {
            console.log('Row data:', row);
            
            // Check if we have the required data
            if (!row || !row.user || !row.user.username || !row.app_name) {
                console.error("Invalid row data:", row);
                alert("Invalid data. Cannot approve referral.");
                return;
            }

            const username = row.user.username;
            const appName = row.app_name.toLowerCase(); // Ensure app_name is lowercase

            console.log('Sending request with:', { username, app_name: appName });

            const response = await axios.get('/limited/referral/re-generate', {
                params: {
                    username: username,
                    app_name: appName
                }
            });

            console.log('API Response:', response.data);

            if (response.data.status === 'success') {
                // Remove the approved referral from the table
                setData(prevData => prevData.filter(item => 
                    !(item.user.username === username && 
                      item.app_name.toLowerCase() === appName)
                ));
                alert('Referral approved successfully');
            } else {
                throw new Error(response.data.message || 'Failed to approve referral');
            }
        } catch (error) {
            console.error("Error during approval:", error);
            console.error("Error response:", error.response?.data);
            
            if (error.response?.status === 403) {
                alert('Unauthorized: You do not have permission to approve referrals');
            } else if (error.response?.status === 404) {
                alert('User or referral not found. Please refresh the page and try again.');
            } else {
                alert(error.response?.data?.message || 'Failed to approve referral. Please try again.');
            }
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
                            header={headerModel}
                            data={data}
                            disableRowClick={true}
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
                                if (key === 'action') {
                                    return (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleApproveClick({
                                                    user: {
                                                        username: value.user.username
                                                    },
                                                    app_name: value.appName.toLowerCase()
                                                });
                                            }}
                                            style={{
                                                backgroundColor: '#008000',
                                                color: 'white',
                                                padding: '8px 16px',
                                                borderRadius: '4px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#0e5d0e'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = '#008000'}
                                        >
                                            Approve
                                        </button>
                                    );
                                }
                                return value;
                            }}
                        />
                    </div>
                </main>
            </div>

            {/* CSS Styles */}
            <style>
                {`
                    .approve-btn {
                        background-color: green;
                        color: white;
                        padding: 8px 12px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    }

                    .approve-btn:hover {
                        background-color: darkgreen;
                    }
                `}
            </style>
        </>
    );
}

export default Referral;
