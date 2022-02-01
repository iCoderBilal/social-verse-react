import React, {useEffect} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Auth from "./views/Auth";
import NotFound from "./views/NotFound";
import Logout from "./views/Logout";
import Verify from "./views/Verify";
import ProfileEdit from "./views/ProfileEdit";
import Post from "./views/Post";
import Notifications from "./views/Notifications";
import Upload from "./views/Upload";
import EmbedPlayer from "./views/EmbedPlayer";
import axios from "axios";
import Embed from "./views/Embed";
import {Toaster} from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {userInteracted} from "./store/ui";

const App = (props) => {
    const {auth, ui} = useSelector((state) => state);
    const {isLoggedIn, user} = auth;
    const {hasUserInteracted} = ui;

    axios.defaults.baseURL = "https://api.watchflic.com";
    axios.defaults.baseURL = "https://127.0.0.1:8000";

    if (isLoggedIn) {
        axios.defaults.headers.common["Flic-Token"] = user.token;
    }

    const dispatch = useDispatch();

    const renderConsoleWarning = () => {
        console.log("%cStop!", "font-size: 50px; color:red");
        console.log(
            "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Flic feature or “hack” someone’s account, it is a scam and will give them access to your Flic account. Learn more: https://en.wikipedia.org/wiki/Self-XSS",
            "font-size: 20px;"
        );
    };

    const userClickObserver = () => {
        window.addEventListener("click", () => dispatch(userInteracted()), {
            once: true,
        });
    };

    useEffect(() => {
        renderConsoleWarning();
        userClickObserver();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <Home hasUserInteracted={hasUserInteracted} {...props} />
                        )}
                    />
                    <PrivateRoute exact path="/notifications" component={Notifications}/>
                    <PrivateRoute exact path="/upload" component={Upload}/>
                    <Route exact path="/profile/:username" component={Profile}/>
                    <Route
                        exact
                        path="/embed/:identifier/:slug"
                        render={(props) => (
                            <Embed hasUserInteracted={hasUserInteracted} {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/embed/play/:identifier/:slug"
                        render={(props) => (
                            <EmbedPlayer hasUserInteracted={hasUserInteracted} {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/post/:identifier/:slug"
                        render={(props) => (
                            <Post hasUserInteracted={hasUserInteracted} {...props} />
                        )}
                    />
                    <Route exact path="/verify" component={Verify}/>
                    <Route exact path="/profile/:username/edit" component={ProfileEdit}/>
                    <Route exact path="/auth" render={(props) => <Auth {...props} />}/>
                    <Route
                        exact
                        path="/logout"
                        render={(props) => <Logout {...props} />}
                    />
                    <Route component={NotFound}/>
                </Switch>
            </BrowserRouter>
            <Toaster position="top-left"/>
        </>
    );
};

export default App;
