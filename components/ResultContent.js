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
  resendTokenRequest,
}) => {
  const { t } = useTranslation();
  const [hasSubmittedToken, setHasSubmittedToken] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
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
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <input
            {...register("token", {
              required: t("tokenRequired"),
              pattern: {
                value: /^[a-fA-F0-9]{32}$/, // Assuming a 6-digit numeric code
                message: t("invalidToken"),
              },
            })}
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder={t("codePlaceholder")}
            className={`w-full px-4 py-2 border rounded-md dark:text-black ${
              errors.token ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-custom-yellow`}
          />
          {errors.token && (
            <p className="text-red-500 text-sm mt-2">{errors.token.message}</p>
          )}
        </div>
        <div>
          <PrimaryButton
            type="button"
            className={`w-full py-3 text-center ${
              !tokenInput || errors.token
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/80 cursor-pointer"
            }`}
            onClick={async () => {
              const isValid = await handleSubmit(onSubmit)();
              if (!isValid) {
                // Validation failed; ensure errors are shown
                return;
              }
              // Proceed with token validation
            }}
          >
            {t("validateCode")}
          </PrimaryButton>
        </div>
      </form>
      <div className="pt-12">
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
