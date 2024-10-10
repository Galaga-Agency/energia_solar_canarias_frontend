"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";
import { sendPasswordResetEmail } from "@/services/api";
import TransitionEffect from "@/components/TransitionEffect";
import { motion } from "framer-motion";
import RetroGrid from "@/components/magicui/retro-grid";
import LanguageSelector from "@/components/LanguageSelector";
import { BiArrowBack } from "react-icons/bi";

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
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900 relative overflow-hidden">
      <TransitionEffect />
      {/* Back Icon and Language Selector */}
      <BiArrowBack
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-custom-yellow text-3xl cursor-pointer hover:opacity-80 z-50"
      />
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
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
            className="absolute w-full h-full p-6 bg-custom-dark-blue shadow-white-shadow bg-opacity-30 rounded-lg flex flex-col justify-center space-y-4 z-40"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            <h2 className="text-center text-custom-light-gray text-2xl md:text-3xl font-secondary mb-6">
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
              <CustomButton
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full py-3 text-center text-custom-dark-blue font-secondary"
              >
                {t("sendResetLink")}
              </CustomButton>
            </form>
          </motion.div>

          {/* Back (Result Face) */}
          <motion.div
            className="absolute w-full h-full p-6 bg-custom-dark-blue shadow-white-shadow bg-opacity-30 rounded-lg flex flex-col justify-center items-center space-y-4"
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
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-custom-yellow text-custom-dark-blue rounded-md hover:bg-opacity-90"
            >
              {t("goBackHome")}
            </button>
          </motion.div>
        </motion.div>
      </div>
      <RetroGrid />
    </div>
  );
};

export default ForgotPassword;
