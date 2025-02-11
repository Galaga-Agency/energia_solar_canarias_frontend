// Import necessary dependencies from Redux Toolkit and Redux Persist
import { configureStore, combineReducers } from "@reduxjs/toolkit";
// Redux Persist helps in storing Redux state in localStorage/sessionStorage
import { persistStore, persistReducer, createTransform } from "redux-persist";
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

// Add logout handling middleware
const logoutMiddleware = (store) => (next) => (action) => {
  if (action.type === "user/logoutUser") {
    // Clear all states except theme
    const themeState = store.getState().theme;
    storage.removeItem("persist:root");
    return next({
      ...action,
      payload: {
        theme: themeState,
      },
    });
  }
  return next(action);
};

// Wrap the root reducer with persistence capabilities
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Create and configure the Redux store
 * This is the central point of Redux state management
 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure immutability checking
      immutableCheck: {
        warnAfter: 1000, // Only warn after 100 checks to reduce noise
      },
      // Configure serialization checking
      serializableCheck: {
        // Actions that are allowed to contain non-serializable values
        ignoredActions: [
          // Redux Persist internal actions
          "persist/PERSIST", // Initial persist action
          "persist/REHYDRATE", // State restoration action
          "persist/PAUSE", // Pause persistence
          "persist/PURGE", // Clear persisted state
          "persist/FLUSH", // Force state persistence
          "persist/REGISTER", // Register persist configuration
          // Our custom actions that might contain non-serializable data
          "user/logoutUserThunk/pending",
          "user/logoutUserThunk/fulfilled",
          "user/logoutUserThunk/rejected",
        ],
        // State paths that are allowed to contain non-serializable values
        ignoredPaths: [
          "plants.plantDetails",
          "notifications.activeNotifications",
          "notifications.resolvedNotifications",
        ],
      },
    }).concat(logoutMiddleware),
  // Enable Redux DevTools in development, disable in production
  devTools: process.env.NODE_ENV !== "production",
});

// Create a persistor object to handle state persistence
export const persistor = persistStore(store);

// Export the store as the default export
export default store;
