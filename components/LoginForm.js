import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
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
    formState: { errors },
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
  const [checkboxError, setCheckboxError] = useState(false);
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

  const isFormFilled = email?.length > 0 && password?.length > 0 && acceptTerms;

  const handleFormSubmit = (data) => {
    if (!acceptTerms) {
      setCheckboxError(true);
      trigger("acceptTerms");
      return;
    }
    setCheckboxError(false);
    handleSubmit(data, "login");
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative h-full flex flex-col justify-between">
      <motion.div
        className="flex-1 relative z-10"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.h2
          className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-8 font-bold"
          variants={itemVariants}
        >
          {t("login")}
        </motion.h2>

        <form
          onSubmit={handleLoginSubmit(handleFormSubmit)}
          noValidate
          className="space-y-6 "
        >
          {/* Email Input */}
          <motion.div
            variants={itemVariants}
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
          </motion.div>

          {/* Password Input */}
          <motion.div
            className={`relative transform transition-all duration-200 ${
              focusedField === "password" ? "scale-[1.02]" : "scale-100"
            }`}
            variants={itemVariants}
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
          </motion.div>

          {/* Custom Checkbox */}
          <motion.div variants={itemVariants}>
            <CustomCheckbox
              checked={acceptTerms}
              onChange={(e) => {
                setValue("acceptTerms", e.target.checked);
                setCheckboxError(!e.target.checked);
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
              {...register("acceptTerms")}
            />
            {!acceptTerms && checkboxError && (
              <motion.p
                className="text-red-500 text-sm mt-2 ml-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {t("acceptTermsFeedback")}
              </motion.p>
            )}
          </motion.div>

          {/* Forgot Password */}
          <motion.div className="text-center py-4" variants={itemVariants}>
            <motion.button
              type="button"
              className="text-custom-dark-blue hover:text-custom-dark-blue/80 font-secondary dark:text-custom-yellow dark:hover:text-custom-yellow/80 underline underline-offset-2 transition-colors duration-200 font-medium"
              onClick={() => router.push("/forgot-password")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("forgotPassword")}
            </motion.button>
          </motion.div>

          {/* Submit Button */}
          <PrimaryButton
            type="button"
            className={`w-full transform transition-all duration-200 hover:scale-[1.02] ${
              !isFormFilled || isSubmitting
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-custom-yellow hover:bg-custom-yellow/80 cursor-pointer"
            }`}
            onClick={async () => {
              if (!isFormFilled) {
                // Trigger validation for all fields and handle errors
                const results = await trigger();
                if (!acceptTerms) {
                  setCheckboxError(true);
                }
                return; // Prevent further actions if validation fails
              }

              // If everything is valid, handle form submission
              handleSubmit();
            }}
          >
            {isSubmitting ? t("loading") : t("signIn")}
          </PrimaryButton>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
