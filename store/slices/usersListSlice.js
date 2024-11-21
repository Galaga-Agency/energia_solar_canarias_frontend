import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersAPI,
  fetchUserByIdAPI,
  updateUserProfileAPI,
  deactivateUserAPI,
  deleteUserAPI,
} from "@/services/shared-api";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (userToken, { rejectWithValue }) => {
    try {
      return await fetchUsersAPI(userToken);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      return await fetchUserByIdAPI({ userId, token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserClase = createAsyncThunk(
  "users/updateUserClase",
  async ({ userId, clase }, { rejectWithValue }) => {
    try {
      return await updateUserProfileAPI({ userId, clase });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deactivateUser = createAsyncThunk(
  "users/deactivateUser",
  async (userId, { rejectWithValue }) => {
    try {
      return await deactivateUserAPI(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      return await deleteUserAPI(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersListSlice = createSlice({
  name: "usersList",
  initialState: {
    users: [],
    userDetails: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        if (state.userDetails && state.userDetails.id === action.meta.arg) {
          state.userDetails.status = "deactivated";
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.userDetails = null;
        state.users = state.users.filter((user) => user.id !== action.meta.arg);
      });
  },
});

export const selectUsers = (state) => state.usersList.users;
export const selectUserDetails = (state) => state.usersList.userDetails;
export const selectUsersLoading = (state) => state.usersList.isLoading;
export const selectUsersError = (state) => state.usersList.error;
export const selectUserById = (state, userId) =>
  state.usersList.users.find((user) => user.usuario_id === Number(userId)) ||
  null;

export default usersListSlice.reducer;
