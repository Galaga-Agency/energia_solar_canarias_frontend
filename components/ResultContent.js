import React from "react";
import PrimaryButton from "./PrimaryButton";
import { useTranslation } from "next-i18next";

const ResultContent = ({
  isSubmitting,
  submissionResult,
  tokenInput,
  setTokenInput,
  handleTokenSubmit,
  setCurrentFace,
}) => {
  const { t } = useTranslation();

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="loading loading-spinner"></span>
        <p className="mt-2">{t("loading")}</p>
      </div>
    );
  }

  const renderSuccessContent = () => (
    <div className="space-y-4">
      <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center">
        {t("enterCode")}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center">
        {t("codeSentMessage")}
      </p>
      <input
        type="text"
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
        placeholder={t("codePlaceholder")}
        className="w-full px-4 py-2 border rounded-md dark:text-black"
      />
      <PrimaryButton onClick={handleTokenSubmit}>
        {t("validateCode")}
      </PrimaryButton>
    </div>
  );

  const renderErrorContent = () => (
    <div className="text-center text-red-500">
      <p>{submissionResult.message}</p>
      <button
        onClick={() => setCurrentFace("login")}
        className="text-gray-800 dark:text-gray-200 underline mt-4"
      >
        {t("backToLogin")}
      </button>
    </div>
  );

  return (
    <>
      {submissionResult?.status === "loginSuccess" && renderSuccessContent()}
      {submissionResult?.status === "loginError" && renderErrorContent()}
    </>
  );
};

export default ResultContent;
