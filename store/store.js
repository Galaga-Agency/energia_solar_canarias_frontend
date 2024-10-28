import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/slices/userSlice";
import plantsReducer from "@/store/slices/plantsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    plants: plantsReducer,
    notifications: notificationsReducer,
    theme: themeReducer,
  },
});

export default store;
