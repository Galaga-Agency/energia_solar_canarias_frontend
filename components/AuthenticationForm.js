"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { loginOrRegister } from "@/services/api";
import { useTranslation } from "next-i18next";

const AuthenticationForm = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const isPrivacyChecked = watch("privacyPolicy");

  const onSubmit = async (data) => {
    try {
      const response = await loginOrRegister(data, isFlipped);
      setFeedbackMessage(
        isFlipped ? t("registrationSuccess") : t("loginSuccess")
      );
      setIsError(false);
      setIsSubmitted(true);
    } catch (error) {
      setFeedbackMessage(isFlipped ? t("registrationError") : t("loginError"));
      setIsError(true);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="relative w-full max-w-[90vw] md:max-w-[50vw] lg:max-w-[35vw] xl:max-w-[30vw] 2xl:max-w-[20vw] mx-auto mt-16">
      <div
        className="relative w-full h-[400px]"
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.8s ease-in-out",
          }}
        >
          {/* Front (Login Form) */}
          <motion.div
            className="absolute w-full h-full p-8 bg-custom-dark-blue bg-opacity-30 shadow-white-shadow rounded-lg flex flex-col justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              position: "absolute",
            }}
          >
            {!isFlipped && (
              <>
                {!isSubmitted ? (
                  <>
                    <h2 className="text-custom-light-gray text-2xl text-center mb-6">
                      {t("login")}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div className="mb-4">
                        <label className="block text-custom-light-gray mb-1">
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
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Checkbox for Privacy Policy */}
                      <div className="mb-6">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            {...register("privacyPolicy", {
                              required: t("termsRequired"),
                            })}
                          />
                          <span className="ml-2 text-custom-light-gray">
                            {t("privacyPolicy")}
                          </span>
                        </label>
                        {errors.privacyPolicy && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.privacyPolicy.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded-md ${
                          !isPrivacyChecked
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={!isPrivacyChecked}
                      >
                        {t("signIn")}
                      </button>
                    </form>

                    <div className="mt-4 text-center">
                      <p className="text-custom-light-gray text-sm">
                        {t("noAccount")}{" "}
                        <button
                          type="button"
                          onClick={() => setIsFlipped(true)}
                          className="text-blue-300 hover:underline"
                        >
                          {t("register")}
                        </button>
                      </p>
                    </div>
                  </>
                ) : (
                  <div
                    className={`text-center p-6 rounded-md ${
                      isError ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    <p className="text-white text-lg">{feedbackMessage}</p>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Back (Signup Form) */}
          <motion.div
            className="absolute w-full h-full p-8 bg-custom-dark-blue bg-opacity-30 shadow-white-shadow rounded-lg flex flex-col justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {isFlipped && (
              <>
                {!isSubmitted ? (
                  <>
                    <h2 className="text-custom-light-gray text-2xl text-center mb-6">
                      {t("register")}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <div className="mb-4">
                        <label className="block text-custom-light-gray mb-1">
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
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Checkbox for Privacy Policy */}
                      <div className="mb-6">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            {...register("privacyPolicy", {
                              required: t("termsRequired"),
                            })}
                          />
                          <span className="ml-2 text-custom-light-gray">
                            {t("privacyPolicy")}
                          </span>
                        </label>
                        {errors.privacyPolicy && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.privacyPolicy.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded-md ${
                          !isPrivacyChecked
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={!isPrivacyChecked}
                      >
                        {t("register")}
                      </button>
                    </form>

                    <div className="mt-4 text-center">
                      <p className="text-custom-light-gray text-sm">
                        {t("alreadyAccount")}{" "}
                        <button
                          type="button"
                          onClick={() => setIsFlipped(false)}
                          className="text-blue-300 hover:underline"
                        >
                          {t("signIn")}
                        </button>
                      </p>
                    </div>
                  </>
                ) : (
                  <div
                    className={`text-center p-6 rounded-md ${
                      isError ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    <p className="text-white text-lg">{feedbackMessage}</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
