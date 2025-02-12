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
import {
  fetchActiveNotifications,
  fetchResolvedNotifications,
  loadAllNotificationsInBackground,
  selectIsInitialLoad,
  setInitialLoad,
} from "@/store/slices/notificationsSlice";
import Cookies from "js-cookie";
import store from "@/store/store";

const AuthenticationForm = () => {
  const [currentFace, setCurrentFace] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [userToValidate, setUserToValidate] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const isInitialLoad = useSelector(selectIsInitialLoad);
  const [userCredentials, setUserCredentials] = useState(null);

  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = async (data, type) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await dispatch(authenticateUser(data)).unwrap();

      if (type === "login") {
        setUserToValidate(response.data.id);
        // Store credentials for resending
        setUserCredentials({
          email: data.email,
          password: data.password,
        });
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

      const cookieOptions = {
        expires: 180,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      };

      // Verify the token before setting
      if (!response.data.tokenIdentificador) {
        console.error("No token found to save");
        throw new Error("No token found");
      }

      Cookies.set("authToken", response.data.tokenIdentificador, cookieOptions);
      Cookies.set("user", JSON.stringify(response.data), cookieOptions);

      dispatch(setUser(response.data));
      router.push(`/dashboard/${userToValidate}`);

      // Fetch all notifications immediately regardless of user type
      const fetchAllNotifications = async () => {
        try {
          // Fetch initial notifications
          await Promise.all([
            dispatch(
              fetchActiveNotifications({ pageIndex: 1, pageSize: 200 })
            ).unwrap(),
            dispatch(
              fetchResolvedNotifications({ pageIndex: 1, pageSize: 200 })
            ).unwrap(),
          ]);

          // Start background loading
          dispatch(
            loadAllNotificationsInBackground({ status: 0, pageSize: 200 })
          );
          dispatch(
            loadAllNotificationsInBackground({ status: 1, pageSize: 200 })
          );
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      // Execute notification fetching
      fetchAllNotifications();

      if (isInitialLoad) {
        dispatch(setInitialLoad(false));
      }
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
    if (!userToValidate || !userCredentials) return;

    try {
      await dispatch(
        authenticateUser({
          email: userCredentials.email,
          password: userCredentials.password,
        })
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
      result: 180,
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
        className="relative w-full min-h-[72vh]"
        style={{ perspective: "1500px" }}
      >
        <motion.div
          className="absolute w-full h-full [transform-style:preserve-3d]"
          style={{
            transform: `rotateY(${getRotation()}deg)`,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {currentFace === "login" && (
            <FormFace isActive={true} rotation={0} formType="login">
              <LoginForm
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                loading={loading}
                setCurrentFace={setCurrentFace}
                t={t}
              />
            </FormFace>
          )}
          {currentFace === "result" && (
            <FormFace isActive={true} rotation={180}>
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
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
