import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  loginRequestAPI,
  validateTokenRequestAPI,
  updateUserProfileAPI,
} from "@/services/shared-api";

// Async Thunks
export const authenticateUser = createAsyncThunk(
  "user/authenticateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginRequestAPI(userData);
      if (!response) throw new Error("Authentication failed");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateToken = createAsyncThunk(
  "user/validateToken",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await validateTokenRequestAPI(id, token);
      if (!response) throw new Error("Token validation failed");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfileAPI(userData);
      if (!response) throw new Error("Profile update failed");
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  isAdmin: false,
  tokenValidated: false,
};

// Slice Definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isAdmin = action.payload.clase === "admin";
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.error = null;
      state.tokenValidated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Authentication cases
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isAdmin = action.payload.clase === "admin";
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
      })
      // Token validation cases
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === true) {
          state.user = action.payload.data;
          state.isLoggedIn = true;
          state.isAdmin = action.payload.data.clase === "admin";
          state.tokenValidated = true;
        } else {
          state.error = action.payload.message;
          state.isLoggedIn = false;
          state.tokenValidated = false;
        }
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
        state.tokenValidated = false;
      })
      // Profile update cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Base selector
const selectUserState = (state) => state.user;

// Derived selectors
export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState.user
);

export const selectIsUserReady = createSelector(
  [selectUser],
  (user) => !!user?.tokenIdentificador
);

export const selectTokenValidated = createSelector(
  [selectUserState],
  (userState) => userState.tokenValidated
);

export const selectIsLoggedIn = createSelector(
  [selectUserState],
  (userState) => userState.isLoggedIn
);

export const selectIsAdmin = createSelector(
  [selectUserState],
  (userState) => userState.isAdmin
);

export const selectLoading = createSelector(
  [selectUserState],
  (userState) => userState.loading
);

export const selectError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

export const selectUserWithToken = createSelector([selectUser], (user) => ({
  user,
  token: user?.tokenIdentificador,
}));

// Action creators
export const { setUser, logoutUser, clearError } = userSlice.actions;

export default userSlice.reducer;
