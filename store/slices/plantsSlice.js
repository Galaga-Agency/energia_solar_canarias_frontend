import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  associatePlantToUserAPI,
  dissociatePlantFromUserAPI,
  fetchAllPlantsAPI,
  fetchAssociatedUsersAPI,
  fetchEnvironmentalBenefitsAPI,
  fetchPlantDetailsAPI,
  fetchPlantsByProviderAPI,
  fetchUserAssociatedPlantsAPI,
} from "@/services/shared-api";
import {
  fetchGoodweAlertsAPI,
  fetchGoodweEquipmentDetailsAPI,
  fetchGoodweGraphDataAPI,
  fetchGoodweRealtimeDataAPI,
  fetchGoodweWeatherDataAPI,
} from "@/services/goodwe-api";
import {
  fetchBatteryChargingStateAPI,
  fetchSolarEdgeComparisonGraphAPI,
  fetchSolarEdgeGraphDataAPI,
  fetchSolarEdgeInventoryAPI,
  fetchSolarEdgeOverviewAPI,
  fetchSolarEdgeRealtimeDataAPI,
  fetchSolarEdgeWeatherDataAPI,
} from "@/services/solardedge-api";
import {
  fetchVictronEnergyAlertsAPI,
  fetchVictronEnergyGraphDataAPI,
  fetchVictronEnergyRealtimeDataAPI,
  fetchVictronEnergyWeatherDataAPI,
} from "@/services/victronenergy-api";

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

export const fetchUserAssociatedPlants = createAsyncThunk(
  "plants/fetchUserAssociatedPlants",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const plants = await fetchUserAssociatedPlantsAPI({ userId, token });
      return plants;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const associatePlantToUser = createAsyncThunk(
  "plants/associatePlantToUser",
  async (
    { userId, plantId, provider, token },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await associatePlantToUserAPI({ userId, plantId, provider, token });
      // After successful association, refresh the user's plants list
      dispatch(fetchUserAssociatedPlants({ userId, token }));
      return { userId, plantId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dissociatePlantFromUser = createAsyncThunk(
  "plants/dissociatePlantFromUser",
  async (
    { userId, plantId, provider, token },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await dissociatePlantFromUserAPI({ userId, plantId, provider, token });
      // After successful dissociation, refresh the user's plants list
      dispatch(fetchUserAssociatedPlants({ userId, token }));
      return { userId, plantId };
    } catch (error) {
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
      // console.log("plant details in redux: ", plantDetails);
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

export const fetchEnvironmentalBenefits = createAsyncThunk(
  "plants/fetchEnvironmentalBenefits",
  async ({ plantId, provider, token }, { rejectWithValue }) => {
    try {
      const benefits = await fetchEnvironmentalBenefitsAPI({
        plantId,
        provider,
        token,
      });
      return benefits;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssociatedUsers = createAsyncThunk(
  "plants/fetchAssociatedUsers",
  async ({ plantId, provider, token }, { rejectWithValue }) => {
    try {
      const users = await fetchAssociatedUsersAPI({ plantId, provider, token });

      // Filter out users where `eliminado !== 0`
      const activeUsers = users.filter((user) => user.eliminado === 0);

      return activeUsers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Goodwe

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

export const fetchGoodweEquipmentDetails = createAsyncThunk(
  "plants/fetchGoodweEquipmentDetails",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const equipmentDetails = await fetchGoodweEquipmentDetailsAPI({
        plantId,
        token,
      });
      return equipmentDetails;
    } catch (error) {
      console.error("Fetch equipment details error:", error);
      return rejectWithValue(
        error.message || "Failed to fetch equipment details"
      );
    }
  }
);

// Solaredge

export const fetchSolarEdgeGraphData = createAsyncThunk(
  "plants/fetchSolarEdgeGraphData",
  async ({ id, dia, fechaFin, fechaInicio, token }, { rejectWithValue }) => {
    try {
      // console.log(
      //   "fetchSolarEdgeGraphData: ",
      //   id,
      //   dia,
      //   fechaFin,
      //   fechaInicio,
      //   token
      // );
      const response = await fetchSolarEdgeGraphDataAPI({
        id,
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

export const fetchSolarEdgeOverview = createAsyncThunk(
  "plants/fetchSolarEdgeOverview",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const data = await fetchSolarEdgeOverviewAPI({ plantId, token });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolarEdgeComparisonGraph = createAsyncThunk(
  "plants/fetchSolarEdgeComparisonGraph",
  async ({ plantId, timeUnit, date, token }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearSolarEdgeComparisonGraph());
      const response = await fetchSolarEdgeComparisonGraphAPI({
        plantId,
        timeUnit,
        date,
        token,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolarEdgeInventory = createAsyncThunk(
  "plants/fetchSolarEdgeInventory",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const data = await fetchSolarEdgeInventoryAPI({ plantId, token });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBatteryChargingState = createAsyncThunk(
  "plants/fetchBatteryChargingState",
  async ({ plantId, startDate, endDate, token }, { rejectWithValue }) => {
    try {
      const data = await fetchBatteryChargingStateAPI({
        plantId,
        startDate,
        endDate,
        token,
      });
      return data;
    } catch (error) {
      console.error("Error fetching battery charging state:", error);
      return rejectWithValue(error.message || "Failed to fetch battery data.");
    }
  }
);

// victron energy

export const fetchVictronEnergyWeatherData = createAsyncThunk(
  "plants/fetchVictronEnergyWeatherData",
  async ({ lat, lng, token }, { rejectWithValue }) => {
    try {
      const weatherData = await fetchVictronEnergyWeatherDataAPI({
        lat,
        lng,
        token,
      });
      // console.log("redux weatherData: ", weatherData);
      return weatherData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVictronEnergyGraphData = createAsyncThunk(
  "plants/fetchVictronEnergyGraphData",
  async ({ id, interval, type, start, end, token }, { rejectWithValue }) => {
    if (!token) {
      return rejectWithValue("No authentication token available");
    }

    try {
      const response = await fetchVictronEnergyGraphDataAPI({
        plantId: id,
        interval,
        type,
        fechaInicio: start,
        fechaFin: end,
        token,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVictronEnergyRealtimeData = createAsyncThunk(
  "plants/fetchVictronEnergyRealtimeData",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchVictronEnergyRealtimeDataAPI({
        plantId,
        token,
      });
      // console.log("Real-Time Data:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVictronEnergyEquipmentDetails = createAsyncThunk(
  "plants/fetchVictronEnergyEquipmentDetails",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const equipmentDetails = await fetchVictronEnergyEquipmentDetailsAPI({
        plantId,
        token,
      });
      return equipmentDetails;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVictronEnergyAlerts = createAsyncThunk(
  "plants/fetchVictronEnergyAlerts",
  async ({ plantId, token }, { rejectWithValue }) => {
    try {
      const alertsData = await fetchVictronEnergyAlertsAPI({ plantId, token });
      return { provider: "victronenergy", data: alertsData };
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
  environmentalBenefits: null,
  loadingBenefits: false,
  errorBenefits: null,
  overview: null,
  overviewLoading: false,
  overviewError: null,
  comparisonData: null,
  comparisonLoading: false,
  comparisonError: null,
  inventory: null,
  inventoryLoading: false,
  inventoryError: null,
  batteryChargingState: null,
  batteryChargingLoading: false,
  batteryChargingError: null,
  equipmentDetails: null,
  equipmentLoading: false,
  equipmentError: null,
  alerts: {
    victronenergy: null,
    goodwe: null,
  },
  alertsLoading: false,
  alertsError: null,
  associatedPlants: [],
  loadingAssociatedPlants: false,
  errorAssociatedPlants: null,
  isDataFetched: false,
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
    clearSolarEdgeComparisonGraph: (state) => {
      state.comparisonData = null;
      state.comparisonError = null;
    },
    clearRealtimeData: (state) => {
      state.realtimeData = null;
      state.realtimeError = null;
    },
    resetFetchState: (state) => {
      state.isDataFetched = false;
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
        state.isDataFetched = true;
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
        state.isDataFetched = true;
      })
      .addCase(fetchPlantsByProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch plants by provider";
        state.plants = [];
      })
      .addCase(fetchEnvironmentalBenefits.pending, (state) => {
        state.loadingBenefits = true;
        state.errorBenefits = null;
      })
      .addCase(fetchEnvironmentalBenefits.fulfilled, (state, action) => {
        state.loadingBenefits = false;
        state.environmentalBenefits = action.payload;
        state.errorBenefits = null;
      })
      .addCase(fetchEnvironmentalBenefits.rejected, (state, action) => {
        state.loadingBenefits = false;
        state.environmentalBenefits = null;
        state.errorBenefits =
          action.payload || "Failed to fetch environmental benefits";
      })
      .addCase(fetchUserAssociatedPlants.pending, (state) => {
        state.loadingAssociatedPlants = true;
        state.errorAssociatedPlants = null;
      })

      //fetch plants associated to a user
      .addCase(fetchUserAssociatedPlants.fulfilled, (state, action) => {
        state.loadingAssociatedPlants = false;
        state.associatedPlants = action.payload;
        state.errorAssociatedPlants = null;
      })
      .addCase(fetchUserAssociatedPlants.rejected, (state, action) => {
        state.loadingAssociatedPlants = false;
        state.errorAssociatedPlants = action.payload;
        state.associatedPlants = [];
      })
      .addCase(dissociatePlantFromUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dissociatePlantFromUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(dissociatePlantFromUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch users associated to a given plant
      .addCase(fetchAssociatedUsers.pending, (state) => {
        state.loadingAssociatedUsers = true;
        state.errorAssociatedUsers = null;
      })
      .addCase(fetchAssociatedUsers.fulfilled, (state, action) => {
        state.loadingAssociatedUsers = false;
        state.associatedUsers = action.payload;
        state.errorAssociatedUsers = null;
      })
      .addCase(fetchAssociatedUsers.rejected, (state, action) => {
        state.loadingAssociatedUsers = false;
        state.errorAssociatedUsers = action.payload || "Failed to fetch users";
        state.associatedUsers = [];
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
        // console.log("Fetching real-time data: pending...");
        state.realtimeLoading = true;
        state.realtimeError = null;
      })
      .addCase(fetchGoodweRealtimeData.fulfilled, (state, action) => {
        // console.log("Real-time data fetched successfully:", action.payload);
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
      .addCase(fetchGoodweEquipmentDetails.pending, (state) => {
        state.equipmentLoading = true;
        state.equipmentError = null;
      })
      .addCase(fetchGoodweEquipmentDetails.fulfilled, (state, action) => {
        state.equipmentLoading = false;
        state.equipmentDetails = action.payload;
        state.equipmentError = null;
      })
      .addCase(fetchGoodweEquipmentDetails.rejected, (state, action) => {
        state.equipmentLoading = false;
        state.equipmentDetails = null;
        state.equipmentError = action.payload;
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
      })
      .addCase(fetchSolarEdgeOverview.pending, (state) => {
        state.overviewLoading = true;
        state.overviewError = null;
      })
      .addCase(fetchSolarEdgeOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchSolarEdgeOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.overviewError = action.payload;
      })
      .addCase(fetchSolarEdgeComparisonGraph.pending, (state) => {
        state.comparisonLoading = true;
        state.comparisonError = null;
        state.comparisonData = null;
      })
      .addCase(fetchSolarEdgeComparisonGraph.fulfilled, (state, action) => {
        state.comparisonLoading = false;
        state.comparisonData = action.payload;
      })
      .addCase(fetchSolarEdgeComparisonGraph.rejected, (state, action) => {
        state.comparisonLoading = false;
        state.comparisonError = action.payload;
      })
      .addCase(fetchSolarEdgeInventory.pending, (state) => {
        state.inventoryLoading = true;
        state.inventoryError = null;
      })
      .addCase(fetchSolarEdgeInventory.fulfilled, (state, action) => {
        state.inventoryLoading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchSolarEdgeInventory.rejected, (state, action) => {
        state.inventoryLoading = false;
        state.inventoryError = action.payload;
      })
      .addCase(fetchBatteryChargingState.pending, (state) => {
        state.batteryChargingLoading = true;
        state.batteryChargingError = null;
      })
      .addCase(fetchBatteryChargingState.fulfilled, (state, action) => {
        state.batteryChargingLoading = false;
        state.batteryChargingState = action.payload;
      })
      .addCase(fetchBatteryChargingState.rejected, (state, action) => {
        state.batteryChargingLoading = false;
        state.batteryChargingError = action.payload;
      })

      // Victron Energy
      .addCase(fetchVictronEnergyWeatherData.pending, (state) => {
        state.weatherLoading = true;
        state.weatherError = null;
      })
      .addCase(fetchVictronEnergyWeatherData.fulfilled, (state, action) => {
        state.weatherLoading = false;
        state.weatherData = action.payload;
        state.weatherError = null;
      })
      .addCase(fetchVictronEnergyWeatherData.rejected, (state, action) => {
        state.weatherLoading = false;
        state.weatherData = null;
        state.weatherError = action.payload || "Failed to fetch weather data";
      })
      .addCase(fetchVictronEnergyGraphData.pending, (state) => {
        state.graphLoading = true;
        state.graphError = null;
      })
      .addCase(fetchVictronEnergyGraphData.fulfilled, (state, action) => {
        state.graphLoading = false;
        state.graphData = action.payload;
        state.graphError = null;
      })
      .addCase(fetchVictronEnergyGraphData.rejected, (state, action) => {
        state.graphLoading = false;
        state.graphData = null;
        state.graphError = action.payload || "Failed to fetch graph data";
      })

      .addCase(fetchVictronEnergyRealtimeData.pending, (state) => {
        state.realtimeLoading = true;
        state.realtimeError = null;
      })
      .addCase(fetchVictronEnergyRealtimeData.fulfilled, (state, action) => {
        state.realtimeLoading = false;
        state.realtimeData = action.payload;
        state.realtimeError = null;
      })
      .addCase(fetchVictronEnergyRealtimeData.rejected, (state, action) => {
        state.realtimeLoading = false;
        state.realtimeData = null;
        state.realtimeError =
          action.payload || "Failed to fetch real-time data";
      })
      .addCase(fetchVictronEnergyEquipmentDetails.pending, (state) => {
        state.equipmentLoading = true;
        state.equipmentError = null;
      })
      .addCase(
        fetchVictronEnergyEquipmentDetails.fulfilled,
        (state, action) => {
          state.equipmentLoading = false;
          state.equipmentDetails = action.payload;
          state.equipmentError = null;
        }
      )
      .addCase(fetchVictronEnergyEquipmentDetails.rejected, (state, action) => {
        state.equipmentLoading = false;
        state.equipmentDetails = null;
        state.equipmentError = action.payload;
      })
      .addCase(fetchVictronEnergyAlerts.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(fetchVictronEnergyAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts[action.payload.provider] = action.payload.data;
        state.alertsError = null;
      })
      .addCase(fetchVictronEnergyAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.payload || "Failed to fetch alerts";
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
export const selectEnvironmentalBenefits = (state) =>
  state.plants.environmentalBenefits;
export const selectLoadingBenefits = (state) => state.plants.loadingBenefits;
export const selectErrorBenefits = (state) => state.plants.errorBenefits;
export const selectPlantOverview = (state) => state.plants.overview;
export const selectOverviewLoading = (state) => state.plants.overviewLoading;
export const selectComparisonData = (state) => state.plants.comparisonData;
export const selectComparisonLoading = (state) =>
  state.plants.comparisonLoading;
export const selectComparisonError = (state) => state.plants.comparisonError;
export const selectInventory = (state) => state.plants.inventory;
export const selectInventoryLoading = (state) => state.plants.inventoryLoading;
export const selectInventoryError = (state) => state.plants.inventoryError;
export const selectBatteryChargingState = (state) =>
  state.plants.batteryChargingState;
export const selectBatteryChargingLoading = (state) =>
  state.plants.batteryChargingLoading;
export const selectBatteryChargingError = (state) =>
  state.plants.batteryChargingError;
export const selectEquipmentDetails = (state) => state.plants.equipmentDetails;
export const selectEquipmentLoading = (state) => state.plants.equipmentLoading;
export const selectEquipmentError = (state) => state.plants.equipmentError;
export const selectAlerts = (state) => state.plants.alerts;
export const selectAlertsLoading = (state) => state.plants.alertsLoading;
export const selectAlertsError = (state) => state.plants.alertsError;
export const selectAssociatedPlants = (state) => state.plants.associatedPlants;
export const selectLoadingAssociatedPlants = (state) =>
  state.plants.loadingAssociatedPlants;
export const selectErrorAssociatedPlants = (state) =>
  state.plants.errorAssociatedPlants;
export const selectAssociatedUsers = createSelector(
  (state) => state.plants,
  (plants) => plants.associatedUsers || []
);
export const selectIsDataFetched = (state) => state.plants.isDataFetched;

export const {
  clearPlants,
  clearPlantDetails,
  setCurrentProvider,
  clearGraphData,
  clearRealtimeData,
  clearSolarEdgeComparisonGraph,
  resetFetchState,
} = plantsSlice.actions;

export default plantsSlice.reducer;
