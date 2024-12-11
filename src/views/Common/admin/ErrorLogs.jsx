

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

    useEffect(() => {
        fetchData(currentPage);

    }, [currentPage, isSideNavOpen, isMobileView]);


    const pageSize = 50;

    const fetchData = async (page) => {
        if (currentPage === page && data.length > 0) return;

        try {
            setIsLoading(true);
            const response = await axios.get(dataUrl, {
                params: {
                    page: page,
                    pageSize: pageSize,
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
                        <ul onScroll={handleScroll} style={{ height: "100vh", overflowY: "auto" }}>
                            {data && data.length > 0 ? (
                                <>
                                    <div className="log">
                                        <div className="log-header">
                                            <p className="header-item">Status Code</p>
                                            <p className="header-item">Path</p>
                                            <p className="header-item">Line</p>
                                            <p className="header-item">Created At</p>
                                            {/* <div className="header-actions"></div> */}
                                        </div>
                                    </div>
                                    {
                                        data.map((item, index) => (
                                            <li key={index} className="data-item">
                                                <ErrorLog data={item} />
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