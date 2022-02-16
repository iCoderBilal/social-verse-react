import React, {Component} from 'react';
import MobileBottomNavigation from "./MobileBottomNavigation";
import MobileFeedVideoPost from "./MobileFeedVideoPost";
import MobileInformationDialogModel from "./MobileInformationDialogModel";
import MobileFeedSass from "../../styles/mobile-feed.scss"
import axios from "axios";
import FlicToaster from "../../utils/FlicToaster";

class MobileFeed extends Component {

    state = {
        isLoadingPosts: true,
        isDialogVisible: false,
        posts: [],
        currentPage: 1,
        seenEverything: false
    }

    loadPosts = () => {
        if (this.state.seenEverything) return true;
        this.setState({ isLoadingPosts: true });
        axios
            .get("/feed?page=" + this.state.currentPage)
            .then((response) => {
                if (response.data.posts !== undefined) {
                    let seenEverything =
                        response.data.posts.length < response.data.records_per_page;
                    this.setState({
                        posts: response.data.posts,
                        currentPage: this.state.currentPage,
                        seenEverything: seenEverything,
                    }, () => this.videoIntersectionObserverAutoPlay());
                } else FlicToaster.error("Something Went Wrong");
            })
            .finally(() => {
                this.setState({ isLoadingPosts: false });
            });
    };

    videoIntersectionObserverAutoPlay = () => {
        const videos = document.getElementsByClassName("feed_video-container__video");
        let hasUserInteracted = this.props.hasUserInteracted;

        [...videos].forEach((video) => {
            // We can only control playback without intersection if video is mute
            video.muted = true;
            video.volume = 1;
            window.FlicObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (
                            entry.intersectionRatio !== 1 &&
                            !video.paused
                        ) {
                            video.pause();
                        } else if (entry.intersectionRatio === 1 && video.paused) {
                            video.muted = hasUserInteracted;
                            video.play();
                        }
                    });
                },
                { threshold: 1 }
            );
            window.FlicObserver.observe(video);
        });
    }


    openInformationDialogModal = () => {
        this.setState({
            isDialogVisible: true
        });
    }

    closeInformationDialogModal = () => {
        this.setState({
            isDialogVisible: false
        });
    }

    componentDidMount() {
        if(this.props.singlePost !== undefined && this.props.singlePost){
            this.setState({
                posts: [this.props.post],
                seenEverything: true,
            }, () => this.videoIntersectionObserverAutoPlay());
        } else{
            this.loadPosts();
        }
        window.gtag('event', 'view', {
            'event_category' : 'page',
            'event_label' : 'Mobile Home'
        });
    }

    getModalAndFeed = () => {
        return (
            <React.Fragment>
                <MobileInformationDialogModel isDialogVisible={this.state.isDialogVisible} closeDialog={this.closeInformationDialogModal}/>
                <div className={`feed-mobile feed ${this.state.isDialogVisible ? 'feed-backdrop' : ''}`}>
                    {
                        this.state.posts.map(video => (
                                <MobileFeedVideoPost
                                    key = {"1"}
                                    hasUserInteracted = {this.props.hasUserInteracted}
                                    username = {video.username}
                                    musicName = {""}
                                    identifier = {video.identifier}
                                    slug = {video.slug}
                                    description = {video.title}
                                    isVerified = {video.isVerified ?? false}
                                    url = {video.video_link}
                                    poster = {video.thumbnail_url}
                                    likesCount = {video.upvote_count}
                                    commentCount = {video.comment_count}
                                    shareCount = {"20K"}
                                    instagramImage = {video.picture_url}
                                    openDialog = {this.openInformationDialogModal}
                                />
                        ))
                    }
                </div>
                <MobileBottomNavigation openDialog={this.openInformationDialogModal}/>
            </React.Fragment>
        )
    }

    render() {
        return this.getModalAndFeed();
    }
}

export default MobileFeed;
