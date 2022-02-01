import React, { Component } from "react";
import FlicToaster from "../utils/FlicToaster";
import usePostsLoader from "../utils/usePostsLoader";
import LoadingPost from "./LoadingPost";
import Post from "./Post";
import { FcOk } from "react-icons/fc";
import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Feed() {
  const { ui } = useSelector((state) => state);
  const [pageNumber, setPageNumber] = useState(1);
  const [autoplayObservedPostsCount, setAutoplayObservedPostsCount] =
    useState(0);
  const { posts, hasMore, loading } = usePostsLoader(pageNumber);

  window.gtag("event", "view", {
    event_category: "page",
    event_label: "Desktop Home",
  });

  const lastPostObserver = useRef();
  const autoplayObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        let video = entry.target;
        if (entry.intersectionRatio !== 1 && !video.paused) {
          video.pause();
        } else if (entry.intersectionRatio === 1 && video.paused) {
          video.muted = !ui.hasUserInteracted;
          video.play();
          return;
        }
      });
    },
    { threshold: 1 }
  );

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (lastPostObserver.current) lastPostObserver.current.disconnect();
      lastPostObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) lastPostObserver.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const videos = document.getElementsByClassName("flic-video");
    for (let i = autoplayObservedPostsCount; i < posts.length; i++) {
      autoplayObserver.observe(videos[i]);
    }
    setAutoplayObservedPostsCount(posts.length);
  }, [posts]);

  const getSeenEverything = () => {
    return (
      <div className="seen-everything-card">
        <div class="flex items-center w-full">
          <div class="flex-grow bg bg-gray-300 h-0.5"></div>
          <div class="flex-grow-0 mx-5 text dark:text-white">
            <FcOk size={35} />
          </div>
          <div class="flex-grow bg bg-gray-300 h-0.5"></div>
        </div>

        <p className="mt-4">You have caught up with everything.</p>
      </div>
    );
  };

  return (
    <div className="flic-feed">
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
          return <Post key={post.identifier + post.slug} post={post} />;
        }
      })}
      {loading ? Array(4).fill(<LoadingPost customClass="mx-auto" />) : <></>}
      {!hasMore ? getSeenEverything() : <></>}
    </div>
  );
}
