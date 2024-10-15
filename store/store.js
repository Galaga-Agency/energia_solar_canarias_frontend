import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/userSlice";
import plantsReducer from "@/store/slices/plantsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    plants: plantsReducer,
  },
});

export default store;
