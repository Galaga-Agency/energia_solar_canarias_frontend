import React, { useState } from "react";
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
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmittedToken, setHasSubmittedToken] = useState(false);

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      token: tokenInput,
    },
  });

  const onSubmit = async (data) => {
    setHasSubmittedToken(true);
    setTokenInput(data.token);

    const result = await handleTokenSubmit();

    if (result === false) {
      console.log("4. Validation failed, resetting states");
      setHasSubmittedToken(false);
      setTokenInput("");
      reset({ token: "" });
    }
  };

  if (hasSubmittedToken) {
    console.log("Showing loading because hasSubmittedToken is true");
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
      {submissionResult?.status === "loginSuccess" &&
        !hasSubmittedToken &&
        renderSuccessContent()}
      {submissionResult?.status === "loginError" && renderErrorContent()}
    </div>
  );
};

export default ResultContent;
