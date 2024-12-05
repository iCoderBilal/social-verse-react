import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setHasUserInteracted } from "./store/ui";
import TopNavigation from "./components/Mobile/TopNavigation";
import Home from "./views/Mobile/Home";
import HomeScreenShortcutSuggestionDialog from "./components/Mobile/HomeScreenShortcutSuggestionDialog";
import LoginDialog from "./components/Mobile/LoginDialog";
import SwitchToAppSuggestionDialog from "./components/Mobile/SwitchToAppSuggestionDialog";
import Inbox from "./views/Mobile/Inbox";
import Auth from "./views/Common/Auth";
import BackDrop from "./components/Mobile/BackDrop";
import Verify from "./views/Common/Verify";
import NotFound from "./views/Common/NotFound";
import Upload from "./views/Mobile/Upload";
import Profile from "./views/Mobile/Profile";
import SinglePost from "./views/Mobile/SinglePost";
import Search from "./views/Mobile/search";
import SideNavigation from "./components/Mobile/SideNavigation";
import ChangePassword from "./views/Common/ResetPassword";
import Dashboard from "./views/Common/admin/Dashboard";
import UserAnalytics from "./views/Common/admin/UserAnalytics";
import ErrorLogs from "./views/Common/admin/ErrorLogs";

const App = (props) => {
  const { auth, ui } = useSelector((state) => state);
  const { isLoggedIn, user } = auth;
  const { hasUserInteracted } = ui;
  const [userRole, setUserRole] = useState(user.role);
  const dispatch = useDispatch();

  axios.defaults.baseURL = "https://api.socialverseapp.com";
  // axios.defaults.baseURL = "http://127.0.0.1:8000";


  if (isLoggedIn) {
    axios.defaults.headers.common["Flic-Token"] = user.token;
  }

  const renderConsoleWarning = () => {
    console.log("%cStop!", "font-size: 50px; color:red");
    console.log(
      "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Empowerverse feature or “hack” someone’s account, it is a scam and will give them access to your Empowerverse account. Learn more: https://en.wikipedia.org/wiki/Self-XSS",
      "font-size: 20px;"
    );
  };

  const userClickObserver = () => {
    window.addEventListener(
      "click",
      () => dispatch(setHasUserInteracted(true)),
      { once: true }
    );
  };

  const startViewportHeightCalculator = () => {
    const calculateAndSetHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--real-vh", `${vh}px`);
    };
    window.addEventListener("resize", calculateAndSetHeight);
    calculateAndSetHeight();
  };

  useEffect(() => {
    startViewportHeightCalculator();
    renderConsoleWarning();
    userClickObserver();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/inbox" elRedirectement={<Inbox />} />
          <Route exact path="/auth" element={<Auth />} />
          <Route exact path="/upload" element={<Upload />} />
          <Route exact path="/search" element={<Search />} />
          <Route exact path="/verify" element={<Verify />} />
          <Route exact path="/reset/finish" element={<ChangePassword />} />
          <Route exact path="/@:username" element={<Profile />} />
          <Route
            exact
            path="/@:username/:identifier/:slug"
            element={<SinglePost />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={userRole === "A" ? <Dashboard /> : <Navigate to="/" />}
          />

          <Route
            path="/admin/dashboard/logs"
            element={userRole === "A" ? <ErrorLogs dataUrl={"/error/logs"} /> : <Navigate to="/" />}
          />

          <Route path="*" element={<NotFound />} status={404} />
        </Routes>

        <LoginDialog />
        {userRole === "U" &&
          <>
            <HomeScreenShortcutSuggestionDialog />
            <SwitchToAppSuggestionDialog />
            <BackDrop />
          </>
        }
      </BrowserRouter>
      <Toaster position="top-left" />
    </>
  );
};

export default App;
