import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllPlantsAPI,
  fetchPlantDetailsAPI,
  fetchPlantsByProviderAPI,
} from "@/services/api";

export const fetchPlants = createAsyncThunk(
  "plants/fetchPlants",
  async ({ userId, token, page = 1, pageSize = 20 }) => {
    const plantsData = await fetchAllPlantsAPI({
      userId,
      token,
      page,
      pageSize,
    });
    if (!plantsData || plantsData.length === 0) {
      throw new Error("No plants found");
    }
    return plantsData;
  }
);

export const fetchPlantDetails = createAsyncThunk(
  "plants/fetchPlantDetails",
  async ({ userId, token, plantId }) => {
    const plantDetails = await fetchPlantDetailsAPI({ userId, token, plantId });
    if (!plantDetails) {
      throw new Error("Plant details not found");
    }
    return plantDetails;
  }
);

export const fetchPlantsByProvider = createAsyncThunk(
  "plants/fetchPlantsByProvider",
  async ({ userId, token, providerName }) => {
    const plantsData = await fetchPlantsByProviderAPI({
      userId,
      token,
      providerName,
    });
    if (!plantsData || plantsData.length === 0) {
      throw new Error("No plants found for this providerName");
    }
    return plantsData;
  }
);

const plantsSlice = createSlice({
  name: "plants",
  initialState: {
    plants: [],
    plantDetails: null,
    plantsByProvider: [],
    loading: false,
    loadingDetails: false,
    loadingByProvider: false,
    error: null,
    detailsError: null,
    providerError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all plants
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = action.payload;
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.plants = [];
      })

      // Fetch specific plant details
      .addCase(fetchPlantDetails.pending, (state) => {
        state.loadingDetails = true;
        state.detailsError = null;
      })
      .addCase(fetchPlantDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.plantDetails = action.payload;
      })
      .addCase(fetchPlantDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.detailsError = action.error.message;
        state.plantDetails = null;
      })

      // Fetch plants by provider (vendor)
      .addCase(fetchPlantsByProvider.pending, (state) => {
        state.loadingByProvider = true;
        state.providerError = null;
      })
      .addCase(fetchPlantsByProvider.fulfilled, (state, action) => {
        state.loadingByProvider = false;
        state.plantsByProvider = action.payload;
      })
      .addCase(fetchPlantsByProvider.rejected, (state, action) => {
        state.loadingByProvider = false;
        state.providerError = action.error.message;
        state.plantsByProvider = [];
      });
  },
});

// Selectors
export const selectPlants = (state) => state.plants.plants;
export const selectPlantDetails = (state) => state.plants.plantDetails;
export const selectPlantsByProvider = (state) => state.plants.plantsByProvider;
export const selectLoading = (state) => state.plants.loading;
export const selectLoadingDetails = (state) => state.plants.loadingDetails;
export const selectLoadingByProvider = (state) =>
  state.plants.loadingByProvider;
export const selectError = (state) => state.plants.error;
export const selectDetailsError = (state) => state.plants.detailsError;
export const selectProviderError = (state) => state.plants.providerError;

export default plantsSlice.reducer;
