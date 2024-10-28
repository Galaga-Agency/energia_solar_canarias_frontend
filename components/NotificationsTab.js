"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import NotificationCard from "./NotificationCard";
import { selectUser } from "@/store/slices/userSlice";
import {
  markAllAsRead,
  selectActiveNotifications,
  selectArchivedNotifications,
  markNotificationAsRead,
  undoArchiveNotification,
  deleteNotification,
} from "@/store/slices/notificationsSlice";
import { useTranslation } from "next-i18next";
import Texture from "./Texture";
import ConfirmationModal from "./ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import PrimaryButton from "./PrimaryButton";
import { useRouter } from "next/navigation";

const NotificationsTab = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const notificationsRef = useRef(null);
  const router = useRouter();

  const activeNotifications = useSelector(selectActiveNotifications);
  const archivedNotifications = useSelector(selectArchivedNotifications);
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationToUndo, setNotificationToUndo] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [showArchived, setShowArchived] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#notifications") {
      notificationsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleMarkAsRead = (notificationId, plantId) => {
    router.push(`/dashboard/${userId}/plants/${plantId}`);
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAsReadWithoutRedirect = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleUndoArchive = () => {
    if (notificationToUndo) {
      dispatch(undoArchiveNotification(notificationToUndo));
      setNotificationToUndo(null);
    }
    setIsModalOpen(false);
  };

  const handleDeleteNotification = () => {
    if (notificationToDelete) {
      dispatch(deleteNotification(notificationToDelete));
      setNotificationToDelete(null);
    }
    setIsModalOpen(false);
  };

  const handleOpenUndoModal = (notificationId) => {
    setNotificationToUndo(notificationId);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (notificationId) => {
    setNotificationToDelete(notificationId);
    setIsModalOpen(true);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <>
      <Texture />
      <div className="flex flex-col">
        <h2 className="text-4xl dark:text-custom-yellow text-custom-dark-blue">
          {t("notifications")}
        </h2>
        <div className="flex flex-col space-y-4 py-4">
          <Link href={`/dashboard/${userId}/settings#notifications`}>
            <span className="text-custom-dark-blue dark:text-custom-light-gray underline underline-offset-2 hover:opacity-80 cursor-pointer">
              {t("goToNotificationsSettings")}
            </span>
          </Link>
          <div className="pt-6 md:mr-auto">
            <PrimaryButton onClick={handleMarkAllAsRead}>
              {t("markAllAsRead")}
            </PrimaryButton>
          </div>
        </div>

        <div className="mt-6 space-y-12 mb-16" ref={notificationsRef}>
          <div className="space-y-4">
            <h3 className="text-2xl text-custom-dark-blue dark:text-custom-yellow">
              {t("activeNotifications")}
            </h3>
            {activeNotifications.length === 0 ? (
              <p className="text-gray-500 text-center ">
                {t("youAreUpToDate")}
              </p>
            ) : (
              <AnimatePresence>
                {activeNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NotificationCard
                      type={notification.type}
                      message={notification.message}
                      timestamp={notification.timestamp}
                      read={notification.read}
                      plantName={notification.plantName}
                      onClick={() =>
                        handleMarkAsRead(notification.id, notification.plantId)
                      }
                      onClose={() =>
                        handleMarkAsReadWithoutRedirect(notification.id)
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-custom-dark-blue dark:text-custom-yellow flex items-center">
                {t("archivedNotifications")}
                <button
                  onClick={() => setShowArchived((prev) => !prev)}
                  className="ml-2 flex items-center text-gray-300 hover:text-gray-100 transition"
                >
                  {!showArchived ? (
                    <IoChevronUp className="ml-2 mt-1 text-custom-dark-blue dark:text-custom-yellow" />
                  ) : (
                    <IoChevronDown className="ml-2 mt-1 text-custom-dark-blue dark:text-custom-yellow" />
                  )}
                </button>
              </h3>
            </div>

            <AnimatePresence>
              {showArchived && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {archivedNotifications.length === 0 ? (
                    <p className="text-gray-500 pb-12">
                      {t("noArchivedNotifications")}
                    </p>
                  ) : (
                    archivedNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4"
                      >
                        <NotificationCard
                          type={notification.type}
                          message={notification.message}
                          timestamp={notification.timestamp}
                          read={notification.read}
                          plantName={notification.plantName}
                          undoArchive={() =>
                            handleOpenUndoModal(notification.id)
                          }
                          onDelete={() =>
                            handleOpenDeleteModal(notification.id)
                          }
                        />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleUndoArchive}
          title={t("undoArchive")}
          message={t("areYouSureUndoArchive")}
        />

        <ConfirmationModal
          isOpen={notificationToDelete !== null}
          onClose={() => setNotificationToDelete(null)}
          onConfirm={handleDeleteNotification}
          title={t("deleteNotification")}
          message={t("areYouSureDeleteNotification")}
        />
      </div>
    </>
  );
};

export default NotificationsTab;
