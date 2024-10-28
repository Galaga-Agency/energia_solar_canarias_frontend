import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    activeNotifications: [
      {
        id: 1,
        type: "error",
        message: "Inversor - se ha detectado un problema de producción.",
        timestamp: "2024-10-28 12:30",
        read: false,
        plantId: 1,
        plantName: "Fernando Plant",
      },
      {
        id: 2,
        type: "warning",
        message: "Fallo ventilador - revise la unidad para evitar daños.",
        timestamp: "2024-10-28 12:31",
        read: false,
        plantId: 2,
        plantName: "Canarias South Plant",
      },
      {
        id: 3,
        type: "alert",
        message: "Inversor: temperatura elevada - monitoree el sistema.",
        timestamp: "2024-10-28 12:32",
        read: false,
        plantId: 3,
        plantName: "Las Palmas Wind & Solar",
      },
      {
        id: 4,
        type: "info",
        message: "Batería por debajo del SOE mínimo - considere recargar.",
        timestamp: "2024-10-28 12:33",
        read: false,
        plantId: 4,
        plantName: "Tenerife Solar Park",
      },
    ],
    archivedNotifications: [],
  },
  reducers: {
    markAllAsRead: (state) => {
      state.activeNotifications.forEach((notification) => {
        notification.read = true;
        state.archivedNotifications.push(notification);
      });
      state.activeNotifications = [];
    },
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notificationIndex = state.activeNotifications.findIndex(
        (n) => n.id === notificationId
      );

      if (notificationIndex !== -1) {
        const [notification] = state.activeNotifications.splice(
          notificationIndex,
          1
        );
        notification.read = true;
        state.archivedNotifications.push(notification);
      }
    },
    undoArchiveNotification: (state, action) => {
      const notificationId = action.payload;
      const notificationIndex = state.archivedNotifications.findIndex(
        (n) => n.id === notificationId
      );

      if (notificationIndex !== -1) {
        const [notification] = state.archivedNotifications.splice(
          notificationIndex,
          1
        );
        notification.read = false;
        state.activeNotifications.push(notification);
      }
    },
    deleteNotification: (state, action) => {
      const notificationId = action.payload;
      const notificationIndex = state.archivedNotifications.findIndex(
        (n) => n.id === notificationId
      );

      if (notificationIndex !== -1) {
        state.archivedNotifications.splice(notificationIndex, 1);
      }
    },
  },
});

export const {
  markAllAsRead,
  markNotificationAsRead,
  undoArchiveNotification,
  deleteNotification,
} = notificationsSlice.actions;

export const selectActiveNotifications = (state) =>
  state.notifications.activeNotifications;
export const selectArchivedNotifications = (state) =>
  state.notifications.archivedNotifications;

export default notificationsSlice.reducer;
