import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FormInput from "@/components/ui/FormInput";
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
  const [countdown, setCountdown] = useState(60);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      token: tokenInput,
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "token") {
        setTokenInput(value.token);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setTokenInput]);

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
      setCanResend(true);
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="space-y-4"
      >
        <FormInput
          name="token"
          type="text"
          register={register}
          error={errors.token}
          placeholder={t("codePlaceholder")}
          validation={{
            required: t("tokenRequired"),
            pattern: {
              value: /^[a-fA-F0-9]{32}$/,
              message: t("invalidToken"),
            },
          }}
          disabled={isSubmitting}
          className="w-full"
        />

        <div>
          <PrimaryButton
            type="button"
            disabled={isSubmitting}
            className={`w-full my-6 text-center ${
              !tokenInput || errors.token || isSubmitting
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/80 cursor-pointer"
            }`}
            onClick={async () => {
              const isValid = await handleSubmit(onSubmit)();
              if (!isValid) return;
            }}
          >
            {isSubmitting ? t("validating") : t("validateCode")}
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
