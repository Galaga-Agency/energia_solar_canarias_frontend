"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import { IoFilter } from "react-icons/io5";
import Texture from "@/components/Texture";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNavbar from "@/components/BottomNavbar";
import {
  fetchActiveNotifications,
  fetchResolvedNotifications,
  loadAllNotificationsInBackground,
  selectActiveTotalCount,
  selectResolvedTotalCount,
  setInitialLoad,
  selectActiveNotifications,
  selectResolvedNotifications,
} from "@/store/slices/notificationsSlice";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";
import AlertsFilterSidebar from "@/components/alerts/AlertsFilterSidebar";
import AlertsSortMenu from "@/components/alerts/AlertsSortMenu";
import ActiveAlertsTab from "@/components/alerts/ActiveAlertsTab";
import ResolvedAlertsTab from "@/components/alerts/ResolvedAlertsTab";
import useTouchDevice from "@/hooks/useTouchDevice";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";

const ITEMS_PER_PAGE = 6;

const NotificationsTab = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile, isDesktop } = useDeviceType();
  const user = useSelector(selectUser);
  const activeNotifications = useSelector(selectActiveNotifications);
  const resolvedNotifications = useSelector(selectResolvedNotifications);
  const activeTotalCount = useSelector(selectActiveTotalCount);
  const resolvedTotalCount = useSelector(selectResolvedTotalCount);
  const [activeTab, setActiveTab] = useState("active");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredActive, setFilteredActive] = useState([]);
  const [filteredResolved, setFilteredResolved] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitializing, setIsInitializing] = useState(true);
  const isTouchDevice = useTouchDevice();

  // Initialize notifications if they're not already loaded
 useEffect(() => {
   const initializeNotifications = async () => {
     try {
       // Always set initializing to true at start
       setIsInitializing(true);

       // Fetch both active and resolved notifications
       const [activeResult, resolvedResult] = await Promise.all([
         dispatch(
           fetchActiveNotifications({ pageIndex: 1, pageSize: 200 })
         ).unwrap(),
         dispatch(
           fetchResolvedNotifications({ pageIndex: 1, pageSize: 200 })
         ).unwrap(),
       ]);

       // Detailed logging for debugging
       console.log("Active Notifications:", activeResult);
       console.log("Resolved Notifications:", resolvedResult);

       // Explicitly check for empty results
       const hasActiveNotifications = activeResult && activeResult.length > 0;
       const hasResolvedNotifications =
         resolvedResult && resolvedResult.length > 0;

       // Ensure initializing is set to false
       setIsInitializing(false);

       // Trigger background loads only if there are no notifications
       if (!hasActiveNotifications && !hasResolvedNotifications) {
         dispatch(
           loadAllNotificationsInBackground({ status: 0, pageSize: 200 })
         );
         dispatch(
           loadAllNotificationsInBackground({ status: 1, pageSize: 200 })
         );
       }
     } catch (error) {
       console.error("Error initializing notifications:", error);
       // Ensure initializing is set to false even if there's an error
       setIsInitializing(false);
     }
   };

   initializeNotifications();
 }, [dispatch]);

  // Reset current page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Update filtered notifications when source notifications change
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

  const totalActivePages = Math.ceil(filteredActive.length / ITEMS_PER_PAGE);
  const totalResolvedPages = Math.ceil(
    filteredResolved.length / ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar pb-36 md:pb-16">
      <TransitionEffect />
      <Texture />

      <div className="relative z-20">
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-2 z-30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <ThemeToggle />
          <LanguageSelector />
        </motion.div>

        <div className="relative h-auto p-4 md:p-8">
          {/* Title Section */}
          <motion.div
            className="flex items-center my-6 xl:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Image
              src={companyIcon}
              alt="Company Icon"
              className="w-12 h-12 mr-2 z-10"
            />
            <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue max-w-[60vw]">
              {t("notifications")}
            </h2>
          </motion.div>

          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {isMobile ? (
              <AlertsFilterSidebar
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
                <AlertsFilterSidebar
                  activeNotifications={activeNotifications}
                  resolvedNotifications={resolvedNotifications}
                  onFilterChange={handleFilterChange}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  activeTab={activeTab}
                />
              </motion.div>
            )}

            {/* Tab navigation */}
            <motion.div
              className="flex-1 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex space-x-2 mb-6 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-2 rounded-2xl shadow-lg">
                {/* Active tab button */}
                <motion.button
                  className={`flex-1 py-1.5 rounded-xl text-sm relative overflow-hidden group ${
                    activeTab === "active"
                      ? "bg-custom-yellow text-custom-dark-blue shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40"
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
                      className={`min-w-[2rem] px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === "active"
                          ? "bg-white/40 text-custom-dark-blue"
                          : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {isInitializing ? (
                        <div className="flex items-center justify-center min-w-[2rem] h-5">
                          <div className="flex gap-1">
                            <motion.div
                              className="w-1.5 h-1.5 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                times: [0, 0.5, 1],
                                delay: 0,
                              }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                times: [0, 0.5, 1],
                                delay: 0.2,
                              }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                times: [0, 0.5, 1],
                                delay: 0.4,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        activeTotalCount
                      )}
                    </span>
                  </div>
                </motion.button>

                {/* Resolved tab button */}
                <motion.button
                  className={`flex-1 py-1.5 rounded-xl text-sm relative overflow-hidden group ${
                    activeTab === "resolved"
                      ? "bg-custom-yellow text-custom-dark-blue shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40"
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
                      className={`min-w-[2rem] px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === "resolved"
                          ? "bg-white/40 text-custom-dark-blue"
                          : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {isInitializing ? (
                        <div className="flex items-center justify-center min-w-[2rem] h-5">
                          <div className="flex gap-1">
                            <motion.div
                              className="w-1.5 h-1.5 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                times: [0, 0.5, 1],
                                delay: 0,
                              }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                times: [0, 0.5, 1],
                                delay: 0.2,
                              }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-current rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                                times: [0, 0.5, 1],
                                delay: 0.4,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        resolvedTotalCount
                      )}
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Sort menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <AlertsSortMenu onSortChange={handleSort} />
              </motion.div>

              {/* Content tabs */}
              {activeTab === "active" ? (
                <ActiveAlertsTab
                  filteredActive={filteredActive}
                  currentPage={currentPage}
                  totalPages={totalActivePages}
                  onPageChange={setCurrentPage}
                />
              ) : (
                <ResolvedAlertsTab
                  filteredResolved={filteredResolved}
                  currentPage={currentPage}
                  totalPages={totalResolvedPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile filter button */}
      {isTouchDevice && !isSidebarOpen && (
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="xl:hidden fixed bottom-20 left-5 z-50 bg-custom-yellow w-12 h-12 flex rounded-full justify-center items-center button-shadow"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoFilter className="text-2xl text-custom-dark-blue" />
        </motion.button>
      )}

      <BottomNavbar userId={user?.id} userClass={user?.clase} />
    </div>
  );
};

export default NotificationsTab;
