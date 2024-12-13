import React from "react";
import { useTranslation } from "react-i18next";

const CloseAlertModal = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
      <h2 className="text-xl font-bold mb-4 text-red-600">
        {t("closeAlerts")}
      </h2>
      <p>{t("closeAlertDesc")}</p>
      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white p-2 rounded-lg"
        >
          {t("cancel")}
        </button>
        <button className="bg-blue-500 text-white p-2 rounded-lg">
          {t("confirm")}
        </button>
      </div>
    </div>
  );
};

export default CloseAlertModal;
