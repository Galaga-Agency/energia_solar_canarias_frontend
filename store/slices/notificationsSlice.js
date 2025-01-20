import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { storage } from "@/utils/storage";
import { fetchGoodweAlertsAPI } from "@/services/goodwe-api";
import { fetchVictronEnergyAlertsAPI } from "@/services/victronenergy-api";

export const fetchAllUserNotifications = createAsyncThunk(
  "notifications/fetchAllUserNotifications",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = storage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const state = getState();
      const user = state.user?.user;

      if (!user) {
        throw new Error("No user found in state");
      }

      let allNotifications = [];

      // 1. Fetch Goodwe alerts
      try {
        const goodweAlerts = await fetchGoodweAlertsAPI({ token });
        console.log("Goodwe alerts received:", goodweAlerts);

        // Only get active alerts (status === 0)
        if (goodweAlerts?.data?.list) {
          const activeGoodweAlerts = goodweAlerts.data.list.filter(
            (alert) => alert.status === 0
          );
          console.log("Active Goodwe alerts:", activeGoodweAlerts);

          const formattedGoodweAlerts = activeGoodweAlerts.map((alert) => ({
            id: `goodwe-${alert.id}`,
            type: "alert",
            message: alert.content || alert.message || "Unknown alert",
            timestamp: new Date().toISOString(),
            read: false,
            archived: false,
            provider: "goodwe",
            plantId: alert.plantId,
            plantName: alert.plantName,
            severity: alert.severity || "medium",
            status: alert.status,
          }));
          allNotifications.push(...formattedGoodweAlerts);
        }
      } catch (goodweError) {
        console.error("Error fetching Goodwe alerts:", goodweError);
      }

      // 2. Fetch Victron alerts for each plant with active alarms
      const victronPlants = state.plants.plants.filter(
        (plant) => plant.organization === "victronenergy" && plant.alarm // Only get plants that have active alarms
      );

      console.log("Victron plants with alarms:", victronPlants.length);

      const victronAlertPromises = victronPlants.map((plant) =>
        fetchVictronEnergyAlertsAPI({
          plantId: plant.id,
          token,
        }).then((alerts) => ({
          alerts,
          plantName: plant.name,
          plantId: plant.id,
        }))
      );

      const victronResults = await Promise.allSettled(victronAlertPromises);

      victronResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value?.alerts) {
          const plantAlerts = result.value.alerts;
          // Only include active Victron alerts (isActive === 1)
          const activeAlerts = plantAlerts.filter(
            (alert) => alert.isActive === 1
          );

          const formattedAlerts = activeAlerts.map((alert) => ({
            id: `victron-${alert.idAlarm}`,
            type: "alert",
            message: alert.description || "Unknown alert",
            timestamp: alert.started
              ? new Date(alert.started * 1000).toISOString()
              : new Date().toISOString(),
            read: false,
            archived: false,
            provider: "victron",
            plantId: result.value.plantId,
            plantName: result.value.plantName,
            severity: alert.nameEnum?.toLowerCase() || "medium",
          }));
          allNotifications.push(...formattedAlerts);
        }
      });

      // Sort all notifications by timestamp (newest first)
      const sortedNotifications = allNotifications.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      console.log(
        `Total active notifications: Goodwe (${
          allNotifications.filter((n) => n.provider === "goodwe").length
        }), Victron (${
          allNotifications.filter((n) => n.provider === "victron").length
        })`
      );
      return sortedNotifications;
    } catch (error) {
      console.error("Error in fetchAllUserNotifications:", error);
      return rejectWithValue(error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    activeNotifications: [],
    archivedNotifications: [],
    loading: false,
    error: null,
    organizationFilter: null,
  },
  reducers: {
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
    undoArchiveNotification: (state, action) => {
      const index = state.archivedNotifications.findIndex(
        (n) => n.id === action.payload
      );
      if (index !== -1) {
        const notification = state.archivedNotifications[index];
        state.archivedNotifications.splice(index, 1);
        state.activeNotifications.push(notification);
      }
    },
    deleteNotification: (state, action) => {
      state.archivedNotifications = state.archivedNotifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setOrganizationFilter: (state, action) => {
      state.organizationFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.activeNotifications = action.payload || [];
        state.archivedNotifications = []; // Reset archived
      })
      .addCase(fetchAllUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  markNotificationAsRead,
  markAllAsRead,
  undoArchiveNotification,
  deleteNotification,
  setOrganizationFilter,
} = notificationsSlice.actions;

// Selectors
export const selectActiveNotifications = (state) => {
  const { activeNotifications, organizationFilter } = state.notifications;
  if (!organizationFilter) return activeNotifications;
  return activeNotifications.filter(
    (n) => n.organization === organizationFilter
  );
};

export const selectArchivedNotifications = (state) => {
  const { archivedNotifications, organizationFilter } = state.notifications;
  if (!organizationFilter) return archivedNotifications;
  return archivedNotifications.filter(
    (n) => n.organization === organizationFilter
  );
};

export const selectNotificationsLoading = (state) =>
  state.notifications?.loading || false;
export const selectNotificationsError = (state) =>
  state.notifications?.error || null;
export const selectOrganizationFilter = (state) =>
  state.notifications?.organizationFilter || null;

export default notificationsSlice.reducer;
