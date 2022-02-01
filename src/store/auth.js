import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
import * as UserLocalStorageHelper from "../utils/UserLocalStorageHelper";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: UserLocalStorageHelper.isLocalStorageUserLoggedIn(),
    user: UserLocalStorageHelper.getLocalStorageUser() ?? {},
  },
  reducers: {
    userLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.user = {};
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
