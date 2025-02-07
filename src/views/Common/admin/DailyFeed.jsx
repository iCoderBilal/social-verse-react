import React, { useState, useEffect } from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";
import { FaTrash } from "react-icons/fa";

const DailyFeed = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  // 1. Default to today's date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts, setPosts] = useState([]);

  // States to handle hover/selection for delete button
  const [hoveredPostId, setHoveredPostId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

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
      setPosts([]);
    }
  };

  // 2. Handle delete
  const handleDelete = async (postId) => {
    // Optional confirmation
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete("/delete/daily-feed", {
        // For a DELETE request, `axios` typically puts data in the request body via `data` property
        data: {
          app_name: "bloom",
          served_on: format(selectedDate, "yyyy-MM-dd"),
          post_id: postId,
        },
      });

      // Remove the deleted post from local state
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.message);
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
          style={{ display: isSideNavOpen ? "block" : "none" }}
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

              {/* DatePicker to select older/future dates */}
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

            {/* Show data if available, otherwise display "No data available" */}
            <div className="video-scroll-container">
              {posts && posts.length > 0 ? (
                <div className="video-list">
                  {posts.map((post) => {
                    // Condition to highlight the card visually
                    const isHoveredAndSelected =
                      hoveredPostId === post.id && selectedPostId === post.id;

                    return (
                      <div
                        className={
                          isHoveredAndSelected
                            ? "video-card hovered-selected"
                            : "video-card"
                        }
                        key={post.id}
                        // Handle hover events
                        onMouseEnter={() => setHoveredPostId(post.id)}
                        onMouseLeave={() => setHoveredPostId(null)}
                        // Handle click (select) event
                        onClick={() => setSelectedPostId(post.id)}
                      >
                        <video src={post.video_link} controls />

                        {/* Show delete button only if hovered AND selected */}
                        {isHoveredAndSelected && (
                          <button
                            className="delete-button"
                            onClick={(e) => {
                              // Prevent the card click from re-triggering
                              e.stopPropagation();
                              handleDelete(post.id);
                            }}
                          >
                            {/* Replace 'trash-icon.png' with your own image path */}
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    );
                  })}
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
          /* Default width on larger screens */
          width: 250px;
        }

        /* Make date picker full-width on screens smaller than 768px */
        @media (max-width: 768px) {
          .date-picker {
            width: 100%;
          }
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
          position: relative;
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
          cursor: pointer;
          transition: border 0.2s;
        }

        /* Visually highlight when hovered + selected */
        .video-card.hovered-selected {
          border: 3px solid #007bff; /* or any color/style you prefer */
        }

        .video-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* The delete button that appears in center on hover+select */
        .delete-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          color: #000;
          border: none;
          border-radius: 50%;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .delete-button:hover {
          background-color: #e60000;
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
