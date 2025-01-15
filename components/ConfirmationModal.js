import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useTranslation } from "next-i18next";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid place-items-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40" // Added z-index
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 flex flex-col gap-2 z-50" // Ensure higher z-index
          >
            <div className="text-lg text-gray-800 dark:text-custom-light-gray">
              {title}
            </div>
            <div className="text-md text-gray-800 dark:text-custom-light-gray">
              {message}
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <SecondaryButton onClick={onClose}>{t("cancel")}</SecondaryButton>
              <PrimaryButton onClick={onConfirm}>{t("confirm")}</PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
