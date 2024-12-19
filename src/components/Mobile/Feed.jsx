import React, {useCallback, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import usePostsLoader from "../../utils/hooks/usePostsLoader";
import Post from "./Post";
import {setCurrentPageNumber} from "../../store/ui";

export default function Feed(props) {
    const {hasUserInteracted, feed} = useSelector(({ui}) => ui);
    const currentPageNumber = feed.currentPageNumber
    const {posts, hasMorePages, isLoading} = usePostsLoader(currentPageNumber);
    const dispatch = useDispatch();
    const lastPostObserver = useRef();
    const autoPlayObserver = useRef(new IntersectionObserver(
        (entries) => {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const video = entry.target;
                if (entry.intersectionRatio !== 1) {
                    video.pause();
                } else if (entry.intersectionRatio === 1) {
                    // Add error handling here
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {}); // Silently catch play errors
                    }
                    break;
                }
            }
        },
        {threshold: 1}
    ));

    const elementsObservedByAutoPlayObserverCount = useRef(0);

    const lastPostElementRef = useCallback(
        (node) => {
            if (isLoading || node === lastPostObserver.current){
                return;
            }
            if (lastPostObserver.current){
                lastPostObserver.current.disconnect();
            }
            lastPostObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMorePages) {
                    dispatch(setCurrentPageNumber(currentPageNumber + 1));
                }
            });
            if (node) lastPostObserver.current.observe(node);
            const videos = document.getElementById("feed").getElementsByTagName("video");
            if(videos.length === posts.length && elementsObservedByAutoPlayObserverCount.current < posts.length){
                for (let i = elementsObservedByAutoPlayObserverCount.current; i < posts.length; i++) {
                    autoPlayObserver.current.observe(videos[i]);
                }
                elementsObservedByAutoPlayObserverCount.current = posts.length;
            }
        },
        [isLoading, hasMorePages, hasUserInteracted]
    );

    return (
        <div className="feed-container">
            <div className="feed" id="feed">
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return (
                            <Post
                                key={post.identifier + post.slug}
                                post={post}
                                lastPostElementRef={lastPostElementRef}
                            />
                        );
                    } else {
                        return <Post key={post.identifier + post.slug} post={post}/>;
                    }
                })}
            </div>
        </div>
    );

}