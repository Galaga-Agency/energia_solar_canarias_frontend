import React from "react";
import { useTranslation } from "react-i18next";

const UnsilenceAlertModal = ({ onClose }) => {
  const { t } = useTranslation();

  // Close the modal after a delay (e.g., 2 seconds) to show the success message
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Close modal after 2 seconds
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [onClose]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-auto text-center">
      <h2 className="text-xl font-bold mb-4 text-green-500">
        {t("unsilenceAlertsSuccess")}
      </h2>
      <p>{t("unsilenceAlertDescSuccess")}</p>
    </div>
  );
};

export default UnsilenceAlertModal;
