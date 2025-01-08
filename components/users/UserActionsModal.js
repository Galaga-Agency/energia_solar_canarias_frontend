import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { IoClose } from "react-icons/io5";

const UserActionsModal = ({ isOpen, onClose, onDelete, onEdit }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <IoClose className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
          {t("userActions")}
        </h2>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          {t("selectAction")}
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            {t("delete")}
          </button>
          <button
            onClick={onEdit}
            className="bg-custom-dark-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {t("edit")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserActionsModal;
