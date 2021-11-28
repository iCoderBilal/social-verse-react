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
import ProfileEdit from "./ProfileEdit";
import Post from "./Post";
import Notifications from "./Notifications";
import Address from "./Address";
import Upload from "./Upload";

export default class App extends Component {

  state = {
    user: AuthHelper.getUser(),
    hasUserInteracted: false
  };

  forceUpdateAppState = () => {
    this.setState({
      user: AuthHelper.getUser(),
    });
  };

   clickListener = () => {
    this.setState({
      hasUserInteracted: true
    },  () => {
      window.removeEventListener('click', this.clickListener);
    })
  }

  componentDidMount() {
    console.log("%cStop!", "font-size: 50px; color:red");
    console.log(
      "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Flic feature or “hack” someone’s account, it is a scam and will give them access to your Flic account. Learn more: https://en.wikipedia.org/wiki/Self-XSS",
      "font-size: 20px;"
    );

    window.addEventListener('click', this.clickListener);
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={(props) => (<Home hasUserInteracted={this.state.hasUserInteracted}{...props}/>)}/>
            <PrivateRoute exact path="/notifications" component={Notifications}/>
            <PrivateRoute exact path="/address" component={Address}/>
            <PrivateRoute exact path="/upload" component={Upload}/>
            <Route exact path="/profile/:username" component={Profile}/>
            <Route exact path="/post/:identifier/:slug" render={(props) => (<Post hasUserInteracted={this.state.hasUserInteracted}{...props}/>)}/>
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
