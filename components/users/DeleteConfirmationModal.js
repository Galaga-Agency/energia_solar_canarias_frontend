import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { FiAlertTriangle } from "react-icons/fi";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Texture from "@/components/Texture";
import { deleteUser } from "@/store/slices/userSlice";

const DeleteConfirmationModal = ({ user, isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(user.usuario_id)).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <AnimatePresence>
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
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
              >
                <Texture className="opacity-30" />

                <div className="relative z-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                    <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-200" />
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-custom-dark-blue dark:text-custom-yellow">
                      {t("deleteUserConfirmation")}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {t("deleteUserWarning", { name: user.usuario_nombre })}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center gap-4">
                    <SecondaryButton type="button" onClick={onClose}>
                      {t("cancel")}
                    </SecondaryButton>
                    <PrimaryButton
                      type="button"
                      onClick={handleDelete}
                      className="!bg-red-500 hover:!bg-red-600 dark:!bg-red-600 dark:hover:!bg-red-700"
                    >
                      {t("delete")}
                    </PrimaryButton>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
