import React, { useState, useEffect } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";

const DailyFeed = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  // 1. Default to today's date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Whenever selectedDate changes, fetch data for that date
    fetchPosts(selectedDate);
  }, [selectedDate]);

  const fetchPosts = async (date) => {
    try {
      // Convert the date object to 'YYYY-MM-DD' string
      const formattedDate = format(date, "yyyy-MM-dd");
      // Make API request
      const response = await axios.get("/list/daily-feed", {
        params: {
          app_name: "bloom",
          served_on: formattedDate,
        },
      });
      // Update your local state
      setPosts(response.data.dailyFeed || []);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      // In case of error, you could optionally show a different message or keep an empty array
      setPosts([]);
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
        ></div>

        <aside className="side-bar">
          <MobileSideNavigation
            isOpen={isSideNavOpen}
            onClose={() => setIsSideNavOpen(false)}
          />
        </aside>

        <main className="main-container">
          <div className="dashboard-container">
            <div className="header-actions">
              <button onClick={() => navigate(-1)} className="back-btn">
                Back
              </button>

              {/* 2. DatePicker to select older/future dates */}
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="date-picker"
                maxDate={addDays(new Date(), 60)}  // Up to 2 months ahead
                minDate={addDays(new Date(), -60)} // Up to 2 months behind
                showPopperArrow={false}
                withPortal
              />
            </div>

            {/* 3. Show data if available, otherwise display "No data available" */}
            <div className="video-scroll-container">
              {posts && posts.length > 0 ? (
                <div className="video-list">
                  {posts.map((post) => (
                    <div className="video-card" key={post.id}>
                      <video src={post.video_link} controls />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No data available</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .date-picker {
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        .video-scroll-container {
          overflow-x: auto;
          white-space: nowrap;
          padding: 10px 0;
        }

        .video-list {
          display: flex;
          gap: 15px;
          padding: 10px;
          flex-wrap: wrap;
        }

        .video-card {
          width: 220px;
          height: 400px;
          background-color: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .video-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-data {
          text-align: center;
          font-size: 18px;
          color: gray;
        }
      `}</style>
    </>
  );
};

export default DailyFeed;
