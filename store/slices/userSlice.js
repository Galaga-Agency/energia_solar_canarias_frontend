import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  loginRequestAPI,
  validateTokenRequestAPI,
  updateUserAPI,
  deleteUserAPI,
  getUserPlantsAPI,
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
      console.log("API Response:", response); // Add this log

      // If the response indicates an error or is not successful
      if (
        !response ||
        response.status === false ||
        response.status === "error"
      ) {
        return rejectWithValue(response?.message || "Token validation failed");
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, ...userData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await updateUserAPI({ userId, userData, token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await deleteUserAPI({ userId, token });
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserPlants = createAsyncThunk(
  "users/getUserPlants",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.user?.tokenIdentificador;
      const response = await getUserPlantsAPI({ userId, token });
      return { userId, plants: response.data };
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
  users: [],
  userPlants: {},
};

// Slice Definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isAdmin = action.payload?.clase === "admin";
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
        state.isAdmin = action.payload?.clase === "admin";
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
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user.usuario_id === action.payload.usuario_id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.usuario_id !== action.payload.userId
        );
        delete state.userPlants[action.payload.userId];
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user plants
      .addCase(getUserPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlants[action.payload.userId] = action.payload.plants;
      })
      .addCase(getUserPlants.rejected, (state, action) => {
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
  (userState) => userState?.user
);

export const selectIsUserReady = createSelector(
  [selectUser],
  (user) => !!user?.tokenIdentificador
);

export const selectTokenValidated = createSelector(
  [selectUserState],
  (userState) => userState?.tokenValidated
);

export const selectIsLoggedIn = createSelector(
  [selectUserState],
  (userState) => userState?.isLoggedIn
);

export const selectIsAdmin = createSelector(
  [selectUserState],
  (userState) => userState?.isAdmin
);

export const selectLoading = createSelector(
  [selectUserState],
  (userState) => userState?.loading
);

export const selectError = createSelector(
  [selectUserState],
  (userState) => userState?.error
);

export const selectUserWithToken = createSelector([selectUser], (user) => ({
  user,
  token: user?.tokenIdentificador,
}));

// Action creators
export const { setUser, logoutUser, clearError } = userSlice.actions;

export default userSlice.reducer;
