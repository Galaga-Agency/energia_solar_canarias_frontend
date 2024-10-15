import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPlantsMock } from "@/services/api";

export const fetchPlants = createAsyncThunk(
  "plants/fetchPlants",
  async (userId) => {
    const plantsData = await fetchPlantsMock(userId);
    if (!plantsData || plantsData.length === 0) {
      throw new Error("No plants found for this userId");
    }
    return plantsData;
  }
);

const plantsSlice = createSlice({
  name: "plants",
  initialState: {
    plants: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const selectPlants = (state) => state.plants.plants;
export const selectLoading = (state) => state.plants.loading;
export const selectError = (state) => state.plants.error;

export default plantsSlice.reducer;
