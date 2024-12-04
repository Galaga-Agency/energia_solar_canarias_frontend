// /components/InfoModal.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "./ui/PrimaryButton";
import { useTranslation } from "next-i18next";

const InfoModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 -mt-12 z-50 grid place-items-center overflow-hidden rounded-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 flex flex-col gap-2"
          >
            <div className="text-lg text-gray-800 dark:text-custom-light-gray">
              {t("pleaseNote")}
            </div>
            <div className="text-md text-gray-800 dark:text-custom-light-gray">
              {t("operationMayTake")}
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <PrimaryButton onClick={onConfirm}>
                {t("iUnderstand")}
              </PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;
