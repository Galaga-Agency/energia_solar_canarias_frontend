import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";
import CustomCheckbox from "./ui/CustomCheckbox";
import FormInput from "@/components/ui/FormInput";
import PrimaryButton from "@/components/ui/PrimaryButton";

const LoginForm = ({
  handleSubmit,
  isSubmitting,
  loading,
  setCurrentFace,
  t,
}) => {
  const {
    handleSubmit: handleLoginSubmit,
    register,
    formState: { errors, isSubmitted },
    watch,
    setValue,
    trigger,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGlow(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const email = watch("email");
  const password = watch("password");
  const acceptTerms = watch("acceptTerms");

  const isFormFilled = email?.length > 0 && password?.length > 0;

  const onSubmit = (data) => {
    if (!acceptTerms) {
      return;
    }
    handleSubmit(data, "login");
  };

  return (
    <motion.div
      className="relative h-full flex flex-col justify-between"
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1], // Custom ease with nice deceleration
        },
      }}
    >
      <div className="flex-1 relative z-10">
        <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-8">
          {t("login")}
        </h2>

        <form
          onSubmit={handleLoginSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <div
            className={`transform transition-all duration-200 ${
              focusedField === "email" ? "scale-[1.02]" : "scale-100"
            }`}
          >
            <FormInput
              label={t("email")}
              error={errors.email}
              register={register}
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="transition-all duration-200 focus:ring-2 focus:ring-custom-yellow/50"
              validation={{
                required: t("emailRequired"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("invalidEmail"),
                },
              }}
            />
          </div>

          <div
            className={`relative transform transition-all duration-200 ${
              focusedField === "password" ? "scale-[1.02]" : "scale-100"
            }`}
          >
            <FormInput
              label={t("password")}
              error={errors.password}
              register={register}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="transition-all duration-200 focus:ring-2 focus:ring-custom-yellow/50"
              validation={{
                required: t("passwordRequired"),
              }}
            />
            <motion.button
              type="button"
              className="absolute right-3 top-10 text-xl text-custom-dark-blue dark:text-gray-400 hover:text-custom-yellow transition-colors duration-200"
              onClick={() => setShowPassword((prev) => !prev)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </motion.button>
          </div>

          <div>
            <CustomCheckbox
              checked={acceptTerms}
              onChange={(e) => {
                setValue("acceptTerms", e.target.checked);
              }}
              registerProps={register("acceptTerms", {
                required: t("acceptTermsFeedback"),
              })}
              label={
                <span className="text-gray-800 dark:text-gray-200 text-sm">
                  {t("acceptTerms")}{" "}
                  <motion.a
                    href="https://www.energiasolarcanarias.es/politica-de-cookies"
                    className="text-custom-dark-blue hover:text-custom-dark-blue/80 dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t("cookiesPolicy")}
                  </motion.a>
                  ,{" "}
                  <motion.a
                    href="https://www.energiasolarcanarias.es/politica-de-privacidad"
                    className="text-custom-dark-blue hover:text-custom-dark-blue/80 dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t("privacyPolicy")}
                  </motion.a>{" "}
                  {t("andThe")}{" "}
                  <motion.a
                    href="https://www.energiasolarcanarias.es/aviso-legal"
                    className="text-custom-dark-blue hover:text-custom-dark-blue/80 dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t("legalNotice")}
                  </motion.a>
                </span>
              }
            />
            {isSubmitted && !acceptTerms && (
              <motion.p
                className="text-red-500 text-sm mt-2 ml-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {t("acceptTermsFeedback")}
              </motion.p>
            )}
          </div>

          <div className="text-center py-4">
            <motion.button
              type="button"
              className="text-custom-dark-blue hover:text-custom-dark-blue/80 font-secondary dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200 font-medium"
              onClick={() => router.push("/forgot-password")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("forgotPassword")}
            </motion.button>
          </div>

          <div>
            <PrimaryButton
              type="submit"
              className={`w-full transform transition-all duration-200 hover:scale-[1.02] ${
                !isFormFilled || isSubmitting || !acceptTerms
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-custom-yellow hover:bg-custom-yellow/80 cursor-pointer"
              }`}
            >
              {isSubmitting ? t("loading") : t("signIn")}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;
