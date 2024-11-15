import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "@/store/slices/userSlice";
import plantsReducer from "@/store/slices/plantsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import themeReducer from "./slices/themeSlice";
import usersListReducer from "./slices/usersListSlice";
import providersReducer from "./slices/providersSlice";

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  plants: plantsReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
  usersList: usersListReducer,
  providers: providersReducer,
});

// Configuration for redux-persist to persist all slices
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "user",
    "providers",
    "plants",
    "notifications",
    "theme",
    "usersList",
  ],
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necessary for redux-persist to avoid serializable state error
    }),
});

export const persistor = persistStore(store);
export default store;
