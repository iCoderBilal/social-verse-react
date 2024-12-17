import React, { useEffect, useState, useRef } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Feedback() {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [selectedAppName, setSelectedAppName] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    const pageSize = 30;

    useEffect(() => {
        getCategories();

    }, [currentPage]);

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

    const fetchData = async (page, appName) => {
        if (currentPage === page && appName === selectedAppName && data.length > 0) return;
        if (appName === '') return;

        try {
            setIsLoading(true);
            const response = await axios.get('/feedback', {
                params: {
                    page: currentPage,
                    page_size: pageSize,
                    app_name: appName
                },
            });
            const fetchedData = response.data.message.feedbacks;
            console.log(fetchedData);

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
                            <select onChange={handleSelectChange} className="select">
                                <option key={1} value=''>Select App</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <ul onScroll={handleScroll} style={{ height: "100vh", overflowY: "auto" }} className="feedback-list">
                            {data && data.length > 0 ? (
                                <>
                                    <div className="feedback-header">
                                        <p className="sender">User</p>
                                        <p className="feedback-type">Type</p>
                                        <p className="feedback-text">Description</p>
                                    </div>
                                    {
                                        data.map((item, index) => {
                                            const isFeedback = item.type === "F";

                                            return (
                                                <li key={index} className="feedback-item">
                                                    <div className="sender">

                                                        <img className="sender-image" src={item.sender.profile_picture_url} alt="" />
                                                        <p className="sender-name">{item.sender.first_name + ' ' + item.sender.last_name}</p>
                                                    </div>
                                                    <div className="feedback-type">
                                                        <p style={{ color: isFeedback ? 'black' : 'red' }}>
                                                            {isFeedback ? "Feedback" : "Bug"}
                                                        </p>
                                                    </div>
                                                    <p className="feedback-text">{item.feedback}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </>
                            ) : (
                                <li>No data available</li>
                            )}
                        </ul>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Feedback;