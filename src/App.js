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

    useEffect(() => {
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
                    <Route exact path="/verify" element={<Verify/>}/>
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
