import React, { useEffect, useState, useCallback } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import TableView from "../../../components/Common/TableView";
import axios from "axios";

// Header Model (Ensure these keys match your data structure)
const headerModel = [
    { key: 'level', label: 'Level', visible: true },
    { key: 'path', label: 'Path', visible: true },
    { key: 'status_code', label: 'Status Code', visible: true },
    { key: 'line', label: 'Line No.', visible: true },
    { key: 'error_code', label: 'Error Code', visible: false },
    { key: 'file_name', label: 'File Name', visible: false },
    { key: 'message', label: 'Message', visible: false },
    { key: 'payload', label: 'Payload', visible: false },
    { key: 'created_at', label: 'Created At', visible: true },
    { key: 'app_name', label: 'App Name', visible: true },
];

function ErrorLogs({ dataUrl }) {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [projects, setProjects] = useState([]);
    const [selectedAppName, setSelectedAppName] = useState("all");
    const [logs, setLogs] = useState([]);

    const navigate = useNavigate();
    const pageSize = 50;

    useEffect(() => {
        const getProjectList = async () => {
            try {
                const response = await axios.get("/admin/project/list");
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
        if (isLoading || !hasMoreData) return;

        try {
            setIsLoading(true);
            const response = await axios.get(dataUrl, {
                params: {
                    page: page,
                    page_size: pageSize,
                    app_name: appName === "all" ? undefined : appName,
                },
            });
            const fetchedData = response.data.logs;

            if (fetchedData.length < pageSize) {
                setHasMoreData(false);
            }
            
            if (page === 1) {
                setLogs(fetchedData);
            } else {
                setLogs(prevLogs => [...prevLogs, ...fetchedData]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = async (event) => {
        const value = event.target.value;
        setSelectedAppName(value);
        setLogs([]);
        setCurrentPage(1);
        setHasMoreData(true);
        
        try {
            setIsLoading(true);
            const response = await axios.get(dataUrl, {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    app_name: value === "all" ? undefined : value.toLowerCase(),
                },
            });
            const fetchedData = response.data.logs;
            
            if (fetchedData.length < pageSize) {
                setHasMoreData(false);
            }
            setLogs(fetchedData);
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

    // Modify the header generation to include both key and label
    const header = headerModel.filter(item => item.visible);

    // Modify the logs filtering to preserve original data
    const filteredLogs = logs.map((log) => {
        const filteredData = {};
        headerModel.forEach((item) => {
            if (item.visible && log.hasOwnProperty(item.key)) {
                filteredData[item.key] = log[item.key];
            }
        });
        // Add the original unfiltered data
        filteredData._original = log;
        return filteredData;
    });

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
                            <select onChange={handleSelectChange} className="select" value={selectedAppName || "all"}>
                                <option key={1} value="all">All</option>
                                {projects.map((project) => (
                                    <option key={project.toLowerCase()} value={project.toLowerCase()}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Pass the dynamically generated header and filtered logs data to the TableView component */}
                        <TableView header={header} data={filteredLogs} />
                    </div>
                </main>
            </div>
        </>
    );
}

export default ErrorLogs;
