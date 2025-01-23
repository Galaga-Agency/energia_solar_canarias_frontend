import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  authenticateUser,
  validateToken,
  selectLoading,
  setUser,
} from "@/store/slices/userSlice";
import useAuth from "@/hooks/useAuth";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FormFace from "@/components/ui/FormFace";
import ResultContent from "@/components/ResultContent";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

const AuthenticationForm = () => {
  const [currentFace, setCurrentFace] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [userToValidate, setUserToValidate] = useState(null);
  const [showGlow, setShowGlow] = useState(false);

  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = async (data, type) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await dispatch(authenticateUser(data)).unwrap();
      console.log("Auth response:", response);

      if (type === "login") {
        setUserToValidate(response.data.id);
        setSubmissionResult({ status: "loginSuccess" });
        setCurrentFace("result");
      }
    } catch (err) {
      setSubmissionResult({
        status: "loginError",
        message: err.includes("contraseña es inválida")
          ? t("invalidPassword")
          : err.includes("usuario no existe")
          ? t("invalidUser")
          : t("internalServerError"),
      });
      setCurrentFace("result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTokenSubmit = async (e) => {
    e?.preventDefault();
    if (!tokenInput?.trim() || !userToValidate || isSubmitting) return false;
    setIsSubmitting(true);

    try {
      const response = await dispatch(
        validateToken({
          id: userToValidate,
          token: tokenInput.trim(),
        })
      ).unwrap();

      if (!response?.status) {
        throw new Error(t("invalidToken"));
      }

      dispatch(setUser(response.data));
      router.push(`/dashboard/${userToValidate}`);
      return true;
    } catch (error) {
      setSubmissionResult({
        status: "loginError",
        message: t("invalidToken"),
      });
      setTokenInput("");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendTokenRequest = async () => {
    if (!userToValidate) return;
    try {
      await dispatch(
        authenticateUser({ email: userEmail, password: userPassword })
      );
    } catch (error) {
      console.error("Failed to resend token:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowGlow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getRotation = () =>
    ({
      login: 0,
      register: 180,
      result: 360,
    }[currentFace]);

  return (
    <div className="relative w-[min(100%-2rem,470px)] mx-auto mt-4">
      {/* Glow effect */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%]"
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
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="relative w-full min-h-[72vh] "
        style={{ perspective: "1500px" }}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: getRotation(),
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Login Form */}
          <FormFace
            isActive={currentFace === "login"}
            rotation={0}
            formType="login"
          >
            <LoginForm
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              loading={loading}
              setCurrentFace={setCurrentFace}
              t={t}
            />
          </FormFace>

          {/* Register Form */}
          {/* Uncomment to enable the RegisterForm */}
          {/* 
          <FormFace isActive={currentFace === "register"} rotation={180}>
            <RegisterForm
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              setCurrentFace={setCurrentFace}
              t={t}
            />
          </FormFace>
          */}

          {/* Result Feedback */}
          <FormFace isActive={currentFace === "result"} rotation={360}>
            <ResultContent
              isSubmitting={isSubmitting}
              submissionResult={submissionResult}
              tokenInput={tokenInput}
              setTokenInput={setTokenInput}
              handleTokenSubmit={handleTokenSubmit}
              setCurrentFace={setCurrentFace}
              resendTokenRequest={resendTokenRequest}
            />
          </FormFace>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
