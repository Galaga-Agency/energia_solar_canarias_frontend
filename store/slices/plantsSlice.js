import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  fetchAllPlantsAPI,
  fetchPlantDetailsAPI,
  fetchPlantsByProviderAPI,
} from "@/services/shared-api";
import {
  fetchGoodweGraphDataAPI,
  fetchGoodweRealtimeDataAPI,
  fetchGoodweWeatherDataAPI,
} from "@/services/goodwe-api";
import {
  fetchSolarEdgeGraphDataAPI,
  fetchSolarEdgeRealtimeDataAPI,
  fetchSolarEdgeWeatherDataAPI,
} from "@/services/solardedge-api";

// Thunks
export const fetchPlants = createAsyncThunk(
  "plants/fetchPlants",
  async ({ userId, token, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const plantsData = await fetchAllPlantsAPI({
        userId,
        token,
        page,
        pageSize,
      });
      if (!plantsData || plantsData.length === 0)
        throw new Error("No plants found");
      return plantsData;
    } catch (error) {
      console.error("Fetch plants error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlantDetails = createAsyncThunk(
  "plants/fetchPlantDetails",
  async ({ userId, token, plantId, provider }, { rejectWithValue }) => {
    try {
      const plantDetails = await fetchPlantDetailsAPI({
        userId,
        token,
        plantId,
        provider,
      });
      if (!plantDetails) throw new Error("Plant details not found");
      return plantDetails;
    } catch (error) {
      console.error("Fetch plant details error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlantsByProvider = createAsyncThunk(
  "plants/fetchPlantsByProvider",
  async ({ userId, token, provider }, { rejectWithValue }) => {
    try {
      const plantsData = await fetchPlantsByProviderAPI({
        userId,
        token,
        provider,
      });
      if (!plantsData) throw new Error("No plants found for this provider");
      return plantsData.data || plantsData;
    } catch (error) {
      console.error("Fetch plants by provider error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGoodweGraphData = createAsyncThunk(
  "plants/fetchGoodweGraphData",
  async (
    { id, date, range, chartIndexId, token },
    { getState, rejectWithValue }
  ) => {
    const requestId = `${range}-${chartIndexId}`;

    try {
      const response = await fetchGoodweGraphDataAPI({
        id,
        date,
        range,
        chartIndexId,
        token,
      });

      const state = getState();
      if (state.plants.currentGraphRequest !== requestId) {
        return rejectWithValue("Outdated request");
      }

      return { ...response, requestId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGoodweWeatherData = createAsyncThunk(
  "plants/fetchGoodweWeatherData",
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const weatherData = await fetchGoodweWeatherDataAPI(name, token);
      if (!weatherData) throw new Error("No weather data found");
      return weatherData;
    } catch (error) {
      console.error("Fetch weather data error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGoodweRealtimeData = createAsyncThunk(
  "plants/fetchGoodweRealtimeData",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const realtimeData = await fetchGoodweRealtimeDataAPI({ plantId, token });
      if (!realtimeData) throw new Error("No real-time data found");
      return realtimeData;
    } catch (error) {
      console.error("Fetch real-time data error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Solaredge

export const fetchSolarEdgeGraphData = createAsyncThunk(
  "plants/fetchSolarEdgeGraphData",
  async (
    { plantId, dia, fechaFin, fechaInicio, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchSolarEdgeGraphDataAPI({
        plantId,
        dia,
        fechaFin,
        fechaInicio,
        token,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolarEdgeRealtimeData = createAsyncThunk(
  "plants/fetchSolarEdgeRealtimeData",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const weatherData = await fetchSolarEdgeRealtimeDataAPI({
        plantId,
        token,
      });
      if (!weatherData) throw new Error("No weather data found");
      return weatherData;
    } catch (error) {
      console.error("Fetch weather data error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolarEdgeWeatherData = createAsyncThunk(
  "plants/fetchSolarEdgeWeatherData",
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const weatherData = await fetchSolarEdgeWeatherDataAPI({
        name,
        token,
      });
      return weatherData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  plants: [],
  plantDetails: null,
  loading: false,
  loadingDetails: false,
  loadingDynamicData: false,
  loadingStaticdata: false,
  error: null,
  detailsError: null,
  currentProvider: null,
  lastUpdated: null,
  graphData: null,
  graphLoading: false,
  graphError: null,
  currentGraphRequest: null,
  weatherData: null,
  weatherLoading: false,
  weatherError: null,
  loadingStates: {},
};

const plantsSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    clearPlants: () => initialState,
    clearPlantDetails: (state) => {
      state.plantDetails = null;
      state.loadingDetails = false;
      state.detailsError = null;
    },
    setCurrentProvider: (state, action) => {
      state.currentProvider = action.payload;
    },
    clearGraphData: (state) => {
      state.graphData = null;
      state.graphError = null;
      state.graphLoading = false;
      state.currentGraphRequest = null;
    },
    clearRealtimeData: (state) => {
      state.realtimeData = null;
      state.realtimeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = action.payload || [];
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch plants";
        state.plants = [];
      })
      .addCase(fetchPlantDetails.pending, (state) => {
        if (!state.loadingDetails) {
          state.loadingDetails = true;
          state.detailsError = null;
        }
      })
      .addCase(fetchPlantDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.plantDetails = action.payload;
        state.detailsError = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPlantDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.detailsError = action.payload || "Failed to fetch details";
        state.plantDetails = null;
      })
      .addCase(fetchPlantsByProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlantsByProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPlantsByProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch plants by provider";
        state.plants = [];
      })

      // Goodwe
      .addCase(fetchGoodweGraphData.pending, (state, action) => {
        state.graphLoading = true;
        state.graphError = null;
        state.currentGraphRequest = `${action.meta.arg.range}-${action.meta.arg.chartIndexId}`;
        state.graphData = null;
      })
      .addCase(fetchGoodweGraphData.fulfilled, (state, action) => {
        if (state.currentGraphRequest === action.payload.requestId) {
          state.graphLoading = false;
          state.graphData = action.payload;
          state.graphError = null;
        }
      })
      .addCase(fetchGoodweGraphData.rejected, (state, action) => {
        if (action.payload !== "Outdated request") {
          state.graphLoading = false;
          state.graphData = null;
          state.graphError = action.payload || "Failed to fetch graph data";
        }
      })
      .addCase(fetchGoodweWeatherData.pending, (state) => {
        state.weatherLoading = true;
        state.weatherError = null;
      })
      .addCase(fetchGoodweWeatherData.fulfilled, (state, action) => {
        state.weatherLoading = false;
        state.weatherData = action.payload;
        state.weatherError = null;
      })
      .addCase(fetchGoodweWeatherData.rejected, (state, action) => {
        state.weatherLoading = false;
        state.weatherData = null;
        state.weatherError = action.payload || "Failed to fetch weather data";
      })
      .addCase(fetchGoodweRealtimeData.pending, (state) => {
        console.log("Fetching real-time data: pending...");
        state.realtimeLoading = true;
        state.realtimeError = null;
      })
      .addCase(fetchGoodweRealtimeData.fulfilled, (state, action) => {
        console.log("Real-time data fetched successfully:", action.payload);
        state.realtimeLoading = false;
        state.realtimeData = action.payload;
        state.realtimeError = null;
      })
      .addCase(fetchGoodweRealtimeData.rejected, (state, action) => {
        console.error("Real-time data fetch failed:", action.payload);
        state.realtimeLoading = false;
        state.realtimeData = null;
        state.realtimeError =
          action.payload || "Failed to fetch real-time data";
      })

      // Solaredge
      .addCase(fetchSolarEdgeGraphData.pending, (state) => {
        state.graphLoading = true;
        state.graphError = null;
      })
      .addCase(fetchSolarEdgeGraphData.fulfilled, (state, action) => {
        state.graphLoading = false;
        state.graphData = action.payload;
      })
      .addCase(fetchSolarEdgeGraphData.rejected, (state, action) => {
        state.graphLoading = false;
        state.graphError = action.payload;
      })
      .addCase(fetchSolarEdgeRealtimeData.pending, (state) => {
        state.realtimeLoading = true;
        state.realtimeError = null;
      })
      .addCase(fetchSolarEdgeRealtimeData.fulfilled, (state, action) => {
        state.realtimeLoading = false;
        state.realtimeData = action.payload;
      })
      .addCase(fetchSolarEdgeRealtimeData.rejected, (state, action) => {
        state.realtimeLoading = false;
        state.realtimeError = action.payload;
      })
      .addCase(fetchSolarEdgeWeatherData.pending, (state) => {
        state.weatherLoading = true;
        state.weatherError = null;
      })
      .addCase(fetchSolarEdgeWeatherData.fulfilled, (state, action) => {
        state.weatherLoading = false;
        state.weatherData = action.payload;
      })
      .addCase(fetchSolarEdgeWeatherData.rejected, (state, action) => {
        state.weatherLoading = false;
        state.weatherError = action.payload;
      });
  },
});

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
  (state) => state.loadingDetails
);
export const selectPlantLoadingState = createSelector(
  [selectPlantsState, (_, plantId) => plantId],
  (state, plantId) => Boolean(state.loadingStates[plantId])
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
export const selectGraphData = (state) => state.plants.graphData;
export const selectGraphLoading = (state) => state.plants.graphLoading;
export const selectGraphError = (state) => state.plants.graphError;
export const selectWeatherData = (state) => state.plants.weatherData;
export const selectWeatherLoading = (state) => state.plants.weatherLoading;
export const selectWeatherError = (state) => state.plants.weatherError;
export const selectRealtimeData = (state) => state.plants.realtimeData;
export const selectRealtimeLoading = (state) => state.plants.realtimeLoading;
export const selectRealtimeError = (state) => state.plants.realtimeError;

export const {
  clearPlants,
  clearPlantDetails,
  setCurrentProvider,
  clearGraphData,
  clearRealtimeData,
} = plantsSlice.actions;

export default plantsSlice.reducer;
