import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./Home";
import Profile from "./Profile";
import Auth from "./Auth";
import NotFound from "./NotFound";
import AuthHelper from "./services/AuthHelper";
import Logout from "./Logout";
import { Toaster } from "react-hot-toast";
import Verify from "./Verify";
import CreatePost from "./CreatePost";
import ProfileEdit from "./ProfileEdit";
import Post from "./Post";
import Notifications from "./Notifications";
import Address from "./Address";

export default class App extends Component {
  state = {
    user: AuthHelper.getUser(),
  };

  forceUpdateAppState = () => {
    this.setState({
      user: AuthHelper.getUser(),
    });
  };

  componentDidMount() {
    console.log("%cStop!", "font-size: 50px; color:red");
    console.log(
      "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Shelter feature or “hack” someone’s account, it is a scam and will give them access to your Shelter account. Learn more: https://en.wikipedia.org/wiki/Self-XSS",
      "font-size: 20px;"
    );
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home}/>
            <PrivateRoute exact path="/post/create" component={CreatePost}/>
            <PrivateRoute exact path="/notifications" component={Notifications}/>
            <PrivateRoute exact path="/address" component={Address}/>
            <Route exact path="/profile/:username" component={Profile}/>
            <Route exact path="/post/:identifier/:slug" component={Post}/>
            <Route exact path="/verify" component={Verify}/>
            <Route exact path="/profile/:username/edit" component={ProfileEdit}/>
            <Route exact path="/auth" render={(props) => (<Auth forceUpdateAppState={this.forceUpdateAppState}{...props}/>)}/>
            <Route exact path="/logout" render={(props) => (<Logout forceUpdateAppState={this.forceUpdateAppState}{...props}/>)}/>
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
        <Toaster position="top-left" />
      </>
    );
  }
}
