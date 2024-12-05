import React, { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTranslation } from "next-i18next";
import Loading from "@/components/ui/Loading";

const ResultContent = ({
  isSubmitting,
  submissionResult,
  tokenInput,
  setTokenInput,
  handleTokenSubmit,
  setCurrentFace,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to keep form hidden after submit

  const handleSubmit = () => {
    setIsVisible(false); // Trigger fade-out effect
    setIsLoading(true); // Show loading spinner

    // Delay handleTokenSubmit for 600ms to allow fade-out
    setTimeout(() => {
      handleTokenSubmit();
      setIsLoading(false); // Hide loading spinner
      setIsSubmitted(true); // Keep form hidden
    }, 600);
  };

  if (isSubmitting || isLoading || isSubmitted) {
    return <Loading />;
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
      <PrimaryButton onClick={handleSubmit}>{t("validateCode")}</PrimaryButton>
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
    <div
      className={`transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {submissionResult?.status === "loginSuccess" && renderSuccessContent()}
      {submissionResult?.status === "loginError" && renderErrorContent()}
    </div>
  );
};

export default ResultContent;
