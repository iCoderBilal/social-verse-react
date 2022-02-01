import React, { useEffect, useState } from "react";
import axios from "axios";

export default function usePostsLoader(pageNumber) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!hasMore) {
      return { loading, hasMore, posts };
    }
    setLoading(true);
    axios
      .get("/posts?page=" + pageNumber)
      .then((response) => {
        setPosts([...posts, ...response.data.posts]);
        setHasMore(
          response.data.posts.length == response.data.records_per_page
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageNumber]);

  return { loading, hasMore, posts };
}
