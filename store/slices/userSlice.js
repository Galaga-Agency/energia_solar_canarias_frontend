import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginRequestAPI,
  validateTokenRequestAPI,
  updateUserProfileAPI,
} from "@/services/api";

export const authenticateUser = createAsyncThunk(
  "user/authenticateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginRequestAPI(userData);
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
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", () => {
  return;
});

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfileAPI(userData);
      console.log("response from redux: ", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoggedIn = true;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
