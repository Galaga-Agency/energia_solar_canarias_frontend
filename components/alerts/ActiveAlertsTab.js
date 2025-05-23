import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  selectActiveNotifications,
  selectActiveTotalCount,
  selectIsInitialLoad,
  selectActiveError,
} from "@/store/slices/notificationsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import NotificationListItem from "@/components/alerts/AlertsListItem";
import NotificationsListSkeleton from "@/components/loadingSkeletons/NotificationsListSkeleton";
import { AlertCircle, BellIcon } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 6;

const ActiveAlertsTab = ({
  filteredActive,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const isInitialLoad = useSelector(selectIsInitialLoad);
  const notifications = useSelector(selectActiveNotifications);
  const error = useSelector(selectActiveError);

  // Determine loading state based on both initial load and data availability
  const isLoading = isInitialLoad && !notifications.length;

  // Calculate pagination
  const paginatedNotifications = filteredActive.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {isLoading ? (
        <motion.div
          className="mb-3"
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
      ) : !filteredActive?.length ? (
        <motion.div
          className="flex flex-col items-center justify-center py-12 px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <BellIcon className="w-16 h-16 text-custom-dark-blue dark:text-custom-yellow mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg text-center font-medium">
            {t("noActiveNotifications")}
          </p>
        </motion.div>
      ) : (
        <div>
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
                  <NotificationListItem notification={notification} />
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
                onPageChange={onPageChange}
              />
            </motion.div>
          )}
        </div>
      )}
    </>
  );
};

export default ActiveAlertsTab;
