import React, {useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import axios from "axios";
import {Toaster} from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {setHasUserInteracted} from "./store/ui";
import BottomNavigation from "./components/Mobile/BottomNavigation";
import Home from "./views/Mobile/Home"
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

const App = (props) => {

    const {auth, ui} = useSelector((state) => state);
    const {isLoggedIn, user} = auth;
    const {hasUserInteracted} = ui;
    const dispatch = useDispatch();

    axios.defaults.baseURL = "https://api.watchflic.com";
    // axios.defaults.baseURL = "https://127.0.0.1:8000";

    if (isLoggedIn) {
        axios.defaults.headers.common["Flic-Token"] = user.token;
    }

    const renderConsoleWarning = () => {
        console.log("%cStop!", "font-size: 50px; color:red");
        console.log(
            "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Flic feature or “hack” someone’s account, it is a scam and will give them access to your Flic account. Learn more: https://en.wikipedia.org/wiki/Self-XSS",
            "font-size: 20px;"
        );
    };

    const userClickObserver = () => {
        window.addEventListener(
            "click",
            () => dispatch(setHasUserInteracted(true)),
            {once: true});
    };

    const startViewportHeightCalculator = () => {
        const calculateAndSetHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--real-vh', `${vh}px`);
        }
        window.addEventListener('resize', calculateAndSetHeight)
        calculateAndSetHeight();
    }

    useEffect(() => {
        startViewportHeightCalculator();
        renderConsoleWarning();
        userClickObserver();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path="/inbox" element={<Inbox/>}/>
                    <Route exact path="/auth" element={<Auth/>}/>
                    <Route exact path="/upload" element={<Upload/>}/>
                    <Route exact path="/verify" element={<Verify/>}/>
                    <Route exact path="/@:username" element={<Profile/>}/>
                    <Route exact path="/@:username/:identifier/:slug" element={<SinglePost/>}/>
                    <Route path="*" element={<NotFound/>} status={404}/>
                </Routes>
                <HomeScreenShortcutSuggestionDialog/>
                <LoginDialog/>
                <SwitchToAppSuggestionDialog/>
                <BottomNavigation/>
                <BackDrop/>
            </BrowserRouter>
            <Toaster position="top-left"/>
        </>
    );
};

export default App;
