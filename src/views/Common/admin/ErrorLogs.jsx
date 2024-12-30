

import React, { useEffect, useState } from "react";
import Loader from "../../../components/Common/Loader";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorLog from "../../../components/Mobile/ErrorLog";

function ErrorLogs({ dataUrl }) {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedAppName, setSelectedAppName] = useState('empowerverse');

    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
        
        fetchData(currentPage, selectedAppName);

    }, [currentPage, isSideNavOpen, isMobileView]);

    const handleSelectChange = async (event) => {
        const value = event.target.value;
        const appName = value.split(' ').join('').toLowerCase();
        let newPage = 1;

        setSelectedAppName(appName);
        setData([]);
        setCurrentPage(newPage);
        setHasMoreData(true);

        fetchData(newPage, appName);
    };

    const pageSize = 50;

    const fetchData = async (page, appName) => {
        if (currentPage === page && data.length > 0 && appName === selectedAppName) return;

        try {
            setIsLoading(true);
            if (appName === "bloomscroll") appName = "bloom";

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

    const getCategories = async () => {
        const response = await axios.get('/categories?page=1&page_size=50');
        // console.log(response.data);

        // Sort alphabetically
        const sortedCategories = response.data.categories.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
        
        setCategories(sortedCategories);
    }

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (!isLoading && hasMoreData && scrollTop + clientHeight >= scrollHeight - 10) {
            setCurrentPage((prevPage) => prevPage + 1);
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
                            <select onChange={handleSelectChange} className="select">
                                <option key={1} value='empowerverse'>Select App</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <ul onScroll={handleScroll} style={{ height: "100vh", overflowY: "auto" }}>
                            {data && data.length > 0 ? (
                                <>
                                    <div className="log">
                                        <div className="log-header">
                                            <p className="header-item">Status Code</p>
                                            <p className="header-item">Path</p>
                                            <p className="header-item">Line</p>
                                            <p className="header-item">Created At</p>
                                            {selectedAppName === 'empowerverse' && <p className="header-item">AppName</p>}
                                            {/* <div className="header-actions"></div> */}
                                        </div>
                                    </div>
                                    {
                                        data.map((item, index) => (
                                            <li key={index} className="data-item">
                                                <ErrorLog data={item} showAppName={selectedAppName === 'empowerverse'} />
                                            </li>
                                        ))
                                    }
                                </>
                            ) : (
                                <li>No data available</li>
                            )}
                        </ul>
                    </div>
                </main >
            </div >

        </>
    )
}

export default ErrorLogs;