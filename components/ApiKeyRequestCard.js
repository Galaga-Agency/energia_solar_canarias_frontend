import { useTranslation } from "next-i18next";
import PrimaryButton from "./PrimaryButton";

const ApiKeyRequestCard = ({ onRequestApiKey }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-dark-shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
        {t("apiKeyRequest")}
      </h2>
      <PrimaryButton onClick={onRequestApiKey}>
        {t("requestApiKey")}
      </PrimaryButton>
    </div>
  );
};

export default ApiKeyRequestCard;
