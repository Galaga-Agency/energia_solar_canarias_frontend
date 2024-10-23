import { useState } from "react";
import { useTranslation } from "next-i18next";
import PrimaryButton from "./PrimaryButton";

const PasswordChangeCard = ({ onChangePassword }) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    onChangePassword(newPassword);
    setNewPassword("");
    setRepeatPassword("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-dark-shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl  mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
        {t("changePassword")}
      </h2>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
          placeholder={t("newPassword")}
          required
        />
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:border-blue-500"
          placeholder={t("repeatPassword")}
          required
        />
        <PrimaryButton type="submit" className="text-nowrap">
          {t("updatePassword")}
        </PrimaryButton>
      </form>
    </div>
  );
};

export default PasswordChangeCard;
