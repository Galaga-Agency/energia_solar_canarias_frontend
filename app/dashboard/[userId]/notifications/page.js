"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { IoFilter } from "react-icons/io5";
import NotificationListItem from "@/components/notifications/NotificationListItem";
import Texture from "@/components/Texture";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNavbar from "@/components/BottomNavbar";
import Pagination from "@/components/ui/Pagination";
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
import useDeviceType from "@/hooks/useDeviceType";
import NotificationFilterSidebar from "@/components/notifications/NotificationFilterSidebar";
import NotificationSortMenu from "@/components/notifications/NotificationSortMenu";
import { AlertCircle, BellIcon, CheckCircleIcon } from "lucide-react";
import NotificationsListSkeleton from "@/components/loadingSkeletons/NotificationsListSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const ITEMS_PER_PAGE = 6;

const NotificationsTab = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();
  const user = useSelector(selectUser);
  const activeNotifications = useSelector(selectActiveNotifications);
  const resolvedNotifications = useSelector(selectResolvedNotifications);
  const activeTotalCount = useSelector(selectActiveTotalCount);
  const resolvedTotalCount = useSelector(selectResolvedTotalCount);
  const isLoadingMore = useSelector(selectIsLoadingMore);
  const isInitialLoad = useSelector(selectIsInitialLoad);
  const activeError = useSelector(selectActiveError);
  const resolvedError = useSelector(selectResolvedError);
  const resolvedFetched = useSelector(selectResolvedFetched);
  const theme = useSelector(selectTheme);
  const [activeTab, setActiveTab] = useState("active");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredActive, setFilteredActive] = useState([]);
  const [filteredResolved, setFilteredResolved] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (activeNotifications.length) {
      setFilteredActive(activeNotifications);
    }
    if (resolvedNotifications.length) {
      setFilteredResolved(resolvedNotifications);
    }
  }, [activeNotifications, resolvedNotifications]);

  const handleFilterChange = (filtered) => {
    setFilteredActive(filtered.active);
    setFilteredResolved(filtered.resolved);
    setCurrentPage(1);
  };

  const handleSort = (sortBy, order) => {
    const sortNotifications = (notifications) => {
      const sorted = [...notifications].sort((a, b) => {
        if (sortBy === "happentime") {
          return new Date(a.happentime) - new Date(b.happentime);
        }
        return a[sortBy] - b[sortBy];
      });
      return order === "desc" ? sorted.reverse() : sorted;
    };

    if (activeTab === "active") {
      setFilteredActive(sortNotifications(filteredActive));
    } else {
      setFilteredResolved(sortNotifications(filteredResolved));
    }
    setCurrentPage(1);
  };

  // Get current notifications based on active tab
  const currentNotifications =
    activeTab === "active" ? filteredActive : filteredResolved;
  const isLoading = activeTab === "active" ? isInitialLoad : !resolvedFetched;
  const error = activeTab === "active" ? activeError : resolvedError;

  // Calculate pagination
  const totalPages = Math.ceil(currentNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNotifications = currentNotifications.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar mb-12">
      <TransitionEffect />

      <motion.div
        className="fixed top-4 right-4 flex items-center gap-2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <ThemeToggle />
        <LanguageSelector />
      </motion.div>
      <Texture />

      <motion.button
        className="xl:hidden fixed bottom-20 left-5 z-40 bg-custom-yellow p-3 rounded-full justify-center"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IoFilter />
      </motion.button>

      <div className="relative h-auto z-10 p-8">
        <motion.h2
          className="text-4xl dark:text-custom-yellow text-custom-dark-blue mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {t("notifications")}
        </motion.h2>

        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {isMobile ? (
            <NotificationFilterSidebar
              activeNotifications={activeNotifications}
              resolvedNotifications={resolvedNotifications}
              onFilterChange={handleFilterChange}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              activeTab={activeTab}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <NotificationFilterSidebar
                activeNotifications={activeNotifications}
                resolvedNotifications={resolvedNotifications}
                onFilterChange={handleFilterChange}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeTab={activeTab}
              />
            </motion.div>
          )}

          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex space-x-1 mb-6 w-full bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-full">
              <motion.button
                className={`flex-1 py-2 rounded-full text-sm relative overflow-hidden group ${
                  activeTab === "active"
                    ? "bg-custom-yellow text-custom-dark-blue"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => setActiveTab("active")}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span className="font-medium">
                    <span className="hidden sm:inline">
                      {t("activeNotifications")}
                    </span>
                    <span className="sm:hidden">{t("active")}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === "active"
                        ? "bg-custom-dark-blue/20 text-custom-dark-blue"
                        : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {activeTotalCount}
                  </span>
                </div>
              </motion.button>
              <motion.button
                className={`flex-1 py-2 rounded-full text-sm relative overflow-hidden group ${
                  activeTab === "resolved"
                    ? "bg-custom-yellow text-custom-dark-blue"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => setActiveTab("resolved")}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span className="font-medium">
                    <span className="hidden sm:inline">
                      {t("resolvedNotifications")}
                    </span>
                    <span className="sm:hidden">{t("cleared")}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === "resolved"
                        ? "bg-custom-dark-blue/20 text-custom-dark-blue"
                        : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {resolvedTotalCount}
                  </span>
                </div>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <NotificationSortMenu onSortChange={handleSort} />
            </motion.div>

            {isLoading ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <NotificationsListSkeleton theme={theme} />
              </motion.div>
            ) : error ? (
              <motion.div
                className="flex flex-col items-center justify-center py-12 px-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4 animate-pulse" />
                <p className="text-red-500 dark:text-red-400 text-lg text-center font-medium">
                  {t("errorLoadingNotifications")}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
                  {t("tryAgainLater")}
                </p>
              </motion.div>
            ) : !currentNotifications?.length ? (
              <motion.div
                className="flex flex-col items-center justify-center py-12 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "active" ? (
                  <BellIcon className="w-16 h-16 text-custom-yellow dark:text-custom-yellow/80 mb-4" />
                ) : (
                  <CheckCircleIcon className="w-16 h-16 text-custom-yellow dark:text-custom-yellow/80 mb-4" />
                )}
                <p className="text-gray-600 dark:text-gray-300 text-lg text-center font-medium">
                  {activeTab === "active"
                    ? t("noActiveNotifications")
                    : t("noResolvedNotifications")}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {paginatedNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-custom-yellow/10 to-custom-yellow/5 dark:from-custom-dark-blue/20 dark:to-custom-dark-blue/10 transform group-hover:translate-x-full transition-transform duration-500" />
                        <div className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 group-hover:translate-y-px group-hover:shadow-lg overflow-hidden">
                          <NotificationListItem notification={notification} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <BottomNavbar userId={user?.id} userClass={user?.clase} />
    </div>
  );
};

export default NotificationsTab;
