import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationListItem from "@/components/notifications/NotificationListItem";
import Pagination from "@/components/ui/Pagination";
import { useTranslation } from "next-i18next";

const ITEMS_PER_PAGE = 10;

const ActiveNotificationsTab = ({
  notifications,
  isLoading,
  error,
  isLoadingMore,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <motion.div
        className="animate-pulse space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"
          />
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.p
        className="text-red-500 text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("errorLoadingNotifications")}
      </motion.p>
    );
  }

  if (!notifications?.length) {
    return (
      <motion.p
        className="text-gray-500 text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("noActiveNotifications")}
      </motion.p>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNotifications = notifications.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {paginatedNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <NotificationListItem notification={notification} />
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoadingMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 text-gray-500"
        >
          {t("loadingMoreNotifications")}
        </motion.div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ActiveNotificationsTab;
