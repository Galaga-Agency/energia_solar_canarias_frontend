"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useTranslation } from "next-i18next";
import Texture from "@/components/Texture";
import Modal from "@/components/ui/Modal";
import NotificationListItem from "@/components/notifications/NotificationListItem";
import {
  fetchActiveNotifications,
  fetchResolvedNotifications,
  loadAllNotificationsInBackground,
  selectActiveNotifications,
  selectResolvedNotifications,
  selectActiveTotalCount,
  selectResolvedTotalCount,
  selectIsLoadingMore,
  selectIsInitialLoad,
  selectActiveError,
  selectResolvedError,
  selectResolvedFetched,
} from "@/store/slices/notificationsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { useParams } from "next/navigation";
import { FileBarChart2 } from "lucide-react";

const ITEMS_PER_PAGE = 100;

const GoodweAlertsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Redux state
  const activeNotifications = useSelector(selectActiveNotifications);
  const resolvedNotifications = useSelector(selectResolvedNotifications);
  const activeTotalCount = useSelector(selectActiveTotalCount);
  const resolvedTotalCount = useSelector(selectResolvedTotalCount);
  const isLoadingMore = useSelector(selectIsLoadingMore);
  const isInitialLoad = useSelector(selectIsInitialLoad);
  const activeError = useSelector(selectActiveError);
  const resolvedError = useSelector(selectResolvedError);
  const resolvedFetched = useSelector(selectResolvedFetched);

  // Local state
  const [activeTab, setActiveTab] = useState("active");
  const [filteredActive, setFilteredActive] = useState([]);
  const [filteredResolved, setFilteredResolved] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { plantId } = useParams();

  // Load notifications on mount
  useEffect(() => {
    if (isOpen && user) {
      dispatch(
        fetchActiveNotifications({ pageIndex: 1, pageSize: ITEMS_PER_PAGE })
      ).then(() => {
        dispatch(
          loadAllNotificationsInBackground({
            status: 0,
            pageSize: ITEMS_PER_PAGE,
          })
        );
      });

      dispatch(
        fetchResolvedNotifications({ pageIndex: 1, pageSize: ITEMS_PER_PAGE })
      ).then(() => {
        dispatch(
          loadAllNotificationsInBackground({
            status: 1,
            pageSize: ITEMS_PER_PAGE,
          })
        );
      });
    }
  }, [dispatch, user, isOpen]);

  // Reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Update filtered notifications when raw data changes
  useEffect(() => {
    if (activeNotifications.length) {
      const goodweActive = activeNotifications.filter(
        (n) => n.provider === "goodwe" && n.stationId === plantId
      );
      setFilteredActive(goodweActive);
    }
    if (resolvedNotifications.length) {
      const goodweResolved = resolvedNotifications.filter(
        (n) => n.provider === "goodwe" && n.stationId === plantId
      );
      setFilteredResolved(goodweResolved);
    }
  }, [activeNotifications, resolvedNotifications, plantId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl p-4 md:p-6 rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg shadow-xl overflow-hidden"
    >
      <Texture className="opacity-30" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue mb-6"
      >
        <div className="flex items-center gap-2">
          <FiAlertCircle className="text-2xl" />
          <h2 className="text-xl md:text-2xl font-bold">
            {t("System Alerts Modal")}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
        >
          <FiX className="text-2xl" />
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center"
      >
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`select-none px-4 py-2 rounded-lg transition-colors ${
              activeTab === "active"
                ? "bg-custom-yellow text-custom-dark-blue"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t("Active")} ({filteredActive.length})
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`select-none px-4 py-2 rounded-lg transition-colors ${
              activeTab === "resolved"
                ? "bg-custom-yellow text-custom-dark-blue"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t("Cleared")} ({filteredResolved.length})
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-h-[60vh] overflow-y-auto custom-scrollbar mt-4"
      >
        {activeTab === "active" ? (
          filteredActive.length === 0 ? (
            <div className="min-h-[300px] w-full flex flex-col items-center justify-center text-center space-y-4">
              <FileBarChart2 className="w-16 h-16 text-custom-dark-blue dark:text-custom-yellow animate-pulse" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                {t("No active alerts")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                {t("You're all set! There are currently no active alerts.")}
              </p>
            </div>
          ) : (
            filteredActive.map((alert) => (
              <NotificationListItem key={alert.id} notification={alert} />
            ))
          )
        ) : filteredResolved.length === 0 ? (
          <div className="min-h-[300px] w-full flex flex-col items-center justify-center text-center space-y-4">
            <FileBarChart2 className="w-16 h-16 text-custom-dark-blue dark:text-custom-yellow animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {t("No cleared alerts")}
            </h3>
          </div>
        ) : (
          filteredResolved.map((alert) => (
            <NotificationListItem key={alert.id} notification={alert} />
          ))
        )}
      </motion.div>
    </Modal>
  );
};

export default GoodweAlertsModal;
