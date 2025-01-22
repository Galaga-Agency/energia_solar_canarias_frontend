"use client";

import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchActiveNotifications,
  fetchResolvedNotifications,
  loadAllNotificationsInBackground,
  selectIsInitialLoad,
  setInitialLoad,
} from "@/store/slices/notificationsSlice";
import { selectUser } from "@/store/slices/userSlice";

const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds
const FETCH_SIZE = 200;

const NotificationsWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isInitialLoad = useSelector(selectIsInitialLoad);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch active notifications
      await dispatch(
        fetchActiveNotifications({
          pageIndex: 1,
          pageSize: FETCH_SIZE,
        })
      );
      dispatch(
        loadAllNotificationsInBackground({
          status: 0,
          pageSize: FETCH_SIZE,
        })
      );

      // Fetch resolved notifications
      await dispatch(
        fetchResolvedNotifications({
          pageIndex: 1,
          pageSize: FETCH_SIZE,
        })
      );
      dispatch(
        loadAllNotificationsInBackground({
          status: 1,
          pageSize: FETCH_SIZE,
        })
      );

      if (isInitialLoad) {
        dispatch(setInitialLoad(false));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [dispatch, user, isInitialLoad]);

  // Initial fetch when component mounts and user is available
  useEffect(() => {
    if (user && isInitialLoad) {
      fetchNotifications();
    }
  }, [fetchNotifications, user, isInitialLoad]);

  // Set up periodic refresh
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(fetchNotifications, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchNotifications, user]);

  return children;
};

export default NotificationsWrapper;
