"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import TransitionEffect from "@/components/TransitionEffect";
import { motion } from "framer-motion";
import RetroGrid from "@/components/RetroGrid";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { IoArrowBackCircle } from "react-icons/io5";
import Texture from "@/components/Texture";
import PasswordRequirements from "@/components/PasswordRequirements";
import FormFace from "@/components/ui/FormFace";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { toast } from "sonner";
import { updateUserPassword } from "@/store/slices/userSlice";

const ResetPassword = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFlipped, setIsFlipped] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error(t("invalidToken"));
      router.push("/");
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, router, t]);

  const password = watch("password");

  const onSubmit = async (data) => {
    if (!token) {
      setSubmissionResult("invalidToken");
      setIsFlipped(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserPassword(token, data.password);
      setSubmissionResult("success");
      setIsFlipped(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      setSubmissionResult("error");
      setIsFlipped(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen w-auto flex items-center light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative">
      <TransitionEffect />
      <IoArrowBackCircle
        onClick={() => router.push("/")}
        className="absolute cursor-pointer top-4 left-4 text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4 z-50"
      />
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      <div
        className="relative w-full max-w-[90vw] md:max-w-[50vw] lg:max-w-[35vw] xl:max-w-[30vw] 2xl:max-w-[20vw] mx-auto mt-8 h-[70vh] z-10"
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

          {/* Front (Reset Password Form) */}
          <FormFace isActive={!isFlipped} rotation={0}>
            <h2 className="text-custom-dark-blue dark:text-gray-200 text-2xl text-center mb-4">
              {t("resetPassword")}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <label className="block text-custom-dark-blue dark:text-gray-200 mb-2">
                  {t("newPassword")}
                </label>
                <input
                  type="password"
                  placeholder={t("newPasswordPlaceholder")}
                  className={`w-full px-4 py-2 border rounded-md bg-opacity-100 bg-white text-custom-dark-blue font-secondary ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-custom-yellow`}
                  {...register("password", {
                    required: t("passwordRequired"),
                    validate: {
                      hasLength: (v) => v.length >= 8 || t("passwordReqLength"),
                      hasUpper: (v) =>
                        /[A-Z]/.test(v) || t("passwordReqUppercase"),
                      hasLower: (v) =>
                        /[a-z]/.test(v) || t("passwordReqLowercase"),
                      hasNumber: (v) => /\d/.test(v) || t("passwordReqNumber"),
                      hasSpecial: (v) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                        t("passwordReqSpecial"),
                    },
                  })}
                />
                <PasswordRequirements password={password} t={t} />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-custom-dark-blue dark:text-gray-200 mb-2">
                  {t("confirmPassword")}
                </label>
                <input
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  className={`w-full px-4 py-2 border rounded-md bg-opacity-100 bg-white text-custom-dark-blue font-secondary ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:border-custom-yellow`}
                  {...register("confirmPassword", {
                    required: t("confirmPasswordRequired"),
                    validate: (value) =>
                      value === password || t("passwordsDoNotMatch"),
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <PrimaryButton
                type="submit"
                disabled={
                  isSubmitting ||
                  !password ||
                  errors.password ||
                  errors.confirmPassword ||
                  watch("confirmPassword") !== password
                }
                isLoading={isSubmitting}
                className="w-full py-3 text-center text-custom-dark-blue font-secondary"
              >
                {t("updatePassword")}
              </PrimaryButton>
            </form>
          </FormFace>

          {/* Back (Result Feedback) */}
          <FormFace isActive={isFlipped} rotation={180}>
            {submissionResult === "success" ? (
              <div className="text-green-500 flex flex-col items-center space-y-4">
                <AiOutlineCheckCircle className="text-6xl" />
                <p className="text-xl">{t("passwordUpdatedSuccessfully")}</p>
              </div>
            ) : (
              <div className="text-red-500 text-center">
                <p className="text-xl">
                  {submissionResult === "invalidToken"
                    ? t("invalidToken")
                    : t("updatePasswordError")}
                </p>
              </div>
            )}
            <PrimaryButton
              onClick={() => router.push("/")}
              className="mt-6 w-full"
            >
              {t("backToLogin")}
            </PrimaryButton>
          </FormFace>
        </motion.div>
      </div>
      <RetroGrid />
    </div>
  );
};

export default ResetPassword;
