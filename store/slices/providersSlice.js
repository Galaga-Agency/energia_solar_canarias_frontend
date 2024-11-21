import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProvidersAPI } from "@/services/shared-api";

export const fetchProviders = createAsyncThunk(
  "providers/fetchProviders",
  async ({ token }) => {
    const response = await fetchProvidersAPI({ token });
    return response;
  }
);

const providersSlice = createSlice({
  name: "providers",
  initialState: {
    providers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectProviders = (state) => state.providers.providers;
export const selectProvidersLoading = (state) => state.providers.loading;
export const selectError = (state) => state.providers.error;

export default providersSlice.reducer;
