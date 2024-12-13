import React from "react";
import { useTranslation } from "react-i18next";

const EditSilencedAlertModal = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
      <h2 className="text-xl font-bold mb-4 text-orange-500">
        {t("editSilencedAlerts")}
      </h2>
      <div className="mb-4">
        <label htmlFor="alertType" className="block text-sm font-medium">
          {t("alertType")}
        </label>
        <select id="alertType" className="w-full p-2 mt-1 rounded-lg">
          <option value="">{t("selectAlertType")}</option>
          {/* Add alert type options here */}
        </select>
      </div>
      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white p-2 rounded-lg"
        >
          {t("cancel")}
        </button>
        <button className="bg-blue-500 text-white p-2 rounded-lg">
          {t("save")}
        </button>
      </div>
    </div>
  );
};

export default EditSilencedAlertModal;
