import React, { useState, useEffect } from "react";
import { HomeIcon, MagnifyingGlassIcon, UserIcon } from "@heroicons/react/20/solid";
import { LuLayoutDashboard, LuUsers, LuClipboardList } from "react-icons/lu";
// import { UsersIcon } from "@heroicons/react/24/outline"; //icon for referral
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineAppRegistration } from "react-icons/md";

import EmpowerverseLogo from "../../images/empowerverse.png";
import {
  setShowLoginDialog,
  setShowSwitchToAppSuggestionDialog,
} from "../../store/ui";
import { setUserLoggedOut } from "../../store/auth";

function MobileSideNavigation({ isOpen, onClose }) {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const [active, setActive] = useState("home");
  const { auth } = useSelector((state) => state);
  const { isLoggedIn } = auth;
  const [isActive, setIsActive] = useState("Login");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const checkLoginStatusAsync = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(isLoggedIn);
      }, 1000);
    });
  };

  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await checkLoginStatusAsync();
      setIsActive(isLoggedIn ? "Logout" : "Login");
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleHomeNavigationClick = () => {
    setActive("home");
    onClose();
    navigate("/");
  };

  const handleSearchNavigationClick = () => {
    setActive("search");
    // if (!isLoggedIn) {
    //   dispatch(setShowLoginDialog(true));
    // } else {
    onClose();
    navigate("/search");
    // }
  };

  const handleProfileNavigationClick = () => {
    setActive("profile");
    onClose();
    if (!isLoggedIn) {
      dispatch(setShowLoginDialog(true));
    } else {
      navigate('/profile');
    }
  };
  const handleAdminNavigationClick = () => {
    setActive("admin");
    onClose();
    navigate("/admin/dashboard");
  };

  const handleLogsNavigationClick = () => {
    setActive("logs");
    onClose();
    navigate("/admin/dashboard/logs");
  };

  const handleFeedbackNavigationClick = () => {
    setActive("feedback");
    onClose();
    navigate("/admin/dashboard/feedback");
  };

  const handleUploadsNavigationClick = () => {
    setActive("uploads");
    onClose();
    navigate("/admin/dashboard/uploads");
  };

  // const handleReferralNavigationClick = () => {
  //   setActive("referral");
  //   onClose();
  //   navigate("/admin/dashboard/referral");
  // };

  const handleOnboardingNavigationClick = () => {
    setActive("onboarding");
    onClose();
    navigate("/admin/dashboard/onboarding");
  };

  const handleLogoutButtonClick = () => {
    onClose();
    setIsActive("Login");
    dispatch(setUserLoggedOut());
    navigate("/auth");
  };
  const downloadEmpowerverse = () => {
    window.open("https://socialverse.page.link/empowerverse", "_blank");
    // console.log("Clicked Download Empowerverse");
  };

  return (
    <>
      {(isMobileView && !isOpen) ? null : (
        <div className={`side-navigation ${isOpen ? "open" : ""}`}>
          <div
            className={`nav-item ${active === "home" ? "active" : ""}`}
            onClick={handleHomeNavigationClick}
          >
            <HomeIcon />
            <p className="nav-text">Home</p>
          </div>
          <div
            className={`nav-item ${active === "search" ? "active" : ""}`}
            onClick={handleSearchNavigationClick}
          >
            <MagnifyingGlassIcon />
            <p className="nav-text">Search</p>
          </div>
          <div
            className={`nav-item ${active === "profile" ? "active" : ""}`}
            onClick={handleProfileNavigationClick}
          >
            <UserIcon />
            <p className="nav-text">Profile</p>
          </div>
          {auth.user.role === "A" ? (
            <>
              <div
                className={`nav-item ${active === "admin" ? "active" : ""}`}
                onClick={handleAdminNavigationClick}
              >
                <LuLayoutDashboard />
                <p className="nav-text">Dashboard</p>
              </div>

              <div
                className={`nav-item ${active === "logs" ? "active" : ""}`}
                onClick={handleLogsNavigationClick}
              >
                <LuClipboardList />
                <p className="nav-text">Logs</p>
              </div>

              <div
                className={`nav-item ${active === "feedback" ? "active" : ""}`}
                onClick={handleFeedbackNavigationClick}
              >
                <LuClipboardList />
                <p className="nav-text">Feedback</p>
              </div>
              <div
                className={`nav-item ${active === "uploads" ? "active" : ""}`}
                onClick={handleUploadsNavigationClick}
              >
                <LuClipboardList />
                <p className="nav-text">Uploads</p>
              </div>
              {/* <div
                className={`nav-item ${active === "referral" ? "active" : ""}`}
                onClick={handleReferralNavigationClick}
              >
                <UsersIcon />
                <p className="nav-text">Referral</p>
              </div> */}
            <div
              className={`nav-item ${active === "onboarding" ? "active" : ""}`}
              onClick={handleOnboardingNavigationClick}
            >
              <MdOutlineAppRegistration />
              <p className="nav-text">Onboarding</p>
            </div>
            </>
          ) : (
            ""
          )}

          {isMobileView ? (
            <div className="nav-item logout ">
              <button
                type="button"
                className="button-logout"
                onClick={handleLogoutButtonClick}
              >
                {isActive}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

export default MobileSideNavigation;
