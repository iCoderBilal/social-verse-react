import React, {useEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {addPosts, setHasMorePages, setIsLoading} from "../../store/ui";

export default function usePostsLoader(pageNumber) {

    const dispatch = useDispatch();
    const {feed} = useSelector(({ui}) => ui);
    const {isLoading, hasMorePages, posts} = feed;

    useEffect(() => {
        if (!hasMorePages) {
            return {isLoading, hasMorePages, posts};
        }
        dispatch(setIsLoading(true));
        axios
            .get("/posts?page=" + pageNumber)
            .then((response) => {
                dispatch(addPosts(response.data.posts))
                dispatch(setHasMorePages(response.data.posts.length === response.data.records_per_page))
            })
            .finally(() => {
                dispatch(setIsLoading(false));
            });
    }, [pageNumber]);

    return {isLoading, hasMorePages, posts};
}
