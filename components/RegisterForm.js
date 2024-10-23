import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import PrimaryButton from "./PrimaryButton";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/store/slices/userSlice";

const RegisterForm = ({ setCurrentFace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    try {
      await dispatch(authenticateUser(data)).unwrap();
      setCurrentFace("login");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center">
        {t("register")}
      </h2>
      <form
        onSubmit={handleSubmit(handleRegister)}
        noValidate
        className="space-y-3"
      >
        <FormInput
          label={t("username")}
          error={errors.username}
          register={register}
          name="username"
          placeholder={t("usernamePlaceholder")}
        />
        <FormInput
          label={t("email")}
          error={errors.email}
          register={register}
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
        />
        <FormInput
          label={t("password")}
          error={errors.password}
          register={register}
          name="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
        />
        <div className="mb-4">
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
        <PrimaryButton type="submit" disabled={errors.privacyPolicy}>
          {t("register")}
        </PrimaryButton>
      </form>
      <div className="mt-2 text-center">
        <p className="text-gray-800 dark:text-gray-200 text-sm">
          {t("alreadyAccount")}{" "}
          <button
            type="button"
            onClick={() => setCurrentFace("login")}
            className="text-gray-800 dark:text-gray-200 text-md underline"
          >
            {t("signIn")}
          </button>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
