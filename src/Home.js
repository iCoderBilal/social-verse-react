import React, { Component } from "react";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import CreateFlicCard from "./components/CreateFlicCard";
import MobileFeed from "./components/mobile/MobileFeed";

export class Home extends Component {
  componentDidMount() {
    document.body.classList.add("grey-bg");
  }

  state = {
      width: window.innerWidth
  }

  renderDesktopOrMobile = () =>{
      if(this.state.width < 768){
          return <MobileFeed hasUserInteracted = {this.props.hasUserInteracted}></MobileFeed>
      }

      return ( <React.Fragment>
          <NavBar/>
          <div className="desktop-f-t-b feed-container mx-auto justify-center">
              <CreateFlicCard/>
              <Feed hasUserInteracted = {this.props.hasUserInteracted}/>
          </div>
      </React.Fragment>);
  }

  render() {
    return this.renderDesktopOrMobile();
  }
}

export default Home;
