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

  console.log("submission result: ", submissionResult);

  if (isSubmitting) {
    return (
      <div className="text-center">
        <span className="loading loading-spinner"></span>
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (submissionResult?.status === "loginSuccess") {
    return (
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
  }

  if (submissionResult?.status === "loginError") {
    return (
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
  }

  return null;
};

export default ResultContent;
