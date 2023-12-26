import React, { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import useCategoriesLoader from '../../utils/hooks/useCategoriesLoader';
import { setCurrentPageNumber } from '../../store/cat';
import {setShowSwitchToAppSuggestionDialog} from "../../store/ui";

function Search(props) {
    const { feed } = useSelector(({ cat }) => cat);
    const currentPageNumber = feed.currentPageNumber;
    const { isLoading, hasMorePages, categories } = useCategoriesLoader(currentPageNumber);
    console.log(feed, currentPageNumber)
    const lastCategoryElementObserver = useRef();
    const dispatch = useDispatch();

    const handleSubverseClick = () => {
        dispatch(setShowSwitchToAppSuggestionDialog(true))
    }
    const lastCategoryElementRef = useCallback(
        (node) => {
            if (isLoading || node === lastCategoryElementObserver.current) {
                return;
            }
            lastCategoryElementObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMorePages) {
                    dispatch(setCurrentPageNumber(currentPageNumber + 1));
                }
            });
            if (node) lastCategoryElementObserver.current.observe(node);
        },
        [isLoading, hasMorePages, dispatch, currentPageNumber]
    );

    useEffect(() => {
        // When categories change, we might want to load more data
        console.log("Categories changed:", categories);
    }, [categories]);

    return (
        <div className="search-categories">
            {categories.map((category, index) => (
                <div onClick={handleSubverseClick} key={category.id} ref={index === categories.length - 1 ? lastCategoryElementRef : null} className="categories-box">
                    <div className="category-image">
                        <img className="img" src={category.image_url} alt={category.name} />
                    </div>
                        <p className="category-name">{category.name}</p>
                </div>
            ))}
        </div>
    );
}

export default Search;
