import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { storage } from "@/utils/storage";
import {
  fetchGoodweActiveNotificationsAPI,
  fetchGoodweResolvedNotificationsAPI,
} from "@/services/goodwe-api";
import { fetchVictronEnergyAlertsAPI } from "@/services/victronenergy-api";

// Initial fetch with first batch
export const fetchActiveNotifications = createAsyncThunk(
  "notifications/fetchActiveNotifications",
  async ({ pageIndex = 1, pageSize = 50 }, { rejectWithValue, getState }) => {
    try {
      const token = storage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      let activeNotifications = [];

      // Fetch Goodwe active alerts
      try {
        const goodweResponse = await fetchGoodweActiveNotificationsAPI({
          token,
          pageIndex,
          pageSize,
        });

        if (goodweResponse?.data?.list) {
          activeNotifications = goodweResponse.data.list.map((alert) => ({
            ...alert,
            id: alert.warningid,
            read: false,
            archived: false,
            provider: "goodwe",
            severity: (() => {
              switch (alert.warninglevel) {
                case 1:
                  return "low";
                case 2:
                  return "medium";
                case 3:
                  return "high";
                default:
                  return "medium";
              }
            })(),
            timestamp: new Date(alert.happentime).toISOString(),
          }));
        }
      } catch (error) {
        console.error("Error fetching Goodwe alerts:", error);
      }

      // Fetch Victron alerts
      const state = getState();
      const plants = state.plants.plants || [];
      const victronPlants = Array.isArray(plants)
        ? plants.filter(
            (plant) => plant.organization === "victronenergy" && plant.alarm
          )
        : [];

      const victronResults = await Promise.allSettled(
        victronPlants.map((plant) =>
          fetchVictronEnergyAlertsAPI({
            plantId: plant.id,
            token,
          }).then((alerts) => ({
            alerts: alerts?.records || [],
            plantName: plant.name,
            plantId: plant.id,
          }))
        )
      );

      let victronNotifications = [];
      victronResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value?.alerts) {
          const activeAlerts = result.value.alerts
            .filter((alert) => alert.isActive === 1)
            .map((alert) => ({
              ...alert,
              id: `victron-${alert.idAlarm}`,
              read: false,
              archived: false,
              provider: "victron",
              plantId: result.value.plantId,
              plantName: result.value.plantName,
              severity: alert.nameEnum?.toLowerCase() || "medium",
              timestamp: alert.started
                ? new Date(alert.started * 1000).toISOString()
                : new Date().toISOString(),
            }));
          victronNotifications.push(...activeAlerts);
        }
      });

      return [...activeNotifications, ...victronNotifications].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } catch (error) {
      console.error("Error in fetchActiveNotifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResolvedNotifications = createAsyncThunk(
  "notifications/fetchResolvedNotifications",
  async ({ pageIndex = 1, pageSize = 50 }, { rejectWithValue, getState }) => {
    try {
      const token = storage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      let resolvedNotifications = [];

      // Fetch Goodwe resolved notifications
      try {
        const goodweResponse = await fetchGoodweResolvedNotificationsAPI({
          token,
          pageIndex,
          pageSize,
        });

        if (goodweResponse?.data?.list) {
          resolvedNotifications = goodweResponse.data.list.map((alert) => ({
            ...alert,
            id: alert.warningid,
            read: true,
            archived: true,
            provider: "goodwe",
            severity: (() => {
              switch (alert.warninglevel) {
                case 1:
                  return "low";
                case 2:
                  return "medium";
                case 3:
                  return "high";
                default:
                  return "medium";
              }
            })(),
            timestamp: new Date(alert.happentime).toISOString(),
          }));
        }
      } catch (error) {
        console.error("Error fetching Goodwe resolved notifications:", error);
      }

      // Fetch Victron resolved notifications
      const state = getState();
      const plants = state.plants.plants || [];
      const victronPlants = Array.isArray(plants)
        ? plants.filter((plant) => plant.organization === "victronenergy")
        : [];

      const victronResults = await Promise.allSettled(
        victronPlants.map((plant) =>
          fetchVictronEnergyAlertsAPI({
            plantId: plant.id,
            token,
          }).then((alerts) => ({
            alerts: alerts?.records || [],
            plantName: plant.name,
            plantId: plant.id,
          }))
        )
      );

      let victronResolvedNotifications = [];
      victronResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value?.alerts) {
          const resolvedAlerts = result.value.alerts
            .filter((alert) => alert.isActive === 0)
            .map((alert) => ({
              ...alert,
              id: `victron-${alert.idAlarm}`,
              read: true,
              archived: true,
              provider: "victron",
              plantId: result.value.plantId,
              plantName: result.value.plantName,
              severity: alert.nameEnum?.toLowerCase() || "medium",
              timestamp: alert.started
                ? new Date(alert.started * 1000).toISOString()
                : new Date().toISOString(),
            }));
          victronResolvedNotifications.push(...resolvedAlerts);
        }
      });

      return [...resolvedNotifications, ...victronResolvedNotifications].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } catch (error) {
      console.error("Error in fetchResolvedNotifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Background loading thunk
export const loadAllNotificationsInBackground = createAsyncThunk(
  "notifications/loadAllInBackground",
  async ({ status, pageSize = 100 }, { dispatch, getState }) => {
    try {
      const token = storage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      dispatch(setLoadingMore(true));
      let currentPage = 2; // Start from page 2 since page 1 was loaded initially
      let hasMore = true;

      while (hasMore) {
        const response = await (status === 0
          ? fetchGoodweActiveNotificationsAPI({
              token,
              pageIndex: currentPage,
              pageSize,
            })
          : fetchGoodweResolvedNotificationsAPI({
              token,
              pageIndex: currentPage,
              pageSize,
            }));

        if (!response?.data?.list?.length) {
          hasMore = false;
          break;
        }

        const formattedNotifications = response.data.list.map((alert) => ({
          ...alert,
          id: alert.warningid,
          read: status === 1,
          archived: status === 1,
          provider: "goodwe",
          severity: (() => {
            switch (alert.warninglevel) {
              case 1:
                return "low";
              case 2:
                return "medium";
              case 3:
                return "high";
              default:
                return "medium";
            }
          })(),
          timestamp: new Date(alert.happentime).toISOString(),
        }));

        // Append the new notifications
        dispatch(
          status === 0
            ? appendActiveNotifications(formattedNotifications)
            : appendResolvedNotifications(formattedNotifications)
        );

        if (formattedNotifications.length < pageSize) {
          hasMore = false;
        } else {
          currentPage++;
          // Add a small delay between requests
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      dispatch(setLoadingMore(false));
    } catch (error) {
      console.error("Error loading all notifications:", error);
      dispatch(setLoadingMore(false));
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    activeNotifications: [],
    resolvedNotifications: [],
    activeTotalCount: 0,
    resolvedTotalCount: 0,
    isLoadingMore: false,
    isInitialLoad: true,
    activeError: null,
    resolvedError: null,
    organizationFilter: null,
    resolvedFetched: false,
  },
  reducers: {
    appendActiveNotifications: (state, action) => {
      const uniqueNotifications = new Set(
        state.activeNotifications.map((n) => n.warningid)
      );

      const newNotifications = action.payload.filter(
        (notification) => !uniqueNotifications.has(notification.warningid)
      );

      state.activeNotifications = [
        ...state.activeNotifications,
        ...newNotifications,
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      state.activeTotalCount = state.activeNotifications.length;
    },
    appendResolvedNotifications: (state, action) => {
      const uniqueNotifications = new Set(
        state.resolvedNotifications.map((n) => n.warningid)
      );

      const newNotifications = action.payload.filter(
        (notification) => !uniqueNotifications.has(notification.warningid)
      );

      state.resolvedNotifications = [
        ...state.resolvedNotifications,
        ...newNotifications,
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      state.resolvedTotalCount = state.resolvedNotifications.length;
    },
    setLoadingMore: (state, action) => {
      state.isLoadingMore = action.payload;
    },
    setInitialLoad: (state, action) => {
      state.isInitialLoad = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.activeNotifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.activeNotifications.forEach((notification) => {
        notification.read = true;
      });
    },
    setOrganizationFilter: (state, action) => {
      state.organizationFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Active notifications
      .addCase(fetchActiveNotifications.pending, (state) => {
        state.activeError = null;
      })
      .addCase(fetchActiveNotifications.fulfilled, (state, action) => {
        state.activeNotifications = action.payload;
        state.activeTotalCount = action.payload.length;
      })
      .addCase(fetchActiveNotifications.rejected, (state, action) => {
        state.activeError = action.payload;
      })
      // Resolved notifications
      .addCase(fetchResolvedNotifications.pending, (state) => {
        state.resolvedError = null;
      })
      .addCase(fetchResolvedNotifications.fulfilled, (state, action) => {
        state.resolvedNotifications = action.payload;
        state.resolvedTotalCount = action.payload.length;
        state.resolvedFetched = true;
      })
      .addCase(fetchResolvedNotifications.rejected, (state, action) => {
        state.resolvedError = action.payload;
      });
  },
});

export const {
  appendActiveNotifications,
  appendResolvedNotifications,
  setLoadingMore,
  setInitialLoad,
  markNotificationAsRead,
  markAllAsRead,
  setOrganizationFilter,
} = notificationsSlice.actions;

// Selectors
export const selectActiveNotifications = (state) => {
  const { activeNotifications, organizationFilter } = state.notifications;
  const user = state.user.user;
  const associatedPlants = state.plants.associatedPlants;

  let filteredNotifications = organizationFilter
    ? activeNotifications.filter((n) => n.provider === organizationFilter)
    : activeNotifications;

  if (user?.clase !== "admin" && associatedPlants?.length > 0) {
    const plantIds = new Set(associatedPlants.map((plant) => plant.id));
    filteredNotifications = filteredNotifications.filter((notification) =>
      plantIds.has(notification.stationId)
    );
  }

  return filteredNotifications;
};

export const selectResolvedNotifications = (state) => {
  const { resolvedNotifications, organizationFilter } = state.notifications;
  const user = state.user.user;
  const associatedPlants = state.plants.associatedPlants;

  // First apply organization filter
  let filteredNotifications = organizationFilter
    ? resolvedNotifications.filter((n) => n.provider === organizationFilter)
    : resolvedNotifications;

  // Then apply access control for non-admin users
  if (user?.clase !== "admin" && associatedPlants?.length > 0) {
    const plantIds = new Set(associatedPlants.map((plant) => plant.id));
    filteredNotifications = filteredNotifications.filter((notification) =>
      plantIds.has(notification.stationId)
    );
  }

  return filteredNotifications;
};

export const selectActiveTotalCount = (state) => {
  const filteredNotifications = selectActiveNotifications(state);
  return filteredNotifications.length;
};

export const selectResolvedTotalCount = (state) => {
  const filteredNotifications = selectResolvedNotifications(state);
  return filteredNotifications.length;
};
export const selectActiveNotificationsCount = (state) => {
  const filteredNotifications = selectActiveNotifications(state);
  return filteredNotifications.length;
};
export const selectIsLoadingMore = (state) => state.notifications.isLoadingMore;
export const selectIsInitialLoad = (state) => state.notifications.isInitialLoad;
export const selectActiveError = (state) => state.notifications.activeError;
export const selectResolvedError = (state) => state.notifications.resolvedError;
export const selectOrganizationFilter = (state) =>
  state.notifications.organizationFilter;
export const selectResolvedFetched = (state) =>
  state.notifications.resolvedFetched;
export const selectActiveVictronNotifications = (state) =>
  state.notifications.activeNotifications.filter(
    (n) => n.provider === "victron" && n.isActive === 1
  );
export const selectActiveGoodweNotifications = (state) => {
  return state.notifications.activeNotifications.filter(
    (notification) =>
      notification.provider === "goodwe" && notification.status === 0
  );
};

export default notificationsSlice.reducer;
