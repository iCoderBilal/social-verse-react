import {useEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {addPosts, setHasMorePages, setIsLoading, addFetchedPageNumber} from "../../store/ui";

export default function usePostsLoader(pageNumber) {

    const dispatch = useDispatch();
    const {feed} = useSelector(({ui}) => ui);
    const {isLoading, hasMorePages, posts, pagesFetched} = feed;

    useEffect(() => {
        if (!hasMorePages || pagesFetched.includes(pageNumber)) {
            return {isLoading, hasMorePages, posts};
        }
        dispatch(setIsLoading(true));
        axios
            .get("/feed?page=" + pageNumber)
            .then((response) => {
                dispatch(addPosts(response.data.posts))
                dispatch(setHasMorePages(response.data.posts.length === response.data.records_per_page))
            })
            .finally(() => {
                dispatch(addFetchedPageNumber(pageNumber));
                dispatch(setIsLoading(false));
            });
    }, [dispatch, hasMorePages, isLoading, pageNumber, pagesFetched, posts]);

    return {isLoading, hasMorePages, posts};
}
