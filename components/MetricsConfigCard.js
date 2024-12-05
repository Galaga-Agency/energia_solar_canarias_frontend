import React from "react";
import { useTranslation } from "next-i18next";
import PrimaryButton from "@/components/ui/PrimaryButton";
import useLocalStorageState from "use-local-storage-state";
import CustomRadio from "@/components/ui/CustomRadio";

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

      {/* Metric System Selection */}
      <div className="mt-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("measurementSystem")}
        </h3>
        <div className="space-y-2">
          <CustomRadio
            checked={metricSystem === "metric"}
            onChange={() => setMetricSystem("metric")}
            label={t("metricSystem")}
            value="metric"
            name="metricSystem"
            className="text-gray-700 dark:text-gray-300"
          />
          <CustomRadio
            checked={metricSystem === "imperial"}
            onChange={() => setMetricSystem("imperial")}
            label={t("imperialSystem")}
            value="imperial"
            name="metricSystem"
            className="text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      {/* Date Format Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("dateFormat")}
        </label>
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          className="mt-2 w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow
            dark:focus:ring-custom-yellow dark:focus:border-custom-yellow"
        >
          <option value="dd-mm-yyyy">{t("dd-mm-yyyy")}</option>
          <option value="mm-dd-yyyy">{t("mm-dd-yyyy")}</option>
          <option value="yyyy-mm-dd">{t("yyyy-mm-dd")}</option>
        </select>
      </div>

      {/* Temperature Unit Selection */}
      <div className="mt-6">
        <h3 className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("temperatureUnit")}
        </h3>
        <div className="space-x-6 flex items-center">
          <CustomRadio
            checked={temperatureUnit === "celsius"}
            onChange={() => setTemperatureUnit("celsius")}
            label={t("celsius")}
            value="celsius"
            name="temperatureUnit"
            className="text-gray-700 dark:text-gray-300"
          />
          <CustomRadio
            checked={temperatureUnit === "fahrenheit"}
            onChange={() => setTemperatureUnit("fahrenheit")}
            label={t("fahrenheit")}
            value="fahrenheit"
            name="temperatureUnit"
            className="text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <PrimaryButton onClick={handleSaveChanges}>
          {t("saveChanges")}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default MetricsConfigCard;
