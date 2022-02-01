import React, {Component} from "react";
import Feed from "../components/Feed";
import NavigationBar from "../components/NavigationBar";
import CreateFlicCard from "../components/CreateFlicCard";
import MobileFeed from "../components/mobile/MobileFeed";
import {Helmet} from "react-helmet";
import CommentSidebar from "../components/common/CommentSidebar";

export class Home extends Component {
    state = {
        width: window.innerWidth
    }

    componentDidMount() {
        document.body.classList.add("grey-bg");
    }

    renderDesktopOrMobile = () => {
        if (this.state.width < 768) {
            return <>
                <CommentSidebar/>
                <MobileFeed hasUserInteracted={this.props.hasUserInteracted}/>
            </>
        }

        return (<React.Fragment>
            <NavigationBar/>
            <CommentSidebar/>
            <div className="desktop-f-t-b feed-container mx-auto justify-center">
                <CreateFlicCard/>
                <Feed hasUserInteracted={this.props.hasUserInteracted}/>
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
                <meta property="twitter:image"
                      content="https://shelter-cdn.nyc3.cdn.digitaloceanspaces.com/flic/assets/flic.png"/>
            </Helmet>
            {this.renderDesktopOrMobile()}
        </React.Fragment>
    }
}

export default Home;
