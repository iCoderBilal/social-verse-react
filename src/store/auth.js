import {createSlice} from "@reduxjs/toolkit";
import * as UserLocalStorageHelper from "../utils/UserLocalStorageHelper";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: UserLocalStorageHelper.isLocalStorageUserLoggedIn(),
        user: UserLocalStorageHelper.getLocalStorageUser() ?? {},
    },
    reducers: {
        setUserLoggedIn: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
            console.log(action.payload)
        },
        setUserLoggedOut: (state, user) => {
            state.isLoggedIn = false;
            state.user = {};
            UserLocalStorageHelper.clearLocalStorage();
        },
    },
});

export const {setUserLoggedIn, setUserLoggedOut} = authSlice.actions;
export default authSlice.reducer;
