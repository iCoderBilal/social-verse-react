import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addCategories, setHasMorePages, setIsLoading, addFetchedPageNumber } from "../../store/cat";

export default function useCategoriesLoader(pageNumber) {
  const dispatch = useDispatch();
  const { feed } = useSelector(({ cat }) => cat);
  const { isLoading, hasMorePages, categories, pagesFetched } = feed;

  useEffect(() => {
    if (!hasMorePages || pagesFetched.includes(pageNumber)) {
      return { isLoading, hasMorePages, categories };
    }

    dispatch(setIsLoading(true));

    axios
      .get("/categories?page=" + pageNumber)
      .then((response) => {
        dispatch(addCategories(response.data.categories));
        dispatch(setHasMorePages(response.data.categories.length === response.data.records_per_page));
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        dispatch(addFetchedPageNumber(pageNumber));
        dispatch(setIsLoading(false));
      });
  }, [dispatch, hasMorePages, isLoading, pageNumber, pagesFetched, categories]);
  return { isLoading, hasMorePages, categories };
}
