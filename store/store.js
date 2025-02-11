// Import necessary dependencies from Redux Toolkit and Redux Persist
import { configureStore, combineReducers } from "@reduxjs/toolkit";
// Redux Persist helps in storing Redux state in localStorage/sessionStorage
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// Default storage engine (localStorage in web browsers)
import storage from "redux-persist/lib/storage";

// Import all our Redux slice reducers
import userReducer from "@/store/slices/userSlice";
import plantsReducer from "@/store/slices/plantsSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";
import themeReducer from "@/store/slices/themeSlice";
import usersListReducer from "@/store/slices/usersListSlice";
import providersReducer from "@/store/slices/providersSlice";
import dashboardViewReducer from "@/store/slices/dashboardViewSlice";

/**
 * Define states that should NOT be persisted between page reloads
 * - These are typically UI states like loading indicators and error messages
 * - They should start fresh each time the app loads
 * - Organized by reducer name for easy management
 */
const volatileStates = {
  plants: [
    "plantDetails", // Current plant being viewed
    "loadingDetails", // Loading state for plant details
    "loading", // General loading state
    "error", // General error state
    "detailsError", // Error state for plant details
  ],
  notifications: [
    "loading", // Loading state for notifications
    "error", // Error state for notifications
    "isLoadingMore", // Loading state for pagination
    "activeError", // Error state for active notifications
    "resolvedError", // Error state for resolved notifications
  ],
  usersList: ["loading", "error"],
  providers: ["loading", "error"],
};

/**
 * Create a transform that cleans specific state properties before persistence
 * This runs in two scenarios:
 * 1. When state is about to be persisted (inbound)
 * 2. When state is being retrieved from storage (outbound)
 */
const cleanDataTransform = createTransform(
  // Transform state going into storage (inbound)
  (inboundState, key) => {
    if (volatileStates[key]) {
      const cleanState = { ...inboundState };
      // Set all volatile fields to null
      volatileStates[key].forEach((field) => {
        cleanState[field] = null;
      });
      return cleanState;
    }
    return inboundState;
  },
  // Transform state coming out of storage (outbound)
  (outboundState, key) => {
    if (volatileStates[key]) {
      const cleanState = { ...outboundState };
      // Also clean state when loading from storage
      volatileStates[key].forEach((field) => {
        cleanState[field] = null;
      });
      return cleanState;
    }
    return outboundState;
  }
);

/**
 * Configuration for Redux Persist
 * Defines how and what state should be persisted
 */
const persistConfig = {
  key: "root", // Key under which state will be stored in localStorage
  storage, // Storage engine to use (localStorage)
  whitelist: [
    // Only these reducers will be persisted
    "user", // User data (keep user logged in)
    "theme", // UI theme preferences
    "dashboardView", // Dashboard layout preferences
    "plants", // Plant data (minus volatile states)
    "notifications", // Notifications (minus volatile states)
  ],
  transforms: [cleanDataTransform], // Apply our cleaning transform
};

/**
 * Combine all individual reducers into one root reducer
 * This creates the complete state tree structure
 */
const rootReducer = combineReducers({
  user: userReducer,
  plants: plantsReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
  usersList: usersListReducer,
  providers: providersReducer,
  dashboardView: dashboardViewReducer,
});

// Wrap the root reducer with persistence capabilities
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Define middleware configuration
const middlewareConfig = {
  immutableCheck: { warnAfter: 1000 },
  serializableCheck: {
    ignoredActions: [
      FLUSH,
      REHYDRATE,
      PAUSE,
      PERSIST,
      PURGE,
      REGISTER,
      "user/logoutUserThunk/pending",
      "user/logoutUserThunk/fulfilled",
      "user/logoutUserThunk/rejected",
    ],
    ignoredPaths: [
      "plants.plantDetails",
      "notifications.activeNotifications",
      "notifications.resolvedNotifications",
    ],
  },
};

/**
 * Create and configure the Redux store
 * This is the central point of Redux state management
 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfig),
  devTools: process.env.NODE_ENV !== "production",
});

// Create a persistor object to handle state persistence
export const persistor = persistStore(store);

// Export the store as the default export
export default store;
