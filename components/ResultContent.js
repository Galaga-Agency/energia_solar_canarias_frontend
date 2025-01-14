import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useTranslation } from "next-i18next";
import Loading from "@/components/ui/Loading";
import { useForm } from "react-hook-form";

const ResultContent = ({
  isSubmitting,
  submissionResult,
  tokenInput,
  setTokenInput,
  handleTokenSubmit,
  setCurrentFace,
  resendTokenRequest, // Function to resend the token request
}) => {
  const { t } = useTranslation();
  const [hasSubmittedToken, setHasSubmittedToken] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      token: tokenInput,
    },
  });

  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [canResend]);

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(60);
    try {
      await resendTokenRequest();
    } catch (error) {
      console.error("Error resending token:", error);
      setCanResend(true); // Allow retry in case of failure
    }
  };

  const onSubmit = async (data) => {
    setHasSubmittedToken(true);
    setTokenInput(data.token);

    const result = await handleTokenSubmit();

    if (result === false) {
      setHasSubmittedToken(false);
      setTokenInput("");
      reset({ token: "" });
    }
  };

  if (hasSubmittedToken) {
    return <Loading />;
  }

  const renderSuccessContent = () => (
    <div className="text-center space-y-4">
      <h2 className="text-gray-800 dark:text-gray-200 text-2xl">
        {t("enterCode")}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">{t("codeSentMessage")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("token")}
          type="text"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder={t("codePlaceholder")}
          className="w-full px-4 py-2 border rounded-md dark:text-black"
        />
        <PrimaryButton type="submit">{t("validateCode")}</PrimaryButton>
      </form>
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("didNotReceiveCode")}{" "}
          <span className="text-custom-dark-blue dark:text-custom-yellow">
            {canResend ? (
              <button
                onClick={handleResend}
                className="underline underline-offset-2 hover:text-custom-dark-blue/80 dark:hover:text-custom-yellow/80"
              >
                {t("resend")}
              </button>
            ) : (
              t("retryIn", { seconds: countdown })
            )}
          </span>
        </p>
      </div>
    </div>
  );

  const renderErrorContent = () => (
    <div className="text-center text-red-500 space-y-4">
      <p>{submissionResult.message}</p>
      <button
        onClick={() => setCurrentFace("login")}
        className="text-gray-800 dark:text-gray-200 underline"
      >
        {t("backToLogin")}
      </button>
    </div>
  );

  return (
    <div className="h-full w-full flex items-center justify-center">
      {submissionResult?.status === "loginSuccess" && renderSuccessContent()}
      {submissionResult?.status === "loginError" && renderErrorContent()}
    </div>
  );
};

export default ResultContent;
