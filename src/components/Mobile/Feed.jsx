import React, {useCallback, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import usePostsLoader from "../../utils/hooks/usePostsLoader";
import Post from "./Post";
import {setCurrentPageNumber} from "../../store/ui";

export default function Feed(props) {
    const dispatch = useDispatch();
    const {ui} = useSelector((state) => state);
    const {currentPageNumber} = ui.feed;
    const [pageNumber, setPageNumber] = useState(1);

    const [autoplayObservedPostsCount, setAutoplayObservedPostsCount] = useState(0);

    const {posts, hasMorePages, isLoading} = usePostsLoader(currentPageNumber);

    const lastPostObserver = useRef();
    const autoplayObserver = new IntersectionObserver(
        (entries) => {
            //There is no way to stop forEach and we need to break early,
            // so just use a simple forLoop
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const video = entry.target;
                video.muted = !(ui.hasUserInteracted);
                if (entry.intersectionRatio !== 1 && !video.paused) {
                    video.pause();
                } else if (entry.intersectionRatio === 1 && video.paused) {
                    video.play();
                    break;
                }
            }
        },
        {threshold: 1}
    );

    const lastPostElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (lastPostObserver.current) lastPostObserver.current.disconnect();
            lastPostObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMorePages) {
                    dispatch(setCurrentPageNumber(currentPageNumber + 1));
                }
            });
            if (node) lastPostObserver.current.observe(node);
        },
        [isLoading, hasMorePages]
    );

    // useEffect(() => {
    //     const videos = document.getElementsByClassName("video");
    //     for (let i = autoplayObservedPostsCount; i < posts.length; i++) {
    //         autoplayObserver.observe(videos[i]);
    //     }
    //     setAutoplayObservedPostsCount(posts.length);
    // }, [posts]);

    return (
        <div className="feed">
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
    );

}