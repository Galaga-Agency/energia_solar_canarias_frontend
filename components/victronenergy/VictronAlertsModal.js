"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useTranslation } from "next-i18next";
import Texture from "@/components/Texture";
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
  setInitialLoad,
} from "@/store/slices/notificationsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { useParams } from "next/navigation";

const ITEMS_PER_PAGE = 100;

const VictronAlertsModal = ({ isOpen, onClose }) => {
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
      const victronActive = activeNotifications.filter(
        (n) => n.provider === "victron" && n.idSite == plantId
      );
      setFilteredActive(victronActive);
    }
    if (resolvedNotifications.length) {
      const victronResolved = resolvedNotifications.filter(
        (n) => n.provider === "victron" && n.idSite == plantId
      );
      setFilteredResolved(victronResolved);
    }
  }, [activeNotifications, resolvedNotifications, plantId]);

  // Handle body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[999]">
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4 pb-20 md:pb-24">
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{
                  scale: 0.9,
                  y: 20,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.1,
                }}
                className="relative w-full max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 md:p-6 backdrop-blur-lg shadow-xl overflow-hidden"
              >
                <Texture className="opacity-30" />

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.2 }}
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

                <div className="p-6 space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.3 }}
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
                        {t("ClearedAlertas")} ({filteredResolved.length})
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4"
                  >
                    {activeTab === "active" ? (
                      filteredActive.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                          {t("No active alerts")}
                        </div>
                      ) : (
                        filteredActive.map((alert) => (
                          <NotificationListItem
                            key={alert.id}
                            notification={alert}
                          />
                        ))
                      )
                    ) : filteredResolved.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        {t("No cleared alerts")}
                      </div>
                    ) : (
                      filteredResolved.map((alert) => (
                        <NotificationListItem
                          key={alert.id}
                          notification={alert}
                        />
                      ))
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VictronAlertsModal;
