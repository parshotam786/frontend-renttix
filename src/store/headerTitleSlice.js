import { createSlice } from "@reduxjs/toolkit";

const headerTitleSlice = createSlice({
  name: "headerTitle",
  initialState: "Dashboard", // Default color mode
  reducers: {
    setHeaderTitle: (state, action) => action.payload, // Update color mode
  },
});

export const { setHeaderTitle } = headerTitleSlice.actions;
export default headerTitleSlice.reducer;
