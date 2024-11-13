import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import {
  authenticateUser,
  validateToken,
  selectLoading,
  setUser,
  selectIsAdmin,
} from "@/store/slices/userSlice";
import useAuth from "@/hooks/useAuth";
import PrimaryButton from "./PrimaryButton";
import FormFace from "./FormFace";
import ResultContent from "./ResultContent";
import FormInput from "./FormInput";
import { useForm } from "react-hook-form";

const AuthenticationForm = () => {
  const [currentFace, setCurrentFace] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { saveAuthData } = useAuth();
  const loading = useSelector(selectLoading);
  const [userToValidate, setUserToValidate] = useState();
  const { t } = useTranslation();
  const isAdmin = useSelector(selectIsAdmin);

  const handleSubmit = async (data, type) => {
    setIsSubmitting(true);
    try {
      const user = await dispatch(authenticateUser(data)).unwrap();
      saveAuthData("mockAuthToken", user);

      if (type === "login") {
        setSubmissionResult({ status: "loginSuccess" });
        setUserToValidate(user.data.id);
        setCurrentFace("result");
      } else {
        setSubmissionResult({ status: "registerSuccess" });
        setCurrentFace("login");
      }
    } catch (err) {
      const errorMessage = err.includes("contraseña es inválida")
        ? t("invalidPassword")
        : err.includes("usuario no existe")
        ? t("invalidUser")
        : t("internalServerError");

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
    setIsSubmitting(true);
    try {
      const response = await dispatch(
        validateToken({ id: userToValidate, token: tokenInput })
      );

      if (
        response.meta.requestStatus === "fulfilled" &&
        response.payload.status === true
      ) {
        Cookies.set("user", JSON.stringify(response.payload.data), {
          expires: 180,
        });
        dispatch(setUser(response.payload.data));

        window.location.href = `/dashboard/${userToValidate}`;
      } else {
        setSubmissionResult({
          status: "loginError",
          message: response.message || t("invalidToken"),
        });
        setTokenInput("");
      }
    } catch (error) {
      setSubmissionResult({
        status: "loginError",
        message: t("invalidToken"),
      });
      setTokenInput("");
    } finally {
      setIsSubmitting(false);
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

  const LoginForm = () => {
    const {
      handleSubmit: handleLoginSubmit,
      register,
      formState: { errors },
    } = useForm();

    return (
      <>
        <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-4">
          {t("login")}
        </h2>
        <form
          onSubmit={handleLoginSubmit((data) => handleSubmit(data, "login"))}
          noValidate
          className="space-y-3"
        >
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
          <div className="text-center">
            <button
              type="button"
              className="text-blue-500 hover:underline font-secondary mt-2 dark:text-blue-300"
              onClick={() => router.push("/forgot-password")}
            >
              {t("forgotPassword")}
            </button>
          </div>
          <br />
          <PrimaryButton type="submit" disabled={loading || isSubmitting}>
            {t("signIn")}
          </PrimaryButton>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-800 dark:text-gray-200 text-sm mt-4">
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
  };

  // RegisterForm component
  const RegisterForm = () => {
    const {
      handleSubmit: handleRegisterSubmit,
      register,
      formState: { errors },
    } = useForm();

    return (
      <>
        <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-4">
          {t("register")}
        </h2>
        <form
          onSubmit={handleRegisterSubmit((data) =>
            handleSubmit(data, "register")
          )}
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
              <span className="ml-2 text-gray-800 dark:text-gray-200">
                {t("privacyPolicyLabel")}
                <a
                  href="https://www.energiasolarcanarias.es/politica-de-cookies"
                  className="text-blue-500 dark:text-blue-300 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("cookiesPolicy")}
                </a>
                ,{" "}
                <a
                  href="https://www.energiasolarcanarias.es/politica-de-privacidad"
                  className="text-blue-500 dark:text-blue-300 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("privacyPolicy")}
                </a>{" "}
                {t("andTheLegalNoticePrefix")}{" "}
                <a
                  href="https://www.energiasolarcanarias.es/aviso-legal"
                  className="text-blue-500 dark:text-blue-300 hover:underline"
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
          <PrimaryButton type="submit" disabled={loading || isSubmitting}>
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

          <FormFace isActive={currentFace === "result"} rotation={360}>
            <ResultContent
              isSubmitting={isSubmitting}
              submissionResult={submissionResult}
              tokenInput={tokenInput}
              setTokenInput={setTokenInput}
              handleTokenSubmit={handleTokenSubmit}
              setCurrentFace={setCurrentFace}
            />
          </FormFace>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
