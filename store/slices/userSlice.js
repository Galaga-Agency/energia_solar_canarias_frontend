import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserAPI, logoutUserAPI } from "@/services/api";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUserAPI(email, password);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUserAPI();
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed.";
      });
  },
});

export const selectUser = (state) => state.user.user;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
