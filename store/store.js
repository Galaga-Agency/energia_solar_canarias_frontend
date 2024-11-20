import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "@/store/slices/userSlice";
import plantsReducer from "@/store/slices/plantsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import themeReducer from "./slices/themeSlice";
import usersListReducer from "./slices/usersListSlice";
import providersReducer from "./slices/providersSlice";

// Transform to clean sensitive/volatile data before persisting
const cleanDataTransform = createTransform(
  // Transform state on its way to being serialized and persisted
  (inboundState, key) => {
    switch (key) {
      case "plants":
        return {
          ...inboundState,
          plantDetails: null,
          loadingDetails: false,
          loading: false,
          error: null,
          detailsError: null,
        };
      case "notifications":
        return {
          ...inboundState,
          loading: false,
          error: null,
        };
      case "usersList":
        return {
          ...inboundState,
          loading: false,
          error: null,
        };
      case "providers":
        return {
          ...inboundState,
          loading: false,
          error: null,
        };
      default:
        return inboundState;
    }
  },
  // Transform state being rehydrated
  (outboundState, key) => {
    switch (key) {
      case "plants":
        return {
          ...outboundState,
          plantDetails: null,
          loadingDetails: false,
          loading: false,
          error: null,
          detailsError: null,
        };
      case "notifications":
        return {
          ...outboundState,
          loading: false,
          error: null,
        };
      case "usersList":
        return {
          ...outboundState,
          loading: false,
          error: null,
        };
      case "providers":
        return {
          ...outboundState,
          loading: false,
          error: null,
        };
      default:
        return outboundState;
    }
  }
);

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "theme"],
  transforms: [cleanDataTransform],
};

// Separate config for plants slice to handle it specially
const plantsPersistConfig = {
  key: "plants",
  storage,
  blacklist: [
    "plantDetails",
    "loadingDetails",
    "loading",
    "error",
    "detailsError",
  ],
};

// Combine all reducers with special handling for plants
const rootReducer = combineReducers({
  user: userReducer,
  plants: persistReducer(plantsPersistConfig, plantsReducer),
  notifications: notificationsReducer,
  theme: themeReducer,
  usersList: usersListReducer,
  providers: providersReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with middleware configuration
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["plants.plantDetails"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store, null, () => {
  // After rehydration, clear sensitive data
  store.dispatch({ type: "plants/clearPlantDetails" });
});

// Rehydration complete listener
let rehydrated = false;
persistor.subscribe(() => {
  if (!rehydrated && persistor.getState().bootstrapped) {
    rehydrated = true;
    // Clear volatile data after rehydration
    store.dispatch({ type: "plants/clearPlantDetails" });
  }
});

export default store;
