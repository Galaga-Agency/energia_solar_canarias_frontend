"use client";

import { useTranslation } from "next-i18next";
import useLocalStorageState from "use-local-storage-state";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import { useEffect, useRef } from "react";

const NotificationsCard = () => {
  const { t } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorageState(
    "notificationsEnabled",
    { defaultValue: true }
  );
  const [notificationStates, setNotificationStates] = useLocalStorageState(
    "notificationStates",
    {
      defaultValue: {
        notifyInverterIssues: true,
        notifyBatteryIssues: true,
        notifyEnvironmentalAlerts: true,
      },
    }
  );
  const [emailAlerts, setEmailAlerts] = useLocalStorageState("emailAlerts", {
    defaultValue: false,
  });
  const [smsAlerts, setSmsAlerts] = useLocalStorageState("smsAlerts", {
    defaultValue: false,
  });
  const [email, setEmail] = useLocalStorageState("email", { defaultValue: "" });
  const [phone, setPhone] = useLocalStorageState("phone", { defaultValue: "" });
  const [notificationFrequency, setNotificationFrequency] =
    useLocalStorageState("notificationFrequency", {
      defaultValue: "immediate",
    });

  const handleAllNotificationsChange = (e) => {
    const isChecked = e.target.checked;
    setNotificationsEnabled(isChecked);
    setNotificationStates({
      notifyInverterIssues: isChecked,
      notifyBatteryIssues: isChecked,
      notifyEnvironmentalAlerts: isChecked,
    });
  };

  const handleIndividualNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationStates((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFrequencyChange = (e) => {
    setNotificationFrequency(e.target.value);
  };

  const handleSaveChanges = () => {
    alert(t("changesSaved"));
  };

  const handleCancelChanges = () => {
    alert(t("changesCancelled"));
  };

  return (
    <div className="w-full h-full bg-white/50 dark:bg-gray-800/60 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm backdrop-filter">
      <h2 className="text-xl font-semibold mb-4 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
        {t("notifications")}
      </h2>

      <div className="flex flex-col lg:flex-row justify-between gap-4 2xl:gap-24 2xl:justify-start items-start mt-4">
        <div className="flex flex-col">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleAllNotificationsChange}
              className="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
            />
            <span className="ml-2 flex-1">{t("enableAllNotifications")}</span>
          </label>

          <div className="flex flex-col mt-2 space-y-2">
            {Object.keys(notificationStates).map((notification, index) => (
              <label
                key={index}
                className="flex items-center text-custom-dark-blue dark:text-custom-light-gray"
              >
                <input
                  type="checkbox"
                  name={notification}
                  checked={notificationStates[notification]}
                  onChange={handleIndividualNotificationChange}
                  className="h-5 w-5 text-custom-light-gray border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
                />
                <span className="ml-2 flex-1">{t(notification)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mt-4">
            <h3 className="font-semibold text-custom-dark-blue dark:text-custom-light-gray">
              {t("notificationFrequency")}
            </h3>
            <select
              value={notificationFrequency}
              onChange={handleFrequencyChange}
              className="mt-2 border rounded p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            >
              <option value="immediate">{t("immediate")}</option>
              <option value="daily">{t("daily")}</option>
              <option value="weekly">{t("weekly")}</option>
            </select>
          </div>

          {/* Email Notifications */}
          <div className="mt-8">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
              />
              <span className="ml-2">{t("receiveEmailAlerts")}</span>
            </label>
            {emailAlerts && (
              <input
                type="email"
                placeholder={t("enterYourEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border rounded p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              />
            )}
          </div>

          {/* SMS Notifications */}
          <div className="mt-2">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow dark:focus:ring-custom-yellow"
              />
              <span className="ml-2">{t("receiveSmsAlerts")}</span>
            </label>
            {smsAlerts && (
              <input
                type="tel"
                placeholder={t("enterYourPhoneNumber")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 border rounded p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <SecondaryButton onClick={handleCancelChanges}>
          {t("cancel")}
        </SecondaryButton>
        <PrimaryButton onClick={handleSaveChanges}>
          {t("saveChanges")}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default NotificationsCard;
