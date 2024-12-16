import React from "react";
import { useTranslation } from "react-i18next";
import SecondaryButton from "./ui/SecondaryButton";
import PrimaryButton from "./ui/PrimaryButton";

const CloseAlertModal = ({ onClose, onSave }) => {
  const { t } = useTranslation();

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onSave();
    onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-auto lg:max-w-96">
      <h2 className="text-xl font-bold mb-4 text-red-500">
        {t("areYouSureCloseAlerts")}
      </h2>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {t("closeAlertsWarning")}
      </p>

      <div className="flex justify-between gap-4">
        <SecondaryButton onClick={handleClose}>{t("no")}</SecondaryButton>
        <PrimaryButton onClick={handleSave}>{t("yes")}</PrimaryButton>
      </div>
    </div>
  );
};

export default CloseAlertModal;
