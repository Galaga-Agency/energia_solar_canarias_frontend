import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  authenticateUser,
  selectLoading,
  selectError,
} from "@/store/slices/userSlice";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { fetchPlants } from "@/store/slices/plantsSlice";

const AuthenticationForm = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultFace, setShowResultFace] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const { saveAuthData } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { email, password } = data;

    try {
      const user = await dispatch(
        authenticateUser({ email, password })
      ).unwrap();
      saveAuthData("mockAuthToken", user);
      setSubmissionResult("loginSuccess");
      setShowResultFace(true);
      router.push(`/dashboard/${user.id}/plants`);
    } catch (error) {
      setSubmissionResult("loginError");
      console.error("Authentication failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-[90vw] md:max-w-[50vw] lg:max-w-[35vw] xl:max-w-[30vw] 2xl:max-w-[20vw] mx-auto mt-8 z-0">
      <div
        className="relative w-full h-[550px]"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: showResultFace
              ? "rotateY(360deg)"
              : isFlipped
              ? "rotateY(180deg)"
              : "rotateY(0deg)",
            transition: "transform 0.8s ease-in-out",
          }}
        >
          <motion.div
            className="absolute w-full h-full p-6 bg-gradient-to-b from-gray-200 to-custom-dark-gray rounded-lg flex flex-col justify-center space-y-4 z-40 dark:from-gray-800 dark:to-gray-900 shadow-dark-shadow dark:shadow-white-shadow"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            {!isFlipped && !showResultFace && (
              <>
                <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-4">
                  {t("login")}
                </h2>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className={`w-full px-4 py-2 border rounded-md dark:text-black ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("email", {
                        required: t("emailRequired"),
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: t("emailInvalid"),
                        },
                      })}
                    />
                    <div className="min-h-[16px]">
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      {t("password")}
                    </label>
                    <input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      className={`w-full px-4 py-2 border rounded-md dark:text-black ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("password", {
                        required: t("passwordRequired"),
                        minLength: {
                          value: 6,
                          message: t("passwordMinLength"),
                        },
                      })}
                    />
                    <div className="min-h-[16px]">
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-blue-500 hover:underline dark:text-blue-300"
                      onClick={() => router.push("/forgot-password")}
                    >
                      {t("forgotPassword")}
                    </button>
                  </div>
                  <CustomButton
                    type="submit"
                    disabled={loading || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    {t("signIn")}
                  </CustomButton>
                </form>
                <div className="min-h-[16px] mt-2">
                  {error && (
                    <div className="text-center text-red-500">{error}</div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">
                    {t("noAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => setIsFlipped(true)}
                      className="text-blue-500 hover:underline dark:text-blue-300"
                    >
                      {t("register")}
                    </button>
                  </p>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            className="absolute w-full h-full p-6 bg-gradient-to-b from-gray-200 to-custom-dark-gray rounded-lg flex flex-col justify-center space-y-4 dark:from-gray-800 dark:to-gray-900 shadow-dark-shadow dark:shadow-white-shadow"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {isFlipped && !showResultFace && (
              <>
                <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center">
                  {t("register")}
                </h2>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-1"
                >
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      {t("username")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("usernamePlaceholder")}
                      className={`w-full px-4 py-2 border rounded-md ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("username", {
                        required: t("usernameRequired"),
                      })}
                    />
                    <div className="min-h-[16px]">
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className={`w-full px-4 py-2 border rounded-md ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("email", {
                        required: t("emailRequired"),
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: t("emailInvalid"),
                        },
                      })}
                    />
                    <div className="min-h-[16px]">
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      {t("password")}
                    </label>
                    <input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      className={`w-full px-4 py-2 border rounded-md ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("password", {
                        required: t("passwordRequired"),
                        minLength: {
                          value: 6,
                          message: t("passwordMinLength"),
                        },
                      })}
                    />
                    <div className="min-h-[16px]">
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        {...register("privacyPolicy", {
                          required: t("privacyPolicyConsent"),
                        })}
                      />
                      <span className="ml-2 text-custom-light-gray">
                        {t("privacyPolicyLabel")}
                        <a
                          href="https://www.energiasolarcanarias.es/politica-de-cookies"
                          className="text-blue-300 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("cookiesPolicy")}
                        </a>
                        ,{" "}
                        <a
                          href="https://www.energiasolarcanarias.es/politica-de-privacidad"
                          className="text-blue-300 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("privacyPolicy")}
                        </a>{" "}
                        {t("andTheLegalNoticePrefix")}{" "}
                        <a
                          href="https://www.energiasolarcanarias.es/aviso-legal"
                          className="text-blue-300 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("legalNotice")}
                        </a>
                      </span>
                    </label>
                    <div className="min-h-[10px] mb-4">
                      {errors.privacyPolicy && (
                        <p className="text-red-500 text-sm mt-0">
                          {errors.privacyPolicy.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <CustomButton
                    type="submit"
                    disabled={loading || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    {t("register")}
                  </CustomButton>
                </form>
                <div className="mt-2 text-center">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">
                    {t("alreadyAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="text-blue-500 hover:underline dark:text-blue-300"
                    >
                      {t("signIn")}
                    </button>
                  </p>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            className="absolute w-full h-full p-6 bg-gradient-to-b from-gray-200 to-custom-dark-gray rounded-lg flex flex-col justify-center space-y-4 dark:from-gray-800 dark:to-gray-900"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(360deg)",
            }}
          >
            {showResultFace && (
              <div className="text-center">
                {submissionResult === "registrationSuccess" ? (
                  <div className="text-green-500 font-semibold text-xl">
                    {t("registrationSuccess")}
                  </div>
                ) : submissionResult === "loginSuccess" ? (
                  <div className="text-green-500 font-semibold text-xl">
                    {t("loginSuccess")}
                  </div>
                ) : submissionResult === "loginError" ? (
                  <div className="text-red-500 font-semibold text-xl">
                    {t("loginError")}
                  </div>
                ) : (
                  <div className="text-red-500 font-semibold text-xl">
                    {t("registrationError")}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
