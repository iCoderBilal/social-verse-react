import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    hasUserInteracted: false,
  },
  reducers: {
    userInteracted: (state) => {
      state.hasUserInteracted = true;
    },
  },
});

export const { userInteracted } = uiSlice.actions;
export default uiSlice.reducer;
