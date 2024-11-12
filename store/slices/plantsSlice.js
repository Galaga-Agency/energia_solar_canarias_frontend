import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPlantsAPI } from "@/services/api";

export const fetchPlants = createAsyncThunk(
  "plants/fetchPlants",
  async ({ userId, token }) => {
    const plantsData = await fetchPlantsAPI({ userId, token });
    if (!plantsData || plantsData.length === 0) {
      throw new Error("No plants found for this userId");
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

const plantsSlice = createSlice({
  name: "plants",
  initialState: {
    plants: [],
    plantDetails: null,
    loading: false,
    loadingDetails: false,
    error: null,
    detailsError: null,
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
      });
  },
});

// Selectors
export const selectPlants = (state) => state.plants.plants;
export const selectPlantDetails = (state) => state.plants.plantDetails;
export const selectLoading = (state) => state.plants.loading;
export const selectLoadingDetails = (state) => state.plants.loadingDetails;
export const selectError = (state) => state.plants.error;
export const selectDetailsError = (state) => state.plants.detailsError;

export default plantsSlice.reducer;
