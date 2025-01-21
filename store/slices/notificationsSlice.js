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

      // Fetch first batch of Goodwe active alerts
      try {
        const goodweResponse = await fetchGoodweActiveNotificationsAPI({
          token,
          pageIndex,
          pageSize,
        });

        if (goodweResponse?.data?.list) {
          const formattedGoodweAlerts = goodweResponse.data.list.map(
            (alert) => ({
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
            })
          );
          activeNotifications = formattedGoodweAlerts;
        }
      } catch (error) {
        console.error("Error fetching Goodwe alerts:", error);
      }

      // Fetch Victron alerts
      const state = getState();
      const victronPlants = state.plants.plants.filter(
        (plant) => plant.organization === "victronenergy" && plant.alarm
      );

      const victronResults = await Promise.allSettled(
        victronPlants.map((plant) =>
          fetchVictronEnergyAlertsAPI({
            plantId: plant.id,
            token,
          }).then((alerts) => ({
            alerts,
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

      // Combine and sort all notifications
      const allNotifications = [
        ...activeNotifications,
        ...victronNotifications,
      ];
      const sortedNotifications = allNotifications.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      return sortedNotifications;
    } catch (error) {
      console.error("Error in fetchActiveNotifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Initial fetch of resolved notifications
export const fetchResolvedNotifications = createAsyncThunk(
  "notifications/fetchResolvedNotifications",
  async ({ pageIndex = 1, pageSize = 50 }, { rejectWithValue }) => {
    try {
      const token = storage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const goodweResponse = await fetchGoodweResolvedNotificationsAPI({
        token,
        pageIndex,
        pageSize,
      });

      if (!goodweResponse?.data?.list) {
        return [];
      }

      const resolvedNotifications = goodweResponse.data.list.map((alert) => ({
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

      return resolvedNotifications.sort(
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
  if (!organizationFilter) return activeNotifications;
  return activeNotifications.filter((n) => n.provider === organizationFilter);
};

export const selectResolvedNotifications = (state) => {
  const { resolvedNotifications, organizationFilter } = state.notifications;
  if (!organizationFilter) return resolvedNotifications;
  return resolvedNotifications.filter((n) => n.provider === organizationFilter);
};

export const selectActiveTotalCount = (state) =>
  state.notifications.activeTotalCount;
export const selectResolvedTotalCount = (state) =>
  state.notifications.resolvedTotalCount;
export const selectIsLoadingMore = (state) => state.notifications.isLoadingMore;
export const selectIsInitialLoad = (state) => state.notifications.isInitialLoad;
export const selectActiveError = (state) => state.notifications.activeError;
export const selectResolvedError = (state) => state.notifications.resolvedError;
export const selectOrganizationFilter = (state) =>
  state.notifications.organizationFilter;
export const selectResolvedFetched = (state) =>
  state.notifications.resolvedFetched;
export const selectActiveNotificationsCount = (state) =>
  state.notifications.activeTotalCount || 0;

export default notificationsSlice.reducer;
