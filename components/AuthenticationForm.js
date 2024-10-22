import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  authenticateUser,
  selectLoading,
  selectError,
  validateToken,
  setUser,
} from "@/store/slices/userSlice";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Cookies from "js-cookie";

const AuthenticationForm = () => {
  const [currentFace, setCurrentFace] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { saveAuthData } = useAuth();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [userToValidate, setUserToValidate] = useState();

  // Form configuration for validation rules
  const formConfig = {
    email: {
      required: t("emailRequired"),
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: t("emailInvalid"),
      },
    },
    password: {
      required: t("passwordRequired"),
      minLength: {
        value: 6,
        message: t("passwordMinLength"),
      },
    },
    username: {
      required: t("usernameRequired"),
    },
  };

  // Form input field component
  const FormInput = ({
    label,
    error,
    register,
    name,
    type = "text",
    placeholder,
  }) => (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md dark:text-black ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...register(name, formConfig[name])}
      />
      <div className="min-h-[16px]">
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </div>
  );

  // Form face wrapper component
  const FormFace = ({ isActive, rotation, children }) => (
    <motion.div
      className="absolute w-full h-full p-6 bg-gradient-to-b from-gray-200 to-custom-dark-gray rounded-lg flex flex-col justify-center space-y-4 z-40 dark:from-gray-800 dark:to-gray-900 shadow-dark-shadow dark:shadow-white-shadow"
      style={{
        backfaceVisibility: "hidden",
        transform: `rotateY(${rotation}deg)`,
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      {children}
    </motion.div>
  );

  const loginForm = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    mode: "onChange",
    defaultValues: { username: "", email: "", password: "" },
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const user = await dispatch(authenticateUser(data)).unwrap();
      saveAuthData("mockAuthToken", user);
      setSubmissionResult({ status: "loginSuccess" });
      setUserToValidate(user.data.id);
      setCurrentFace("result");
    } catch (err) {
      let errorMessage;

      if (err === "Failed to fetch") {
        errorMessage = t("internalServerError");
      } else if (err.includes("la contraseña es inválida")) {
        errorMessage = t("invalidPassword");
      } else if (err.includes("el usuario no existe")) {
        errorMessage = t("invalidUser");
      } else {
        errorMessage = err;
      }

      setSubmissionResult({
        status: "loginError",
        message: errorMessage,
      });
      setCurrentFace("result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTokenSubmit = async () => {
    if (!tokenInput.trim() || !userToValidate) return;
    try {
      const response = await dispatch(
        validateToken({ id: userToValidate, token: tokenInput })
      ).unwrap();

      if (response.status === "success") {
        dispatch(setUser(response.data));
        Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
        setTokenInput("");
        router.push(`/dashboard/${userToValidate}/plants`);
      } else {
        setTokenInput("");
        setSubmissionResult({
          status: "loginError",
          message: t("invalidUser"),
        });
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setSubmissionResult({
        status: "loginError",
        message: t("invalidUser"),
      });
    }
  };

  const getRotation = () => {
    const rotations = {
      login: 0,
      register: 180,
      result: 360,
    };
    return `rotateY(${rotations[currentFace]}deg)`;
  };

  const LoginForm = () => (
    <>
      <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-4">
        {t("login")}
      </h2>
      <form
        onSubmit={loginForm.handleSubmit((data) => handleSubmit(data, "login"))}
        noValidate
        className="space-y-3"
      >
        <FormInput
          label={t("email")}
          error={loginForm.formState.errors.email}
          register={loginForm.register}
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
        />
        <FormInput
          label={t("password")}
          error={loginForm.formState.errors.password}
          register={loginForm.register}
          name="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
        />
        <CustomButton
          type="submit"
          disabled={loading || isSubmitting}
          isLoading={isSubmitting}
        >
          {t("signIn")}
        </CustomButton>
      </form>
      <div className="mt-2 text-center">
        <p className="text-gray-800 dark:text-gray-200 text-sm">
          {t("noAccount")}{" "}
          <button
            type="button"
            onClick={() => setCurrentFace("register")}
            className="text-gray-800 dark:text-gray-200 text-md underline"
          >
            {t("register")}
          </button>
        </p>
      </div>
    </>
  );

  const RegisterForm = () => {
    const {
      register,
      formState: { errors },
    } = registerForm;

    return (
      <>
        <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center">
          {t("register")}
        </h2>
        <form
          onSubmit={registerForm.handleSubmit((data) => handleSubmit(data))}
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
        {error && <div className="text-center text-red-500 mt-4">{error}</div>}
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

  const ResultContent = () => {
    if (isSubmitting) {
      return (
        <div className="text-center">
          <span className="loading loading-spinner"></span>
          <p>{t("loading")}</p>
        </div>
      );
    }

    if (submissionResult?.status === "loginSuccess") {
      return (
        <div className="space-y-4">
          <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center">
            {t("enterCode")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {t("codeSentMessage")}
          </p>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder={t("codePlaceholder")}
            className="w-full px-4 py-2 border rounded-md dark:text-black"
          />
          <CustomButton
            onClick={handleTokenSubmit}
            disabled={loading}
            isLoading={isSubmitting}
          >
            {t("validateCode")}
          </CustomButton>
        </div>
      );
    }

    if (submissionResult?.status === "loginError") {
      return (
        <div className="text-center text-red-500">
          <p>{submissionResult.message}</p>
          <button
            onClick={() => {
              setCurrentFace("login");
              setSubmissionResult(null);
            }}
            className="text-gray-800 dark:text-gray-200 underline mt-4"
          >
            {t("backToLogin")}
          </button>
        </div>
      );
    }

    return null;
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
            transform: getRotation(),
            transition: "transform 0.8s ease-in-out",
          }}
        >
          <FormFace isActive={currentFace === "login"} rotation={0}>
            <LoginForm />
          </FormFace>

          <FormFace isActive={currentFace === "register"} rotation={180}>
            <RegisterForm />
          </FormFace>

          <FormFace isActive={currentFace === "result"} rotation={0}>
            <ResultContent />
          </FormFace>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
