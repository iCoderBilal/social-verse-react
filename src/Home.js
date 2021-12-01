import React, { Component } from "react";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import CreateFlicCard from "./components/CreateFlicCard";
import MobileFeed from "./components/mobile/MobileFeed";
import {Helmet} from "react-helmet";

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
      return <React.Fragment>
          <Helmet>
              <meta property="twitter:card" content="summary_large_image"/>
              <meta property="twitter:url" content="https://beta.watchflic.com"/>
              <meta property="twitter:title" content="Flic - Beta Web App"/>
              <meta property="twitter:description" content="Do more with just a flic"/>
              <meta property="twitter:image" content="https://shelter-cdn.nyc3.cdn.digitaloceanspaces.com/flic/assets/flic.png"/>
          </Helmet>
          {this.renderDesktopOrMobile()}
      </React.Fragment>
  }
}

export default Home;
