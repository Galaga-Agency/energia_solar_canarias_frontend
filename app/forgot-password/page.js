"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import TransitionEffect from "@/components/TransitionEffect";
import { motion } from "framer-motion";
import RetroGrid from "@/components/RetroGrid";
import LanguageSelector from "@/components/LanguageSelector";
import { BiArrowBack } from "react-icons/bi";
import ThemeToggle from "@/components/ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { IoArrowBackCircle } from "react-icons/io5";
import Texture from "@/components/Texture";
import { sendPasswordResetEmail } from "@/store/slices/userSlice";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isFlipped, setIsFlipped] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { email } = data;

    try {
      await dispatch(sendPasswordResetEmail({ email })).unwrap();
      setSubmissionResult("success");
    } catch (error) {
      console.error("Password reset error:", error);
      setSubmissionResult("error");
    }
    setIsSubmitting(false);
    setIsFlipped(true);
  };

  return (
    <div
      className={`min-h-screen w-auto flex items-center light:bg-gradient-to-b bg-white/80 dark:bg-custom-dark-blue backdrop-blur-sm
      relative`}
    >
      <TransitionEffect />
      {/* Back Icon and Language Selector */}
      <IoArrowBackCircle
        onClick={() => router.push("/")}
        className="absolute cursor-pointer top-4 left-4 text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4 z-50"
      />
      <div className="absolute top-4  right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex flex-col items-end">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-end">
          <LanguageSelector />
        </div>
      </div>

      <div className="relative w-[min(100%-2rem,470px)] mx-auto mt-8 h-[72vh] z-10 perspective ">
        <motion.div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.8s ease-in-out",
          }}
        >
          {/* Glow effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[130%] animate-pulse">
            {/* Primary glow */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-custom-yellow/10 via-green-400/15 to-transparent rounded-[100%] blur-[80px]"
              style={{
                animation: "glow 8s ease-in-out infinite alternate",
              }}
            />
            {/* Secondary subtle glow */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-custom-yellow/10 via-green-400/10 to-transparent rounded-[100%] blur-[90px]"
              style={{
                animation: "glow 8s ease-in-out infinite alternate-reverse",
              }}
            />
          </div>
          {/* Front (Forgot Password Form) */}
          <motion.div
            className="absolute w-full h-full p-6 bg-white/80 dark:bg-custom-dark-blue backdrop-blur-sm rounded-lg flex flex-col justify-center space-y-4 z-40  "
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <Texture />
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
                type="button" // Use type="button" to prevent default submission
                isLoading={isSubmitting}
                className={`w-full py-3 text-center font-secondary ${
                  !watch("email") || !!errors.email || isSubmitting
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70"
                    : "bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/80 cursor-pointer"
                }`}
                onClick={async () => {
                  // Validate the form when the button is clicked
                  const isValid = await handleSubmit(onSubmit)();

                  // Display errors if validation fails
                  if (!isValid) {
                    return;
                  }

                  // Proceed with form submission if validation passes
                  if (isSubmitting) return;
                  setIsSubmitting(true);

                  try {
                    await dispatch(
                      sendPasswordResetEmail({ email: watch("email") })
                    ).unwrap();
                    setSubmissionResult("success");
                  } catch (error) {
                    console.error("Password reset error:", error);
                    setSubmissionResult("error");
                  } finally {
                    setIsSubmitting(false);
                    setIsFlipped(true);
                  }
                }}
              >
                {t("sendResetLink")}
              </PrimaryButton>
            </form>
          </motion.div>

          {/* Back (Result Face) */}
          <motion.div
            className="absolute w-full h-full p-6 bg-gradient-to-b y rounded-lg flex flex-col justify-center space-y-4 z-40 bg-white/80 dark:bg-custom-dark-blue backdrop-blur-sm "
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Texture />
            {submissionResult === "success" ? (
              <div className="text-green-500 font-semibold text-xl text-center">
                {t("resetLinkSent")}
              </div>
            ) : (
              <div className="text-red-500 font-semibold text-xl text-center">
                {t("resetError")}
              </div>
            )}
            {/* <PrimaryButton onClick={() => router.push("/")}>
              {t("goBackHome")}
            </PrimaryButton> */}
          </motion.div>
        </motion.div>
      </div>
      <RetroGrid />
    </div>
  );
};

export default ForgotPassword;
