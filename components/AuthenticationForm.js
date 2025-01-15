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
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const dispatch = useDispatch();
  const { saveAuthData } = useAuth();
  const loading = useSelector(selectLoading);
  const [userToValidate, setUserToValidate] = useState();
  const { t } = useTranslation();
  const router = useRouter();
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    // Delay the glow effect
    const timer = setTimeout(() => {
      setShowGlow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (data, type) => {
    setIsSubmitting(true);
    try {
      const response = await dispatch(authenticateUser(data)).unwrap();
      console.log("User data --------------", response);

      saveAuthData(response.data.tokenIdentificador, response.data);

      if (type === "login") {
        setUserEmail(data.email);
        setUserPassword(data.password);
        setSubmissionResult({ status: "loginSuccess" });
        setUserToValidate(response.data.id);
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

      // console.log("Token validation response:", response);

      if (
        response.type?.includes("rejected") ||
        response.error ||
        !response.payload?.status
      ) {
        setSubmissionResult({
          status: "loginError",
          message: response.payload || t("invalidToken"),
        });
        setTokenInput("");
        setIsSubmitting(false);
        return false;
      }

      saveAuthData(
        response.payload.data.tokenIdentificador,
        response.payload.data
      );
      dispatch(setUser(response.payload.data));
      window.location.href = `/dashboard/${userToValidate}`;
      return true;
    } catch (error) {
      setSubmissionResult({
        status: "loginError",
        message: t("invalidToken"),
      });
      setTokenInput("");
      setIsSubmitting(false);
      return false;
    }
  };

  const resendTokenRequest = async () => {
    if (!userEmail || !userPassword) {
      console.error("User credentials are not available to resend the token.");
      return;
    }

    try {
      const data = { email: userEmail, password: userPassword };
      await dispatch(authenticateUser(data));
      // console.log("Token resent successfully!");
    } catch (error) {
      console.error("Failed to resend token:", error);
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
