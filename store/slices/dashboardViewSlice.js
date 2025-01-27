import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  view: "providers", // Default view
};

const dashboardViewSlice = createSlice({
  name: "dashboardView",
  initialState,
  reducers: {
    setDashboardView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const { setDashboardView } = dashboardViewSlice.actions;
export const selectDashboardView = (state) => state.dashboardView.view;
export default dashboardViewSlice.reducer;
