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
import ActiveNotificationsTab from "@/components/notifications/ActiveNotificationsTab";
import ResolvedNotificationsTab from "@/components/notifications/ResolvedNotificationsTab";

const ITEMS_PER_PAGE = 50;

const NotificationsTab = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();

  // Redux state
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

  // Local state
  const [activeTab, setActiveTab] = useState("active");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredActive, setFilteredActive] = useState([]);
  const [filteredResolved, setFilteredResolved] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Load both types of notifications on mount
  useEffect(() => {
    if (user && isInitialLoad) {
      // Fetch active notifications and start their background loading
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

      // Fetch resolved notifications and start their background loading
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

      dispatch(setInitialLoad(false));
    }
  }, [dispatch, user, isInitialLoad]);

  // Reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Update filtered notifications when raw data changes
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
    setCurrentPage(1); // Reset to first page when filtering
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
    setCurrentPage(1); // Reset to first page when sorting
  };

  const renderTabContent = () => {
    if (activeTab === "active") {
      return (
        <ActiveNotificationsTab
          notifications={filteredActive}
          isLoading={isInitialLoad}
          error={activeError}
          isLoadingMore={isLoadingMore}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      );
    }

    return (
      <ResolvedNotificationsTab
        notifications={filteredResolved}
        isLoading={!resolvedFetched}
        error={resolvedError}
        isLoadingMore={isLoadingMore}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <TransitionEffect />

      {/* Theme and Language Controls */}
      <motion.div
        className="fixed top-4 right-4 flex flex-col md:flex-row items-center gap-2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <ThemeToggle />
        <LanguageSelector />
      </motion.div>

      <Texture />

      {/* Mobile Filter Button */}
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
        {/* Page Title */}
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
          {/* Sidebar */}
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

          {/* Main Content Area */}
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {/* Tab Buttons */}
            <div className="flex space-x-2 sm:space-x-4 mb-6 w-full">
              <motion.button
                className={`flex-1 px-3 sm:px-6 py-2 rounded-full text-sm sm:text-base transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === "active"
                    ? "bg-custom-yellow text-custom-dark-blue"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("active")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 relative z-10">
                  <span>
                    <span className="hidden sm:inline">
                      {t("activeNotifications")}
                    </span>
                    <span className="sm:hidden">{t("active")}</span>
                  </span>
                  <span className="bg-white/30 dark:bg-black/20 text-custom-dark-blue dark:text-custom-yellow px-1.5 sm:px-2 py-0.5 rounded-full text-xs sm:text-sm">
                    {activeTotalCount}
                  </span>
                </div>
              </motion.button>
              <motion.button
                className={`flex-1 px-3 sm:px-6 py-2 rounded-full text-sm sm:text-base transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === "resolved"
                    ? "bg-custom-yellow text-custom-dark-blue"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("resolved")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 relative z-10">
                  <span>
                    <span className="hidden sm:inline">
                      {t("resolvedNotifications")}
                    </span>
                    <span className="sm:hidden">{t("cleared")}</span>
                  </span>
                  <span className="bg-white/30 dark:bg-black/20 text-custom-dark-blue dark:text-custom-yellow px-1.5 sm:px-2 py-0.5 rounded-full text-xs sm:text-sm">
                    {resolvedTotalCount}
                  </span>
                </div>
              </motion.button>
            </div>

            {/* Sort Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <NotificationSortMenu onSortChange={handleSort} />
            </motion.div>

            {/* Notifications Content */}
            {renderTabContent()}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar userId={user?.id} userClass={user?.clase} />
    </motion.div>
  );
};

export default NotificationsTab;
