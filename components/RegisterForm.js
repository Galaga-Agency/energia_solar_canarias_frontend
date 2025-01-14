import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/ui/FormInput";
import PasswordRequirements from "@/components/PasswordRequirements";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const RegisterForm = ({ handleSubmit, isSubmitting, setCurrentFace, t }) => {
  const {
    handleSubmit: handleRegisterSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      privacyPolicy: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const username = watch("username");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isFormFilled =
    username && email && password && confirmPassword && isChecked;

  useEffect(() => {
    if (confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  return (
    <div
      className="flex flex-col justify-start items-center h-auto space-y-6 px-6 overflow-y-auto register-form-container"
      style={{ minHeight: "calc(100vh - 20px)" }}
    >
      <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-4">
        {t("register")}
      </h2>
      <form
        onSubmit={handleRegisterSubmit((data) =>
          handleSubmit(data, "register")
        )}
        noValidate
        className="space-y-4 pb-4"
      >
        <FormInput
          label={t("username")}
          error={errors.username}
          register={register}
          name="username"
          placeholder={t("usernamePlaceholder")}
          validation={{
            required: t("usernameRequired"),
            minLength: {
              value: 3,
              message: t("usernameMinLength"),
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message: t("usernamePattern"),
            },
          }}
        />

        <FormInput
          label={t("email")}
          error={errors.email}
          register={register}
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          validation={{
            required: t("emailRequired"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z.-]+\.[A-Z]{2,}$/i,
              message: t("invalidEmail"),
            },
          }}
        />

        <div className="space-y-1">
          <div className="relative">
            <FormInput
              label={t("password")}
              error={errors.password}
              register={register}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              validation={{
                required: t("passwordRequired"),
                validate: {
                  hasLength: (v) => v.length >= 8 || t("passwordReqLength"),
                  hasUpper: (v) => /[A-Z]/.test(v) || t("passwordReqUppercase"),
                  hasLower: (v) => /[a-z]/.test(v) || t("passwordReqLowercase"),
                  hasNumber: (v) => /\d/.test(v) || t("passwordReqNumber"),
                  hasSpecial: (v) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(v) || t("passwordReqSpecial"),
                },
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-xl text-custom-dark-blue dark:text-gray-400 hover:text-custom-yellow transition-colors duration-200"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <PasswordRequirements password={password} t={t} />
        </div>

        <div className="relative">
          <FormInput
            label={t("confirmPassword")}
            error={errors.confirmPassword}
            register={register}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("confirmPasswordPlaceholder")}
            validation={{
              required: t("confirmPasswordRequired"),
              validate: (value) =>
                value === password || t("passwordsDoNotMatch"),
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-xl text-custom-dark-blue dark:text-gray-400 hover:text-custom-yellow transition-colors duration-200"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <div className="space-y-2">
          <CustomCheckbox
            checked={isChecked}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setIsChecked(isChecked);
              setValue("privacyPolicy", isChecked, { shouldValidate: true });
            }}
            className="text-gray-800 dark:text-gray-200"
            label={
              <span className="text-gray-800 dark:text-gray-200 text-sm">
                {t("privacyPolicyLabel")}{" "}
                <a
                  href="https://www.energiasolarcanarias.es/politica-de-cookies"
                  className="text-custom-dark-blue hover:text-custom-dark-blue/80 dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("cookiesPolicy")}
                </a>
                ,{" "}
                <a
                  href="https://www.energiasolarcanarias.es/politica-de-privacidad"
                  className="text-custom-dark-blue hover:text-custom-dark-blue/80 dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("privacyPolicy")}
                </a>{" "}
                {t("andThe")}{" "}
                <a
                  href="https://www.energiasolarcanarias.es/aviso-legal"
                  className="text-custom-dark-blue hover:text-custom-dark-blue/80 dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("legalNotice")}
                </a>
              </span>
            }
          />

          {errors.privacyPolicy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.privacyPolicy.message}
            </p>
          )}
        </div>

        <PrimaryButton
          type="submit"
          disabled={!isFormFilled || isSubmitting}
          isLoading={isSubmitting}
          className="w-full transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          {t("register")}
        </PrimaryButton>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-800 dark:text-gray-200 text-sm">
          {t("alreadyAccount")}{" "}
          <button
            type="button"
            onClick={() => setCurrentFace("login")}
            className="text-custom-dark-blue hover:text-custom-dark-blue/80 dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200 font-medium"
          >
            {t("signIn")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
