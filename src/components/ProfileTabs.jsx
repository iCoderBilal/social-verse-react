import React, {Component} from 'react';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import axios from "axios";
import {connect} from "react-redux"

class ProfileTabs extends Component {

    state = {
        isUsedLoggedIn:  this.props.isUserLoggedIn
    }

    loadSavedPosts = () => {
        axios.get('/posts/saved').then(() => {
            console.log("Saved")
        });
    }

    loadPersonalPosts = () => {
        axios.get('/posts/profile').then(() => {
            console.log("Profile Posts")
        });
    }

    loadLikedPosts = () => {
        axios.get('/posts/liked').then(() => {
            console.log("Liked Posts");
        });
    }

    componentDidMount() {
        this.loadPersonalPosts();
        if(this.state.isUsedLoggedIn){
            this.loadPersonalPosts();
            this.loadSavedPosts();
        }
    }

    render() {
        return (<div className={'profile-tabs'}>
            <Tabs>
                <TabList>
                    <Tab>Posts</Tab>
                    {this.state.isUsedLoggedIn ? (<><Tab>Liked</Tab><Tab>Saved</Tab></>) : <></>}
                </TabList>

                <TabPanel>
                    <h2>Fetch Personal Posts</h2>
                </TabPanel>
                {this.state.isUsedLoggedIn ? (<> <TabPanel>
                    <h2>Fetch Liked Posts</h2>
                </TabPanel>
                    <TabPanel>
                        <h2>Fetch Saved videos</h2>
                    </TabPanel></>) : <></>}
            </Tabs>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        isUserLoggedIn: state.isUserLoggedIn,
        user: state.user
    }
}


export default connect(mapStateToProps)(ProfileTabs);