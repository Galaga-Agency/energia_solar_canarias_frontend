import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FormInput from "@/components/ui/FormInput";
import Loading from "@/components/ui/Loading";
import { useTranslation } from "next-i18next";
import AnimatedInputWrapper from "@/components/ui/AnimatedInputWrapper";

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
  const [focusedField, setFocusedField] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  const {
    handleSubmit: handleTokenSubmitForm,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      token: "",
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

  const token = watch("token");

  useEffect(() => {
    setTokenInput(token);
  }, [token, setTokenInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGlow(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    setTokenError(null);
    setHasSubmittedToken(true);
    setTokenInput(data.token);

    const result = await handleTokenSubmit();

    if (result === false) {
      setTokenError({
        message: t("invalidToken"),
      });
      setHasSubmittedToken(false);
      setTokenInput("");
      reset({ token: "" });
    }
  };

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

  if (hasSubmittedToken) {
    return <Loading />;
  }

  return (
    <div className="h-full w-full flex flex-col justify-center z-50">
      {submissionResult?.status === "loginError" ? (
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-red-500">{submissionResult.message}</p>
          <motion.button
            onClick={() => setCurrentFace("login")}
            className="text-gray-800 dark:text-gray-200 underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("backToLogin")}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="relative h-full flex flex-col justify-between overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
        >
          <div className="flex-1 relative z-10">
            <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-8">
              {t("enterCode")}
            </h2>

            <form
              onSubmit={handleTokenSubmitForm(onSubmit)}
              className="space-y-4 md:space-y-6"
              noValidate
            >
              <AnimatedInputWrapper
                shouldShake={!!tokenError}
                className={`transform transition-all duration-200 ${
                  focusedField === "token" ? "scale-[1.02]" : "scale-100"
                }`}
              >
                <FormInput
                  name="token"
                  type="text"
                  register={register}
                  error={errors.token || tokenError}
                  placeholder={t("codePlaceholder")}
                  onFocus={() => {
                    setFocusedField("token");
                    setTokenError(null);
                  }}
                  onBlur={() => setFocusedField(null)}
                  className={`transition-all duration-200 focus:ring-2 focus:ring-custom-yellow/50 ${
                    errors.token || tokenError ? "border-red-500" : ""
                  }`}
                  validation={{
                    required: t("tokenRequired"),
                    pattern: {
                      value: /^[a-fA-F0-9]{32}$/,
                      message: t("invalidToken"),
                    },
                  }}
                />
              </AnimatedInputWrapper>

              <div>
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full transform transition-all duration-200 hover:scale-[1.02] ${
                    !tokenInput || errors.token || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed opacity-70"
                      : "bg-custom-yellow hover:bg-custom-yellow/80 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? t("validating") : t("validateCode")}
                </PrimaryButton>
              </div>

              <div className="text-center pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("didNotReceiveCode")}{" "}
                  <motion.button
                    type="button"
                    className={`text-custom-dark-blue dark:text-custom-yellow ${
                      canResend
                        ? "underline underline-offset-2 hover:text-custom-dark-blue/80 dark:hover:text-custom-yellow/80"
                        : ""
                    }`}
                    onClick={handleResend}
                    disabled={!canResend}
                    whileHover={canResend ? { scale: 1.05 } : {}}
                    whileTap={canResend ? { scale: 0.95 } : {}}
                  >
                    {canResend
                      ? t("resend")
                      : t("retryIn", { seconds: countdown })}
                  </motion.button>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResultContent;
