import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersAPI,
  fetchUserByIdAPI,
  updateUserProfileAPI,
  deactivateUserAPI,
  deleteUserAPI,
  updateUserAPI,
} from "@/services/shared-api";

// Existing thunks
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

// Add new updateUser thunk
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData, token }, { rejectWithValue }) => {
    try {
      const response = await updateUserAPI({ userId, userData, token });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update user");
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
  reducers: {
    // Add reducers for direct state updates
    updateUserInList: (state, action) => {
      state.users = state.users.map((user) =>
        user.usuario_id === action.payload.usuario_id ? action.payload : user
      );
      if (state.userDetails?.usuario_id === action.payload.usuario_id) {
        state.userDetails = action.payload;
      }
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch user by id cases
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update in both lists
        state.users = state.users.map((user) =>
          user.usuario_id === action.payload.usuario_id ? action.payload : user
        );
        if (state.userDetails?.usuario_id === action.payload.usuario_id) {
          state.userDetails = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Deactivate user cases
      .addCase(deactivateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.userDetails && state.userDetails.id === action.meta.arg) {
          state.userDetails.status = "deactivated";
        }
        state.error = null;
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = null;
        state.users = state.users.filter((user) => user.id !== action.meta.arg);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { updateUserInList, clearUserError } = usersListSlice.actions;

// Export selectors
export const selectUsers = (state) => state.usersList.users;
export const selectUserDetails = (state) => state.usersList.userDetails;
export const selectUsersLoading = (state) => state.usersList.isLoading;
export const selectUsersError = (state) => state.usersList.error;
export const selectUserById = (state, userId) =>
  state.usersList.users.find((user) => user.usuario_id === Number(userId)) ||
  null;

export default usersListSlice.reducer;
