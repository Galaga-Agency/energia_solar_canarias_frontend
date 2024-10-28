import React from "react";
import { useTranslation } from "next-i18next";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import useLocalStorageState from "use-local-storage-state";

const MetricsConfigCard = () => {
  const { t } = useTranslation();
  const [metricSystem, setMetricSystem] = useLocalStorageState("metricSystem", {
    defaultValue: "metric",
  });
  const [dateFormat, setDateFormat] = useLocalStorageState("dateFormat", {
    defaultValue: "dd-mm-yyyy",
  });
  const [temperatureUnit, setTemperatureUnit] = useLocalStorageState(
    "temperatureUnit",
    {
      defaultValue: "celsius",
    }
  );

  const handleSaveChanges = () => {
    alert(t("changesSaved"));
  };

  return (
    <div className="w-full h-full bg-white/50 dark:bg-gray-800/60 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm backdrop-filter">
      <h2 className="text-xl mb-4 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
        {t("metricsConfiguration")}
      </h2>

      <div className="mt-4">
        <label className="flex items-center text-gray-700 dark:text-gray-300">
          <input
            type="radio"
            value="metric"
            checked={metricSystem === "metric"}
            onChange={() => setMetricSystem("metric")}
            className="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
          />
          <span className="ml-2 flex-1">{t("metricSystem")}</span>
        </label>
        <label className="flex items-center text-gray-700 dark:text-gray-300">
          <input
            type="radio"
            value="imperial"
            checked={metricSystem === "imperial"}
            onChange={() => setMetricSystem("imperial")}
            className="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
          />
          <span className="ml-2 flex-1">{t("imperialSystem")}</span>
        </label>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 dark:text-gray-300">
          {t("dateFormat")}
        </label>
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          className="mt-2 border rounded p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
        >
          <option value="dd-mm-yyyy">{t("dd-mm-yyyy")}</option>
          <option value="mm-dd-yyyy">{t("mm-dd-yyyy")}</option>
          <option value="yyyy-mm-dd">{t("yyyy-mm-dd")}</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          {t("temperatureUnit")}
        </label>
        <div className="flex items-center">
          <label className="flex items-center mr-4 text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              value="celsius"
              checked={temperatureUnit === "celsius"}
              onChange={() => setTemperatureUnit("celsius")}
              className="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
            />
            <span className="ml-2">{t("celsius")}</span>
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              value="fahrenheit"
              checked={temperatureUnit === "fahrenheit"}
              onChange={() => setTemperatureUnit("fahrenheit")}
              className="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
            />
            <span className="ml-2">{t("fahrenheit")}</span>
          </label>
        </div>
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={handleSaveChanges}>
          {t("saveChanges")}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default MetricsConfigCard;
