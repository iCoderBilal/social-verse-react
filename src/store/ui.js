import {createSlice} from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        hasUserInteracted: false,
        feed: {
            isLoading: false,
            posts: [],
            currentSelectedPostIndex: -1,
            showComments: false,
            currentPageNumber: 1,
            pagesFetched: [],
            hasMorePages: true
        },
        showSwitchToAppSuggestionDialog: true,
        showLoginDialog: false,
        showHomeScreenShortcutSuggestionDialog: false
    },
    reducers: {
        setHasUserInteracted: (state, hasUserInteracted) => {
            state.hasUserInteracted = !!(hasUserInteracted.payload);
        },
        setCurrentSelectedPostIndex: (state, currentSelectedPostIndex) => {
            state.feed.currentSelectedPostIndex = currentSelectedPostIndex.payload
        },
        setShowComments: (state, showComments) => {
            state.feed.showComments = !!(showComments.payload);
        },
        setShowSwitchToAppSuggestionDialog: (state, showSwitchToAppSuggestionDialog) => {
            state.showSwitchToAppSuggestionDialog = !!(showSwitchToAppSuggestionDialog.payload);
        },
        addPosts: (state, newPosts) => {
            state.feed.posts = [...state.feed.posts, ...newPosts.payload];
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
        },
        setShowLoginDialog: (state, showLoginDialog) => {
            state.showLoginDialog = !!(showLoginDialog.payload);
        },
        setShowHomeScreenShortcutSuggestionDialog: (state, showHomeScreenShortcutSuggestionDialog) => {
            state.showHomeScreenShortcutSuggestionDialog = !!(showHomeScreenShortcutSuggestionDialog.payload);
        }
    },
});

export const {
    setHasUserInteracted,
    setCurrentSelectedPostIndex,
    setShowComments,
    setShowSwitchToAppSuggestionDialog,
    setShowLoginDialog,
    addPosts,
    setCurrentPageNumber,
    addFetchedPageNumber,
    setHasMorePages,
    setIsLoading,
    setShowHomeScreenShortcutSuggestionDialog
} = uiSlice.actions;
export default uiSlice.reducer;
