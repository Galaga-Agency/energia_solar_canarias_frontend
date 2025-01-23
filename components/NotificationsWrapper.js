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
import { selectTokenValidated, selectUser } from "@/store/slices/userSlice";

const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds
const FETCH_SIZE = 200;

const NotificationsWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isInitialLoad = useSelector(selectIsInitialLoad);
  const tokenValidated = useSelector(selectTokenValidated);

  const fetchNotifications = useCallback(async () => {
    if (!user || !tokenValidated) return;

    try {
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
  }, [dispatch, user, isInitialLoad, tokenValidated]);

  useEffect(() => {
    if (user && tokenValidated && isInitialLoad) {
      fetchNotifications();
    }
  }, [fetchNotifications, user, isInitialLoad, tokenValidated]);

  useEffect(() => {
    if (!user || !tokenValidated) return;

    const intervalId = setInterval(fetchNotifications, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchNotifications, user, tokenValidated]);

  return children;
};

export default NotificationsWrapper;
