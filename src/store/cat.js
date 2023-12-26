import {createSlice} from "@reduxjs/toolkit";

const getUniqueCategories = categories => {
    let encountered = [];
    return categories.filter((category) => {
        const key = category.id;
        return encountered[key] ? false : encountered[key] = true;
    })
}

const uiSlice = createSlice({
    name: "cat",
    initialState: {
        hasUserInteracted: false,
        feed: {
            isLoading: false,
            categories: [],
            currentSelectedCategoryIndex: -1,
            currentPageNumber: 1,
            pagesFetched: [],
            hasMorePages: true
        },
    },
    reducers: {
        setHasUserInteracted: (state, hasUserInteracted) => {
            state.hasUserInteracted = !!(hasUserInteracted.payload);
        },
        setCurrentSelectedPostIndex: (state, currentSelectedCategoryIndex) => {
            state.feed.currentSelectedCategoryIndex = currentSelectedCategoryIndex.payload
        },
        addCategories: (state, newCategories) => {
            state.feed.categories = getUniqueCategories([...state.feed.categories, ...newCategories.payload]);
        },
        prependCategory: (state, singleCategory) => {
            state.feed.categories = getUniqueCategories([singleCategory.payload, ...state.feed.categories]);
        },
        setCurrentPageNumber: (state, newPageNumber) => {
            state.feed.currentPageNumber = newPageNumber.payload
        },
        addFetchedPageNumber: (state, fetchedPageNumber) => {
            state.feed.pagesFetched = [...state.feed.pagesFetched, fetchedPageNumber.payload];
        },
        setHasMorePages: (state, hasMorePages) => {
            state.feed.hasMorePages = !!(hasMorePages.payload)
        },
        setIsLoading: (state, isLoading) => {
            state.feed.isLoading = !!(isLoading.payload)
        }
    },
});

export const {
    setHasUserInteracted,
    setCurrentSelectedPostIndex,
    addCategories,
    prependCategory,
    setCurrentPageNumber,
    addFetchedPageNumber,
    setHasMorePages,
    setIsLoading
} = uiSlice.actions;
export default uiSlice.reducer;
