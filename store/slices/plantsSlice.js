import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  fetchAllPlantsAPI,
  fetchPlantDetailsAPI,
  fetchPlantsByProviderAPI,
} from "@/services/api";

// Thunks
export const fetchPlants = createAsyncThunk(
  "plants/fetchPlants",
  async ({ userId, token, page = 1, pageSize = 20 }) => {
    console.log("Fetching all plants with:", { userId, token, page, pageSize });
    const plantsData = await fetchAllPlantsAPI({
      userId,
      token,
      page,
      pageSize,
    });
    if (!plantsData || plantsData.length === 0) {
      throw new Error("No plants found");
    }
    console.log("Plants data received:", plantsData);
    return plantsData;
  }
);

export const fetchPlantDetails = createAsyncThunk(
  "plants/fetchPlantDetails",
  async ({ userId, token, plantId, provider }) => {
    console.log("Fetching plant details with:", { userId, plantId, provider });
    const plantDetails = await fetchPlantDetailsAPI({
      userId,
      token,
      plantId,
      provider,
    });

    if (!plantDetails) {
      throw new Error("Plant details not found");
    }
    console.log("Plant details received:", plantDetails);
    return plantDetails;
  }
);

export const fetchPlantsByProvider = createAsyncThunk(
  "plants/fetchPlantsByProvider",
  async ({ userId, token, provider }) => {
    console.log("Fetching plants by provider:", { userId, provider });
    const plantsData = await fetchPlantsByProviderAPI({
      userId,
      token,
      provider,
    });

    if (!plantsData) {
      throw new Error("No plants found for this provider");
    }

    // Transform the data if needed
    const transformedData = plantsData.data || plantsData;
    console.log("Provider plants received:", transformedData);
    return transformedData;
  }
);

const initialState = {
  plants: [],
  plantDetails: null,
  loading: false,
  loadingDetails: false,
  error: null,
  detailsError: null,
  currentProvider: null,
  lastUpdated: null,
};

const plantsSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    clearPlants: (state) => {
      return initialState;
    },
    clearPlantDetails: (state) => {
      state.plantDetails = null;
      state.loadingDetails = false;
      state.detailsError = null;
    },
    setCurrentProvider: (state, action) => {
      state.currentProvider = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all plants cases
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = action.payload || [];
        state.error = null;
        state.lastUpdated = new Date().toISOString();
        console.log("Plants stored in state:", state.plants);
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.plants = [];
        console.error("Plants fetch failed:", action.error);
      })

      // Fetch plant details cases
      .addCase(fetchPlantDetails.pending, (state) => {
        state.loadingDetails = true;
        state.detailsError = null;
      })
      .addCase(fetchPlantDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.plantDetails = action.payload;
        state.detailsError = null;
        state.lastUpdated = new Date().toISOString();
        console.log("Plant details stored in state:", state.plantDetails);
      })
      .addCase(fetchPlantDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.detailsError = action.error.message;
        state.plantDetails = null;
        console.error("Plant details fetch failed:", action.error);
      })

      // Fetch plants by provider cases
      .addCase(fetchPlantsByProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlantsByProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
        state.lastUpdated = new Date().toISOString();
        console.log("Provider plants stored in state:", state.plants);
      })
      .addCase(fetchPlantsByProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.plants = [];
        console.error("Provider plants fetch failed:", action.error);
      });
  },
});

// Selectors with safety checks
const selectPlantsState = (state) => state.plants;

export const selectPlants = createSelector(
  [selectPlantsState],
  (state) => state.plants || []
);

export const selectPlantDetails = createSelector(
  [selectPlantsState],
  (state) => state.plantDetails || null
);

export const selectLoading = createSelector([selectPlantsState], (state) =>
  Boolean(state.loading)
);

export const selectLoadingDetails = createSelector(
  [selectPlantsState],
  (state) => Boolean(state.loadingDetails)
);

export const selectError = createSelector(
  [selectPlantsState],
  (state) => state.error || null
);

export const selectDetailsError = createSelector(
  [selectPlantsState],
  (state) => state.detailsError || null
);

export const selectCurrentProvider = createSelector(
  [selectPlantsState],
  (state) => state.currentProvider || null
);

export const selectLastUpdated = createSelector(
  [selectPlantsState],
  (state) => state.lastUpdated || null
);

export const selectLoadingAny = createSelector(
  [selectLoading, selectLoadingDetails],
  (loading, loadingDetails) => Boolean(loading || loadingDetails)
);

export const selectAllErrors = createSelector(
  [selectError, selectDetailsError],
  (error, detailsError) => ({
    generalError: error || null,
    detailsError: detailsError || null,
  })
);

// Actions
export const { clearPlants, clearPlantDetails, setCurrentProvider } =
  plantsSlice.actions;

export default plantsSlice.reducer;
