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
import PrimaryButton from "@/components/ui/PrimaryButton";
import FormFace from "@/components/ui/FormFace";
import ResultContent from "@/components/ResultContent";
import FormInput from "@/components/ui/FormInput";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CustomCheckbox from "./ui/CustomCheckbox";

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
      saveAuthData(user.data.tokenIdentificador || "mockAuthToken", user.data);
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
    if (!tokenInput.trim() || !userToValidate) return false;
    setIsSubmitting(true);

    try {
      const response = await dispatch(
        validateToken({ id: userToValidate, token: tokenInput })
      );
      console.log("RESPONSE:", response);

      if (
        response.type?.includes("rejected") ||
        response.error ||
        !response.payload?.status
      ) {
        console.log("STOPPING - ERROR DETECTED");
        setSubmissionResult({
          status: "loginError",
          message: response.payload || t("invalidToken"),
        });
        setTokenInput("");
        setIsSubmitting(false);
        return false;
      }

      console.log("SUCCESS - REDIRECTING");
      saveAuthData(
        response.payload.data.tokenIdentificador,
        response.payload.data
      );
      dispatch(setUser(response.payload.data));
      window.location.href = `/dashboard/${userToValidate}`;
      return true;
    } catch (error) {
      console.log("CAUGHT ERROR:", error);
      setSubmissionResult({
        status: "loginError",
        message: t("invalidToken"),
      });
      setTokenInput("");
      setIsSubmitting(false);
      return false; // Return false for error
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
      formState: { errors, isValid, isDirty },
      watch,
    } = useForm({
      mode: "onChange",
      defaultValues: {
        email: "",
        password: "",
      },
    });

    const [showPassword, setShowPassword] = useState(false);

    // Watch form fields
    const email = watch("email");
    const password = watch("password");
    const isFormFilled = email && password;

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
            validation={{
              required: t("emailRequired"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("invalidEmail"),
              },
            }}
          />
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
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-xl text-custom-dark-blue"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              className="text-gray-800 dark:text-gray-200 underline font-secondary mt-2 underline-offset-2"
              onClick={() => router.push("/forgot-password")}
            >
              {t("forgotPassword")}
            </button>
          </div>
          <br />
          <PrimaryButton
            type="submit"
            disabled={
              loading || isSubmitting || !isValid || !isDirty || !isFormFilled
            }
            isLoading={isSubmitting}
          >
            {t("signIn")}
          </PrimaryButton>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-800 dark:text-gray-200 text-sm mt-4">
            {t("noAccount")}{" "}
            <button
              type="button"
              onClick={() => setCurrentFace("register")}
              className="text-gray-800 dark:text-gray-200 text-md underline underline-offset-2"
            >
              {t("register")}
            </button>
          </p>
        </div>
      </>
    );
  };

  const RegisterForm = () => {
    const {
      handleSubmit: handleRegisterSubmit,
      register,
      formState: { errors, isValid, isDirty },
      watch,
      setValue,
    } = useForm({
      mode: "onChange",
      defaultValues: {
        username: "",
        email: "",
        password: "",
        privacyPolicy: false,
      },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    // Watch form fields
    const username = watch("username");
    const email = watch("email");
    const password = watch("password");
    const isFormFilled = username && email && password && isChecked;

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
            validation={{
              required: t("usernameRequired"),
              minLength: {
                value: 3,
                message: t("usernameMinLength"),
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
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("invalidEmail"),
              },
            }}
          />
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
                minLength: {
                  value: 8,
                  message: t("passwordMinLength"),
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: t("passwordPattern"),
                },
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-xl text-custom-dark-blue"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          <div className="mb-4">
            <CustomCheckbox
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e);
                setValue("privacyPolicy", e, { shouldValidate: true });
              }}
              className="text-gray-800 dark:text-gray-200"
              label={
                <span className="text-gray-800 dark:text-gray-200">
                  {t("privacyPolicyLabel")}{" "}
                  <a
                    href="https://www.energiasolarcanarias.es/politica-de-cookies"
                    className="text-gray-800 dark:text-gray-200 underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("cookiesPolicy")}
                  </a>
                  ,{" "}
                  <a
                    href="https://www.energiasolarcanarias.es/politica-de-privacidad"
                    className="text-gray-800 dark:text-gray-200 underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("privacyPolicy")}
                  </a>{" "}
                  {t("andTheLegalNoticePrefix")}{" "}
                  <a
                    href="https://www.energiasolarcanarias.es/aviso-legal"
                    className="text-gray-800 dark:text-gray-200 underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("legalNotice")}
                  </a>
                </span>
              }
            />
            <input
              type="hidden"
              {...register("privacyPolicy", {
                required: t("privacyPolicyConsent"),
              })}
              value={isChecked}
            />
            <div className="min-h-[10px] mb-4">
              {errors.privacyPolicy && (
                <p className="text-red-500 text-sm mt-0">
                  {errors.privacyPolicy.message}
                </p>
              )}
            </div>
          </div>
          <PrimaryButton
            type="submit"
            disabled={
              loading || isSubmitting || !isValid || !isDirty || !isFormFilled
            }
            isLoading={isSubmitting}
          >
            {t("register")}
          </PrimaryButton>
        </form>
        <div className="mt-2 text-center">
          <p className="text-gray-800 dark:text-gray-200 text-sm">
            {t("alreadyAccount")}{" "}
            <button
              type="button"
              onClick={() => setCurrentFace("login")}
              className="text-gray-800 dark:text-gray-200 text-md underline underline-offset-2"
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
