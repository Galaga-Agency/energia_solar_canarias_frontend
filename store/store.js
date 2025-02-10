import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import reducers
import userReducer from "@/store/slices/userSlice";
import plantsReducer from "@/store/slices/plantsSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";
import themeReducer from "@/store/slices/themeSlice";
import usersListReducer from "@/store/slices/usersListSlice";
import providersReducer from "@/store/slices/providersSlice";
import dashboardViewReducer from "@/store/slices/dashboardViewSlice";

// Define which states should be cleaned during persistence
const volatileStates = {
  plants: [
    "plantDetails",
    "loadingDetails",
    "loading",
    "error",
    "detailsError",
  ],
  notifications: [
    "loading",
    "error",
    "isLoadingMore",
    "activeError",
    "resolvedError",
  ],
  usersList: ["loading", "error"],
  providers: ["loading", "error"],
};

// Transform to clean sensitive/volatile data before persisting
const cleanDataTransform = createTransform(
  (inboundState, key) => {
    if (volatileStates[key]) {
      const cleanState = { ...inboundState };
      volatileStates[key].forEach((field) => {
        cleanState[field] = null;
      });
      return cleanState;
    }
    return inboundState;
  },
  (outboundState, key) => {
    if (volatileStates[key]) {
      const cleanState = { ...outboundState };
      volatileStates[key].forEach((field) => {
        cleanState[field] = null;
      });
      return cleanState;
    }
    return outboundState;
  }
);

// Main persistence configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "theme", "dashboardView", "plants", "notifications"],
  transforms: [cleanDataTransform],
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  plants: plantsReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
  usersList: usersListReducer,
  providers: providersReducer,
  dashboardView: dashboardViewReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with middleware configuration
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 100,
      },
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: [
          "plants.plantDetails",
          "notifications.activeNotifications",
          "notifications.resolvedNotifications",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
