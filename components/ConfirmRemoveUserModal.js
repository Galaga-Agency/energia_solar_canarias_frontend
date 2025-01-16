import React from "react";
import Modal from "@/components/ui/Modal";
import { FiAlertTriangle } from "react-icons/fi";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

const ConfirmRemoveUserModal = ({ isOpen, onClose, onConfirm, user, t }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-200" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          {t("removeUserConfirmation")}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t("removeUserWarning", { name: user.nombre || user.name })}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <SecondaryButton onClick={onClose}>{t("cancel")}</SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            className="!bg-red-500 hover:!bg-red-600"
          >
            {t("remove")}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmRemoveUserModal;
