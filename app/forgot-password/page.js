"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import { sendPasswordResetEmail } from "@/services/shared-api";
import TransitionEffect from "@/components/TransitionEffect";
import { motion } from "framer-motion";
import RetroGrid from "@/components/RetroGrid";
import LanguageSelector from "@/components/LanguageSelector";
import { BiArrowBack } from "react-icons/bi";
import ThemeToggle from "@/components/ThemeToggle";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Use Redux to get the current theme
  const theme = useSelector(selectTheme);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { email } = data;

    try {
      await sendPasswordResetEmail(email);
      setSubmissionResult("success");
    } catch (error) {
      setSubmissionResult("error");
    }
    setIsSubmitting(false);
    setIsFlipped(true);
  };

  return (
    <div
      className={`min-h-screen w-auto flex items-center light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900
      relative`}
    >
      <TransitionEffect />
      {/* Back Icon and Language Selector */}
      <BiArrowBack
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-custom-dark-blue dark:text-custom-yellow text-3xl cursor-pointer hover:opacity-80 z-50"
      />
      <div className="absolute top-4  right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex flex-col items-end">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-end">
          <LanguageSelector />
        </div>
      </div>
      <div
        className="relative w-full max-w-[90vw] md:max-w-[50vw] lg:max-w-[35vw] xl:max-w-[30vw] 2xl:max-w-[20vw] mx-auto mt-8 h-[60vh] z-10"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.8s ease-in-out",
          }}
        >
          {/* Front (Forgot Password Form) */}
          <motion.div
            className="absolute w-full h-full p-6 bg-gradient-to-b from-gray-200 to-custom-dark-gray rounded-lg flex flex-col justify-center space-y-4 z-40 dark:from-gray-800 dark:to-gray-900 shadow-dark-shadow dark:shadow-white-shadow"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-4">
              {t("forgotPassword")}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-custom-light-gray mb-2">
                  {t("email")}
                </label>
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className={`w-full px-4 py-2 border rounded-md bg-opacity-100 bg-white text-custom-dark-blue font-secondary ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-custom-yellow`}
                  {...register("email", {
                    required: t("emailRequired"),
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: t("emailInvalid"),
                    },
                  })}
                />
                <div className="h-2">
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full py-3 text-center text-custom-dark-blue font-secondary"
              >
                {t("sendResetLink")}
              </PrimaryButton>
            </form>
          </motion.div>

          {/* Back (Result Face) */}
          <motion.div
            className="absolute w-full h-full p-6 bg-gradient-to-b from-gray-200 to-custom-dark-gray rounded-lg flex flex-col justify-center space-y-4 z-40 dark:from-gray-800 dark:to-gray-900 shadow-dark-shadow dark:shadow-white-shadow"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {submissionResult === "success" ? (
              <div className="text-green-500 font-semibold text-xl text-center">
                {t("resetLinkSent")}
              </div>
            ) : (
              <div className="text-red-500 font-semibold text-xl text-center">
                {t("resetError")}
              </div>
            )}
            <PrimaryButton onClick={() => router.push("/")}>
              {t("goBackHome")}
            </PrimaryButton>
          </motion.div>
        </motion.div>
      </div>
      <RetroGrid />
    </div>
  );
};

export default ForgotPassword;
